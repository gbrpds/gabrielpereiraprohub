import { createClientRecord } from "../actions";

export default async function NovoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-white">Novo cliente</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-950 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <form action={createClientRecord} className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Nome</label>
          <input
            name="name"
            required
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Empresa</label>
          <input
            name="company"
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Telefone</label>
          <input
            name="phone"
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Observações</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input type="checkbox" name="invite" defaultChecked className="rounded border-neutral-700" />
          Convidar para o Portal do Cliente por e-mail
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-black hover:bg-orange-500"
        >
          Salvar cliente
        </button>
      </form>
    </div>
  );
}
