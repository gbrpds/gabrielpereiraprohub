"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProjetoStatus } from "@/types/database";

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const client_id = String(formData.get("client_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const start_date = String(formData.get("start_date") ?? "") || null;
  const end_date = String(formData.get("end_date") ?? "") || null;

  const { data: project, error } = await supabase
    .from("projects")
    .insert({ client_id, name, description, start_date, end_date })
    .select("id")
    .single();

  if (error) {
    redirect(`/projetos/novo?client_id=${client_id}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/projetos");
  revalidatePath(`/clientes/${client_id}`);
  redirect(`/projetos/${project!.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "planejamento") as ProjetoStatus;
  const start_date = String(formData.get("start_date") ?? "") || null;
  const end_date = String(formData.get("end_date") ?? "") || null;

  const { data: project } = await supabase
    .from("projects")
    .update({ name, description, status, start_date, end_date })
    .eq("id", id)
    .select("client_id")
    .single();

  revalidatePath("/projetos");
  revalidatePath(`/projetos/${id}`);
  if (project) revalidatePath(`/clientes/${project.client_id}`);
  redirect(`/projetos/${id}`);
}
