import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { Upload, AlertCircle } from 'lucide-react';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [applicationNumber, setApplicationNumber] = useState<string | undefined>(state?.applicationNumber);
  const [union, setUnion] = useState<string | undefined>(state?.union);
  const [idProof, setIdProof] = useState<string | null>(null);
  const [idProofError, setIdProofError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch applicationNumber and union if missing
  useEffect(() => {
    const fetchUserData = async () => {
      if (!applicationNumber || !union) {
        try {
          if (!applicationNumber) {
            console.error('No applicationNumber provided, redirecting to home');
            setApiError('Invalid application number');
            navigate('/');
            return;
          }
          console.log('Fetching user data due to missing:', { applicationNumber, union });
          const response = await axios.get('/registration/user', {
            params: { applicationNumber },
          });
          console.log('Fetched user data:', response.data);
          const { applicationNumber: fetchedAppNumber, union: fetchedUnion, paymentStatus } = response.data;
          if (!fetchedAppNumber || !fetchedUnion || paymentStatus === undefined) {
            console.error('Fetched data missing required fields:', response.data);
            setApiError('Unable to fetch user data');
            navigate('/');
            return;
          }
          setApplicationNumber(fetchedAppNumber);
          // Normalize fetched union
          const normalizedUnion = fetchedUnion.replace(' Union', '');
          setUnion(normalizedUnion);
        } catch (error: any) {
          console.error('Error fetching user data:', error);
          setApiError(error.response?.data?.message || 'Failed to fetch user data. Please try again.');
          navigate('/');
        }
      }
    };

    fetchUserData();
  }, [applicationNumber, union, navigate]);

  console.log('DocumentUpload state:', { applicationNumber, union });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdProofError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setIdProofError('File size should not exceed 2MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setIdProofError('Only JPG, PNG, or PDF formats are accepted');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setIdProof(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!applicationNumber || !union) {
      console.error('Missing applicationNumber or union', { applicationNumber, union });
      setApiError('Invalid application number or union');
      navigate('/');
      return;
    }

    if (!['Tirhut', 'Harit'].includes(union)) {
      console.error('Invalid union value:', union);
      setApiError('Invalid union specified');
      return;
    }

    if (!idProof) {
      setIdProofError('ID proof is required');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Fetching user for applicationNumber:', applicationNumber);
      const userResponse = await axios.get('/registration/user', {
        params: { applicationNumber },
      });
      console.log('User response:', userResponse.data);
      const { union: userUnion, paymentStatus } = userResponse.data;

      if (paymentStatus === undefined) {
        console.error('Payment status missing in user response:', userResponse.data);
        setApiError('Invalid user data');
        return;
      }

      // Normalize userUnion for comparison
      const normalizedUserUnion = userUnion.replace(' Union', '');
      if (normalizedUserUnion !== union) {
        console.warn('Union mismatch:', { stateUnion: union, userUnion, normalizedUserUnion });
        setApiError('Union mismatch. Please contact support.');
        return;
      }

      console.log('Uploading document for applicationNumber:', applicationNumber);
      const uploadResponse = await axios.post('/registration/upload-document', {
        applicationNumber,
        idProof,
      });
      console.log('Upload response:', uploadResponse.data);

      console.log('Navigation decision:', { applicationNumber, normalizedUserUnion, paymentStatus });
      if (paymentStatus) {
        console.log('Navigating to admit-card for paid user:', { applicationNumber, union: normalizedUserUnion });
        navigate('/admit-card', { state: { applicationNumber, union: normalizedUserUnion } });
      } else {
        console.log('Navigating to payment-verification for unpaid user:', { applicationNumber, union: normalizedUserUnion });
        navigate('/payment-verification', { state: { applicationNumber, union: normalizedUserUnion } });
      }
    } catch (error: any) {
      console.error('Document upload error:', error);
      setApiError(error.response?.data?.message || 'Document upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <Upload className="w-6 h-6 mr-2 text-blue-600" />
            Upload Documents
          </h2>

          {apiError && (
            <p className="text-red-500 text-xs mt-2 flex items-center mb-4">
              <AlertCircle className="w-3 h-3 mr-1" />
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload ID Proof <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">JPG/PNG/PDF format, max size 2MB</p>
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileUpload}
                className="w-full p-2 border rounded-md"
              />
              {idProofError && (
                <p className="text-red-500 text-xs mt-1">{idProofError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center text-sm transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Upload Document'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;