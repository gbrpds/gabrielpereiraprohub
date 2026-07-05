"use client";

import { useEffect, useRef, useState } from "react";
import { updateDemandaDetails } from "./actions";
import { uploadAttachment, deleteAttachment, getDemandaDetail } from "@/lib/attachments";
import { DEMANDA_STATUS_LABEL, DEMANDA_STATUS_ORDER } from "@/lib/status";
import type { Demanda, DemandaAttachment, DemandaStatus } from "@/types/database";

type Detail = {
  demanda: (Demanda & { clients: { id: string; name: string } | null }) | null;
  attachments: (DemandaAttachment & { url: string | null })[];
};

export function DemandaDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captionInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    const data = await getDemandaDetail(id);
    setDetail(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches on id change, canonical data-fetch effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(formData: FormData) {
    await updateDemandaDetails(id, formData);
    await refresh();
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);
    formData.set("caption", captionInputRef.current?.value ?? "");

    setUploading(true);
    await uploadAttachment(id, formData);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (captionInputRef.current) captionInputRef.current.value = "";
    await refresh();
    setUploading(false);
  }

  async function handleDelete(attachmentId: string, filePath: string) {
    await deleteAttachment(attachmentId, filePath);
    await refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Demanda</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white">
            Fechar ✕
          </button>
        </div>

        {loading || !detail?.demanda ? (
          <p className="text-sm text-neutral-500">Carregando...</p>
        ) : (
          <>
            <form action={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Cliente</label>
                <p className="text-sm text-white">{detail.demanda.clients?.name}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Título</label>
                <input
                  name="title"
                  defaultValue={detail.demanda.title}
                  required
                  className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Status</label>
                <select
                  name="status"
                  defaultValue={detail.demanda.status}
                  className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                >
                  {DEMANDA_STATUS_ORDER.map((status) => (
                    <option key={status} value={status}>
                      {DEMANDA_STATUS_LABEL[status as DemandaStatus]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-300">
                    Data de entrega
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    defaultValue={detail.demanda.due_date ?? ""}
                    className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-300">
                    Data de publicação
                  </label>
                  <input
                    type="date"
                    name="publish_date"
                    defaultValue={detail.demanda.publish_date ?? ""}
                    className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  Descrição
                </label>
                <textarea
                  name="description"
                  rows={5}
                  defaultValue={detail.demanda.description ?? ""}
                  className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
              >
                Salvar
              </button>
            </form>

            <div className="mt-8 border-t border-neutral-800 pt-6">
              <h3 className="mb-3 text-sm font-semibold text-white">Anexos</h3>

              <div className="mb-4 grid grid-cols-2 gap-3">
                {detail.attachments.map((attachment) => (
                  <div key={attachment.id} className="border border-neutral-800 bg-black p-2">
                    {attachment.file_type.startsWith("image/") && attachment.url ? (
                      <img src={attachment.url} alt={attachment.file_name} className="mb-2 h-32 w-full object-cover" />
                    ) : attachment.file_type.startsWith("video/") && attachment.url ? (
                      <video src={attachment.url} controls className="mb-2 h-32 w-full object-cover" />
                    ) : (
                      <a
                        href={attachment.url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="mb-2 block h-32 truncate border border-neutral-800 p-2 text-xs text-orange-300 underline"
                      >
                        {attachment.file_name}
                      </a>
                    )}
                    <p className="truncate text-xs text-neutral-400">
                      {attachment.caption || attachment.file_name}
                    </p>
                    <button
                      onClick={() => handleDelete(attachment.id, attachment.file_path)}
                      className="mt-1 text-xs text-red-400 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleUpload} className="space-y-2 border-t border-neutral-800 pt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  required
                  className="block w-full text-xs text-neutral-400"
                />
                <input
                  ref={captionInputRef}
                  type="text"
                  placeholder="Legenda (opcional)"
                  className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400 disabled:opacity-50"
                >
                  {uploading ? "Enviando..." : "Anexar entrega"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
