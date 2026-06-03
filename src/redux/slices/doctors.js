import { rtkQApi } from "../rtkQApi";

const doctorsApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDoctor: builder.mutation({
      query: (payload) => ({
        url: `doctor/getAll`,
        method: "POST",
        body: payload,
      }),
    }),
    getDoctorAllPatients: builder.mutation({
      query: (payload) => ({
        url: `doctor/getAllPatient`,
        method: "POST",
        body: payload,
      }),
    }),

    getSingleDoctor: builder.query({
      query: (doctorId) => ({
        url: `doctor/get?doctorId=${doctorId}`,
        method: "GET",
      }),
    }),
    getAllSpecializationByDeptId: builder.mutation({
      query: (departmentList) => ({
        url: `doctor/getAllSpecializationByDeptId`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: departmentList,
      }),
    }),
    getAllDepartmentsOrGetById: builder.query({
      query: () => ({
        url: `doctor/getAllDepartmentsOrGetById`,
        method: "GET",
      }),
    }),
    deleteDoctor: builder.mutation({
      query: (doctorId) => ({
        url: `doctor/DeleteDoctor`,
        method: "DELETE",
        params: {
          doctorId: doctorId,
        },
      }),
    }),

    getLookupByValue: builder.query({
      query: () => ({
        url: `/Lookup/getLookupByValue`,
        method: "GET",
      }),
    }),
    getDoctorsByDeptName: builder.query({
      query: (department) => ({
        url: `doctor/getDoctorsByDeptName?departmentName=${department}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllDoctorMutation,
  useGetSingleDoctorQuery,
  usegGetLookupByValueQuery,
  useDeleteDoctorMutation,
  useGetDoctorAllPatientsMutation,
  useGetAllDepartmentsOrGetByIdQuery,
  useGetAllSpecializationByDeptIdMutation,
  useLazyGetDoctorsByDeptNameQuery,
} = doctorsApiSlice;
