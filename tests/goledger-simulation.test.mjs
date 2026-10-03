import assert from "node:assert/strict";
import test from "node:test";
import { buildSimulationSteps } from "../components/case-studies/goledger/simulation.ts";

const scenarios = [
  "success", "antifraud_block", "gateway_declined", "timeout",
  "circuit_breaker", "reconciled", "capture_retry", "not_processed",
];
const first = (steps, node, state) => steps.findIndex((step) => step.nodes[node] === state);
const final = (steps) => steps.at(-1);

test("every scenario persists checkout and delivers PaymentRequested before processing the Saga", () => {
  for (const scenario of scenarios) {
    const steps = buildSimulationSteps(scenario);
    const commit = first(steps, "request_outbox", "success");
    const delivery = first(steps, "payment_queue", "success");
    const antifraud = first(steps, "antifraud", "running");
    assert.ok(commit >= 0 && delivery > commit && antifraud > delivery, scenario);
    assert.equal(steps[commit].paymentStatus, "pending");
    assert.equal(steps[commit].holdStatus, "authorized");
    assert.equal(steps[commit].nodes.hold, "reserved");
    assert.equal(steps[commit].nodes.attempt, "success");
  }
});

test("financial completion precedes balance projection and uses a separate queue", () => {
  const steps = buildSimulationSteps("success");
  const completion = steps.findIndex((step) => step.paymentStatus === "completed");
  assert.ok(completion > first(steps, "primary_gateway", "success"));
  assert.equal(steps[completion].holdStatus, "captured");
  assert.equal(steps[completion].nodes.commit, "success");
  assert.equal(steps[completion].nodes.projection_outbox, "success");
  assert.ok(first(steps, "projection_queue", "running") > completion);
  assert.ok(first(steps, "projector", "running") > completion);
  assert.equal(final(steps).nodes.dynamo, "success");
});

test("uncertain timeout never charges secondary, captures, or releases funds", () => {
  const steps = buildSimulationSteps("timeout");
  assert.equal(final(steps).paymentStatus, "requires_review");
  assert.equal(final(steps).holdStatus, "authorized");
  assert.ok(first(steps, "lookup", "running") > first(steps, "primary_gateway", "error"));
  for (const step of steps) {
    assert.equal(step.nodes.secondary_gateway, "idle");
    assert.equal(step.nodes.capture, "idle");
    assert.equal(step.nodes.projection_outbox, "idle");
    assert.notEqual(step.holdStatus, "released");
  }
});

test("a decline releases the hold without treating it as an open circuit", () => {
  const steps = buildSimulationSteps("gateway_declined");
  assert.equal(final(steps).paymentStatus, "failed");
  assert.equal(final(steps).holdStatus, "released");
  assert.equal(final(steps).nodes.primary_cb, "success");
  assert.equal(final(steps).nodes.secondary_gateway, "idle");
  assert.equal(final(steps).nodes.projection_outbox, "idle");
});

test("antifraud rejection makes no gateway call", () => {
  const steps = buildSimulationSteps("antifraud_block");
  assert.equal(final(steps).holdStatus, "released");
  assert.equal(final(steps).paymentStatus, "failed");
  for (const step of steps) {
    assert.equal(step.nodes.primary_gateway, "idle");
    assert.equal(step.nodes.secondary_gateway, "idle");
  }
});

test("open primary breaker blocks submission and persists failover before secondary sends", () => {
  const steps = buildSimulationSteps("circuit_breaker");
  const routeChange = steps.findIndex((step) => step.selectedProvider === "secondary");
  assert.ok(first(steps, "primary_cb", "blocked") < routeChange);
  assert.equal(steps[routeChange].paymentStatus, "retry_scheduled");
  assert.ok(first(steps, "secondary_gateway", "running") > routeChange);
  assert.ok(steps.every((step) => step.nodes.primary_gateway === "idle"));
  assert.equal(final(steps).paymentStatus, "completed");
});

test("an uncertain result switches providers only after lookup confirms not_processed", () => {
  const steps = buildSimulationSteps("not_processed");
  const lookup = first(steps, "lookup", "success");
  const routeChange = steps.findIndex((step) => step.selectedProvider === "secondary");
  assert.ok(lookup >= 0 && routeChange > lookup);
  assert.ok(first(steps, "secondary_gateway", "running") > routeChange);
  assert.equal(final(steps).paymentStatus, "completed");
});

test("a reconciled success captures without submitting another charge", () => {
  const steps = buildSimulationSteps("reconciled");
  assert.ok(first(steps, "capture", "running") > first(steps, "lookup", "success"));
  assert.equal(steps.filter((step, index) =>
    step.nodes.primary_gateway === "running" &&
    (index === 0 || steps[index - 1].nodes.primary_gateway !== "running")
  ).length, 1);
  assert.ok(steps.every((step) => step.nodes.secondary_gateway === "idle"));
  assert.equal(final(steps).holdStatus, "captured");
});

test("capture retry preserves charged funds and never returns to gateway submission", () => {
  const steps = buildSimulationSteps("capture_retry");
  const failure = first(steps, "capture", "error");
  assert.ok(failure > first(steps, "primary_gateway", "success"));
  assert.equal(steps[failure].holdStatus, "authorized");
  assert.equal(steps[failure].nodes.projection_outbox, "idle");
  const retry = steps.findIndex((step, index) => index > failure && step.nodes.capture === "running");
  assert.ok(retry > failure);
  for (const step of steps.slice(failure)) {
    assert.equal(step.nodes.primary_gateway, "success");
    assert.equal(step.nodes.secondary_gateway, "idle");
    assert.notEqual(step.holdStatus, "released");
  }
  assert.equal(final(steps).paymentStatus, "completed");
});
