export const BASE_URL = "https://medicalaiapi.xeventechnologies.com/api";
// export const BASE_URL = "http://localhost:3011/api";
export const AI_BACKEND_URL = "https://medical-aibe.xeventechnologies.com";

export const GOOLE_PLACES_API = "test_api";
export const SOCKET_URI = "https://medicalai-socket.xeventechnologies.com/";
// export const SOCKET_URI = "http://192.168.10.177:5030";

export const USER_ROLE = {
  admin: 1,
  doctor: 2,
  patient: 3,
  staf: 4,
};
export const APPOINTMENT_STATUSES = {
  MISSED: 304,
  CANCELED: 305,
  BOOKED: 307,
  PENDING: 302,
  COMPLETED: 303,
  REACHED: 306,
  UPCOMING: 301,
};

export const GENDER_OPTIONS = [
  {
    label: "Male",
    value: 11,
  },
  {
    label: "Female",
    value: 12,
  },
  {
    label: "Others",
    value: 13,
  },
];

export const CRYPTO_SECRET = "thisi_is_my-secretjdkdkdl";

export const RTK_TAGS = {
  GET_USER_BY_ID: "GET_USER_BY_ID",
  FIND_HOSPITAL_NEARBY_ID: "FIND_HOSPITAL_NEARBY_ID",
  ALLERGIES: "ALLERGIES",
  FAMILY_MEDICAL_HISTORY: "FAMILY_MEDICAL_HISTORY",
};

export const API_END_POINTS = {
  LOOK_UPS_BY_ID: "Lookup/getLookupByValue",
  GET_ALL_MEDICAL_HISTORY: "medicalHistory/getAll",
  GET_MEDICAL_HISTORY_BY_ID: "medicalHistory/getById",
  GET_FAMILY_MEDICAL_HISTORY_HISTORY: "familyMedicalHistory/getAll",
};

export const CHAT_TYPE = {
  prescription: "PHYSICIAN",
  psychiatrist: "PSYCHIATRIST",
};
