import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { ScheduleProvider } from './context/ScheduleContext';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScheduleProvider>
          <App />
        </ScheduleProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);