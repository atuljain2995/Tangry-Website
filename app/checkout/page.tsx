'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckoutHeader } from '@/components/layout/CheckoutHeader';
import { CheckoutForm } from '@/components/ecommerce/CheckoutForm';
import { PaymentOptions } from '@/components/ecommerce/PaymentOptions';
import { OrderSummary } from '@/components/ecommerce/OrderSummary';
import { CheckoutStepper } from '@/components/ecommerce/CheckoutStepper';
import { CheckoutMobileBar } from '@/components/ecommerce/CheckoutMobileBar';
import { CheckoutTrustStrip } from '@/components/ecommerce/CheckoutTrustStrip';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Address, PaymentMethod } from '@/lib/types/database';
import { createOrder } from '@/lib/actions/orders';
import { getCheckoutTotals } from '@/lib/utils/checkout-totals';
import { Check, Loader2, Truck } from 'lucide-react';
import { analytics } from '@/lib/analytics';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

const SHIPPING_FORM_ID = 'checkout-shipping-form';
const PAYMENT_FORM_ID = 'checkout-payment-form';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isCartHydrated } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totals = getCheckoutTotals(cart);

  const reportCheckoutError = (message: string) => {
    setCheckoutError(message);
    setIsProcessing(false);
  };

  if (!isCartHydrated) {
    return (
      <div className="min-h-screen bg-[#FFF8F3]">
        <CheckoutHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#D32F2F]" aria-hidden />
          <p className="mt-4 text-gray-600">Loading your cart…</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-[#FFF8F3]">
        <CheckoutHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mb-8 text-gray-600">Add some masalas before checkout</p>
          <Link
            href="/products"
            className="inline-block rounded-2xl bg-[#D32F2F] px-8 py-3 font-semibold text-white transition hover:bg-[#B71C1C]"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (
    shipping: Address,
    billing: Address,
    _sameAsShipping: boolean,
    email: string,
  ) => {
    setShippingAddress(shipping);
    setBillingAddress(billing);
    setCustomerEmail(email);
    setCheckoutError(null);
    setCurrentStep('payment');
    analytics.trackBeginCheckout(cart.items, totals.grandTotal, cart.couponCode);
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
    setCheckoutError(null);
    setIsProcessing(true);

    const checkoutItems = [...cart.items];
    const checkoutTotal = totals.grandTotal;
    const checkoutCoupon = cart.couponCode;

    try {
      if (paymentMethod === 'cod') {
        const result = await createOrder({
          ...createOrderPayload(),
          paymentMethod: 'cod',
        });
        if (!result.success) {
          analytics.trackCheckoutError('cod', result.error || 'order_failed');
          reportCheckoutError(result.error || 'Failed to place order. Please try again.');
          return;
        }
        setOrderNumber(result.orderNumber);
        analytics.trackPurchase(
          result.orderNumber,
          checkoutItems,
          checkoutTotal,
          checkoutCoupon,
        );
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
            country: shippingAddress?.country || 'IN',
          }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          analytics.trackCheckoutError('razorpay', createData.error || 'create_order_failed');
          reportCheckoutError(createData.error || 'Could not start payment. Please try again.');
          return;
        }
        const { orderId, keyId, amountPaise } = createData as {
          orderId: string;
          keyId: string;
          amountPaise: number;
        };
        if (!orderId || !keyId || typeof amountPaise !== 'number') {
          reportCheckoutError('Invalid payment response. Please try again.');
          return;
        }
        const RazorpayClass = (window as { Razorpay?: new (opts: object) => { open: () => void } })
          .Razorpay;
        if (!RazorpayClass) {
          reportCheckoutError(
            'Payment gateway is still loading. Please wait a moment and try again.',
          );
          return;
        }
        const rzp = new (RazorpayClass as new (opts: object) => { open: () => void })({
          key: keyId,
          order_id: orderId,
          amount: amountPaise,
          currency: 'INR',
          name: 'Tangry Spices',
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
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
              analytics.trackCheckoutError('razorpay', verifyData.error || 'verify_failed');
              reportCheckoutError(
                verifyData.error ||
                  'Payment verification failed. Contact support if you were charged.',
              );
              return;
            }
            setCheckoutError(null);
            setOrderNumber(verifyData.orderNumber);
            analytics.trackPurchase(
              verifyData.orderNumber,
              checkoutItems,
              checkoutTotal,
              checkoutCoupon,
            );
            clearCart();
            setCurrentStep('confirmation');
          },
          modal: { ondismiss: () => setIsProcessing(false) },
        });
        setIsProcessing(false);
        rzp.open();
        return;
      }

      const result = await createOrder({
        ...createOrderPayload(),
        paymentMethod,
      });
      if (!result.success) {
        reportCheckoutError(result.error || 'Failed to place order. Please try again.');
        return;
      }
      setOrderNumber(result.orderNumber);
      analytics.trackPurchase(
        result.orderNumber,
        checkoutItems,
        checkoutTotal,
        checkoutCoupon,
      );
      clearCart();
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      analytics.trackCheckoutError('unknown', 'exception');
      reportCheckoutError('Payment failed. Please try again.');
    } finally {
      if (paymentMethod !== 'razorpay') {
        setIsProcessing(false);
      }
    }
  };

  const mobileCta =
    currentStep === 'shipping' ? 'Continue' : isProcessing ? 'Processing…' : 'Pay now';

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <CheckoutHeader itemCount={totals.itemCount} />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="container mx-auto px-4 py-6 pb-28 lg:pb-10 lg:py-8">
        {currentStep === 'confirmation' ? (
          <div className="mx-auto max-w-lg py-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-600 shadow-lg">
              <Check size={44} className="text-white" aria-hidden />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Order confirmed. Taste of home is on the way.
            </h1>
            <p className="mb-1 text-gray-600">Thank you for choosing Tangry Spices</p>
            <p className="mb-6 text-xl font-bold text-[#D32F2F]">Order #{orderNumber}</p>

            <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Truck className="h-4 w-4 text-[#D32F2F]" aria-hidden />
                What happens next
              </div>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Confirmation email on its way
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Freshly packed in Jaipur
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Tracking details when your order ships
                </li>
              </ul>
            </div>

            {!user && (
              <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-left">
                <h3 className="mb-1 font-bold text-gray-900">Create an account</h3>
                <p className="mb-3 text-sm text-gray-600">
                  Track orders, save addresses, and checkout faster next time.
                </p>
                <Link
                  href="/signup"
                  className="inline-block rounded-2xl bg-[#D32F2F] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#B71C1C]"
                >
                  Sign up free
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="rounded-2xl border-2 border-gray-200 px-8 py-3 font-semibold text-gray-700 transition hover:border-gray-300"
              >
                Shop more masalas
              </Link>
              <Link
                href={user ? '/account/orders' : '/track-order'}
                className="rounded-2xl bg-[#D32F2F] px-8 py-3 font-bold text-white shadow-lg transition hover:bg-[#B71C1C]"
              >
                Track order
              </Link>
            </div>

            <CheckoutTrustStrip compact />
          </div>
        ) : (
          <>
            <CheckoutStepper currentStep={currentStep} />

            <div className="mb-4 lg:hidden">
              <OrderSummary
                showCouponField={currentStep === 'shipping'}
                collapsibleOnMobile
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                {currentStep === 'shipping' && (
                  <CheckoutForm
                    formId={SHIPPING_FORM_ID}
                    onSubmit={handleShippingSubmit}
                    onBack={() => router.push('/products')}
                  />
                )}

                {currentStep === 'payment' && (
                  <PaymentOptions
                    formId={PAYMENT_FORM_ID}
                    onSubmit={handlePaymentSubmit}
                    onBack={() => {
                      setCheckoutError(null);
                      setCurrentStep('shipping');
                    }}
                    isProcessing={isProcessing}
                    error={checkoutError}
                    onDismissError={() => setCheckoutError(null)}
                  />
                )}
              </div>

              <div className="hidden lg:col-span-1 lg:block">
                <OrderSummary showCouponField={currentStep === 'shipping'} />
                <div className="mt-4">
                  <CheckoutTrustStrip />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {currentStep !== 'confirmation' && (
        <CheckoutMobileBar
          grandTotal={totals.grandTotal}
          afterDiscount={totals.afterDiscount}
          step={currentStep}
          isProcessing={isProcessing}
          formId={currentStep === 'shipping' ? SHIPPING_FORM_ID : PAYMENT_FORM_ID}
          ctaLabel={mobileCta}
        />
      )}
    </div>
  );
}
