import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateClientRecord, inviteClientUser, getContractUrl } from "../actions";
import { ClientFields } from "../client-fields";
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

  const contractUrl = client.contract_file_path
    ? await getContractUrl(client.contract_file_path)
    : null;

  const updateAction = updateClientRecord.bind(null, id);
  const inviteAction = inviteClientUser.bind(null, id, client.email);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{client.name}</h1>
          <p className="text-sm text-neutral-500">{client.company}</p>
        </div>
        {client.auth_user_id ? (
          <span className="border border-emerald-500 px-2 py-0.5 text-xs font-medium text-emerald-300">
            Convidado
          </span>
        ) : (
          <form action={inviteAction}>
            <button
              type="submit"
              className="bg-orange-500 px-3 py-1.5 text-xs font-medium text-black hover:bg-orange-400"
            >
              Enviar convite ao Portal
            </button>
          </form>
        )}
      </div>

      {contractUrl && (
        <a
          href={contractUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block border border-neutral-700 px-3 py-2 text-sm text-orange-300 hover:border-orange-500"
        >
          📄 Ver contrato anexado
        </a>
      )}

      <form action={updateAction} className="space-y-6">
        <ClientFields client={client} />

        <div className="border border-neutral-800 bg-neutral-950 p-6">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              name="active"
              defaultChecked={client.active}
              className="border-neutral-700"
            />
            Cliente ativo
          </label>
          <button
            type="submit"
            className="mt-4 bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
          >
            Salvar alterações
          </button>
        </div>
      </form>

      <div className="border border-neutral-800 bg-neutral-950 p-6">
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
