import { rtkQApi } from "../rtkQApi";

const appointmentsApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({


    getAllInvoices: builder.mutation({
      query: (payload) => {
        return ({
        url: `invoice/getAll`,
        method: "POST",
        body: payload,
      })},
    })
  })
});

export const {
  useGetAllInvoicesMutation,
} = appointmentsApiSlice;
