import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {LoginForm,RegisterForm,Nav} from '../PageComponents/LoginCom';
import DashbordPage from './DashBoard';

import { TokenManager } from '../Models/ManegeToken';

function LoginPage() {
  const tokenManager = new TokenManager();
  const isAuthenticated = Boolean(tokenManager.getToken());

  return (<>

    <BrowserRouter>
    
     <Nav  />
       
      
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/dashboard" element={<DashbordPage />} />
      
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter></>
  );
}


export default LoginPage