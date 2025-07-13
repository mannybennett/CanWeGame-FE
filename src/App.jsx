import { useContext } from 'react'; // Import useContext
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routes, Route, Navigate
import LandingPage from './pages/LandingPage.jsx'; // Ensure .jsx extension
import HomePage from './pages/HomePage.jsx';     // Ensure .jsx extension
import { AuthContext } from './context/AuthContext.jsx'; // Ensure .jsx extension
import './styles/App.css';

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
        {/* If authenticated, redirect from landing page to home page */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
        />

        {/* This route requires authentication. If not authenticated, PrivateRoute redirects to / */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;