import { rtkQApi } from "../rtkQApi";

const appointmentsApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    addOrUpdate: builder.mutation({
      query: (payload) => {
        return({
        url: `appointment/addOrUpdate`,
        method: "POST",
        body: payload,
      })},
    }),
    addOrUpdateFreeAppointmnet: builder.mutation({
      query: (payload) => {
        return({
        url: `appointment/addOrUpdateFreeAppointmnet`,
        method: "POST",
        body: payload,
      })},
    }),
    rescheduleAppointment: builder.mutation({
      query: (payload) => {
        return({
        url: `appointment/rescheduleAppointment`,
        method: "POST",
        body: payload,
      })},
    }),

    getAllAppointments: builder.mutation({
      query: (payload) => {
        return ({
        url: `appointment/getAll`,
        method: "POST",
        body: payload,
      })},
    }),
    endSessionAndAppointment: builder.mutation({
      query: ({appointmentId}) => {
        return ({
        url: `appointment/endSessionAndAppointment?appointmentId=${appointmentId}`,
        method: "POST",
      })},
    }),

    getSingleAppointment: builder.query({
      query: (appointmentId) => ({
        url: `appointment/get?appointmentId=${appointmentId}`,
        method: "GET",
      }),
    }),

    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, statusId}) => ({
        url: `appointment/updateStatus?appointmentId=${appointmentId}&statusId=${statusId}`,
        method: "POST",
        // body: payload,
      }),
    }),

    deleteAppointment: builder.mutation({
      query: (payload, appointmentId) => ({
        url: `api/appointment/delete?appointmentId=${appointmentId}`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useAddOrUpdateMutation,
  useGetAllAppointmentsMutation,
  useLazyGetSingleAppointmentQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
  useRescheduleAppointmentMutation,
  useEndSessionAndAppointmentMutation,
  useAddOrUpdateFreeAppointmnetMutation,
} = appointmentsApiSlice;
