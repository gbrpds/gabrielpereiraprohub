import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateClientRecord, inviteClientUser } from "../actions";
import { DEMANDA_STATUS_BADGE, DEMANDA_STATUS_LABEL } from "@/lib/status";
import type { DemandaStatus } from "@/types/database";

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: client }, { data: demandas }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase
      .from("demandas")
      .select("id, title, status")
      .eq("client_id", id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (!client) notFound();

  const updateAction = updateClientRecord.bind(null, id);
  const inviteAction = inviteClientUser.bind(null, id, client.email);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">{client.name}</h1>
        <p className="text-sm text-neutral-500">{client.company}</p>
      </div>

      <div className="border border-neutral-800 bg-neutral-950 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Acesso ao Portal</h2>
          {client.auth_user_id ? (
            <span className="border border-emerald-700 px-2 py-0.5 text-xs font-medium text-emerald-400">
              Convidado
            </span>
          ) : (
            <form action={inviteAction}>
              <button
                type="submit"
                className="bg-orange-600 px-3 py-1.5 text-xs font-medium text-black hover:bg-orange-500"
              >
                Enviar convite
              </button>
            </form>
          )}
        </div>

        <form action={updateAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Nome</label>
              <input
                name="name"
                defaultValue={client.name}
                required
                className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Empresa</label>
              <input
                name="company"
                defaultValue={client.company ?? ""}
                className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">E-mail</label>
              <input
                name="email"
                type="email"
                defaultValue={client.email}
                required
                className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Telefone</label>
              <input
                name="phone"
                defaultValue={client.phone ?? ""}
                className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-600 focus:outline-none"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              name="active"
              defaultChecked={client.active}
              className="border-neutral-700"
            />
            Cliente ativo
          </label>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              Contexto / Estratégia
            </label>
            <p className="mb-2 text-xs text-neutral-500">
              Registre aqui nicho, tom de voz, objetivos, referências e qualquer coisa que ajude a
              lembrar do contexto desse cliente.
            </p>
            <textarea
              name="notes"
              rows={10}
              defaultValue={client.notes ?? ""}
              className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-600 px-4 py-2 text-sm font-medium text-black hover:bg-orange-500"
          >
            Salvar alterações
          </button>
        </form>
      </div>

      <div className="border border-neutral-800 bg-neutral-950 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Demandas recentes</h2>
          <Link
            href={`/demandas?client_id=${client.id}`}
            className="text-xs font-medium text-neutral-400 hover:text-white"
          >
            Ver todas
          </Link>
        </div>
        <ul className="space-y-2">
          {(demandas ?? []).map((demanda) => (
            <li key={demanda.id} className="flex items-center justify-between text-sm">
              <span className="text-white">{demanda.title}</span>
              <span
                className={`px-2 py-0.5 text-xs font-medium ${DEMANDA_STATUS_BADGE[demanda.status as DemandaStatus]}`}
              >
                {DEMANDA_STATUS_LABEL[demanda.status as DemandaStatus]}
              </span>
            </li>
          ))}
          {(demandas ?? []).length === 0 && (
            <p className="text-sm text-neutral-500">Nenhuma demanda ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
