import { useState,useRef,useEffect } from 'react';
import { useNavigate, NavLink,Navigate, useLocation } from 'react-router-dom';
import { Email, Password, Username } from '../Components/Inputs.jsx';
import { RegisterApi, LoginApi, VerifyOtpApi,ResendOtpApi } from '../Api_Connections/userApi.js';
import { TokenManager } from '../Models/ManegeToken.js';
import style from '../Styles/Inputs.module.css'
import "../Styles/VerifyOTP.css";
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
    await LoginApi({ email, password,navigate });
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
    await RegisterApi({ email, username, password, navigate  });
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
   Token.setKey('Auth');
  const isAuthenticated = Boolean(Token.getToken());

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}





function VerifyOTP() {
  const isRunning = useRef(false); // Ref to track if a verification request is in progress
  const navigate = useNavigate();
  //array to store the 6 digits of the OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  //Error  message
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const resendInProgress = useRef(false);
  //input references to manage focus between OTP input fields
  const inputsRef = useRef([]);

  useEffect(() => {
    const expiresAt = Date.now() + 10 * 60 * 1000;
    let intervalId;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) window.clearInterval(intervalId);
    };

    intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerResetKey]);

  const handleChange = (value, index) => {
    //Checks that the user enters only numbers
    if (!/^\d*$/.test(value)) return;
    
  //Copy the OTP array
    const newOtp = [...otp];
  //Update the specific position
    newOtp[index] = value.slice(-1);
//Updates React state using setOtp().
    setOtp(newOtp);
    setMessage("");
//move to the new  input field if the user has entered a digit and the current index is less than 5
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
  
    // Check if the user pressed Backspace,
  // the current input is empty, and this is not the first input.
    if (e.key === "Backspace" && !otp[index] && index > 0) {
          // Move the cursor (focus) to the previous input.
      inputsRef.current[index - 1].focus();
    }

  // Check if the user pressed the left arrow
  // and the current input is not the first one.
    if (e.key === "ArrowLeft" && index > 0) {
       // Move focus to the previous input.
      inputsRef.current[index - 1].focus();
    }
  // Check if the user pressed the right arrow
  // and the current input is not the last one (index 5).
    if (e.key === "ArrowRight" && index < 5) {
  // Move focus to the next input.
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    // Stop the browser from pasting all the text into one input.
    e.preventDefault();

 // Get the copied text.
  // Remove anything that is not a digit.
  // Keep only the first 6 digits.
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

  // Create an array containing 6 empty strings.
    const newOtp = Array(6).fill("");

 // Split the pasted text into individual digits.
  // Store each digit in its corresponding array position.
    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });
// Update the OTP state in React.
    setOtp(newOtp);

 // Calculate the index of the input that should receive focus.
// The maximum index is 5 because there are 6 inputs.
    const nextIndex = Math.min(pasted.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  const verifyOTP = async () => {

    if(isRunning.current) return; // Prevent multiple submissions
    const enteredOTP = otp.join("");
   
    if (enteredOTP.length !== 6) {
      setMessage("Please enter all 6 digits.");
      return;
    }

    isRunning.current = true;
    setIsVerifying(true);

    // Send enteredOTP to your backend for verification
    try {
      await VerifyOtpApi(enteredOTP,navigate);
      setMessage("OTP verified successfully!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to verify OTP. Please try again.");
    } finally {
      isRunning.current = false;
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    if (resendInProgress.current || secondsRemaining > 0) return;

    resendInProgress.current = true;
    setIsResending(true);
    setMessage("");
    try {
      await ResendOtpApi();
      setOtp(["", "", "", "", "", ""]);
      setSecondsRemaining(600);
      setTimerResetKey((key) => key + 1);
      setMessage("A new OTP has been sent.");
      inputsRef.current[0]?.focus();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to resend OTP. Please try again.");
    } finally {
      resendInProgress.current = false;
      setIsResending(false);
    }
  };

  return (
    <div className="otp-page">

      <div className="otp-card">

        {/* OTP Icon */}
        <div className="otp-icon">
          <div className="otp-circle">
            <div className="otp-inner">
              OTP
            </div>
          </div>
        </div>

        {/* Title */}
        <h2>Verify OTP</h2>

        <p className="otp-description">
          Enter the 6-digit code sent to your email address. 
          If you didn't receive it, you can request a new one.
          you have 10 minutes to enter the code before it expires.
        </p>

        {/* OTP Inputs */}
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              onPaste={handlePaste}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Resend OTP */}
        <div className="resend-text">
          {secondsRemaining > 0 ? (
            <>Didn't receive code? Resend available in <Timer seconds={secondsRemaining} /></>
          ) : (
            "Didn't receive code?"
          )}
          <button type="button" onClick={resendOTP} disabled={secondsRemaining > 0 || isResending}>
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="otp-message" role="status">{message}</p>
        )}

        {/* Verify Button */}
        <button
          className="verify-btn"
          onClick={verifyOTP}
          disabled={isVerifying}
          aria-busy={isVerifying}
        >
          {isVerifying && <span className="spinner" aria-hidden="true" />}
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </button>

      </div>
    </div>
  );
}












function Timer({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <span className="otp-timer" aria-live="polite">
      {String(minutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
    </span>
  );
}

export default Timer;







export { LoginForm, RegisterForm , Nav,ProtectedRoute,VerifyOTP  };