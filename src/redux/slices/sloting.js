import { rtkQApi } from "../rtkQApi";

const slotApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    addOrUpdateSlot: builder.mutation({
      query: (payload) => ({
        url: "sloting/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Slots"],
      invalidatesTags:['Slots']
    }),

    getDoctorSlots: builder.query({
      query: ({ doctorId, date }) => {
        let apiUrl = "sloting/getDoctorSlots";
        apiUrl += `?doctorId=${doctorId}`;

        if (date) {
          apiUrl += `&date=${date}`;
        }
        return {
          url: apiUrl,
          method: "GET",
        };
      },
      providesTags: ["Slots"],
      invalidatesTags:['Slots']
    }),

    getDoctorSlotsDates: builder.query({
      query: ({doctorId, startDate, endDate}) => {
        console.log("doctorId",doctorId);
        let apiUrl = `sloting/getDoctorSlotDates?doctorId=${doctorId}`;

        if (startDate) {
          apiUrl += `&startDate=${startDate}`; 
        }

        if (endDate) {
          apiUrl += `&endDate=${endDate}`;
        } 

        return {
          url: apiUrl,
          method: "GET",
        };
      },
      providesTags: ["Slots"],
      invalidatesTags:['Slots']
    }),
  }),
});

export const {
  useAddOrUpdateSlotMutation,
  useGetDoctorSlotsQuery,
  useGetDoctorSlotsDatesQuery,
} = slotApiSlice;
