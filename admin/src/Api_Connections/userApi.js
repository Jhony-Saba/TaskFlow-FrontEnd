import{ TokenManager } from '../Models/ManegeToken'
const Token = new  TokenManager ();

 
const API_URL = import.meta.env.VITE_APP_API_URL;

async function readResponse(response) {
  const body = await response.text();

  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return { message: body };
  }
}
/**
* Registers a new user by sending their details to the API.
*
* @param {Object} params - Function parameters.
* @param {string} params.email - User's email address.
* @param {string} params.username - User's username.
* @param {string} params.password - User's password.
* @param {Object} params.Token - Token management object used to store the access token.
* @param {Function} params.navigate - React Router navigation function.
*
* @returns {Promise<void>} Resolves when registration is completed.
*
* Flow:
* 1. Sends a POST request to the registration endpoint.
* 2. Creates a new user with the 'admin' role.
* 3. Reads and validates the API response.
* 4. Saves the returned access token.
* 5. Redirects the user to the dashboard on success.
* 6. Displays an error message if registration fails.
*/
 async function RegisterApi({ email, username, password, navigate  }) {
  

  try {
    const response = await fetch(`${API_URL}/user/register/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        email,
        role: 'admin',
      }),
    });

    const data = await readResponse(response);
    if (data.success===false || !response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
     Token.setKey('otpToken');
     Token.setToken(data.accessToken);
    navigate('/verify-otp');
  } catch (error) {
    alert(error.message);
  } 
}
  async function ResendOtpApi(){
  Token.setKey('otpToken');
const response= await fetch(`${API_URL}/user/register/resend`,{
method:'POST',
headers:{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Token.getToken()}`},
});
const data = await readResponse(response);

    if ( !response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
}
async function VerifyOtpApi(otp,navigate){
      Token.setKey('otpToken');
    const response = await fetch(`${API_URL}/user/register/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${Token.getToken()}`,
      },
      body: JSON.stringify({
        otp,
      }),
    });

    const data = await readResponse(response);

    if ( !response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
Token.setKey('Auth');   
Token.setToken(data.Tokenaccess)
  navigate('/Dashboard'); 
  return data;
}





/**
* Authenticates a user by sending their login credentials to the API.
*
* @param {Object} params - Function parameters.
* @param {string} params.email - User's email address.
* @param {string} params.password - User's password.
* @param {Object} params.Token - Token management object used to store the access token.
* @param {Function} params.navigate - React Router navigation function.
*
* @returns {Promise<void>} Resolves when the login process is completed.
*
* Flow:
* 1. Sends a POST request to the login endpoint.
* 2. Validates the server response.
* 3. Stores the returned access token.
* 4. Redirects the user to the dashboard upon successful login.
* 5. Displays an error message if authentication fails.
*/
async function LoginApi({ email, password, navigate }) {


  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    Token.setKey('Auth');
    Token.setToken(data.Tokenaccess);
    navigate('/dashboard');
  } catch (error) {
    alert(error.message);
  } 
}

export { RegisterApi, LoginApi,VerifyOtpApi,ResendOtpApi };