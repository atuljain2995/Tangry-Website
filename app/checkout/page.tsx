'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { CheckoutForm } from '@/components/ecommerce/CheckoutForm';
import { PaymentOptions } from '@/components/ecommerce/PaymentOptions';
import { OrderSummary } from '@/components/ecommerce/OrderSummary';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Address, PaymentMethod } from '@/lib/types/database';
import { createOrder } from '@/lib/actions/orders';
import { Check } from 'lucide-react';
import Link from 'next/link';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  // Redirect if cart is empty
  if (cart.items.length === 0 && currentStep !== 'confirmation') {
    return (
      <main className="page-shell">
        <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <CartDrawer />

        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products before checkout</p>
          <Link
            href="/products"
            className="inline-block bg-[#D32F2F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition"
          >
            Browse Products
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  const handleShippingSubmit = (shipping: Address, billing: Address, _sameAsShipping: boolean, email: string) => {
    setShippingAddress(shipping);
    setBillingAddress(billing);
    setCustomerEmail(email);
    setCurrentStep('payment');
  };

  const createOrderPayload = () => ({
    items: cart.items,
    shippingAddress: shippingAddress!,
    billingAddress: billingAddress!,
    userEmail: customerEmail,
    couponCode: cart.couponCode ?? undefined,
  });

  const handlePaymentSubmit = async (paymentMethod: PaymentMethod) => {
    if (!shippingAddress || !billingAddress) return;
    setIsProcessing(true);

    try {
      if (paymentMethod === 'cod') {
        const result = await createOrder({
          ...createOrderPayload(),
          paymentMethod: 'cod',
        });
        if (!result.success) {
          alert(result.error || 'Failed to place order.');
          return;
        }
        setOrderNumber(result.orderNumber);
        clearCart();
        setCurrentStep('confirmation');
        return;
      }

      if (paymentMethod === 'razorpay') {
        const createRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              quantity: i.quantity,
            })),
            couponCode: cart.couponCode ?? null,
            country: shippingAddress.country || 'IN',
          }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          alert(createData.error || 'Could not start payment.');
          return;
        }
        const { orderId, keyId, amountPaise } = createData as {
          orderId: string;
          keyId: string;
          amountPaise: number;
        };
        if (!orderId || !keyId || typeof amountPaise !== 'number') {
          alert('Invalid payment response. Please try again.');
          return;
        }
        const Razorpay = (window as { Razorpay?: new (opts: object) => { open: () => void } }).Razorpay;
        if (!Razorpay) {
          alert('Payment script not loaded. Please refresh and try again.');
          return;
        }
        const rzp = new Razorpay({
          key: keyId,
          order_id: orderId,
          amount: amountPaise,
          currency: 'INR',
          name: 'Tangry Spices',
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                createOrderPayload: { ...createOrderPayload(), paymentMethod: 'razorpay' },
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              alert(verifyData.error || 'Payment verification failed.');
              return;
            }
            setOrderNumber(verifyData.orderNumber);
            clearCart();
            setCurrentStep('confirmation');
          },
          modal: { ondismiss: () => setIsProcessing(false) },
        });
        rzp.open();
        return;
      }

      // Stripe / bank_transfer: create order with payment_status pending
      const result = await createOrder({
        ...createOrderPayload(),
        paymentMethod,
      });
      if (!result.success) {
        alert(result.error || 'Failed to place order.');
        return;
      }
      setOrderNumber(result.orderNumber);
      clearCart();
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'shipping', name: 'Shipping', completed: currentStep === 'payment' || currentStep === 'confirmation' },
    { id: 'payment', name: 'Payment', completed: currentStep === 'confirmation' },
    { id: 'confirmation', name: 'Confirmation', completed: false }
  ];

  return (
    <main className="page-shell">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      <div className="container mx-auto px-6 py-12 mt-20">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition ${
                    step.completed
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-[#D32F2F] text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? <Check size={24} /> : index + 1}
                  </div>
                  <span className={`text-sm mt-2 font-semibold ${
                    currentStep === step.id ? 'text-[#D32F2F]' : 'text-gray-600'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-4 ${
                    step.completed ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'shipping' && (
              <CheckoutForm
                onSubmit={handleShippingSubmit}
                onBack={() => router.push('/')}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentOptions
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep('shipping')}
                isProcessing={isProcessing}
              />
            )}

            {currentStep === 'confirmation' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={48} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                <p className="text-lg text-gray-600 mb-2">Thank you for your order</p>
                <p className="text-2xl font-bold text-[#D32F2F] mb-8">Order #{orderNumber}</p>
                
                <div className="bg-white rounded-lg p-6 mb-8 text-left max-w-md mx-auto shadow-md">
                  <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      Order confirmation email sent
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      Your order is being prepared
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      You'll receive tracking information soon
                    </li>
                  </ul>
                </div>

                {!user && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 mb-8 max-w-md mx-auto text-left">
                    <h3 className="font-bold text-gray-900 mb-1">Create an account</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Sign up to track your orders, save addresses, and checkout faster next time.
                    </p>
                    <Link
                      href="/signup"
                      className="inline-block px-6 py-2 bg-[#D32F2F] text-white text-sm rounded-full font-semibold hover:bg-[#B71C1C] transition"
                    >
                      Create Account
                    </Link>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/products"
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 transition"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href={user ? '/account/orders' : '/track-order'}
                    className="px-8 py-3 bg-[#D32F2F] text-white rounded-full font-bold hover:bg-[#B71C1C] transition shadow-lg"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <OrderSummary showCouponField={currentStep === 'shipping'} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

