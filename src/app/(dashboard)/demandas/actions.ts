"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DemandaPrioridade, DemandaStatus } from "@/types/database";

export async function createDemanda(formData: FormData) {
  const supabase = await createClient();

  const client_id = String(formData.get("client_id") ?? "");
  const project_id = String(formData.get("project_id") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priority = String(formData.get("priority") ?? "media") as DemandaPrioridade;
  const due_date = String(formData.get("due_date") ?? "") || null;

  const { error } = await supabase
    .from("demandas")
    .insert({ client_id, project_id, title, description, priority, due_date });

  if (error) {
    redirect(`/demandas/nova?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/demandas");
  redirect("/demandas");
}

export async function updateDemandaStatus(id: string, status: DemandaStatus) {
  const supabase = await createClient();
  await supabase.from("demandas").update({ status }).eq("id", id);
  revalidatePath("/demandas");
}
