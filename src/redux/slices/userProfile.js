import { RTK_TAGS } from "@/config";
import { rtkQApi } from "../rtkQApi";

const userProfileApiSlice = rtkQApi.injectEndpoints({
  tagTypes: [
    "Medication",
    "PreExistingCondition",
    "SocialHistory",
    RTK_TAGS.FAMILY_MEDICAL_HISTORY,
    "SurgicalHistory",
    "SoapNotes",
    RTK_TAGS.ALLERGIES,
    "HOPI",
    "USER",
    "ALLERGIES",
    "medicine",
    "Precription",
    "User",
  ],
  endpoints: (builder) => ({
    getAllMedication: builder.query({
      query: (payload) => {
        return {
          url: `medication/getAll`,
          method: "POST",
          body: payload,
        };
      },
      providesTags: ["Medication"],
    }),
    addOrUpdateMedication: builder.mutation({
      query: (payload) => ({
        url: "medication/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Medication"],
    }),
    uploadImage: builder.mutation({
      query: (payload) => ({
        url: "AWSS3/post",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["uploadImage"],
    }),
    uploadMediaList: builder.mutation({
      query: (payload) => ({
        url: "AWSS3/postList",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["uploadMediaList"],
    }),
    deleteMedication: builder.mutation({
      query: (medicationId) => ({
        url: `medication/delete?medicationId=${medicationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Medication"],
      // providesTags: [RTK_TAGS.ALLERGIES]
    }),
    getMedicinesDropdown: builder.query({
      query: () => ({
        url: "medicine/getAll",
        method: "GET",
      }),
      invalidatesTags: ["medicine"],
    }),
    getAllSurgicalHistory: builder.query({
      query: ({ patientId }) => {
        let url = `surgicalHistory/getAll`;
        if (patientId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patientId=${patientId}`;
          }
        }
        return {
          url,
          method: "GET",
        };
      },

      providesTags: ["SurgicalHistory"],
    }),
    getAllPreExistingCondition: builder.query({
      query: ({ patientId }) => {
        let url = `preExistingCondition/getAll`;
        if (patientId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patientId=${patientId}`;
          }
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["PreExistingCondition"],
    }),
    preExistingConditionAddOrUpdate: builder.mutation({
      query: (payload) => ({
        url: "preExistingCondition/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PreExistingCondition"],
    }),
    deletePreExistingCondition: builder.mutation({
      query: (preExistingConditionId) => ({
        url: `preExistingCondition/delete?preExistingConditionId=${preExistingConditionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PreExistingCondition"],
    }),
    deleteSocialHistory: builder.mutation({
      query: (socialHistoryId) => ({
        url: `socialHistory/delete?socialHistoryId=${socialHistoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SocialHistory"],
    }),
    getAllFamilyHistory: builder.query({
      query: ({ patientId }) => {
        let url = `familyMedicalHistory/getAll`;
        if (patientId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patient=${patientId}`;
          }
        }
        return {
          url,
          method: "GET",
        };
      },

      providesTags: [RTK_TAGS.FAMILY_MEDICAL_HISTORY],
    }),

    getAllAllergiesHistory: builder.query({
      query: ({ patientId }) => {
        let url = `medicalHistory/getAll`;
        if (patientId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patientId=${patientId}`;
          }
        }
        return {
          url,
          method: "GET",
        };
      },

      providesTags: ["ALLERGIES"],
    }),
    getAllSocialHistory: builder.query({
      query: ({ patientId }) => {
        let url = `socialHistory/getAll`;
        if (patientId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patientId=${patientId}`;
          }
        }
        return {
          url,
          method: "GET",
        };
      },

      providesTags: ["SocialHistory"],
    }),
    socialHistoryAddOrUpdate: builder.mutation({
      query: (payload) => ({
        url: "socialHistory/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SocialHistory"],
    }),
    familyHistoryAddOrUpdate: builder.mutation({
      query: (payload) => ({
        url: "familyMedicalHistory/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [RTK_TAGS.FAMILY_MEDICAL_HISTORY],
    }),
    allergiesAddOrUpdate: builder.mutation({
      query: (payload) => ({
        url: "medicalHistory/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ALLERGIES"],
    }),
    deleteAllergies: builder.mutation({
      query: (medicalHistoryId) => ({
        url: `medicalHistory/delete?medicalHistoryId=${medicalHistoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [RTK_TAGS.ALLERGIES],
      // providesTags: [RTK_TAGS.ALLERGIES]
    }),

    deleteFamilyMedicalHistory: builder.mutation({
      query: (familyMedicalHistoryId) => ({
        url: `familyMedicalHistory/delete?familyMedicalHistoryId=${familyMedicalHistoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [RTK_TAGS.FAMILY_MEDICAL_HISTORY],
      // providesTags: [RTK_TAGS.ALLERGIES]
    }),
    deleteSurgicalMedicalHistory: builder.mutation({
      query: (surgicalHistoryId) => ({
        url: `surgicalHistory/delete?surgicalHistoryId=${surgicalHistoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SurgicalHistory"],
    }),
    surgicalHistoryAddOrUpdate: builder.mutation({
      query: (payload) => ({
        url: "surgicalHistory/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SurgicalHistory"],
    }),
    SoapNotesAddOrUpdate: builder.mutation({
      query: (payload) => ({
        url: "PAT/SoapNotes/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SoapNotes"],
    }),
    AddOrUpdatePrescription: builder.mutation({
      query: (payload) => ({
        url: "PAT/precription/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Precription"],
    }),
    deletePrescription: builder.mutation({
      query: (prescriptionId) => ({
        url: `/PAT/precription/delete?prescriptionId=${prescriptionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Precription"],
    }),
    deleteSoapNotes: builder.mutation({
      query: (soapNoteId) => ({
        url: `/PAT/SoapNotes/delete?soapNoteId=${soapNoteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SoapNotes"],
    }),
    getAllSoapNotes: builder.query({
      query: ({ patientId, appointmentId }) => {
        let url = `PAT/SoapNotes/getAll`;
        if (patientId !== undefined || appointmentId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patientId=${patientId}`;
          }
          if (appointmentId !== undefined) {
            if (patientId !== undefined) {
              url += `&`;
            }
            url += `appointmentId=${appointmentId}`;
          }
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["SoapNotes"],
    }),
    getAllPrecription: builder.query({
      query: ({ patientId, appointmentId }) => {
        let url = `PAT/precription/getAll`;
        if (patientId !== undefined || appointmentId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patientId=${patientId}`;
          }
          if (appointmentId !== undefined) {
            if (patientId !== undefined) {
              url += `&`;
            }
            url += `appointmentId=${appointmentId}`;
          }
        }
        console.log("url", url);
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Precription"],
    }),

    getLookupByValue: builder.query({
      query: () => ({
        url: `/Lookup/getLookupByValue?lookupType=MedicineFrequency`,
        method: "GET",
      }),
    }),
    // getHistoryOfPresentIllness: builder.query({
    //   query: () => ({
    //     url: `PAT/HistoryOfPresentIllness/getAll`,
    //     method: "GET",
    //   }),
    //   providesTags: ["HOPI"],
    // }),
    getHistoryOfPresentIllness: builder.query({
      query: ({ patientId, appointmentId }) => {
        let url = `PAT/HistoryOfPresentIllness/getAll`;
        if (patientId !== undefined || appointmentId !== undefined) {
          url += `?`;
          if (patientId !== undefined) {
            url += `patientId=${patientId}`;
          }
          if (appointmentId !== undefined) {
            if (patientId !== undefined) {
              url += `&`;
            }
            url += `appointmentId=${appointmentId}`;
          }
        }
        console.log("url", url);
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["HOPI"],
    }),
    HOPIAddOrUpdate: builder.mutation({
      query: (payload) => ({
        url: "PAT/HistoryOfPresentIllness/addOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["HOPI"],
    }),

    getUserById: builder.query({
      query: ({ userId }) => {
        let apiUrl = "user/get";
        apiUrl += `?userId=${userId}`;

        return {
          url: apiUrl,
          method: "GET",
        };
      },
      providesTags: [RTK_TAGS.GET_USER_BY_ID],
    }),

    updateUserById: builder.mutation({
      query: (payload) => ({
        url: "registration/userRegistration",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [RTK_TAGS.GET_USER_BY_ID],
    }),
    userRegisteration: builder.mutation({
      query: (payload) => ({
        url: "user/saveOrUpdate",
        method: "POST",
        body: payload,
      }),
      // providesTags: ["User"],
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.mutation({
      query: (payload) => ({
        url: `/user/getAll`,
        method: "POST",
        body: payload,
      }),
      // providesTags: ["User"],
      invalidatesTags: ["User"],
    }),
    deleteSingleUser: builder.mutation({
      query: (userId) => ({
        url: `/user/delete?userId=${userId}`,
        method: "DELETE",
      }),
      // providesTags: ["User"],
      invalidatesTags: ["User"],
    }),
    deleteHistoryOfPresentIllness: builder.mutation({
      query: (hopiId) => ({
        url: `/PAT/HistoryOfPresentIllness/delete?hopiId=${hopiId}`,
        method: "DELETE",
      }),
      // providesTags: ["User"],
      invalidatesTags: ["HOPI"],
    }),
  }),
});

export const {
  useGetAllMedicationQuery,
  useDeleteMedicationMutation,
  useAddOrUpdateMedicationMutation,
  useGetAllSurgicalHistoryQuery,
  useGetAllSoapNotesQuery,
  useGetAllPrecriptionQuery,
  useGetAllPreExistingConditionQuery,
  usePreExistingConditionAddOrUpdateMutation,
  useDeletePreExistingConditionMutation,
  useGetAllFamilyHistoryQuery,
  useGetAllSocialHistoryQuery,
  useDeleteSocialHistoryMutation,
  useSocialHistoryAddOrUpdateMutation,
  useFamilyHistoryAddOrUpdateMutation,
  useSurgicalHistoryAddOrUpdateMutation,
  useSoapNotesAddOrUpdateMutation,
  useAllergiesAddOrUpdateMutation,
  useHOPIAddOrUpdateMutation,
  useGetAll,
  useDeletePrescriptionMutation,
  usegGetLookupByValueQuery,
  useGetAllAllergiesHistoryQuery,
  useGetHistoryOfPresentIllnessQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useUserRegisterationMutation,
  useGetAllUsersMutation,
  useDeleteSingleUserMutation,
  useDeleteAllergiesMutation,
  useDeleteFamilyMedicalHistoryMutation,
  useGetMedicinesDropdownQuery,
  useDeleteSurgicalMedicalHistoryMutation,
  useAddOrUpdatePrescriptionMutation,
  useUploadImageMutation,
  useUploadMediaListMutation,
  useDeleteHistoryOfPresentIllnessMutation,
  useDeleteSoapNotesMutation
} = userProfileApiSlice;
