'use client';

import { useState } from 'react';
import { submitWholesaleQuote } from '@/lib/actions/wholesale';
import { analytics } from '@/lib/analytics';

export function WholesaleForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    businessType: '',
    estimatedMonthlyVolume: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    const result = await submitWholesaleQuote(formData);
    if (result.success) {
      analytics.trackFormSubmission('wholesale', true);
      setStatus('success');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstNumber: '',
        businessType: '',
        estimatedMonthlyVolume: '',
        message: '',
      });
    } else {
      analytics.trackFormSubmission('wholesale', false);
      setStatus('error');
      setErrorMessage(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-md space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
          <input
            type="text"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
            placeholder="Your company name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person *</label>
          <input
            type="text"
            required
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
            placeholder="10-digit number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            GST Number (Optional)
          </label>
          <input
            type="text"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
            placeholder="GSTIN"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type *</label>
          <select
            required
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
          >
            <option value="">Select type</option>
            <option value="restaurant">Restaurant/Hotel</option>
            <option value="retailer">Retailer/Distributor</option>
            <option value="manufacturer">Food Manufacturer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Estimated Monthly Volume
        </label>
        <select
          value={formData.estimatedMonthlyVolume}
          onChange={(e) => setFormData({ ...formData, estimatedMonthlyVolume: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
        >
          <option value="">Select range</option>
          <option value="0-50kg">0-50 kg</option>
          <option value="50-100kg">50-100 kg</option>
          <option value="100-500kg">100-500 kg</option>
          <option value="500kg+">500+ kg</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Additional Requirements
        </label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
          placeholder="Tell us about your requirements..."
        />
      </div>

      {status === 'success' && (
        <p className="text-green-600 font-medium">
          Thank you for your interest! Our team will contact you within 24 hours.
        </p>
      )}
      {status === 'error' && <p className="text-red-600 text-sm">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#D32F2F] text-white py-4 rounded-full font-bold text-lg hover:bg-[#B71C1C] transition shadow-lg disabled:opacity-50"
      >
        {status === 'sending' ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
