import axios from 'axios';

export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_ERROR_AUTH = 'AUTHENTICATE_ERROR_AUTH';
export const AUTHENTICATE_LOGIN = 'AUTHENTICATE_LOGIN';
export const AUTHENTICATE_LOGOUT = 'AUTHENTICATE_LOGOUT';
export const AUTHENTICATE_REGISTER = 'AUTHENTICATE_REGISTER';
export const AUTHENTICATE_REGISTER_ERROR = 'AUTHENTICATE_REGISTER_ERROR';

export function auth({ name, avatar, token }) {
  return {
    type: AUTHENTICATE,
    payload: { token },
  };
}

export function login({  token }) {
  return {
    type: AUTHENTICATE_LOGIN,
    payload: { token },
  };
}

export function authError(error) {
  return {
    type: AUTHENTICATE_ERROR_AUTH,
    error,
  };
}

export function logout() {
  return { type: AUTHENTICATE_LOGOUT };
}

export const handleLogout = () => async (dispatch) => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth'));
    console.log('auth:', auth);
    const token = auth ? auth.token : null;

    if (!token) {
      throw new Error('No auth token found');
    }

    await axios.post(`${process.env.REACT_APP_BASE_URL}/logout`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
      withXSRFToken:true
    });

    dispatch(logout());
    localStorage.removeItem('auth');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const handleLogin = credentials => async (dispatch) => {
  try {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, credentials, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Ensure cookies are sent,
      withXSRFToken:true
    });
    
    const { token } = response.data;
    console.log('Login token: ', token);
    dispatch(login({ token }));
    
    localStorage.setItem('auth', JSON.stringify({
      loggedIn: true,
      token,
    }));
    
    // Return the response to handle in the component
    return { payload: { token } };
  } catch (error) {
    console.error('Login failed:', error);
    dispatch(handleAuthError('Login failed. Check your credentials &  please try again.'));
    throw error;
  }
};

export const handleAuthError = error => (dispatch) => {
  dispatch(authError(error));
};

export const handleRegister = ({
 username, email, password, password_confirmation,
 }) => async (dispatch) => {
  try {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/sanctum/csrf-cookie`);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
      username,
      email,
      password,
      password_confirmation,
    }, {

        headers: {
            Accept: 'application/json',
        },
    });

    const { token } = response.data;
    console.log(token)
    dispatch(registerSuccess(token));
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    dispatch(registerError(error));
    throw error.response.data;
  }
};

export function registerSuccess(token) {
  return {
    type: AUTHENTICATE_REGISTER,
    payload: { token },
  };
}

export function registerError(error) {
  return {
    type: AUTHENTICATE_REGISTER_ERROR,
    error,
  };
}
