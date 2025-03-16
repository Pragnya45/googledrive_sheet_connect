import { store } from "../Redux";

const getAuthToken = () => {
  return store?.getState()?.admin?.token;
};

export { getAuthToken };
