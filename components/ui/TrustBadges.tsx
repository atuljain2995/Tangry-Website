'use client';

import { Shield, Truck, RefreshCcw, Lock, Award, Leaf } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'horizontal' | 'grid';
  className?: string;
}

export const TrustBadges = ({ variant = 'horizontal', className = '' }: TrustBadgesProps) => {
  const badges = [
    {
      icon: Shield,
      title: '100% Authentic',
      description: 'Quality Assured'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹499'
    },
    {
      icon: RefreshCcw,
      title: 'Easy Returns',
      description: '7-day return policy'
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      description: '100% Safe & Secure'
    },
    {
      icon: Award,
      title: 'ISO Certified',
      description: 'Quality Standards'
    },
    {
      icon: Leaf,
      title: 'Organic Options',
      description: 'Natural & Pure'
    }
  ];

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {badges.map((badge, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <badge.icon className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{badge.title}</h3>
            <p className="text-xs text-gray-600">{badge.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center gap-6 ${className}`}>
      {badges.map((badge, index) => (
        <div 
          key={index} 
          className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <badge.icon className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{badge.title}</h3>
            <p className="text-xs text-gray-600">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PaymentBadges = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <div className="text-xs text-gray-600 font-semibold">We Accept:</div>
      <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-gray-200">
        <span className="text-xs font-semibold">💳 Cards</span>
      </div>
      <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-gray-200">
        <span className="text-xs font-semibold">📱 UPI</span>
      </div>
      <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-gray-200">
        <span className="text-xs font-semibold">💰 Wallets</span>
      </div>
      <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-gray-200">
        <span className="text-xs font-semibold">🏦 Net Banking</span>
      </div>
      <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-gray-200">
        <span className="text-xs font-semibold">💵 COD</span>
      </div>
    </div>
  );
};

export const SecurityBadges = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <Lock size={16} className="text-green-600" />
        <span className="font-semibold">SSL Secured</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <Shield size={16} className="text-blue-600" />
        <span className="font-semibold">FSSAI Certified</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <Award size={16} className="text-purple-600" />
        <span className="font-semibold">ISO 22000</span>
      </div>
    </div>
  );
};

