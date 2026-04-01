import { apiClient } from "../services/axios";
import type { ApiWrapper, PagedResult } from "../types/api.wrapper";
import type { ChatboxResponse } from "../types/chatbox";

export const askChatbox = async (question: string) => {
  const res = await apiClient.post<ApiWrapper<ChatboxResponse>>(
    "/api/ChatBox/ask",
    { question }
  );
  return res.data.data;
};

export const getChatboxHistory = async (pageNumber: number, pageSize: number) => {
  const res = await apiClient.get<ApiWrapper<PagedResult<ChatboxResponse>>>(
    `/api/ChatBox/history`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    }
  );
  return res.data.data;
};