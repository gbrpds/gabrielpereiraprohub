import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950 p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-white">Hub</h1>
        <p className="mb-6 text-sm text-neutral-500">Acesso da equipe interna</p>

        {error && (
          <p className="mb-4 rounded-md bg-red-950 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-300">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-300">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-black transition hover:bg-orange-500"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
