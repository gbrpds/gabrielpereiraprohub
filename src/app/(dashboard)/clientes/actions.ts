"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContractCycle } from "@/types/database";

const CONTRACT_BUCKET = "client-contracts";

function parseNumber(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim().replace(/\./g, "").replace(",", ".");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseInteger(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function str(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  return raw || null;
}

async function uploadContract(clientId: string, file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const admin = createAdminClient();
  const path = `${clientId}/${Date.now()}-${file.name}`;
  const { error } = await admin.storage.from(CONTRACT_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) return null;
  return path;
}

function clientFieldsFromForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: str(formData.get("company")),
    phone: str(formData.get("phone")),
    document: str(formData.get("document")),
    instagram: str(formData.get("instagram")),
    address: str(formData.get("address")),
    package: str(formData.get("package")),
    contract_value: parseNumber(formData.get("contract_value")),
    contract_cycle: (String(formData.get("contract_cycle") ?? "mensal") as ContractCycle),
    billing_day: parseInteger(formData.get("billing_day")),
    contract_start: str(formData.get("contract_start")),
    contract_end: str(formData.get("contract_end")),
    payment_method: str(formData.get("payment_method")),
    notes: str(formData.get("notes")),
  };
}

export async function createClientRecord(formData: FormData) {
  const supabase = await createClient();
  const fields = clientFieldsFromForm(formData);
  const invite = formData.get("invite") === "on";

  const { data: client, error } = await supabase
    .from("clients")
    .insert(fields)
    .select("id")
    .single();

  if (error) {
    redirect(`/clientes/novo?error=${encodeURIComponent(error.message)}`);
  }

  const contractFile = formData.get("contract_file") as File | null;
  if (contractFile && contractFile.size > 0 && client) {
    const path = await uploadContract(client.id, contractFile);
    if (path) {
      await supabase.from("clients").update({ contract_file_path: path }).eq("id", client.id);
    }
  }

  if (invite && client) {
    const admin = createAdminClient();
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
      fields.email,
      { redirectTo: process.env.NEXT_PUBLIC_PORTAL_URL }
    );
    if (!inviteError && invited?.user) {
      await supabase.from("clients").update({ auth_user_id: invited.user.id }).eq("id", client.id);
    }
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateClientRecord(id: string, formData: FormData) {
  const supabase = await createClient();
  const fields = clientFieldsFromForm(formData);
  const active = formData.get("active") === "on";

  await supabase.from("clients").update({ ...fields, active }).eq("id", id);

  const contractFile = formData.get("contract_file") as File | null;
  if (contractFile && contractFile.size > 0) {
    const path = await uploadContract(id, contractFile);
    if (path) {
      await supabase.from("clients").update({ contract_file_path: path }).eq("id", id);
    }
  }

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect(`/clientes/${id}`);
}

export async function inviteClientUser(id: string, email: string) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_PORTAL_URL,
  });

  if (!error && invited?.user) {
    await supabase.from("clients").update({ auth_user_id: invited.user.id }).eq("id", id);
  }

  revalidatePath(`/clientes/${id}`);
}

export async function getContractUrl(path: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin.storage.from(CONTRACT_BUCKET).createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}
