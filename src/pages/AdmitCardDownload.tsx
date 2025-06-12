import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../axiosConfig';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { generateAdmitCardPDF } from '../utils/pdfGenerator';
// import type { RegistrationData } from '../types';
import {
  Download,
  AlertCircle,
  X,
  Calendar,
  MapPin,
  User,
  FileText,
} from 'lucide-react';

interface FormData {
  applicationNumber: string;
}

const AdmitCardDownload: React.FC = () => {
  const location = useLocation();
  const { applicationNumber: initialAppNumber } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const [admitCard, setAdmitCard] = useState< any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (initialAppNumber) {
      setValue('applicationNumber', initialAppNumber);
      fetchAdmitCard({ applicationNumber: initialAppNumber });
    }
  }, [initialAppNumber, setValue]);

  const fetchAdmitCard = async (data: FormData) => {
  setApiError(null);
  setIsLoading(true);

  try {
    const response = await axios.get('/admit-card', {
      params: { applicationNumber: data.applicationNumber },
    });
    console.log('API Response:', response.data);
    setAdmitCard(response.data.user);
    setQrCodeUrl(`${window.location.origin}/admit-card?appNo=${data.applicationNumber}`);
    if (!response.data.emailSent) {
      setApiError('Admit card fetched, but failed to send notification email.');
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch admit card. Please try again.';
    setApiError(errorMessage);
    console.error('Fetch Admit Card Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    if (error.response?.data?.message.includes('Tirhut Union')) {
      setIsModalOpen(true);
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleDownload = async () => {
    if (!admitCard) return;
    try {
      await generateAdmitCardPDF(admitCard);
    } catch (error) {
      setApiError('Failed to generate PDF. Please try again.');
      console.error('PDF Generation Error:', error);
    }
  };

  const handleEmail = async () => {
    if (!admitCard) return;
    setApiError(null);
    setIsEmailing(true);

    try {
      await axios.post('/admit-card/email', {
        applicationNumber: admitCard.applicationNumber,
      });
      alert('Admit card has been emailed successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send email. Please try again.';
      setApiError(errorMessage);
      console.error('Email Admit Card Error:', error);
    } finally {
      setIsEmailing(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-GB');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Admit Card Download
          </h2>

          {apiError && (
            <p className="text-red-500 text-xs mt-2 flex items-center mb-4">
              <AlertCircle className="w-3 h-3 mr-1" />
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit(fetchAdmitCard)} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors.applicationNumber ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('applicationNumber', {
                  required: 'Application number is required',
                })}
              />
              {errors.applicationNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.applicationNumber.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center text-sm transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
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
                  Fetching...
                </>
              ) : (
                'Fetch Admit Card'
              )}
            </button>
          </form>

          {admitCard && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Admit Card Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {admitCard.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Father's Name:</strong> {admitCard.fatherName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Mother's Name:</strong> {admitCard.motherName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date of Birth:</strong> {admitCard.dob ? formatDate(admitCard.dob) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Gender:</strong> {admitCard.gender ? admitCard.gender.toUpperCase() : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {admitCard.email || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Mobile:</strong> {admitCard.mobile || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Aadhaar Number:</strong> {admitCard.aadhaarNumber || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {admitCard.address || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Union:</strong> {admitCard.union || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Posts Applied For:</strong>{' '}
                    {admitCard.selectedPosts?.length ? admitCard.selectedPosts.join(', ') : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>District Preferences:</strong>{' '}
                    {admitCard.districtPreferences?.length ? admitCard.districtPreferences.join(', ') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                    <strong>Exam Center:</strong> {admitCard.examCenter || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                    <strong>Exam Shift:</strong> {admitCard.examShift || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <User className="w-4 h-4 mr-1 text-blue-600" />
                    <strong>Application Number:</strong> {admitCard.applicationNumber || 'N/A'}
                  </p>
                  <div className="mt-4">
                    {admitCard.photo ? (
                      <img
                        src={admitCard.photo}
                        alt="Candidate Photo"
                        className="w-32 h-40 object-cover border border-gray-300"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">Photo: N/A</p>
                    )}
                  </div>
                  <div className="mt-2">
                    {admitCard.signature ? (
                      <img
                        src={admitCard.signature}
                        alt="Candidate Signature"
                        className="w-32 h-16 object-contain border border-gray-300"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">Signature: N/A</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <QRCode value={qrCodeUrl} size={128} />
                    <p className="text-xs text-gray-500 mt-2">Scan to verify admit card</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold flex items-center text-sm transition-colors duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Admit Card
                </button>
                <button
                  onClick={handleEmail}
                  disabled={isEmailing}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center text-sm transition-colors duration-200 ${
                    isEmailing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isEmailing ? (
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
                      Sending...
                    </>
                  ) : (
                    'Email Admit Card'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tirhut Union Admit Card Notice
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Admit cards for Tirhut Union candidates will be available for download starting from{' '}
              <strong>June 18, 2025</strong>. Please check back after this date.
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmitCardDownload;