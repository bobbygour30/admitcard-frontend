declare global {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    order_id: string;
    handler: (response: any) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    notes: {
      applicationNumber: string;
    };
    theme: {
      color: string;
    };
    method: {
      card: boolean;
      netbanking: boolean;
      upi: boolean;
      wallet: boolean;
      emi: boolean;
      paylater: boolean;
    };
  }

  interface RazorpayInstance {
    open: () => void;
    on: (event: string, callback: (response: any) => void) => void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export {};