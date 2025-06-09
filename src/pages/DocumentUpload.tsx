import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { FilePlus, FileText, ChevronRight, AlertCircle } from 'lucide-react';

const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationNumber } = location.state || {};

  const [idProof, setIdProof] = useState<string | null>(null);
  const [idProofError, setIdProofError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!applicationNumber) {
    navigate('/');
    return null;
  }

  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdProofError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setIdProofError('File size should not exceed 500KB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setIdProofError('Only JPG, PNG, and PDF formats are accepted');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setIdProof(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!idProof) {
      setIdProofError('ID proof is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/registration/upload-document', { applicationNumber, idProof });
      navigate('/payment-verification', { state: { applicationNumber } });
    } catch (error: any) {
      setApiError(error.message || 'Document upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FilePlus className="w-6 h-6 mr-2 text-blue-600" />
              Document Upload
            </h2>
            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-md">
              Application No: {applicationNumber}
            </div>
          </div>

          {apiError && (
            <p className="text-red-500 text-xs mt-2 flex items-center mb-4">
              <AlertCircle className="w-3 h-3 mr-1" />
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload ID Proof <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                JPG/PNG/PDF format, max size 500KB
              </p>

              <div className="mb-3 flex justify-center">
                <div className="w-32 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  {idProof ? (
                    idProof.startsWith('data:image') ? (
                      <img src={idProof} alt="Uploaded ID proof" className="max-w-full max-h-full" />
                    ) : (
                      <FileText className="w-8 h-8 text-gray-400" />
                    )
                  ) : (
                    <FilePlus className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer transition-colors duration-200">
                  <span>Choose ID Proof</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleIdProofUpload}
                  />
                </label>
              </div>

              {idProofError && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {idProofError}
                </p>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md font-semibold flex items-center text-sm transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold flex items-center text-sm transition-colors duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Next: Payment Verification
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;