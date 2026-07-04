import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProject } from "../actions";
import { DEMANDA_STATUS_LABEL, PROJETO_STATUS_LABEL } from "@/lib/status";
import type { DemandaStatus, ProjetoStatus } from "@/types/database";

export default async function ProjetoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: demandas }] = await Promise.all([
    supabase.from("projects").select("*, clients(id, name)").eq("id", id).single(),
    supabase
      .from("demandas")
      .select("id, title, status")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!project) notFound();

  const client = project.clients as unknown as { id: string; name: string } | null;
  const updateAction = updateProject.bind(null, id);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        {client && (
          <Link href={`/clientes/${client.id}`} className="text-sm text-neutral-500 hover:underline">
            {client.name}
          </Link>
        )}
        <h1 className="text-2xl font-semibold text-neutral-900">{project.name}</h1>
      </div>

      <form action={updateAction} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Nome</label>
          <input
            name="name"
            defaultValue={project.name}
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Descrição</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={project.description ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Status</label>
          <select
            name="status"
            defaultValue={project.status}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          >
            {(Object.keys(PROJETO_STATUS_LABEL) as ProjetoStatus[]).map((status) => (
              <option key={status} value={status}>
                {PROJETO_STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Início</label>
            <input
              type="date"
              name="start_date"
              defaultValue={project.start_date ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Fim previsto</label>
            <input
              type="date"
              name="end_date"
              defaultValue={project.end_date ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Salvar alterações
        </button>
      </form>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Demandas do projeto</h2>
          <Link
            href={`/demandas?project_id=${project.id}`}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
          >
            Ver no quadro
          </Link>
        </div>
        <ul className="space-y-2">
          {(demandas ?? []).map((demanda) => (
            <li key={demanda.id} className="flex items-center justify-between text-sm">
              <span className="text-neutral-900">{demanda.title}</span>
              <span className="text-xs text-neutral-500">
                {DEMANDA_STATUS_LABEL[demanda.status as DemandaStatus]}
              </span>
            </li>
          ))}
          {(demandas ?? []).length === 0 && (
            <p className="text-sm text-neutral-400">Nenhuma demanda vinculada ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
