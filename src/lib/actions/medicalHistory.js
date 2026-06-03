import instance from "../api-instance";

// export const updateMosqueInfo = async (payload, token, mosqueId) => {
//   return await instance.patch(`/mosque/${mosqueId}`, payload, {
//     headers: {
//       "Content-Type": "application/json",
//       "Access-Control-Allow-Origin": "*",
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const addOrUpdateAllergies = async (payload, token) => {
  return await instance.post(`/medicalHistory/addOrUpdate`, payload, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllergiesById = async (payload, token) => {
  return await instance.post(`/medicalHistory/addOrUpdate`, payload, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  });
};
