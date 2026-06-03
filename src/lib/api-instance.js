import axios from "axios";

const instance = axios.create({
  baseURL: "https://medicalaiapi.xeventechnologies.com/api/",
  timeout: 80000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export const fetcher = async (url, token) => {
  if (token) {
    instance.interceptors.request.use(
      (config) => {
        config.headers = config.headers || {};
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  return instance.get(url).then((response) => {
    return response.data.data;
  });
};

export const paginationFetcher = async (url, token) => {
  if (token) {
    instance.interceptors.request.use(
      (config) => {
        config.headers = config.headers || {};
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  return instance.get(url).then((response) => {
    return response.data;
  });
};

export default instance;
