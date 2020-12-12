import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  localId: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
};

const authStart = (state, action) => {
  return {
    ...state,
    error: null,
    loading: true,
  };
};

const authSuccess = (state, action) => {
  return {
    ...state,
    token: action.idToken,
    localId: action.localId,
    error: null,
    loading: false,
  };
};

const authFail = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};

const logout = (state, action) => {
  return {
    ...state,
    token: null,
    localId: null
  }
}

const redirectPathOnAuth = (state, action) => {
  return {
    ...state,
    authRedirectPath: action.path
  }
} 

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.LOGOUT:
      return logout(state, action);
    case actionTypes.REDIRECT_PATH_ON_AUTH:
      return redirectPathOnAuth(state, action);
    default:
      return state;
  }
};

export default reducer;
