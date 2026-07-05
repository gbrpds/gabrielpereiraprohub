import type { Client } from "@/types/database";

const input =
  "w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-neutral-300";
const section = "border border-neutral-800 bg-neutral-950 p-6";
const sectionTitle = "mb-4 text-sm font-semibold uppercase tracking-wide text-orange-300";

export function ClientFields({ client }: { client?: Partial<Client> }) {
  return (
    <div className="space-y-6">
      <div className={section}>
        <h2 className={sectionTitle}>Dados de contato</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Nome *</label>
            <input name="name" required defaultValue={client?.name ?? ""} className={input} />
          </div>
          <div>
            <label className={label}>Empresa</label>
            <input name="company" defaultValue={client?.company ?? ""} className={input} />
          </div>
          <div>
            <label className={label}>E-mail *</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={client?.email ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Telefone / WhatsApp</label>
            <input name="phone" defaultValue={client?.phone ?? ""} className={input} />
          </div>
          <div>
            <label className={label}>Instagram</label>
            <input
              name="instagram"
              placeholder="@usuario"
              defaultValue={client?.instagram ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>CPF / CNPJ</label>
            <input name="document" defaultValue={client?.document ?? ""} className={input} />
          </div>
          <div className="col-span-2">
            <label className={label}>Endereço</label>
            <input name="address" defaultValue={client?.address ?? ""} className={input} />
          </div>
        </div>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>Contrato & Financeiro</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Pacote / Plano</label>
            <input
              name="package"
              placeholder="Ex: Estratégia, Social Media..."
              defaultValue={client?.package ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Valor do contrato (R$)</label>
            <input
              name="contract_value"
              inputMode="decimal"
              placeholder="0,00"
              defaultValue={client?.contract_value != null ? String(client.contract_value) : ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Ciclo de cobrança</label>
            <select
              name="contract_cycle"
              defaultValue={client?.contract_cycle ?? "mensal"}
              className={input}
            >
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
              <option value="pontual">Pontual (avulso)</option>
            </select>
          </div>
          <div>
            <label className={label}>Dia de vencimento</label>
            <input
              name="billing_day"
              type="number"
              min={1}
              max={31}
              placeholder="Ex: 10"
              defaultValue={client?.billing_day != null ? String(client.billing_day) : ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Forma de pagamento</label>
            <input
              name="payment_method"
              placeholder="Pix, boleto, cartão..."
              defaultValue={client?.payment_method ?? ""}
              className={input}
            />
          </div>
          <div />
          <div>
            <label className={label}>Início do contrato</label>
            <input
              name="contract_start"
              type="date"
              defaultValue={client?.contract_start ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Fim do contrato</label>
            <input
              name="contract_end"
              type="date"
              defaultValue={client?.contract_end ?? ""}
              className={input}
            />
          </div>
          <div className="col-span-2">
            <label className={label}>Anexar contrato (PDF, imagem)</label>
            <input
              name="contract_file"
              type="file"
              accept="application/pdf,image/*"
              className="block w-full text-xs text-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>Contexto / Estratégia</h2>
        <p className="mb-2 text-xs text-neutral-500">
          Nicho, tom de voz, objetivos, referências e qualquer coisa que ajude a lembrar do
          contexto desse cliente.
        </p>
        <textarea name="notes" rows={8} defaultValue={client?.notes ?? ""} className={input} />
      </div>
    </div>
  );
}
