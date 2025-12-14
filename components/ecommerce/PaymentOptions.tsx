'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, Building } from 'lucide-react';
import { PaymentMethod } from '@/lib/types/database';

interface PaymentOptionsProps {
  onSubmit: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
  isProcessing?: boolean;
}

export const PaymentOptions = ({ onSubmit, onBack, isProcessing = false }: PaymentOptionsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');

  const paymentMethods = [
    {
      id: 'razorpay' as PaymentMethod,
      name: 'Cards / UPI / Wallets',
      description: 'Razorpay - Credit/Debit Cards, UPI, Wallets',
      icon: CreditCard,
      available: true,
      recommended: true
    },
    {
      id: 'stripe' as PaymentMethod,
      name: 'International Cards',
      description: 'Stripe - International Credit/Debit Cards',
      icon: CreditCard,
      available: true,
      recommended: false
    },
    {
      id: 'cod' as PaymentMethod,
      name: 'Cash on Delivery',
      description: 'Pay when you receive the product',
      icon: Banknote,
      available: true,
      recommended: false
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      name: 'Bank Transfer',
      description: 'Direct bank transfer (For B2B orders)',
      icon: Building,
      available: false,
      recommended: false
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              disabled={!method.available || isProcessing}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                selectedMethod === method.id
                  ? 'border-[#D32F2F] bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  selectedMethod === method.id ? 'bg-[#D32F2F] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <method.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-900">{method.name}</h3>
                    {method.recommended && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        Recommended
                      </span>
                    )}
                    {!method.available && (
                      <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        Not Available
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-[#D32F2F] bg-[#D32F2F]'
                      : 'border-gray-300'
                  } flex items-center justify-center`}>
                    {selectedMethod === method.id && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Your payment information is secure and encrypted</li>
          <li>• You will be redirected to the payment gateway</li>
          <li>• COD available for orders below ₹5,000</li>
          <li>• International payments supported via Stripe</li>
        </ul>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="w-4 h-4 mt-1 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300 rounded"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the <a href="/terms" className="text-[#D32F2F] hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-[#D32F2F] hover:underline">Privacy Policy</a>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="px-8 py-3 bg-[#D32F2F] text-white rounded-full font-bold hover:bg-[#B71C1C] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Place Order</span>
          )}
        </button>
      </div>
    </form>
  );
};

