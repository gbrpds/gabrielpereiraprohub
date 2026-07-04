"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createClientRecord(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const invite = formData.get("invite") === "on";

  const { data: client, error } = await supabase
    .from("clients")
    .insert({ name, email, company, phone, notes })
    .select("id")
    .single();

  if (error) {
    redirect(`/clientes/novo?error=${encodeURIComponent(error.message)}`);
  }

  if (invite && client) {
    const admin = createAdminClient();
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: process.env.NEXT_PUBLIC_PORTAL_URL,
      }
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

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const active = formData.get("active") === "on";

  await supabase.from("clients").update({ name, email, company, phone, notes, active }).eq("id", id);

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
