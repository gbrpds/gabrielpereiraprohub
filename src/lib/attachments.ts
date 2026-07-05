"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "demanda-attachments";
const SIGNED_URL_TTL = 60 * 60; // 1 hour, enough for a drawer/session to stay open

export async function uploadAttachment(demandaId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  const caption = String(formData.get("caption") ?? "").trim() || null;

  if (!file || file.size === 0) return;

  const admin = createAdminClient();
  const path = `${demandaId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const supabase = await createClient();
  await supabase.from("demanda_attachments").insert({
    demanda_id: demandaId,
    file_path: path,
    file_name: file.name,
    file_type: file.type,
    caption,
  });

  revalidatePath("/demandas");
  revalidatePath("/cronograma");
}

export async function updateAttachmentCaption(id: string, caption: string) {
  const supabase = await createClient();
  await supabase.from("demanda_attachments").update({ caption }).eq("id", id);
  revalidatePath("/demandas");
  revalidatePath("/cronograma");
}

export async function deleteAttachment(id: string, filePath: string) {
  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([filePath]);

  const supabase = await createClient();
  await supabase.from("demanda_attachments").delete().eq("id", id);

  revalidatePath("/demandas");
  revalidatePath("/cronograma");
}

export async function getDemandaDetail(id: string) {
  const supabase = await createClient();

  const [{ data: demanda }, { data: attachments }] = await Promise.all([
    supabase.from("demandas").select("*, clients(id, name)").eq("id", id).single(),
    supabase
      .from("demanda_attachments")
      .select("*")
      .eq("demanda_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const admin = createAdminClient();
  const attachmentsWithUrls = await Promise.all(
    (attachments ?? []).map(async (attachment) => {
      const { data } = await admin.storage
        .from(BUCKET)
        .createSignedUrl(attachment.file_path, SIGNED_URL_TTL);
      return { ...attachment, url: data?.signedUrl ?? null };
    })
  );

  return { demanda, attachments: attachmentsWithUrls };
}
