import { rtkQApi } from "../rtkQApi";

const iCantAffordSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    saveOrUpdateCantAfford: builder.mutation({
      query: (payload) => ({
        url: `iCantAfford/saveOrUpdate`,
        method: "POST",
        body: payload,
      }),
    }),
    getCannotAfford: builder.mutation({
      query: (payload) => ({
        url: `iCantAfford/getAll`,
        method: "POST",
        body: payload,
      }),
    }),
    updateStatus: builder.mutation({
      query: ({ iCantAffordId, isAdminApproved }) => ({
        url: `iCantAfford/updateStatus?iCantAffordId=${iCantAffordId}&isAdminApproved=${isAdminApproved}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useSaveOrUpdateCantAffordMutation, useGetCannotAffordMutation ,useUpdateStatusMutation} =
  iCantAffordSlice;
