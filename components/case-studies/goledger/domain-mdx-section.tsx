"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiChevronDown, FiCopy } from "react-icons/fi";
import { TbBrandGolang } from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { Locale } from "@/components/portfolio";

interface DomainTopic {
  id: string;
  num: string;
  title: { pt: string; en: string };
  summary: { pt: string; en: string };
  filePath: string;
  explanation: { pt: React.ReactNode; en: React.ReactNode };
  equations?: { label: string; formula: string }[];
  stateBadges?: { label: string; desc: string; color: string }[];
  codeTokens: {
    raw: string;
    lines: {
      tokens: { text: string; type: "keyword" | "type" | "func" | "string" | "comment" | "operator" | "plain" | "property" }[];
    }[];
  };
}

const domainTopics: DomainTopic[] = [
  {
    id: "balance-calc",
    num: "01",
    title: {
      pt: "Cálculo de Saldo & Partidas Dobradas",
      en: "Balance Calculation & Double-Entry Arithmetic",
    },
    summary: {
      pt: "Separação estrita entre saldo liquidado (Ledger) e saldo disponível deduzido de reservas em aberto (Holds).",
      en: "Strict separation between settled ledger balance and available balance minus active holds.",
    },
    filePath: "internal/ledger/domain/wallet/balance.go",
    explanation: {
      pt: (
        <>
          No GoLedger, uma carteira nunca atualiza saldos por mutação destrutiva (como <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-800">UPDATE balance</code>). O <strong>Saldo do Ledger</strong> representa a consolidação auditável de todos os lançamentos de crédito e débito históricos em inteiros (cents). Já o <strong>Saldo Disponível</strong> deduz de forma atômica o valor das reservas temporárias (Holds) autorizadas que ainda aguardam liquidação, impedindo qualquer risco de cheque especial ou gasto duplo sob alta concorrência.
        </>
      ),
      en: (
        <>
          In GoLedger, wallet balances are never mutated destructively. <strong>Ledger Balance</strong> represents the audit-proof historical sum of settled credits minus debits in integer minor units (cents). <strong>Available Balance</strong> atomically subtracts active authorized Holds awaiting final capture, preventing double-spending and overdraft under high concurrency.
        </>
      ),
    },
    equations: [
      { label: "Saldo Contábil (Ledger)", formula: "Total Créditos - Total Débitos" },
      { label: "Saldo Disponível", formula: "Saldo Contábil - Reservas Ativas (Holds)" },
      { label: "Invariante Contábil", formula: "Saldo Disponível ≥ 0  ∧  ∑ Débitos == ∑ Créditos" },
    ],
    codeTokens: {
      raw: `package wallet

import (
    "errors"
    "time"
)

var (
    ErrInvalidSnapshot = errors.New("balance snapshot contains negative values")
    ErrInsufficientFunds = errors.New("insufficient available balance for hold")
)

type LedgerBalanceSnapshot struct {
    TotalCredits          int64
    TotalDebits           int64
    ActiveHoldsMinorUnits int64
}

type WalletBalance struct {
    WalletID                   string
    Currency                   string
    LedgerBalanceMinorUnits    int64
    AvailableBalanceMinorUnits int64
    CalculatedAt               time.Time
}

func CalculateBalance(
    walletID string,
    currency string,
    snapshot LedgerBalanceSnapshot,
) (WalletBalance, error) {
    if snapshot.TotalCredits < 0 || snapshot.TotalDebits < 0 || snapshot.ActiveHoldsMinorUnits < 0 {
        return WalletBalance{}, ErrInvalidSnapshot
    }

    ledgerBalance := snapshot.TotalCredits - snapshot.TotalDebits
    availableBalance := ledgerBalance - snapshot.ActiveHoldsMinorUnits

    return WalletBalance{
        WalletID:                   walletID,
        Currency:                   currency,
        LedgerBalanceMinorUnits:    ledgerBalance,
        AvailableBalanceMinorUnits: availableBalance,
        CalculatedAt:               time.Now().UTC(),
    }, nil
}`,
      lines: [
        { tokens: [{ text: "package ", type: "keyword" }, { text: "wallet", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "import ", type: "keyword" }, { text: "(", type: "plain" }] },
        { tokens: [{ text: '    "errors"', type: "string" }] },
        { tokens: [{ text: '    "time"', type: "string" }] },
        { tokens: [{ text: ")", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "var ", type: "keyword" }, { text: "(", type: "plain" }] },
        { tokens: [{ text: "    ErrInvalidSnapshot ", type: "property" }, { text: "= errors.", type: "plain" }, { text: "New", type: "func" }, { text: '("balance snapshot contains negative values")', type: "string" }] },
        { tokens: [{ text: "    ErrInsufficientFunds ", type: "property" }, { text: "= errors.", type: "plain" }, { text: "New", type: "func" }, { text: '("insufficient available balance for hold")', type: "string" }] },
        { tokens: [{ text: ")", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "type ", type: "keyword" }, { text: "LedgerBalanceSnapshot ", type: "type" }, { text: "struct ", type: "keyword" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "    TotalCredits          ", type: "property" }, { text: "int64", type: "type" }] },
        { tokens: [{ text: "    TotalDebits           ", type: "property" }, { text: "int64", type: "type" }] },
        { tokens: [{ text: "    ActiveHoldsMinorUnits ", type: "property" }, { text: "int64", type: "type" }] },
        { tokens: [{ text: "}", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "type ", type: "keyword" }, { text: "WalletBalance ", type: "type" }, { text: "struct ", type: "keyword" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "    WalletID                   ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    Currency                   ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    LedgerBalanceMinorUnits    ", type: "property" }, { text: "int64", type: "type" }] },
        { tokens: [{ text: "    AvailableBalanceMinorUnits ", type: "property" }, { text: "int64", type: "type" }] },
        { tokens: [{ text: "    CalculatedAt               ", type: "property" }, { text: "time.Time", type: "type" }] },
        { tokens: [{ text: "}", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        {
          tokens: [
            { text: "func ", type: "keyword" },
            { text: "CalculateBalance", type: "func" },
            { text: "(", type: "plain" },
          ],
        },
        { tokens: [{ text: "    walletID ", type: "plain" }, { text: "string", type: "type" }, { text: ",", type: "plain" }] },
        { tokens: [{ text: "    currency ", type: "plain" }, { text: "string", type: "type" }, { text: ",", type: "plain" }] },
        { tokens: [{ text: "    snapshot ", type: "plain" }, { text: "LedgerBalanceSnapshot", type: "type" }, { text: ",", type: "plain" }] },
        { tokens: [{ text: ") (", type: "plain" }, { text: "WalletBalance", type: "type" }, { text: ", ", type: "plain" }, { text: "error", type: "type" }, { text: ") {", type: "plain" }] },
        {
          tokens: [
            { text: "    if ", type: "keyword" },
            { text: "snapshot.", type: "plain" },
            { text: "TotalCredits ", type: "property" },
            { text: "< ", type: "operator" },
            { text: "0 ", type: "plain" },
            { text: "|| ", type: "operator" },
            { text: "snapshot.", type: "plain" },
            { text: "TotalDebits ", type: "property" },
            { text: "< ", type: "operator" },
            { text: "0 ", type: "plain" },
            { text: "|| ", type: "operator" },
            { text: "snapshot.", type: "plain" },
            { text: "ActiveHoldsMinorUnits ", type: "property" },
            { text: "< ", type: "operator" },
            { text: "0 ", type: "plain" },
            { text: "{", type: "plain" },
          ],
        },
        { tokens: [{ text: "        return ", type: "keyword" }, { text: "WalletBalance", type: "type" }, { text: "{}, ", type: "plain" }, { text: "ErrInvalidSnapshot", type: "property" }] },
        { tokens: [{ text: "    }", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "    ledgerBalance ", type: "plain" }, { text: ":= ", type: "operator" }, { text: "snapshot.", type: "plain" }, { text: "TotalCredits ", type: "property" }, { text: "- ", type: "operator" }, { text: "snapshot.", type: "plain" }, { text: "TotalDebits", type: "property" }] },
        { tokens: [{ text: "    availableBalance ", type: "plain" }, { text: ":= ", type: "operator" }, { text: "ledgerBalance ", type: "plain" }, { text: "- ", type: "operator" }, { text: "snapshot.", type: "plain" }, { text: "ActiveHoldsMinorUnits", type: "property" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "    return ", type: "keyword" }, { text: "WalletBalance", type: "type" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "        WalletID", type: "property" }, { text: ":                   walletID,", type: "plain" }] },
        { tokens: [{ text: "        Currency", type: "property" }, { text: ":                   currency,", type: "plain" }] },
        { tokens: [{ text: "        LedgerBalanceMinorUnits", type: "property" }, { text: ":    ledgerBalance,", type: "plain" }] },
        { tokens: [{ text: "        AvailableBalanceMinorUnits", type: "property" }, { text: ": availableBalance,", type: "plain" }] },
        { tokens: [{ text: "        CalculatedAt", type: "property" }, { text: ":               time.", type: "plain" }, { text: "Now", type: "func" }, { text: "().", type: "plain" }, { text: "UTC", type: "func" }, { text: "(),", type: "plain" }] },
        { tokens: [{ text: "    }, ", type: "plain" }, { text: "nil", type: "keyword" }] },
        { tokens: [{ text: "}", type: "plain" }] },
      ],
    },
  },
  {
    id: "hold-state-machine",
    num: "02",
    title: {
      pt: "Máquina de Estados de Reservas (Holds)",
      en: "Hold State Machine & Invariant Guard",
    },
    summary: {
      pt: "Ciclo de vida determinístico de transações: Authorized → Captured, Released ou Expired.",
      en: "Strict deterministic transaction lifecycle: Authorized → Captured, Released or Expired.",
    },
    filePath: "internal/ledger/domain/hold/hold.go",
    explanation: {
      pt: (
        <>
          As reservas financeiras (Holds) bloqueiam temporariamente o saldo do pagador durante a execução de chamadas externas de rede (antifraude e autorização no adquirente/PSP). A máquina de estados garante transições unidirecionais estritas: nenhum hold pode ser capturado após sua expiração (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-800">expires_at</code>), e ordens canceladas liberam imediatamente o saldo retido.
        </>
      ),
      en: (
        <>
          Holds isolate user funds during in-flight external operations (fraud screening and payment gateways). The domain model enforces strict unidirectional state transitions: no hold can be captured past <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-800">expires_at</code>, and canceled orders instantly release balance back to the available pool.
        </>
      ),
    },
    stateBadges: [
      { label: "Authorized", desc: "Saldo bloqueado temporariamente aguardando confirmação do PSP", color: "bg-blue-500" },
      { label: "Captured", desc: "Liquidação confirmada, convertendo o hold em débito contábil efetivo", color: "bg-emerald-500" },
      { label: "Released", desc: "Compensação de estorno, devolvendo imediatamente o saldo à carteira", color: "bg-amber-500" },
      { label: "Expired", desc: "Timeout de segurança liberado automaticamente pelo worker de conciliação", color: "bg-rose-500" },
    ],
    codeTokens: {
      raw: `package hold

import (
    "errors"
    "time"
)

type Status string

const (
    StatusAuthorized Status = "authorized"
    StatusCaptured   Status = "captured"
    StatusReleased   Status = "released"
    StatusExpired    Status = "expired"
)

var ErrInvalidTransition = errors.New("invalid hold state transition")

type Hold struct {
    id        string
    walletID  string
    amount    int64
    status    Status
    createdAt time.Time
    expiresAt time.Time
}

func (h Hold) CanCapture(now time.Time) bool {
    return h.status == StatusAuthorized && now.Before(h.expiresAt)
}

func (h Hold) Capture(now time.Time) (Hold, error) {
    if !h.CanCapture(now) {
        return Hold{}, ErrInvalidTransition
    }
    h.status = StatusCaptured
    return h, nil
}

func (h Hold) Release() (Hold, error) {
    if h.status != StatusAuthorized {
        return Hold{}, ErrInvalidTransition
    }
    h.status = StatusReleased
    return h, nil
}`,
      lines: [
        { tokens: [{ text: "package ", type: "keyword" }, { text: "hold", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "import ", type: "keyword" }, { text: "(", type: "plain" }] },
        { tokens: [{ text: '    "errors"', type: "string" }] },
        { tokens: [{ text: '    "time"', type: "string" }] },
        { tokens: [{ text: ")", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "type ", type: "keyword" }, { text: "Status ", type: "type" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "const ", type: "keyword" }, { text: "(", type: "plain" }] },
        { tokens: [{ text: "    StatusAuthorized ", type: "property" }, { text: "Status ", type: "type" }, { text: "= ", type: "operator" }, { text: '"authorized"', type: "string" }] },
        { tokens: [{ text: "    StatusCaptured   ", type: "property" }, { text: "Status ", type: "type" }, { text: "= ", type: "operator" }, { text: '"captured"', type: "string" }] },
        { tokens: [{ text: "    StatusReleased   ", type: "property" }, { text: "Status ", type: "type" }, { text: "= ", type: "operator" }, { text: '"released"', type: "string" }] },
        { tokens: [{ text: "    StatusExpired    ", type: "property" }, { text: "Status ", type: "type" }, { text: "= ", type: "operator" }, { text: '"expired"', type: "string" }] },
        { tokens: [{ text: ")", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "var ", type: "keyword" }, { text: "ErrInvalidTransition ", type: "property" }, { text: "= errors.", type: "plain" }, { text: "New", type: "func" }, { text: '("invalid hold state transition")', type: "string" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "type ", type: "keyword" }, { text: "Hold ", type: "type" }, { text: "struct ", type: "keyword" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "    id        ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    walletID  ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    amount    ", type: "property" }, { text: "int64", type: "type" }] },
        { tokens: [{ text: "    status    ", type: "property" }, { text: "Status", type: "type" }] },
        { tokens: [{ text: "    createdAt ", type: "property" }, { text: "time.Time", type: "type" }] },
        { tokens: [{ text: "    expiresAt ", type: "property" }, { text: "time.Time", type: "type" }] },
        { tokens: [{ text: "}", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "func ", type: "keyword" }, { text: "(h ", type: "plain" }, { text: "Hold", type: "type" }, { text: ") ", type: "plain" }, { text: "CanCapture", type: "func" }, { text: "(now ", type: "plain" }, { text: "time.Time", type: "type" }, { text: ") ", type: "plain" }, { text: "bool ", type: "type" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "    return ", type: "keyword" }, { text: "h.", type: "plain" }, { text: "status ", type: "property" }, { text: "== ", type: "operator" }, { text: "StatusAuthorized ", type: "property" }, { text: "&& ", type: "operator" }, { text: "now.", type: "plain" }, { text: "Before", type: "func" }, { text: "(h.", type: "plain" }, { text: "expiresAt", type: "property" }, { text: ")", type: "plain" }] },
        { tokens: [{ text: "}", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "func ", type: "keyword" }, { text: "(h ", type: "plain" }, { text: "Hold", type: "type" }, { text: ") ", type: "plain" }, { text: "Capture", type: "func" }, { text: "(now ", type: "plain" }, { text: "time.Time", type: "type" }, { text: ") (", type: "plain" }, { text: "Hold", type: "type" }, { text: ", ", type: "plain" }, { text: "error", type: "type" }, { text: ") {", type: "plain" }] },
        { tokens: [{ text: "    if ", type: "keyword" }, { text: "!h.", type: "plain" }, { text: "CanCapture", type: "func" }, { text: "(now) {", type: "plain" }] },
        { tokens: [{ text: "        return ", type: "keyword" }, { text: "Hold", type: "type" }, { text: "{}, ", type: "plain" }, { text: "ErrInvalidTransition", type: "property" }] },
        { tokens: [{ text: "    }", type: "plain" }] },
        { tokens: [{ text: "    h.", type: "plain" }, { text: "status ", type: "property" }, { text: "= ", type: "operator" }, { text: "StatusCaptured", type: "property" }] },
        { tokens: [{ text: "    return ", type: "keyword" }, { text: "h, ", type: "plain" }, { text: "nil", type: "keyword" }] },
        { tokens: [{ text: "}", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "func ", type: "keyword" }, { text: "(h ", type: "plain" }, { text: "Hold", type: "type" }, { text: ") ", type: "plain" }, { text: "Release", type: "func" }, { text: "() (", type: "plain" }, { text: "Hold", type: "type" }, { text: ", ", type: "plain" }, { text: "error", type: "type" }, { text: ") {", type: "plain" }] },
        { tokens: [{ text: "    if ", type: "keyword" }, { text: "h.", type: "plain" }, { text: "status ", type: "property" }, { text: "!= ", type: "operator" }, { text: "StatusAuthorized ", type: "property" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "        return ", type: "keyword" }, { text: "Hold", type: "type" }, { text: "{}, ", type: "plain" }, { text: "ErrInvalidTransition", type: "property" }] },
        { tokens: [{ text: "    }", type: "plain" }] },
        { tokens: [{ text: "    h.", type: "plain" }, { text: "status ", type: "property" }, { text: "= ", type: "operator" }, { text: "StatusReleased", type: "property" }] },
        { tokens: [{ text: "    return ", type: "keyword" }, { text: "h, ", type: "plain" }, { text: "nil", type: "keyword" }] },
        { tokens: [{ text: "}", type: "plain" }] },
      ],
    },
  },
  {
    id: "outbox-transaction",
    num: "03",
    title: {
      pt: "Gravação Atômica Ledger + Outbox",
      en: "Atomic Ledger & Transactional Outbox Commit",
    },
    summary: {
      pt: "Eliminação do dual-write gravando lançamentos e eventos no mesmo commit ACID do PostgreSQL.",
      en: "Persisting balanced financial entries and domain events atomically in a single Postgres ACID commit.",
    },
    filePath: "internal/ledger/infra/postgres/outbox_repository.go",
    explanation: {
      pt: (
        <>
          Para eliminar o risco de dual-write entre banco e broker de mensageria, o GoLedger grava os lançamentos do ledger e o registro na tabela <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-xs">outbox_events</code> dentro da mesma transação ACID do PostgreSQL. Um relay worker independente consome os eventos pendentes via <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-xs">SELECT ... FOR UPDATE SKIP LOCKED</code> e publica no AWS SNS/SQS com entrega garantida (At-Least-Once).
        </>
      ),
      en: (
        <>
          To eliminate dual-write inconsistency between database state and message brokers, GoLedger commits double-entry ledger postings and the <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-xs">outbox_events</code> record within a single PostgreSQL ACID transaction. A dedicated relay worker consumes pending rows using <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-xs">SELECT FOR UPDATE SKIP LOCKED</code>, dispatching events to AWS SNS/SQS with guaranteed At-Least-Once delivery.
        </>
      ),
    },
    stateBadges: [
      { label: "Atomic Commit", desc: "Lançamentos contábeis e evento persistidos juntos sob isolamento ACID", color: "bg-emerald-500" },
      { label: "Outbox Relay", desc: "Worker de alta vazão sem contenção de lock via SELECT FOR UPDATE SKIP LOCKED", color: "bg-sky-500" },
      { label: "At-Least-Once", desc: "Publicação no SNS/SQS com retry exponencial e idempotência nos consumidores", color: "bg-purple-500" },
    ],
    codeTokens: {
      raw: `package postgres

import (
    "context"
    "fmt"
    "github.com/jackc/pgx/v5"
)

type OutboxEvent struct {
    ID            string
    AggregateType string
    AggregateID   string
    EventType     string
    Payload       []byte
}

func (r *Repository) CommitPostingsAndOutbox(
    ctx context.Context,
    tx pgx.Tx,
    postingsQuery string,
    event OutboxEvent,
) error {
    // 1. Executa lançamentos contábeis balanceados
    if _, err := tx.Exec(ctx, postingsQuery); err != nil {
        return fmt.Errorf("failed to insert postings: %w", err)
    }

    // 2. Grava evento na outbox no mesmo commit atômico
    const insertOutbox = \`
        INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, status, created_at)
        VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
    \`
    if _, err := tx.Exec(ctx, insertOutbox, event.ID, event.AggregateType, event.AggregateID, event.EventType, event.Payload); err != nil {
        return fmt.Errorf("failed to insert outbox event: %w", err)
    }

    return tx.Commit(ctx)
}`,
      lines: [
        { tokens: [{ text: "package ", type: "keyword" }, { text: "postgres", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "import ", type: "keyword" }, { text: "(", type: "plain" }] },
        { tokens: [{ text: '    "context"', type: "string" }] },
        { tokens: [{ text: '    "fmt"', type: "string" }] },
        { tokens: [{ text: '    "github.com/jackc/pgx/v5"', type: "string" }] },
        { tokens: [{ text: ")", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "type ", type: "keyword" }, { text: "OutboxEvent ", type: "type" }, { text: "struct ", type: "keyword" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "    ID            ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    AggregateType ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    AggregateID   ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    EventType     ", type: "property" }, { text: "string", type: "type" }] },
        { tokens: [{ text: "    Payload       ", type: "property" }, { text: "[]byte", type: "type" }] },
        { tokens: [{ text: "}", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "func ", type: "keyword" }, { text: "(r *", type: "plain" }, { text: "Repository", type: "type" }, { text: ") ", type: "plain" }, { text: "CommitPostingsAndOutbox", type: "func" }, { text: "(", type: "plain" }] },
        { tokens: [{ text: "    ctx ", type: "plain" }, { text: "context.Context", type: "type" }, { text: ",", type: "plain" }] },
        { tokens: [{ text: "    tx ", type: "plain" }, { text: "pgx.Tx", type: "type" }, { text: ",", type: "plain" }] },
        { tokens: [{ text: "    postingsQuery ", type: "plain" }, { text: "string", type: "type" }, { text: ",", type: "plain" }] },
        { tokens: [{ text: "    event ", type: "plain" }, { text: "OutboxEvent", type: "type" }, { text: ",", type: "plain" }] },
        { tokens: [{ text: ") ", type: "plain" }, { text: "error ", type: "type" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "    // 1. Executa lançamentos contábeis balanceados", type: "comment" }] },
        { tokens: [{ text: "    if ", type: "keyword" }, { text: "_, err ", type: "plain" }, { text: ":= ", type: "operator" }, { text: "tx.", type: "plain" }, { text: "Exec", type: "func" }, { text: "(ctx, postingsQuery); err ", type: "plain" }, { text: "!= ", type: "operator" }, { text: "nil ", type: "keyword" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "        return fmt.", type: "plain" }, { text: "Errorf", type: "func" }, { text: '("failed to insert postings: %w", err)', type: "string" }] },
        { tokens: [{ text: "    }", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "    // 2. Grava evento na outbox no mesmo commit atômico", type: "comment" }] },
        { tokens: [{ text: "    const ", type: "keyword" }, { text: "insertOutbox = ", type: "plain" }, { text: "`", type: "string" }] },
        { tokens: [{ text: "        INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, status, created_at)", type: "string" }] },
        { tokens: [{ text: "        VALUES ($1, $2, $3, $4, $5, 'pending', NOW())", type: "string" }] },
        { tokens: [{ text: "    `", type: "string" }] },
        { tokens: [{ text: "    if ", type: "keyword" }, { text: "_, err ", type: "plain" }, { text: ":= ", type: "operator" }, { text: "tx.", type: "plain" }, { text: "Exec", type: "func" }, { text: "(ctx, insertOutbox, event.ID, event.AggregateType, event.AggregateID, event.EventType, event.Payload); err ", type: "plain" }, { text: "!= ", type: "operator" }, { text: "nil ", type: "keyword" }, { text: "{", type: "plain" }] },
        { tokens: [{ text: "        return fmt.", type: "plain" }, { text: "Errorf", type: "func" }, { text: '("failed to insert outbox event: %w", err)', type: "string" }] },
        { tokens: [{ text: "    }", type: "plain" }] },
        { tokens: [{ text: "", type: "plain" }] },
        { tokens: [{ text: "    return tx.", type: "plain" }, { text: "Commit", type: "func" }, { text: "(ctx)", type: "plain" }] },
        { tokens: [{ text: "}", type: "plain" }] },
      ],
    },
  },
];

function CodeBlock({
  filePath,
  rawCode,
  lines,
}: {
  filePath: string;
  rawCode: string;
  lines: DomainTopic["codeTokens"]["lines"];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const getTokenClass = (type: string) => {
    switch (type) {
      case "keyword":
        return "text-purple-400 font-semibold";
      case "type":
        return "text-sky-300 font-medium";
      case "func":
        return "text-amber-300 font-medium";
      case "string":
        return "text-emerald-300";
      case "property":
        return "text-slate-200";
      case "operator":
        return "text-sky-400 font-semibold";
      case "comment":
        return "text-slate-500 italic";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c121e] overflow-hidden shadow-md flex flex-col">
      {/* Editor Tab Header */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-[#121929] border-b border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 mr-2 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700/80" />
          </div>
          <span className="text-slate-300 font-medium truncate">{filePath}</span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60 text-sky-400 font-semibold text-[10.5px]">
            <TbBrandGolang className="text-xs" />
            <span>Go</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800/80 px-2 py-0.5 rounded transition-all cursor-pointer"
            title="Copiar código"
          >
            {copied ? (
              <>
                <FiCheck className="text-emerald-400 text-xs" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <FiCopy className="text-xs" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers and Syntax Highlighting */}
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed select-text max-h-[480px]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, lineIdx) => (
              <tr key={lineIdx} className="hover:bg-slate-800/30 transition-colors">
                <td className="pr-4 text-slate-600 select-none text-right font-mono text-[11px] w-8 align-top">
                  {lineIdx + 1}
                </td>
                <td className="whitespace-pre">
                  {line.tokens.map((tok, tokIdx) => (
                    <span key={tokIdx} className={getTokenClass(tok.type)}>
                      {tok.text}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DomainMdxSection({ locale }: { locale: Locale }) {
  const [activeTopicId, setActiveTopicId] = useState<string>("balance-calc");
  const isManualClickRef = useRef(false);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const activeTopic = domainTopics.find((t) => t.id === activeTopicId) || domainTopics[0];

  const handleToggle = (id: string) => {
    isManualClickRef.current = true;
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      isManualClickRef.current = false;
    }, 1000);
    setActiveTopicId(id);
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (isManualClickRef.current) return;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const viewportCenter = window.innerHeight * 0.45;
        let closestId = "";
        let minDistance = Infinity;

        itemRefs.current.forEach((el, id) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elemCenter = rect.top + rect.height / 2;
          const dist = Math.abs(elemCenter - viewportCenter);

          // Requires element to be firmly centered in the viewport focus zone (strict threshold)
          if (rect.bottom > 140 && rect.top < window.innerHeight - 140) {
            if (dist < minDistance && dist < 120) {
              minDistance = dist;
              closestId = id;
            }
          }
        });

        if (closestId && closestId !== activeTopicId) {
          setActiveTopicId(closestId);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    };
  }, [activeTopicId]);

  return (
    <section id="domain-mdx" className="scroll-mt-28">
      {/* Section Header */}
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1.5">
          06 · {locale === "pt" ? "Domínio & Implementação" : "Domain & Implementation"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt" ? "Máquinas de estados e modelos em Go" : "State machines & Go domain models"}
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "Veja como os modelos de domínio do GoLedger estruturam as transições de estado, cálculos financeiros e integridade contábil no código Go."
            : "Explore how GoLedger domain models handle state transitions, financial arithmetic, and integrity constraints in Go."}
        </p>
      </div>

      {/* Split View: Left Accordions (with written text expanded) · Right Sticky Code Block ONLY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-y border-slate-300 divide-y lg:divide-y-0 lg:divide-x divide-slate-300 py-8 lg:py-10 items-start">
        
        {/* Left Column (5 cols): Expanding Accordion Items with Written Content */}
        <div className="lg:col-span-5 lg:pr-8 pb-8 lg:pb-0 space-y-3.5">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            {locale === "pt" ? "Contratos & Regras de Negócio" : "Contracts & Business Rules"}
          </span>

          {domainTopics.map((topic) => {
            const isExpanded = topic.id === activeTopicId;

            return (
              <div
                key={topic.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(topic.id, el);
                  else itemRefs.current.delete(topic.id);
                }}
                className={cn(
                  "rounded-xl border transition-all overflow-hidden shadow-2xs scroll-mt-32",
                  isExpanded
                    ? "border-sky-600 bg-white ring-2 ring-sky-600/10"
                    : "border-slate-300 bg-white hover:border-slate-400"
                )}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => handleToggle(topic.id)}
                  aria-expanded={isExpanded}
                  className={cn(
                    "w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors",
                    isExpanded ? "bg-slate-50/80" : "hover:bg-slate-50/50"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        "font-mono text-2xl sm:text-3xl font-black tracking-tighter select-none flex-shrink-0 transition-colors",
                        isExpanded ? "text-sky-600" : "text-slate-300"
                      )}
                    >
                      {topic.num}
                    </span>

                    <div className="min-w-0">
                      <h3
                        className={cn(
                          "text-sm sm:text-base font-bold transition-colors truncate",
                          isExpanded ? "text-sky-950" : "text-slate-900"
                        )}
                      >
                        {topic.title[locale]}
                      </h3>
                      {!isExpanded && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                          {topic.summary[locale]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "w-6 h-6 rounded-md border border-slate-200 bg-white grid place-items-center text-slate-500 transition-transform duration-200 flex-shrink-0 shadow-2xs",
                      isExpanded && "rotate-180 bg-slate-100 text-slate-900 border-slate-300"
                    )}
                  >
                    <FiChevronDown className="text-xs" />
                  </div>
                </button>

                {/* Accordion Expanded Content: Written explanation, equations & state badges */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 border-t border-slate-200/90 space-y-4 bg-white text-xs sm:text-sm text-slate-700">
                        {/* Text explanation */}
                        <div className="leading-relaxed">
                          {topic.explanation[locale]}
                        </div>

                        {/* Mathematical Equation (if present) */}
                        {topic.equations && topic.equations.length > 0 && (
                          <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-3.5 space-y-2 shadow-2xs">
                            {topic.equations.map((eq, i) => (
                              <div key={i} className="text-xs font-mono font-bold text-emerald-950">
                                <span className="text-emerald-800 font-semibold">{eq.label}: </span>
                                <span>{eq.formula}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* State Badges (if present) */}
                        {topic.stateBadges && topic.stateBadges.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            {topic.stateBadges.map((b, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-300 px-3 py-2 rounded-lg shadow-2xs"
                              >
                                <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", b.color)} />
                                <span>
                                  <strong className="text-slate-950 font-semibold">{b.label}</strong>: {b.desc}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Sticky Code Block ONLY */}
        <div className="lg:col-span-7 lg:pl-8 pt-8 lg:pt-0 lg:sticky lg:top-24">
          <CodeBlock
            filePath={activeTopic.filePath}
            rawCode={activeTopic.codeTokens.raw}
            lines={activeTopic.codeTokens.lines}
          />
        </div>

      </div>
    </section>
  );
}
