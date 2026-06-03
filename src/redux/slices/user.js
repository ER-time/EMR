import { rtkQApi } from "../rtkQApi";

const userApiSlice = rtkQApi.injectEndpoints({
  tagTypes: ['User'],
  endpoints: (builder) => ({
    userRegisteration: builder.mutation({
      query: (payload) => ({
        url: "user/saveOrUpdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserStatus: builder.mutation({
      query: (userId) => ({
        url: `user/inActiveUser?userId=${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    
    getAllUsers: builder.mutation({
      query: (payload) => ({
        url: `/user/getAll`,
        method: "POST",
        body: payload,
        // providesTags: ['User'],
      }),
      invalidatesTags:['User']
    }),
    deleteSingleUser: builder.mutation({
      query: (userId) => ({
        url: `/user/delete?userId=${userId}`,
        method: "DELETE",
        // providesTags: ['User'],
      }),
      invalidatesTags:['User']
    }),
    GetAllDropdowns: builder.query({
      query: () => ({
        url: "Lookup/getLookupByValue",
        method: "GET",
      }),
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
    getSinglePatient: builder.mutation({
      query: ({ userId, userRoleId }) => {
        let apiUrl = "patientPersonal/get";
        apiUrl += `?userId=${userId}`;

        if (userRoleId) {
          apiUrl += `&userRoleId=${userRoleId}`;
        }
        return {
          url: apiUrl,
          method: "POST",
        };
      },
      providesTags: ["User"],
      invalidatesTags:['User']
    }),

    
  }),
});

export const {useUpdateUserStatusMutation, useSinglePatientMutation,useLazyGetDoctorSlotsQuery,useGetAllDropdownsQuery, useUserRegisterationMutation,useGetAllUsersMutation,useDeleteSingleUserMutation } = userApiSlice;
