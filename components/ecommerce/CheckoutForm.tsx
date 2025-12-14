'use client';

import { useState } from 'react';
import { Address } from '@/lib/types/database';
import { validatePinCode } from '@/lib/utils/database';

interface CheckoutFormProps {
  onSubmit: (shippingAddress: Address, billingAddress: Address, sameAsShipping: boolean) => void;
  onBack: () => void;
}

export const CheckoutForm = ({ onSubmit, onBack }: CheckoutFormProps) => {
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    type: 'shipping',
    isDefault: false
  });

  const [billingAddress, setBillingAddress] = useState<Partial<Address>>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    type: 'billing',
    isDefault: false
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Shipping validation
    if (!shippingAddress.fullName?.trim()) newErrors.shipping_fullName = 'Full name is required';
    if (!shippingAddress.phone?.trim()) newErrors.shipping_phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) newErrors.shipping_phone = 'Invalid phone number';
    if (!shippingAddress.addressLine1?.trim()) newErrors.shipping_addressLine1 = 'Address is required';
    if (!shippingAddress.city?.trim()) newErrors.shipping_city = 'City is required';
    if (!shippingAddress.state?.trim()) newErrors.shipping_state = 'State is required';
    if (!shippingAddress.postalCode?.trim()) newErrors.shipping_postalCode = 'PIN code is required';
    else if (!validatePinCode(shippingAddress.postalCode)) newErrors.shipping_postalCode = 'Invalid PIN code';

    // Billing validation (if different)
    if (!sameAsShipping) {
      if (!billingAddress.fullName?.trim()) newErrors.billing_fullName = 'Full name is required';
      if (!billingAddress.phone?.trim()) newErrors.billing_phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(billingAddress.phone)) newErrors.billing_phone = 'Invalid phone number';
      if (!billingAddress.addressLine1?.trim()) newErrors.billing_addressLine1 = 'Address is required';
      if (!billingAddress.city?.trim()) newErrors.billing_city = 'City is required';
      if (!billingAddress.state?.trim()) newErrors.billing_state = 'State is required';
      if (!billingAddress.postalCode?.trim()) newErrors.billing_postalCode = 'PIN code is required';
      else if (!validatePinCode(billingAddress.postalCode)) newErrors.billing_postalCode = 'Invalid PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const finalBillingAddress = sameAsShipping ? { ...shippingAddress, type: 'billing' as const } : billingAddress;
      onSubmit(
        shippingAddress as Address,
        finalBillingAddress as Address,
        sameAsShipping
      );
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.shipping_fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.shipping_fullName && (
              <p className="text-red-600 text-xs mt-1">{errors.shipping_fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.shipping_phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10-digit mobile number"
            />
            {errors.shipping_phone && (
              <p className="text-red-600 text-xs mt-1">{errors.shipping_phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address Line 1 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={shippingAddress.addressLine1}
              onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.shipping_addressLine1 ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="House no., Building name"
            />
            {errors.shipping_addressLine1 && (
              <p className="text-red-600 text-xs mt-1">{errors.shipping_addressLine1}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={shippingAddress.addressLine2}
              onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
              placeholder="Road name, Area, Colony"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.shipping_city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter city"
            />
            {errors.shipping_city && (
              <p className="text-red-600 text-xs mt-1">{errors.shipping_city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State <span className="text-red-600">*</span>
            </label>
            <select
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.shipping_state ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.shipping_state && (
              <p className="text-red-600 text-xs mt-1">{errors.shipping_state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PIN Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.shipping_postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="6-digit PIN code"
              maxLength={6}
            />
            {errors.shipping_postalCode && (
              <p className="text-red-600 text-xs mt-1">{errors.shipping_postalCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="w-4 h-4 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300 rounded"
          />
          <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
            Billing address same as shipping address
          </label>
        </div>

        {!sameAsShipping && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Address</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Repeat similar fields for billing address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={billingAddress.fullName}
                  onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                    errors.billing_fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.billing_fullName && (
                  <p className="text-red-600 text-xs mt-1">{errors.billing_fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={billingAddress.phone}
                  onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                    errors.billing_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.billing_phone && (
                  <p className="text-red-600 text-xs mt-1">{errors.billing_phone}</p>
                )}
              </div>

              {/* Additional fields similar to shipping */}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 transition"
        >
          Back to Cart
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-[#D32F2F] text-white rounded-full font-bold hover:bg-[#B71C1C] transition shadow-lg"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

