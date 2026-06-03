import { rtkQApi } from "../rtkQApi";

const authApiSlice = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    quickRegisteration: builder.mutation({
      query: (payload) => ({
        url: "registration/quickRegistration",
        method: "POST",
        body: payload,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "account/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    sendLinkForPasswordReset: builder.mutation({
      query: ({ email }) => ({
        url: `account/sendEmailForForgetPassword?email=${email}`,
        method: "GET",
      }),
    }),

    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: "account/updatePassword",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    updatePasswordWithEncrypted: builder.mutation({
      query: (credentials) => ({
        url: "account/updatePasswordWithEncryptedMail",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    reSendOtp: builder.mutation({
      query: ({ email }) => ({
        url: `registration/resendOTPCode?email=${email}`,
        method: "POST",
        body: {},
      }),
    }),

    verifyOtp: builder.mutation({
      query: (credentials) => ({
        url: "registration/verifyOTPCode",
        method: "POST",
        body: { ...credentials },
      }),
    }),


    
  }),
});

export const {
  useQuickRegisterationMutation,
  useLoginMutation,
  useReSendOtpMutation,
  useUpdatePasswordMutation,
  useSendLinkForPasswordResetMutation,
  useUpdatePasswordWithEncryptedMutation,
} = authApiSlice;
