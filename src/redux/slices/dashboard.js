import { rtkQApi } from "../rtkQApi";

const appointmentsApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    totalAppointments: builder.query({
      query: ({ year, month, week, day }) => ({
        url: `dashboard/patient/totalAppointment/get?year=${year}&month=${month}&week=${week}&day=${day}`,
        method: "GET",
      }),
    }),
    adminPieChartData: builder.query({
      query: ({ year, month, week, day }) => ({
        url: `dashboard/admin/pieChartData/get?year=${year}&month=${month}&week=${week}&day=${day}`,
        method: "GET",
      }),
    }),
    doctorPieChartData: builder.query({
      query: ({ year, month, week, day }) => ({
        url: `dashboard/doctor/pieChartData/get?year=${year}&month=${month}&week=${week}&day=${day}`,
        method: "GET",
      }),
    }),
    getCountData: builder.mutation({
      query: () => ({
        url: `dashboard/admin/countData/get`,
        method: "POST",
      }),
    }),
    totalGenderChartData: builder.query({
      query: ({ year, month, week, day }) => ({
        url: `dashboard/admin/genderChartData/get?year=${year}&month=${month}&week=${week}&day=${day}`,
        method: "GET",
      }),
    }),
    patientGenderChartData: builder.query({
      query: ({ year, month, week, day }) => ({
        url: `dashboard/patient/genderChartData/get?year=${year}&month=${month}&week=${week}&day=${day}`,
        method: "GET",
      }),
    }),
    doctorGenderChartData: builder.query({
      query: ({ year, month, week, day }) => ({
        url: `dashboard/doctor/genderChartData/get?year=${year}&month=${month}&week=${week}&day=${day}`,
        method: "GET",
      }),
    }),
    doctorTotalEarningData: builder.query({
      query: ({ year, month, week, day }) => ({
        url: `dashboard/doctor/totalEarning/get?year=${year}&month=${month}&week=${week}&day=${day}`,
        method: "GET",
      }),
    }),
    getAppointmentGraph: builder.query({
      query: ({ statusId }) => ({
        url: `dashboard/admin/appointmentGraph/get?statusId=${statusId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useTotalAppointmentsQuery,
  useGetCountDataMutation,
  useAdminPieChartDataQuery,
  useTotalGenderChartDataQuery,
  usePatientGenderChartDataQuery,
  useDoctorGenderChartDataQuery,
  useDoctorTotalEarningDataQuery,
  useDoctorPieChartDataQuery,
  useGetAppointmentGraphQuery
} = appointmentsApiSlice;
