import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PROJETO_STATUS_BADGE, PROJETO_STATUS_LABEL } from "@/lib/status";
import type { ProjetoStatus } from "@/types/database";

export default async function ProjetosPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, start_date, end_date, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Projetos</h1>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Projeto</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Início</th>
              <th className="px-4 py-3 font-medium">Fim previsto</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((project) => (
              <tr key={project.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/projetos/${project.id}`} className="font-medium text-neutral-900">
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {(project.clients as unknown as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${PROJETO_STATUS_BADGE[project.status as ProjetoStatus]}`}
                  >
                    {PROJETO_STATUS_LABEL[project.status as ProjetoStatus]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{project.start_date ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{project.end_date ?? "—"}</td>
              </tr>
            ))}
            {(projects ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  Nenhum projeto cadastrado ainda. Crie um a partir da página de um cliente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
