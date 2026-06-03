import { rtkQApi } from "../rtkQApi";

const notificationSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrGetById: builder.mutation({
      query: (payload) => {
        return({
        url: `notification/getAllOrGetById`,
        method: "POST",
        body: payload,
      })},
    }),
   
  }),
});

export const {

    useGetAllOrGetByIdMutation,

} = notificationSlice;
