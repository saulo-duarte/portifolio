import { ProjectPage } from "../../../../components/portfolio";
export function generateStaticParams() { return [{ slug:"goledge" }, { slug:"url-shortener" }]; }
export default async function Project({ params }: { params:Promise<{ slug:"goledge"|"url-shortener" }> }) { const { slug }=await params; return <ProjectPage locale="en" slug={slug}/>; }
