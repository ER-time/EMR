import { rtkQApi } from "../rtkQApi";

const patientsApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({

    getPatientPersonal: builder.query({
      query: (patientId) => ({
        url: `patientPersonal/get?patientId=${patientId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPatientPersonalQuery 
} = patientsApiSlice;
