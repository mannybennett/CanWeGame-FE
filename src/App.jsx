import { useContext } from 'react'; // Import useContext
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routes, Route, Navigate

// Import your page components
import LandingPage from './pages/LandingPage.jsx'; // Ensure .jsx extension
import HomePage from './pages/HomePage.jsx';     // Ensure .jsx extension

// Import your AuthContext
import { AuthContext } from './context/AuthContext.jsx'; // Ensure .jsx extension

import './styles/App.css';

// A simple PrivateRoute component to protect routes that require authentication
// This component checks if the user is authenticated. If not, it redirects to the login page.
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useContext(AuthContext);

  // While authentication status is being determined, you might show a loading spinner
  if (loadingAuth) {
    return <div>Loading authentication...</div>; // Or a proper loading component
  }

  // If authenticated, render the children (the protected component)
  // Otherwise, navigate to the login page
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  // Get authentication status from AuthContext
  const { isAuthenticated, loadingAuth } = useContext(AuthContext);

  // While authentication status is being determined, you might show a loading spinner
  // This is important for the initial load to prevent flickering or incorrect redirects
  if (loadingAuth) {
    return <div>Loading application...</div>; // Or a full-page loading spinner
  }

  return (
    <>
      <Routes>
        {/* Public Route: Landing Page */}
        {/* If authenticated, redirect from landing page to home page */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
        />

        {/* Protected Route: Home Page */}
        {/* This route requires authentication. If not authenticated, PrivateRoute redirects to / */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Add more protected routes here using PrivateRoute */}
        {/* Example: User Profile Page */}
        {/* <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          }
        /> */}

        {/* Example: Friends List Page */}
        {/* <Route
          path="/friends"
          element={
            <PrivateRoute>
              <FriendListPage />
            </PrivateRoute>
          }
        /> */}

        {/* Catch-all for 404 Not Found (optional) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
}

export default App;