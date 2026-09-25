import { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Email, Password, Username } from '../Components/Inputs.jsx';
import { RegisterApi, LoginApi } from '../Api_Connections/userApi.js';
import { TokenManager } from '../Models/ManegeToken.js';
import style from '../Styles/Inputs.module.css'
function LoginForm() {
  const Token = new TokenManager();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = async (e) => {
    await LoginApi({ email, password, isRunning, setIsRunning, e, Token, navigate });
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

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = async (e) => {
    await RegisterApi({ email, username, password, isRunning, setIsRunning, e });
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

function Nav(){
  const location = useLocation();

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
export { LoginForm, RegisterForm , Nav };