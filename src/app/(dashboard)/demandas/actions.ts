"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DemandaStatus } from "@/types/database";

export async function createDemanda(formData: FormData) {
  const supabase = await createClient();

  const client_id = String(formData.get("client_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const due_date = String(formData.get("due_date") ?? "") || null;
  const publish_date = String(formData.get("publish_date") ?? "") || null;

  const { error } = await supabase
    .from("demandas")
    .insert({ client_id, title, description, due_date, publish_date });

  if (error) {
    redirect(`/demandas/nova?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/demandas");
  revalidatePath("/cronograma");
  redirect("/demandas");
}

export async function updateDemandaStatus(id: string, status: DemandaStatus) {
  const supabase = await createClient();
  await supabase.from("demandas").update({ status }).eq("id", id);
  revalidatePath("/demandas");
  revalidatePath("/cronograma");
}

export async function updateDemandaDetails(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "recebida") as DemandaStatus;
  const due_date = String(formData.get("due_date") ?? "") || null;
  const publish_date = String(formData.get("publish_date") ?? "") || null;

  await supabase
    .from("demandas")
    .update({ title, description, status, due_date, publish_date })
    .eq("id", id);

  revalidatePath("/demandas");
  revalidatePath("/cronograma");
}
