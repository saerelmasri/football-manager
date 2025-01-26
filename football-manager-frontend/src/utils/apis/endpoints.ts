/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "./axiosConfig";

// GET request with query params
export async function fetchWithQueryParams(
  endpoint: string,
  queryParams: any,
  token?: string
) {
  try {
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(endpoint, { params: queryParams, headers });
    return response;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}

// POST request with body params
export async function postWithBody(
  endpoint: string,
  body: any,
  token?: string
) {
  try {
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.post(endpoint, body, { headers });
    return response.data;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

// PUT request with body params
export async function putWithBody(endpoint: string, body: any, token?: string) {
  try {
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.put(endpoint, body, { headers });
    return response;
  } catch (error) {
    console.error("PUT request failed:", error);
    throw error;
  }
}
