"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TransactionStatus, TransactionType } from "@/types/database";

function parseAmount(value: FormDataEntryValue | null): number {
  const raw = String(value ?? "").trim().replace(/\./g, "").replace(",", ".");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();

  const type = String(formData.get("type") ?? "receita") as TransactionType;
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const client_id = String(formData.get("client_id") ?? "") || null;
  const amount = parseAmount(formData.get("amount"));
  const status = String(formData.get("status") ?? "pendente") as TransactionStatus;
  const due_date = String(formData.get("due_date") ?? "") || null;
  const paid_date = status === "pago" ? String(formData.get("due_date") ?? "") || null : null;

  await supabase
    .from("transactions")
    .insert({ type, description, category, client_id, amount, status, due_date, paid_date });

  revalidatePath("/financeiro");
}

export async function setTransactionStatus(id: string, status: TransactionStatus) {
  const supabase = await createClient();
  const paid_date = status === "pago" ? new Date().toISOString().slice(0, 10) : null;
  await supabase.from("transactions").update({ status, paid_date }).eq("id", id);
  revalidatePath("/financeiro");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  revalidatePath("/financeiro");
}
