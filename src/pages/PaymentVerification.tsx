import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { CreditCard, ChevronRight, AlertCircle, X } from 'lucide-react';

interface LocationState {
  applicationNumber?: string;
}

const PaymentVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationNumber } = (location.state || {}) as LocationState;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [union, setUnion] = useState<string>('');

  // Load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window.Razorpay !== 'undefined') {
        resolve(true); // Script already loaded
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!applicationNumber) {
      navigate('/');
      return;
    }

    setApiError(null);
    setIsSubmitting(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setApiError('Failed to load Razorpay SDK');
        setIsSubmitting(false);
        return;
      }

      if (!window.Razorpay) {
        setApiError('Razorpay SDK not available');
        setIsSubmitting(false);
        return;
      }

      // Fetch Razorpay order from backend
      const response = await axios.post('/payment/create-order', { applicationNumber });
      const { order_id, amount, currency, union, key_id } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: `${union} Application`,
        description: `Payment for Application No: ${applicationNumber}`,
        image: 'https://your-logo-url.com/logo.png', // Replace with your logo URL
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // Verify payment with backend
            const verifyResponse = await axios.post('/payment/verify', {
              applicationNumber,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            setUnion(verifyResponse.data.union);
            setIsPopupOpen(true);
          } catch (error: any) {
            setApiError(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: {
          applicationNumber,
        },
        theme: {
          color: '#00cc1f',
        },
        method: {
          card: true,
          netbanking: true,
          upi: true,
          wallet: false,
          emi: false,
          paylater: false,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        setApiError(`Payment failed: ${response.error.description}`);
      });
      paymentObject.open();
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to create payment order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    navigate('/admit-card', {
      state: { applicationNumber, union },
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!applicationNumber) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
              Payment
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

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md font-semibold flex items-center text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePayment}
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
                  Processing...
                </>
              ) : (
                <>
                  Pay Now
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-[90vw] sm:max-w-md relative transform transition-all duration-300 scale-100 animate-fadeIn">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              aria-label="Close pop-up"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                Payment Successful!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                Please remember your Application Number{' '}
                <strong className="text-blue-600">{applicationNumber}</strong>. Your admit card will be downloaded with your application number.
              </p>
              <button
                onClick={handleClosePopup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-md font-semibold text-xs sm:text-sm transition-colors duration-200 w-full sm:w-auto"
              >
                Proceed to Admit Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;