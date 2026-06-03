import {  rtkQApi } from "../rtkQApi";

const chatApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInboxes: builder.query({
      query: () => ({
        url: `Chat/getAllInboxes`,
        method: "GET",
      }),
    }),
    createChat: builder.mutation({
      query: (payload) => {
        return ({
        url: `Chat/create`,
        method: "POST",
        body: payload,
      })},
    }),
    getAllConversationDetails: builder.query({
      query: ({inboxId}) => {
        return ({
        url: `Chat/getAllConversationDetails?inboxId=${inboxId}`,
        method: "GET",
      })},
    }),
  }),
});

export const {
  useLazyGetAllInboxesQuery,
  useCreateChatMutation,
  useLazyGetAllConversationDetailsQuery
} = chatApiSlice;
