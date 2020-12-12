import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, localId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    localId: localId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiratonDate");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.LOGOUT,
  };
};

export const redirectPathOnAuth = (path) => {
  return {
    type: actionTypes.REDIRECT_PATH_ON_AUTH,
    path: path,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmMBcvA43OJgd7ku9zKO1Z9Tw0oeiT8Eo";

    if (!isSignUp) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAmMBcvA43OJgd7ku9zKO1Z9Tw0oeiT8Eo";
    }

    axios
      .post(url, authData)
      .then((res) => {
        const expiratonDate = new Date(Date.now() + res.data.expiresIn * 1000);
        localStorage.setItem("token", res.data.idToken);
        localStorage.setItem("expiratonDate", expiratonDate);
        localStorage.setItem("userId", res.data.localId);
        dispatch(authSuccess(res.data.idToken, res.data.localId));
        dispatch(checkAuthTimeout(res.data.expiresIn));
      })
      .catch((err) => {
        dispatch(authFail(err.response.data.error.message));
      });
  };
};

export const checkAuthState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return dispatch(logout());
    }
    const expiratonDate = new Date(localStorage.getItem("expiratonDate"));
    if (expiratonDate > new Date()) {
      const localId = localStorage.getItem("userId");
      dispatch(authSuccess(token, localId));
      dispatch(checkAuthTimeout((expiratonDate - new Date()) / 1000));
    } else {
      dispatch(logout());
    }
  };
};
