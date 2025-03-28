import axios from "axios";
import { env } from "../utils/env";
import { getAuthToken, logOut } from "../utils/helper";

const baseUrl = env.backendUrl;

export const handleApi = async ({ url, body, query }) => {
  try {
    const authToken = getAuthToken();

    const response = await axios({
      url: query ? `${baseUrl + url}${query}` : baseUrl + url,
      ...body,
      headers: {
        Authorization: authToken ? "Bearer " + authToken : undefined,
      },
    });
    console.log(response);
    const result = await response.data;

    return {
      error: null,
      response: result,
    };
  } catch (error) {
    console.error(error);
    if (error?.response?.status === 500) {
      logOut();
    }
    return {
      error,
      response: null,
    };
  }
};

export const externalApi = async ({ url, body }) => {
  try {
    const response = await axios({
      url,
      ...body,
    });

    const result = await response.data;

    return {
      error: null,
      response: result,
    };
  } catch (error) {
    console.error(error);
    return {
      error,
      response: null,
    };
  }
};
