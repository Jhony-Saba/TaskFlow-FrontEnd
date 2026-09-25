import { useState} from 'react'
import validator from 'validator'
import {Link} from 'react-router-dom'
import style from '../Styles/Inputs.module.css'

function Email({ email, setEmail }) {
  const [emailStatus, setEmailStatus] = useState("");

    const handleEmail = (e) => {
    const value = e.target.value;
    const result = validateEmail(value);

    setEmailStatus(result.message);

    if (!result.valid) {
      setEmail('');
      return result.message;
    }

    return result.message;
  };

  return (
    <>
      <input
        type="email"
        placeholder="Enter your Email"
        className={style.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleEmail}
      />
      <p>{emailStatus}</p>
    </>
  );
}
function Password({ password, setPassword }) {
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordDetails, setPasswordDetails] = useState([]);

  const handlePassword = (e) => {
    const value = e.target.value;
    const result = validatePassword(value);

    setPasswordStatus(result.message);
    setPasswordDetails(result.details || []);

    if (!result.valid) {
      setPassword('');
      return result.message;
    }

    return result.message;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordStatus("");
      setPasswordDetails([]);
      return;
    }

    const result = checkPassword(value);
    setPasswordStatus(result.valid ? "" : result.message);
    setPasswordDetails(result.valid ? [] : result.details || []);
  };

  return (
    <>
      <input
        type="password"
        placeholder="Enter your Password"
        className={style.input}
        value={password}
        onChange={handlePasswordChange}
        onBlur={handlePassword}
      />
      {passwordStatus && <p>{passwordStatus}</p>}
      {passwordDetails.length > 0 && (
        <ol>
          {passwordDetails.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ol>
      )}
    </>
  );
}
function Username({ username, setUsername }) {
  const [usernameStatus, setUsernameStatus] = useState("");

  const handleUsername = (e) => {
    const value = e.target.value;
    const result = validateUsername(value);

    setUsernameStatus(result.message);

    if (!result.valid) {
      setUsername('');
      return result.message;
    }

    return result.message;
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter your username"
        className={style.input}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleUsername}
      />
      <p>{usernameStatus}</p>
    </>
  );
}
function Title({ title, setTitle }) {
  const [titleStatus, setTitleStatus] = useState("");
  
  
  const handleTitle =(e)=>{
    const value =e.target.value;
    if(inputCheck(value,'Title')){
      setTitleStatus('Title is required');
      setTitle('');
      return 'Title is required';
    }

    return '';
  }
  
  return(<>
  <input type="text"
  placeholder="Enter your title" 
  value={title} 
  onChange={(e)=>setTitle(e.target.value)} 
  onBlur={handleTitle}
  />
  <p>{titleStatus}</p>
  </>);


}
function Context({ context, setContext }) {
  const [contextStatus, setContextStatus] = useState("");
  
  
  const handleContext =(e)=>{
    const value =e.target.value;
    if(validator.isBoolean(value) || validator.isNumeric(value) || validator.isEmpty(value)){
      setContextStatus('Context is required');
      setContext('');
      return 'Context is required';
    }
    return '';

  }
  
  return(<>
  <input type="text"
  placeholder="Enter context" 
  value={context} 
  onChange={(e)=>setContext(e.target.value)} 
  onBlur={handleContext}
  />
  <p>{contextStatus}</p>
  </>);


  }
function SelectTaskStatus({ status, setStatus }) {
  const statusOptions = ['To Do', 'In Progress', 'Done'];

  return (
    <select value={status} onChange={(e) => setStatus?.(e.target.value)} disabled={!setStatus}>
      {statusOptions.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Deadline({ deadline, setDeadline }) {

 const handleDeadline = (e) => {
 const result= validateDeadline(e.target.value);
  if(result.valid){
    setDeadline?.(e.target.value);
     // e.target.value is "YYYY-MM-DD"
  }
  else {
    alert(result.message)
  }

  };

  
   return (
    <input
      type="date"
      aria-label="Task deadline"
      value={deadline || ''}
      onChange={handleDeadline}
    />
  );
}

























  

function validateDeadline(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { valid: false, message: "Invalid date" };
  }

  const [year, month, day] = value.split('-').map(Number);
  const deadline = new Date(year, month - 1, day);

  if (
    deadline.getFullYear() !== year ||
    deadline.getMonth() !== month - 1 ||
    deadline.getDate() !== day
  ) {
    return { valid: false, message: "Invalid date" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deadline < today) {
    return { valid: false, message: "Deadline cannot be in the past" };
  }

  return { valid: true, message: "Valid deadline" };
}

  function validateEmail(value) {
  const result = inputCheck(value, 'Email');
  if (result) return result;

  if (!validator.isEmail(value)) {
    return { valid: false, message: 'Invalid email format' };
  }

  return { valid: true, message: '', details: [] };
}

function validatePassword(value) {
  const result = inputCheck(value, 'Password');
  if (result) return result;

  return checkPassword(value);
}

function validateUsername(value) {
  const result = inputCheck(value, 'Username');
  if (result) return result;

  if (value.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }

  return { valid: true, message: '', details: [] };
}


function checkPassword(value) {
  const options = {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  };

  const errors = [];

  // Run the built-in strong password check
  const isStrong = validator.isStrongPassword(value, options);

  // Manual checks to explain what failed
  if (value.length < options.minLength) {
    errors.push(`Password must be at least ${options.minLength} characters long`);
  }
  if ((value.match(/[a-z]/g) || []).length < options.minLowercase) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if ((value.match(/[A-Z]/g) || []).length < options.minUppercase) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if ((value.match(/[0-9]/g) || []).length < options.minNumbers) {
    errors.push("Password must contain at least one number");
  }
  if ((value.match(/[^A-Za-z0-9]/g) || []).length < options.minSymbols) {
    errors.push("Password must contain at least one symbol");
  }

  if (!isStrong) {
    return { valid: false, details: errors };
  }

  return { valid: true, message: "",details:[] };
}
function inputCheck(value, fieldName) {
  if (!fieldName) {
    fieldName = 'Field';
  }

  if (validator.isEmpty(value)) {
    return { valid: false, message: `${fieldName} is required`, details: [] };
  }
  if (validator.isNumeric(value)) {
    return { valid: false, message: `${fieldName} is invalid`, details: [] };
  }
  if (validator.isBoolean(value)) {
    return { valid: false, message: `${fieldName} is invalid`, details: [] };
  }
  if (validator.isEAN(value)) {
    return { valid: false, message: `${fieldName} is invalid`, details: [] };
  }

  return null;
}


function Navbar() {
  return (
    <div>
      <Link to="/login">
       Login
      </Link>
      <Link to="/signup">
      Sing Up
      </Link>
    </div>
  );
}
export { Email, Password, Username, Title, Context, Navbar, SelectTaskStatus, Deadline };