/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "./axiosConfig";

// GET request with query params
export async function fetchWithQueryParams(endpoint: string, queryParams: any) {
  try {
    const response = await api.get(endpoint, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
}

// POST request with body params
export async function postWithBody(endpoint: string, body: any) {
  try {
    const response = await api.post(endpoint, body);
    return response.data;
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
}

// PUT request with body params
export async function putWithBody(endpoint: string, body: any) {
  try {
    const response = await api.put(endpoint, body);
    return response.data;
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
}
