export type ApplicantChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const STORAGE_PREFIX = "maems-applicant-chat:v1:";

/** Legacy single key (pre per-user); remove when present to avoid wrong sharing. */
export const LEGACY_APPLICANT_CHAT_KEY = "maems-applicant-chat-thread";

export function applicantChatStorageKey(email: string): string {
  return `${STORAGE_PREFIX}${email.toLowerCase().trim()}`;
}

export function clearApplicantChatForEmail(email: string): void {
  try {
    localStorage.removeItem(applicantChatStorageKey(email));
  } catch {
    // ignore
  }
}

function parseThread(raw: string): ApplicantChatMessage[] {
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) return [];
  return data.filter(
    (m): m is ApplicantChatMessage =>
      m != null &&
      typeof m === "object" &&
      typeof (m as ApplicantChatMessage).id === "string" &&
      ((m as ApplicantChatMessage).role === "user" ||
        (m as ApplicantChatMessage).role === "bot") &&
      typeof (m as ApplicantChatMessage).text === "string"
  );
}

export function loadApplicantChatThread(email: string): ApplicantChatMessage[] {
  try {
    const raw = localStorage.getItem(applicantChatStorageKey(email));
    if (!raw) return [];
    return parseThread(raw);
  } catch {
    return [];
  }
}

export function saveApplicantChatThread(
  email: string,
  messages: ApplicantChatMessage[]
): void {
  try {
    localStorage.setItem(
      applicantChatStorageKey(email),
      JSON.stringify(messages)
    );
  } catch {
    // ignore quota / private mode
  }
}
