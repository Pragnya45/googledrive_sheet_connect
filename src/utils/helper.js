import { store } from "../Redux";
import { adminLogoutFn } from "../Redux/logoutSlice";

const getAuthToken = () => {
  return store?.getState()?.admin?.token;
};
const logOut = () => {
  store.dispatch(adminLogoutFn());
};

export { getAuthToken, logOut };
