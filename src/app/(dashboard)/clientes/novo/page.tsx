import { createClientRecord } from "../actions";
import { ClientFields } from "../client-fields";

export default async function NovoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold text-white">Novo cliente</h1>

      {error && (
        <p className="mb-4 border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <form action={createClientRecord} className="space-y-6">
        <ClientFields />

        <div className="border border-neutral-800 bg-neutral-950 p-6">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" name="invite" defaultChecked className="border-neutral-700" />
            Convidar para o Portal do Cliente por e-mail
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-orange-500 px-3 py-2 text-sm font-medium text-black hover:bg-orange-400"
          >
            Salvar cliente
          </button>
        </div>
      </form>
    </div>
  );
}
