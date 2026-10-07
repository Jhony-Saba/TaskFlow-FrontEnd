import { useState } from 'react';
import { useNavigate, NavLink,Navigate, useLocation } from 'react-router-dom';
import { Email, Password, Username } from '../Components/Inputs.jsx';
import { RegisterApi, LoginApi } from '../Api_Connections/userApi.js';
import { TokenManager } from '../Models/ManegeToken.js';
import style from '../Styles/Inputs.module.css'
const Token = new TokenManager();
  


/**
*- LoginForm renders the user authentication page.
*- It manages the email and password input fields, handles
* login form submission, tracks the login request state,
* and redirects authenticated users using React Router.
*- The component also displays TaskFlow branding and a
* sign-in interface for returning users.
*/
function LoginForm() {
 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');// Store the user's email input
  const [password, setPassword] = useState('');// Store the user's password input
  const [isRunning, setIsRunning] = useState(false);// Track whether a login request is currently in progress
// Handle form submission and authenticate the user
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isRunning) return;
  if (!email || !password) return;
  
   try{
     setIsRunning(true);
    await LoginApi({ email, password,  Token, navigate });
   }catch(error){
   console.error("Login failed:", error);
   }finally{
    setIsRunning(false);}
  };

  return (
    <main className={style.authPage}>
      <section className={style.authIntro}>
        <span className={style.brandMark}>TF</span>
        <p className={style.eyebrow}>TaskFlow workspace</p>
        <h1>Make progress visible.</h1>
        <p className={style.introCopy}>
          Bring your projects, priorities, and people into one calm place to work.
        </p>
        <div className={style.introRule} />
        <p className={style.introNote}>A clearer day starts with a clearer next step.</p>
      </section>
      <form onSubmit={handleSubmit} className={style.authCard}>
        <div className={style.formHeader}>
          <p className={style.formEyebrow}>Welcome back</p>
          <h2>Sign in to TaskFlow</h2>
          <p>Pick up where you left off.</p>
        </div>
        <div className={style.formFields}>
          <Email email={email} setEmail={setEmail} />
          <Password password={password} setPassword={setPassword} />
        </div>
        <button type="submit" disabled={isRunning} className={style.button}>
          {isRunning ? 'Logging in...' : 'Log in'}
        </button>
        <p className={style.formFooter}>New to TaskFlow? Use the sign up tab above.</p>
      </form>
    </main>
  );
}
/**
* RegisterForm Component
*
* Renders the user registration form and handles account creation.
* Features:
* - Manages email, username, and password input states.
* - Prevents duplicate submissions using the isRunning flag.
* - Validates required fields before submitting.
* - Calls the registration API and navigates after successful signup.
*/
function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
  if (isRunning) return;
  if (!email || !password) return;
  if (isRunning) return;
   setIsRunning(true);
    await RegisterApi({ email, username, password,Token, navigate  });
    setIsRunning(false);
  
  };

  return (
    <main className={style.authPage}>
      <section className={style.authIntro}>
        <span className={style.brandMark}>TF</span>
        <p className={style.eyebrow}>TaskFlow workspace</p>
        <h1>Good work has a rhythm.</h1>
        <p className={style.introCopy}>
          Create a focused home for the work that matters, without the usual noise.
        </p>
        <div className={style.introRule} />
        <p className={style.introNote}>Plan with intent. Deliver with confidence.</p>
      </section>
      <form onSubmit={handleSubmit} className={style.authCard}>
        <div className={style.formHeader}>
          <p className={style.formEyebrow}>Get started</p>
          <h2>Create your account</h2>
          <p>Your next organized workday starts here.</p>
        </div>
        <div className={style.formFields}>
          <Username username={username} setUsername={setUsername} />
          <Email email={email} setEmail={setEmail} />
          <Password password={password} setPassword={setPassword} />
        </div>
        <button type="submit" disabled={isRunning} className={style.button}>
          {isRunning ? 'Signing up...' : 'Create account'}
        </button>
        <p className={style.formFooter}>Already have an account? Use the login tab above.</p>
      </form>
    </main>
  );
}

/**
* Nav Component
*
* Displays navigation links for authentication pages.
* - Hides the navigation when the user is on the dashboard page.
* - Shows "Login" and "Sign up" links on the login and signup pages.
* - Highlights the active link using React Router's NavLink.
*/
function Nav(){
  //check where is the location of the user 
  const location = useLocation();
 //Hides the navigation when the user is on the dashboard page.
  if (location.pathname === '/dashboard') {
    return null;
  }
 if(location.pathname ==='/login' || location.pathname ==='/signup' )
  return (
    <nav className={style.nav} aria-label="Account navigation">
      <NavLink to="/login" className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
        Login
      </NavLink>
      <NavLink to="/signup" className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
        Sign up
      </NavLink>
    </nav>
  )
}

/**
* ProtectedRoute Component
*
* Protects routes that require user authentication.
* - Checks if a valid authentication token exists.
* - If the user is authenticated, renders the protected content.
* - If the user is not authenticated, redirects them to the login page.
*
* @param {Object} props - Component props.
* @param {React.ReactNode} props.children - The protected component(s) to render.
* @returns {React.ReactNode} Protected content or a redirect to the login page.
*/
function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(new TokenManager().getToken());

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
export { LoginForm, RegisterForm , Nav,ProtectedRoute };