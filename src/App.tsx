// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Sidebar/Layout';
import ChequeUploadForm from './components/cheques/ChequeUploadForm';
import './App.css';

// Page temporaire pour le dashboard
const Dashboard = () => (
  <div style={{ padding: '20px', background: 'white', borderRadius: '10px' }}>
    <h1>Tableau de bord</h1>
    <p>Page en construction</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scan" element={<ChequeUploadForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;