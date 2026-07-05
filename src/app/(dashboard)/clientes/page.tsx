import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, company, email, active, auth_user_id")
    .order("name");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Clientes</h1>
        <Link
          href="/clientes/novo"
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
        >
          Novo cliente
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-black text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Portal</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((client) => (
              <tr key={client.id} className="border-t border-neutral-900 hover:bg-black">
                <td className="px-4 py-3">
                  <Link href={`/clientes/${client.id}`} className="font-medium text-white">
                    {client.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-400">{client.company ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-400">{client.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`border px-2 py-0.5 text-xs font-medium ${
                      client.auth_user_id
                        ? "border-emerald-700 text-emerald-400"
                        : "border-neutral-700 text-neutral-500"
                    }`}
                  >
                    {client.auth_user_id ? "Convidado" : "Sem acesso"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`border px-2 py-0.5 text-xs font-medium ${
                      client.active
                        ? "border-emerald-700 text-emerald-400"
                        : "border-neutral-700 text-neutral-500"
                    }`}
                  >
                    {client.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
            {(clients ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
