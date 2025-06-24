import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { AlertCircle } from 'lucide-react';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentVerification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { applicationNumber, union } = state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationNumber || !union) {
      console.error('Missing applicationNumber or union, redirecting to home');
      setApiError('Invalid application number or union');
      navigate('/');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded');
      initiatePayment();
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setApiError('Failed to load payment gateway');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [applicationNumber, union, navigate]);

  const initiatePayment = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      console.log('Creating Razorpay order for:', { applicationNumber, amount: 60000, union });
      const response = await axios.post('/payment/create-order', {
        applicationNumber,
        amount: 60000,
        union,
      });
      console.log('Razorpay order response:', JSON.stringify(response.data, null, 2));

      const order: RazorpayOrder | undefined = response.data.order;
      if (!order) {
        console.error('No order in response:', response.data);
        setApiError('Failed to create payment order');
        return;
      }

      if (!window.Razorpay) {
        console.error('Razorpay SDK not loaded');
        setApiError('Payment gateway not available');
        return;
      }

      const razorpayKey = union === 'Tirhut' ? import.meta.env.VITE_RAZORPAY_KEY_ID : import.meta.env.VITE_HARIT_RAZORPAY_KEY_ID;

      const options = {
        key: razorpayKey || '',
        amount: order.amount,
        currency: order.currency,
        name: 'CBT Exam Portal',
        description: `Application Fee for ${union}`,
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            console.log('Verifying payment:', { ...response, union });
            const verifyResponse = await axios.post('/payment/verify', {
              applicationNumber,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              paymentStatus: true,
              razorpay_signature: response.razorpay_signature,
              union,
            });
            console.log('Payment verified:', verifyResponse.data);
            navigate('/admit-card', { state: { applicationNumber, union } });
          } catch (error: any) {
            console.error('Payment verification error:', error);
            setApiError(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          email: '',
          contact: '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
            setApiError('Payment cancelled by user');
          },
        },
      };

      console.log('Initializing Razorpay with:', {
        key: options.key,
        order_id: options.order_id,
        amount: options.amount,
        union,
      });

      if (!options.key) {
        console.error('Missing Razorpay key ID for union:', union);
        setApiError('Payment gateway configuration error');
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        setApiError(response.error.description || 'Payment failed');
      });
      rzp.open();
    } catch (error: any) {
      console.error('Order creation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setApiError(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Verification</h2>

          {apiError && (
            <p className="text-red-500 text-xs mt-2 flex items-center mb-4">
              <AlertCircle className="w-3 h-3 mr-1" />
              {apiError}
            </p>
          )}

          {isLoading && <p className="text-gray-600">Initiating payment...</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;