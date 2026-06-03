import { rtkQApi } from "../rtkQApi";

const lookupsApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getAllSpecialities: builder.query({
      query: () => ({
        url: "Lookup/getAllSpecialities",
        method: "GET",
      }),
    }),
    
    getAllLanguages: builder.query({
      query: () => ({
        url: "Lookup/getAllLanguages",
        method: "GET",
      }),
    }),
    getLookupByValue: builder.query({
      query: (lookupType) =>{
        return ({
        url: `Lookup/getLookupByValue?lookupType=${lookupType}`,
        method: "GET",
      })},
    }),

    getServerityLookupByValue: builder.query({
      query: (lookupType) =>{
        return ({
        url: `Lookup/getLookupByValue?lookupType=SeverityType`,
        method: "GET",
      })},
    }),
   
  }),
});

export const {
  useGetLookupByValueQuery,
  useGetServerityLookupByValueQuery,
  useGetAllSpecialitiesQuery,
  useGetAllLanguagesQuery,
} = lookupsApiSlice;
1;
