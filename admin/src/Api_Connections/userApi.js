
 
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

 async function RegisterApi({ email, username, password, isRunning, setIsRunning, e }) {
  e.preventDefault();
  if (!email || !username || !password) return;
  if (isRunning) return;

  setIsRunning(true);

  try {
    const response = await fetch(`${API_URL}/user/register`, {
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

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    alert('Registration successful');
    console.log(data);
  } catch (error) {
    alert(error.message);
  } finally {
    setIsRunning(false);
  }
}

async function LoginApi({ email, password, isRunning, setIsRunning, e, Token, navigate }) {
  e.preventDefault();
  if (isRunning) return;

  setIsRunning(true);

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

    Token.setToken(data.Tokenaccess);
    navigate('/dashboard');
    window.location.href = '/dashboard';
  } catch (error) {
    alert(error.message);
  } finally {
    setIsRunning(false);
  }
}

export { RegisterApi, LoginApi };