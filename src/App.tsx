import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homepage from './pages/Homepage';
import RegistrationForm from './pages/RegistrationForm';
import DocumentUpload from './pages/DocumentUpload';
import PaymentVerification from './pages/PaymentVerification';
import AdmitCardDownload from './pages/AdmitCardDownload';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RegistrationProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/upload-documents" element={<DocumentUpload />} />
                <Route path="/payment-verification" element={<PaymentVerification />} />
                <Route path="/admit-card" element={<AdmitCardDownload />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RegistrationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;