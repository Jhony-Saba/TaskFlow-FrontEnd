import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import {LoginForm,RegisterForm,Nav,ProtectedRoute} from '../PageComponents/LoginCom';
import DashbordPage from './DashBoard';
import { TokenManager } from '../Models/ManegeToken';


/**
** LoginPage is the main routing component of the application.
*- It checks the user's authentication status using TokenManager,
* provides routes for login and signup, protects the dashboard
* route with ProtectedRoute, and redirects users to the appropriate
* page based on whether they are authenticated.
*/
function LoginPage() {
  // Create an instance of TokenManager to access authentication tokens
  const tokenManager = new TokenManager();
  // Check if a token exists.
  // If a token is found, the user is considered authenticated.
  const isAuthenticated = Boolean(tokenManager.getToken());

  return (<>
{/* Enables client-side routing using URL hash fragments (#) */}
    <HashRouter>
{/* Navigation bar displayed across all pages */}
    <Nav/>
{/* Defines all application routes */}
      <Routes>
{/* Route for the login page */}
        <Route path="/login" element={<LoginForm />} />
{/* Route for the registration/sign-up page */}
        <Route path="/signup" element={<RegisterForm />} />
{/* Protected dashboard route */}
{/* Users must be authenticated to access DashboardPage */}
        <Route path="/dashboard/*"
        element={  <ProtectedRoute>
              <DashbordPage />
            </ProtectedRoute>}/>
{/* Catch-all route for undefined URLs */}
{/* Redirect authenticated users to dashboard */}
{/* Redirect unauthenticated users to login */}
        <Route path="*" element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
          } />
      </Routes>
    </HashRouter></>
  );
}


export default LoginPage