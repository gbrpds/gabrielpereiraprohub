import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateClientRecord, inviteClientUser } from "../actions";
import { PROJETO_STATUS_BADGE, PROJETO_STATUS_LABEL } from "@/lib/status";
import type { ProjetoStatus } from "@/types/database";

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: client }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase
      .from("projects")
      .select("id, name, status")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();

  const updateAction = updateClientRecord.bind(null, id);
  const inviteAction = inviteClientUser.bind(null, id, client.email);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">{client.name}</h1>
        <p className="text-sm text-neutral-500">{client.company}</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Acesso ao Portal</h2>
          {client.auth_user_id ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Convidado
            </span>
          ) : (
            <form action={inviteAction}>
              <button
                type="submit"
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
              >
                Enviar convite
              </button>
            </form>
          )}
        </div>

        <form action={updateAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Nome</label>
              <input
                name="name"
                defaultValue={client.name}
                required
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Empresa</label>
              <input
                name="company"
                defaultValue={client.company ?? ""}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">E-mail</label>
              <input
                name="email"
                type="email"
                defaultValue={client.email}
                required
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Telefone</label>
              <input
                name="phone"
                defaultValue={client.phone ?? ""}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Observações</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={client.notes ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              name="active"
              defaultChecked={client.active}
              className="rounded border-neutral-300"
            />
            Cliente ativo
          </label>
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Salvar alterações
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Projetos</h2>
          <Link
            href={`/projetos/novo?client_id=${client.id}`}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
          >
            + Novo projeto
          </Link>
        </div>
        <ul className="space-y-2">
          {(projects ?? []).map((project) => (
            <li key={project.id} className="flex items-center justify-between text-sm">
              <Link href={`/projetos/${project.id}`} className="text-neutral-900 hover:underline">
                {project.name}
              </Link>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${PROJETO_STATUS_BADGE[project.status as ProjetoStatus]}`}
              >
                {PROJETO_STATUS_LABEL[project.status as ProjetoStatus]}
              </span>
            </li>
          ))}
          {(projects ?? []).length === 0 && (
            <p className="text-sm text-neutral-400">Nenhum projeto ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
