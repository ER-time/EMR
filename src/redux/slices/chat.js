import { AiRtkQApi } from "../rtkQApi";

const chatApiSlice = AiRtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    generatePrescriptionFromChat: builder.mutation({
      query: ({ user_query, user_id }) => ({
        url: `/generate_prescription_from_chat_session?user_query=${user_query}&user_id=${user_id}`,
        method: "POST",
      }),
    }),
    getChatHistory: builder.mutation({
      query: (payload) => (
        {
        url: `/get_chat_history`,
        method: "POST",
        payload:payload
      }),
    }),
    generatePrescriptionFromChatSession: builder.mutation({
      query: ({ user_query, user_id, session_id }) => ({
        url: `/generate_prescription_from_chat_session?user_query=${user_query}&user_id=${user_id}&session_id=${session_id}`,
        method: "POST",
      }),
    }),
    psychiatristChatSession: builder.mutation({
      query: ({ user_query, user_id, session_id }) => ({
        url: `/psychiatrist_chat_session?user_query=${user_query}&user_id=${user_id}&session_id=${session_id}`,
        method: "POST",
      }),
    }),
    getRandomSessionId: builder.mutation({
      query: () => ({
        url: `generate_random_session_id`,
        method: "GET",
      }),
    }),
    

    cannotAfford: builder.mutation({
      query: (payload) => ({
        url: `lie_detector`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetRandomSessionIdMutation,
  useGeneratePrescriptionFromChatMutation,
  useCannotAffordMutation,
  useGeneratePrescriptionFromChatSessionMutation,
  useGetChatHistoryMutation,
  usePsychiatristChatSessionMutation
} = chatApiSlice;
