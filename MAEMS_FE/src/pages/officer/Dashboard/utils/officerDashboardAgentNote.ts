/** Trích danh sách loại tài liệu thiếu từ ghi chú agent (pattern tiếng Anh từ backend). */
export function parseAgentNote(notes: string | null) {
  if (!notes) return { missingDocs: [] as string[] };
  const m = notes.match(/Missing required document types?:\s*([^\n.]+)/i);
  const missingDocs = m ? m[1].split(",").map((s) => s.trim()) : [];
  return { missingDocs };
}
