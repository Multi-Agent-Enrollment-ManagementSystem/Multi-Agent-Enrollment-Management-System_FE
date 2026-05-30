import { getBytes, getStorage, ref } from "firebase/storage";
import { app, firebaseStorage } from "../../../../firebase";
import { apiClient } from "../../../../services/axios";
import type { Document } from "../../../../types/document";

const ENV_STORAGE_BUCKET = (
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? ""
).trim();

const MAX_BYTES = 15 * 1024 * 1024;

function isFirebaseStorageUrl(url: string): boolean {
  return /firebasestorage\.googleapis\.com/i.test(url);
}

function firebaseObjectPathFromUrl(url: string): string | null {
  try {
    const match = new URL(url).pathname.match(/\/o\/(.+)$/);
    if (!match?.[1]) return null;
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function firebaseBucketFromUrl(url: string): string | null {
  const match = url.match(/\/b\/([^/]+)\//i);
  return match?.[1] ?? null;
}

function firebaseBucketCandidates(filePathUrl: string): string[] {
  const buckets: string[] = [];
  const fromUrl = firebaseBucketFromUrl(filePathUrl);
  if (fromUrl) buckets.push(fromUrl);
  if (ENV_STORAGE_BUCKET && !buckets.includes(ENV_STORAGE_BUCKET)) {
    buckets.push(ENV_STORAGE_BUCKET);
  }
  return buckets;
}

async function fetchViaFirebase(filePath: string): Promise<Blob | null> {
  const objectPath = firebaseObjectPathFromUrl(filePath);
  if (!objectPath) return null;

  const storages = firebaseBucketCandidates(filePath).map((id) =>
    getStorage(app, `gs://${id}`),
  );
  if (!storages.length) storages.push(firebaseStorage);

  for (const storage of storages) {
    try {
      const bytes = await getBytes(ref(storage, objectPath), MAX_BYTES);
      if (bytes.byteLength > 0) return new Blob([bytes]);
    } catch {
      // Thử bucket khác
    }
  }
  return null;
}

async function fetchViaApiPath(path: string): Promise<Blob | null> {
  try {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const res = await apiClient.get<Blob>(normalized, { responseType: "blob" });
    return res.data?.size ? res.data : null;
  } catch {
    return null;
  }
}

/** Tải blob tài liệu để ghi vào folder (Firebase SDK hoặc API) */
export async function fetchDocumentFromFilePath(
  doc: Document,
): Promise<Blob | null> {
  const filePath = doc.filePath?.trim();
  if (!filePath) return null;

  if (isFirebaseStorageUrl(filePath)) {
    const blob = await fetchViaFirebase(filePath);
    if (blob) return blob;
  }

  if (/^https?:\/\//i.test(filePath)) {
    try {
      const res = await fetch(filePath, { cache: "no-store" });
      if (res.ok) return await res.blob();
    } catch {
      return null;
    }
    return null;
  }

  return fetchViaApiPath(filePath);
}
