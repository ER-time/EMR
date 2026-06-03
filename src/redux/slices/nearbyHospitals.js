// import { RTK_TAGS } from "@/config";
// import { aiRtkQApi } from "../rtkQApi";

// const slotApiSlice = aiRtkQApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getNearbyHospitals: builder.query({
//       query: (payload) => {
//         let apiUrl = "/get_nearby_hospitals";
//         return {
//           url: apiUrl,
//           method: "POST",
//           body: payload,
//         };
//       },
//       providesTags: [RTK_TAGS.FIND_HOSPITAL_NEARBY_ID],
//     }),
//   }),
// });

// export const { useGetNearbyHospitalsQuery } = slotApiSlice;
