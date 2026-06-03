import { AI_BACKEND_URL, BASE_URL } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosBaseQuery =
  (
    { baseUrl, userHeader } = {
      baseUrl: "",
    }
  ) =>
  async ({ url, method, data, params, body }, api) => {
    let headers = {
      "Content-type": "application/json; charset=UTF-8",
    };
    if (userHeader) {
      const customHeader = await userHeader;
      headers = { ...headers, ...customHeader };
    }
    try {
      // console.log("api", api, data, body);
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data.data };
    } catch (axiosError) {
      const err = axiosError;
      if (err.response?.status === 401) {
        await signOut();
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data?.message || err.response?.data,
        },
      };
    }
  };

const getTokenHeader = async (headers, { getState }) => {
  const session = await getSession();
  if (session) {
    headers.set("authorization", `Bearer ${token}`);
  }
  return headers;
};

export const rtkQApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL || "https://medicalaiapi.xeventechnologies.com/api",
    credentials: "same-origin",
    prepareHeaders: async (headers, { getState }) => {
      const session = await getSession();
      if (session) {
        headers.set("authorization", `Bearer ${session?.user?.user?.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Slots"],
  endpoints: () => ({}),
});
export const AiRtkQApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: AI_BACKEND_URL || "https://medical-aibe.xeventechnologies.com",
    credentials: "same-origin",
    prepareHeaders: async (headers, { getState }) => {
      const session = await getSession();
      if (session) {
        headers.set("authorization", `Bearer ${session?.user?.user?.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Slots"],
  endpoints: () => ({}),
});

// export const aiRtkQApi = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://medical-aibe.xeventechnologies.com/",
//     credentials: "same-origin",
//     prepareHeaders: async (headers, { getState }) => {
//       const session = await getSession();
//       if (session) {
//         headers.set("authorization", `Bearer ${session?.user?.user?.token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ["Slots"],
//   endpoints: () => ({}),
// });
