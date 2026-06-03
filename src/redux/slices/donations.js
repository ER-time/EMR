import { rtkQApi } from "../rtkQApi";

const donationApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    addOrUpdateDonation: builder.mutation({
      query: (payload) => {
        return({
        url: `donation/getAllOrGetById`,
        method: "POST",
        body: payload,
      })},
    }),
   
  }),
});

export const {

  useAddOrUpdateDonationMutation,

} = donationApiSlice;
