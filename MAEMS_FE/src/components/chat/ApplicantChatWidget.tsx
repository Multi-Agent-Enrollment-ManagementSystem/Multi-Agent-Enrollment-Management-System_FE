import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { askChatbox } from "../../api/chatbox";
import { useAuthStore } from "../../stores/authStore";
import {
  LEGACY_APPLICANT_CHAT_KEY,
  loadApplicantChatThread,
  saveApplicantChatThread,
  type ApplicantChatMessage,
} from "../../utils/applicantChatStorage";

const WELCOME_MESSAGE: ApplicantChatMessage = {
  id: "welcome-message",
  role: "bot",
  text: "Xin chào Anh/Chị! Em là trợ lý AI của MAEMS. Em rất sẵn lòng hỗ trợ Anh/Chị.",
};

export function ApplicantChatWidget() {
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [threadMessages, setThreadMessages] = useState<ApplicantChatMessage[]>([]);
  const [hydratedForEmail, setHydratedForEmail] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const legacyRemovedRef = useRef(false);

  const allMessages = useMemo(
    () => [WELCOME_MESSAGE, ...threadMessages],
    [threadMessages]
  );

  useEffect(() => {
    if (legacyRemovedRef.current) return;
    legacyRemovedRef.current = true;
    try {
      localStorage.removeItem(LEGACY_APPLICANT_CHAT_KEY);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const email = user?.email?.trim();
    if (!email) {
      setThreadMessages([]);
      setHydratedForEmail(null);
      return;
    }
    setThreadMessages(loadApplicantChatThread(email));
    setHydratedForEmail(email);
  }, [user?.email]);

  useEffect(() => {
    const email = user?.email?.trim();
    if (!email || hydratedForEmail !== email) return;
    saveApplicantChatThread(email, threadMessages);
  }, [threadMessages, user?.email, hydratedForEmail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, allMessages.length, isSending]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isSending || !user?.email) return;

    const tempQuestion: ApplicantChatMessage = {
      id: `local-q-${Date.now()}`,
      role: "user",
      text: question,
    };
    setThreadMessages((prev) => [...prev, tempQuestion]);
    setInput("");
    setIsSending(true);
    setErrorText(null);

    try {
      const response = await askChatbox(question);
      setThreadMessages((prev) => [
        ...prev,
        {
          id: `a-${response.chatId}-${Date.now()}`,
          role: "bot",
          text: response.answer,
        },
      ]);
    } catch {
      setErrorText("Gửi câu hỏi thất bại. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[1000] h-14 w-14 rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600"
          aria-label="Mở trợ lý AI"
        >
          <MessageCircle className="mx-auto h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[1000] flex h-[calc(100dvh-2.5rem)] w-[min(360px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl">
          <div className="flex shrink-0 items-center justify-between bg-orange-500 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-2">
              <div className="shrink-0 rounded-full bg-white/25 p-1.5">
                <Bot className="h-4 w-4" />
              </div>
              <div className="truncate text-lg font-semibold">Trợ lý MAEMS</div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="shrink-0 rounded-md bg-white/20 p-1.5 transition hover:bg-white/30"
              aria-label="Đóng trợ lý AI"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-orange-50/30 px-3 py-4">
            {allMessages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-[16px] leading-relaxed ${
                    message.role === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="mb-3 flex justify-start">
                <div className="rounded-2xl bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                  Trợ lý đang trả lời...
                </div>
              </div>
            )}

            {errorText && (
              <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorText}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 border-t border-orange-100 p-3">
            <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={isSending || !input.trim() || !user?.email}
                className="rounded-full bg-orange-500 p-2 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-200"
                aria-label="Gửi tin nhắn"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              Thông tin chỉ mang tính tham khảo, được tư vấn bởi AI.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
