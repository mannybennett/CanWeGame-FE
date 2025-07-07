import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth.jsx";
import { Eye, EyeOff } from "lucide-react";
import "../styles/LandingPage.css";
// import ShipAnimation from "../components/ShipAnimation";

export default function LandingPage() {
  const navigate = useNavigate();
  // Destructure login, register, isAuthenticated, and loadingAuth from AuthContext
  const { login, register, isAuthenticated, loadingAuth, user } = useAuth();

  // refs
  const logoRef = useRef(null);
  const shipContainerRef = useRef(null); // This ref will be used for the animation container
  // Login/Register states
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Mobile swipe functionality
  const [currentForm, setCurrentForm] = useState(0); // 0 for login, 1 for register
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null); // Assuming this refers to the main auth form container for swipe

  // New states for displaying login/register errors
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  // --- Effect for Automatic Redirection on Authentication Status Change ---
  useEffect(() => {
    // Only attempt to navigate if authentication status has been determined
    if (!loadingAuth && isAuthenticated) {
      navigate('/home', { replace: true }); // Redirect to home page
    }
  }, [isAuthenticated, loadingAuth, navigate]); // Dependencies: re-run when these values change

  // --- Existing Effects ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (logoRef.current && shipContainerRef.current) {
        const logoWidth = logoRef.current.offsetWidth;
        // Set the width of the ship animation container to match the logo container
        shipContainerRef.current.style.width = `${logoWidth}px`;
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);


  // --- Existing Touch Handlers ---
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentForm === 0) {
      setCurrentForm(1); // Switch to register
    }
    if (isRightSwipe && currentForm === 1) {
      setCurrentForm(0); // Switch to login
    }
    // Reset touch coordinates
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // --- Updated Submit Handlers to use AuthContext and handle errors ---
  const handleLoginSubmit = async (e) => { // Made async
    e.preventDefault();
    setLoginError(null); // Clear previous errors
    try {
      const success = await login(loginData.username, loginData.password);
      if (!success) {
        // If login function returns false (indicating failure, but no error thrown)
        setLoginError("Login failed. Please check your credentials.");
      }
      // If login is successful, the useEffect above will handle the navigation to /home
    } catch (error) {
      // Catch errors thrown by the login function (e.g., network error, API error response)
      console.error("Login submission error:", error);
      // Display a more user-friendly error message from the backend if available
      setLoginError(error.response?.data?.message || "An unexpected error occurred during login. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => { // Made async
    e.preventDefault();
    setRegisterError(null); // Clear previous errors
    const { email, username, password, confirmPassword } = registerData;

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match!");
      return; // Stop submission
    }

    const confirmedData = { email, username, password }; // Data to send to register API

    try {
      // Assuming your register function takes email, username, password
      const success = await register(confirmedData); // Adjust parameters based on your register function in AuthContext
      if (success) {
        alert('Registration successful! Please log in.');
        setCurrentForm(0); // Switch to login form after successful registration
        // Clear form fields for login
        setLoginData({ username: username, password: "" }); // Pre-fill username for convenience
        setRegisterData({ email: "", username: "", password: "", confirmPassword: "" });
      } else {
        // This path might be hit if register returns false without throwing
        setRegisterError("Registration failed. Please try again.");
      }
    } catch (error) {
      // Catch errors thrown by the register function
      console.error("Register submission error:", error);
      setRegisterError(error.response?.data?.message || "An unexpected error occurred during registration. Please try again.");
    }
  };

  // --- Existing Password Visibility Toggle ---
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "login":
        setShowLoginPassword(!showLoginPassword);
        break;
      case "register":
        setShowRegisterPassword(!showRegisterPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  // --- Loading State for Initial Authentication Check ---
  // This is crucial to prevent the login/register forms from flashing
  // before the AuthContext determines if the user is already authenticated.
  if (loadingAuth) {
    return (
      <div className="landing-page-loading-overlay">
        <p>Loading application...</p>
        {/* Add a spinner or more elaborate loading UI here */}
      </div>
    );
  }

  return (
    <main className="landing-page">
      <div className="main-container">
        {/* Left Section - 2/3 */}
        <div className="logo-section">
          <section className="slogan-container">
            <h2 className="slogan">More Gaming, Less Planning.</h2>
          </section>
          <section className="logo-container" ref={logoRef}>
            <h1 className="main-logo">
              <span className="logo-canwe">canwe</span>
              <span className="logo-game">game</span>
              <span className="logo-com">.com</span>
            </h1>
          </section>
          <section className="ship-container" ref={shipContainerRef}>
            {/* <ShipAnimation logoRef={logoRef}/> */}
          </section>
        </div>

        {/* Vertical Separator - Hidden on mobile */}
        <div className="vertical-separator"></div>

        {/* Right Section - 1/3 */}
        <div className="forms-section">
          {isMobile ? (
            // Mobile: Swipeable carousel
            <div className="mobile-carousel">
              {/* Form indicator dots */}
              <div className="form-indicators">
                <button
                  onClick={() => setCurrentForm(0)}
                  className={`indicator-dot ${currentForm === 0 ? "active" : ""}`}
                />
                <button
                  onClick={() => setCurrentForm(1)}
                  className={`indicator-dot ${currentForm === 1 ? "active" : ""}`}
                />
              </div>

              <div
                ref={containerRef}
                className="carousel-container"
                style={{ transform: `translateX(-${currentForm * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Login Form */}
                <div className="form-slide">
                  <div className="form-card">
                    <div className="form-header">
                      <h2 className="form-title">Login</h2>
                    </div>
                    <div className="form-content">
                      <form onSubmit={handleLoginSubmit} className="form">
                        <div className="input-group">
                          <label htmlFor="login-username" className="input-label">
                            Username
                          </label>
                          <input
                            id="login-username"
                            type="text"
                            value={loginData.username}
                            onChange={(e) => {
                              // Remove spaces from the input before updating state
                              const newValue = e.target.value.replace(/\s/g, '');
                              setLoginData({ ...registerData, username: newValue });
                            }}
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="login-password" className="input-label">
                            Password
                          </label>
                          <div className="password-input-container">
                            <input
                              id="login-password"
                              type={showLoginPassword ? "text" : "password"}
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="input-field password-input"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("login")}
                              className="password-toggle"
                            >
                              {showLoginPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                          </div>
                        </div>
                        {loginError && <p className="error-message">{loginError}</p>}
                        <button type="submit" className="submit-button">
                          Login
                        </button>
                      </form>
                    </div>
                    <p className="swipe-hint">Swipe right to register</p>
                  </div>
                </div>

                {/* Register Form */}
                <div className="form-slide">
                  <div className="form-card">
                    <div className="form-header">
                      <h2 className="form-title">Register</h2>
                    </div>
                    <div className="form-content">
                      <form onSubmit={handleRegisterSubmit} className="form">
                        <div className="input-group">
                          <label htmlFor="register-email" className="input-label">
                            Email
                          </label>
                          <input
                            id="register-email"
                            type="email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="register-username" className="input-label">
                            Username
                          </label>
                          <input
                            id="register-username"
                            type="text"
                            value={registerData.username}
                            onChange={(e) => {
                              const newValue = e.target.value.replace(/\s/g, '');
                              setRegisterData({ ...registerData, username: newValue });
                            }}
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="register-password" className="input-label">
                            Password
                          </label>
                          <div className="password-input-container">
                            <input
                              id="register-password"
                              type={showRegisterPassword ? "text" : "password"}
                              value={registerData.password}
                              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                              className="input-field password-input"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("register")}
                              className="password-toggle"
                            >
                              {showRegisterPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                          </div>
                        </div>
                        <div className="input-group">
                          <label htmlFor="register-confirm-password" className="input-label">
                            Confirm Password
                          </label>
                          <div className="password-input-container">
                            <input
                              id="register-confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={registerData.confirmPassword}
                              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                              className="input-field password-input"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("confirm")}
                              className="password-toggle"
                            >
                              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                          </div>
                        </div>
                        {registerError && <p className="error-message">{registerError}</p>}
                        <button type="submit" className="submit-button">
                          Register
                        </button>
                      </form>
                    </div>
                    <p className="swipe-hint">Swipe left to log in</p>
                  </div>
                </div>
              </div>
            </div>

          ) : (

            // Desktop: Stacked forms with separator
            <div className="desktop-forms">
              {/* Login Form */}
              <div className="form-card">
                <div className="form-header">
                  <h2 className="form-title">Login</h2>
                </div>
                <div className="form-content">
                  <form onSubmit={handleLoginSubmit} className="form">
                    <div className="input-group">
                      <label htmlFor="login-username-desktop" className="input-label">
                        Username
                      </label>
                      <input
                        id="login-username-desktop"
                        type="text"
                        value={loginData.username}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s/g, '');
                          setLoginData({ ...registerData, username: newValue });
                        }}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="login-password-desktop" className="input-label">
                        Password
                      </label>
                      <div className="password-input-container">
                        <input
                          id="login-password-desktop"
                          type={showLoginPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="input-field password-input"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("login")}
                          className="password-toggle"
                        >
                          {showLoginPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </div>
                    {loginError && <p className="error-message">{loginError}</p>}
                    <button type="submit" className="submit-button">
                      Login
                    </button>
                  </form>
                </div>
              </div>

              {/* HR Separator with "or" */}
              <div className="form-separator">
                <hr className="separator-line" />
                <span className="separator-text">or</span>
              </div>

              {/* Register Form */}
              <div className="form-card">
                <div className="form-header">
                  <h2 className="form-title">Register</h2>
                </div>
                <div className="form-content">
                  <form onSubmit={handleRegisterSubmit} className="form">
                    <div className="input-group">
                      <label htmlFor="register-email-desktop" className="input-label">
                        Email
                      </label>
                      <input
                        id="register-email-desktop"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="register-username-desktop" className="input-label">
                        Username
                      </label>
                      <input
                        id="register-username-desktop"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s/g, '');
                          setRegisterData({ ...registerData, username: newValue });
                        }}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="register-password-desktop" className="input-label">
                        Password
                      </label>
                      <div className="password-input-container">
                        <input
                          id="register-password-desktop"
                          type={showRegisterPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="input-field password-input"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("register")}
                          className="password-toggle"
                        >
                          {showRegisterPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label htmlFor="register-confirm-password-desktop" className="input-label">
                        Confirm Password
                      </label>
                      <div className="password-input-container">
                        <input
                          id="register-confirm-password-desktop"
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="input-field password-input"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="password-toggle"
                        >
                          {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </div>
                    {registerError && <p className="error-message">{registerError}</p>}
                    <button type="submit" className="submit-button">
                      Register
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
};