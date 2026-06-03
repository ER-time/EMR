import { rtkQApi } from "../rtkQApi";

const videoApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    getVonageSession: builder.query({
      query: () => ({
        url: `SYS/Vonage/session`,
        method: "GET",
      }),
    }),

    VonageToken: builder.mutation({
      query: (payload) => ({
        url: "SYS/Vonage/token",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useGetVonageSessionQuery, useVonageTokenMutation } =
  videoApiSlice;
