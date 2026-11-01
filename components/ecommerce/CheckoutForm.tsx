'use client';

import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { Address } from '@/lib/types/database';
import { validatePinCode } from '@/lib/utils/database';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getGuestCheckoutInfo } from '@/lib/utils/guest-orders';
import { CheckoutDeliveryHint } from './CheckoutDeliveryHint';
import { MapPin, Pencil } from 'lucide-react';

const PINCODE_STORAGE_KEY = 'tangry_pincode';

interface SavedAddress {
  id: string;
  type: 'shipping' | 'billing';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

interface CheckoutFormProps {
  onSubmit: (
    shippingAddress: Address,
    billingAddress: Address,
    sameAsShipping: boolean,
    email: string,
  ) => void;
  onBack: () => void;
  formId?: string;
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
}

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// India Post spellings that differ from INDIAN_STATES
const STATE_ALIASES: Record<string, string> = {
  'andaman & nicobar': 'Andaman and Nicobar Islands',
  'andaman & nicobar islands': 'Andaman and Nicobar Islands',
  chattisgarh: 'Chhattisgarh',
  'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'jammu & kashmir': 'Jammu and Kashmir',
  pondicherry: 'Puducherry',
  orissa: 'Odisha',
  'new delhi': 'Delhi',
};

function normalizeState(raw: string | undefined): string {
  const s = (raw ?? '').trim();
  if (!s) return '';
  const exact = INDIAN_STATES.find((st) => st.toLowerCase() === s.toLowerCase());
  return exact ?? STATE_ALIASES[s.toLowerCase()] ?? '';
}

function initialShippingAddress(): Partial<Address> {
  return {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    type: 'shipping',
    isDefault: false,
  };
}

export const CheckoutForm = ({
  onSubmit,
  onBack,
  formId = 'checkout-shipping-form',
}: CheckoutFormProps) => {
  const { user } = useAuth();
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [email, setEmail] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [expressMode, setExpressMode] = useState(false);
  const [pinLookupLoading, setPinLookupLoading] = useState(false);
  const [pinNotFound, setPinNotFound] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const autoFilled = useRef<{ city: string; state: string }>({ city: '', state: '' });
  const fid = useId();

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>(initialShippingAddress);

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
    isDefault: false,
  });

  const applyAddress = useCallback((addr: SavedAddress, target: 'shipping' | 'billing') => {
    const mapped: Partial<Address> = {
      fullName: addr.full_name,
      phone: normalizePhone(addr.phone),
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country || 'IN',
      type: target,
      isDefault: addr.is_default,
    };
    if (target === 'shipping') setShippingAddress(mapped);
    else setBillingAddress(mapped);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- initialising form from fetched user data */
  useEffect(() => {
    if (!user) return;
    setEmail(user.email || '');
    setLoadingAddresses(true);
    fetch('/api/account/addresses', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: SavedAddress[]) => {
        setSavedAddresses(data);
        const defaultShipping = data.find((a) => a.type === 'shipping' && a.is_default);
        if (defaultShipping) {
          applyAddress(defaultShipping, 'shipping');
          setExpressMode(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false));
  }, [user, applyAddress]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Returning guest (no account): prefill from the last checkout remembered on this
  // device instead of asking them to retype an address they've already given us.
  useEffect(() => {
    if (user) return;
    const remembered = getGuestCheckoutInfo();
    if (!remembered) return;
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate form from localStorage after mount */
    setEmail(remembered.email);
    setShippingAddress({
      fullName: remembered.fullName,
      phone: remembered.phone,
      addressLine1: remembered.addressLine1,
      addressLine2: remembered.addressLine2 || '',
      city: remembered.city,
      state: remembered.state,
      postalCode: remembered.postalCode,
      country: remembered.country || 'IN',
      type: 'shipping',
      isDefault: false,
    });
    setExpressMode(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  // Restore saved PIN after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(PINCODE_STORAGE_KEY);
    if (saved && /^\d{6}$/.test(saved)) {
      /* eslint-disable react-hooks/set-state-in-effect -- hydrate PIN from localStorage after mount */
      setShippingAddress((prev) =>
        prev.postalCode ? prev : { ...prev, postalCode: saved },
      );
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, []);

  // PIN → city/state autofill
  useEffect(() => {
    const pc = shippingAddress.postalCode?.replace(/\D/g, '').slice(0, 6) ?? '';
    /* eslint-disable react-hooks/set-state-in-effect -- PIN lookup side effect */
    setPinNotFound(false);
    if (pc.length !== 6 || !validatePinCode(pc)) return;

    let cancelled = false;
    setPinLookupLoading(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    fetch(`/api/delivery-estimate?pincode=${encodeURIComponent(pc)}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (cancelled) return;
          setPinNotFound(true);
          // Drop values we auto-filled from a previous PIN; keep anything the user typed
          const prevAuto = autoFilled.current;
          setShippingAddress((prev) => ({
            ...prev,
            city: prev.city === prevAuto.city ? '' : prev.city,
            state: prev.state === prevAuto.state ? '' : prev.state,
          }));
          autoFilled.current = { city: '', state: '' };
          return;
        }
        if (!res.ok) return;
        const data = (await res.json()) as { district?: string; state?: string };
        if (cancelled) return;
        const city = data.district && data.district !== '—' ? data.district : '';
        const state = normalizeState(data.state);
        const prevAuto = autoFilled.current;
        setShippingAddress((prev) => ({
          ...prev,
          city: city && (!prev.city?.trim() || prev.city === prevAuto.city) ? city : prev.city,
          state: state || prev.state,
        }));
        autoFilled.current = { city, state };
        if (typeof window !== 'undefined') localStorage.setItem(PINCODE_STORAGE_KEY, pc);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPinLookupLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shippingAddress.postalCode]);

  const computeErrors = () => {
    const newErrors: Record<string, string> = {};

    if (!email?.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Enter a valid email address';

    if (!shippingAddress.fullName?.trim()) newErrors.shipping_fullName = 'Full name is required';
    if (!shippingAddress.phone?.trim()) newErrors.shipping_phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone))
      newErrors.shipping_phone = 'Enter a valid 10-digit mobile number';
    if (!shippingAddress.addressLine1?.trim())
      newErrors.shipping_addressLine1 = 'Address is required';
    if (!shippingAddress.city?.trim()) newErrors.shipping_city = 'City is required';
    if (!shippingAddress.state?.trim()) newErrors.shipping_state = 'State is required';
    if (!shippingAddress.postalCode?.trim()) newErrors.shipping_postalCode = 'PIN code is required';
    else if (!validatePinCode(shippingAddress.postalCode))
      newErrors.shipping_postalCode = 'Invalid PIN code';
    else if (pinNotFound)
      newErrors.shipping_postalCode = "We couldn't find this PIN code. Please check it.";

    if (!sameAsShipping) {
      if (!billingAddress.fullName?.trim()) newErrors.billing_fullName = 'Full name is required';
      if (!billingAddress.phone?.trim()) newErrors.billing_phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(billingAddress.phone))
        newErrors.billing_phone = 'Invalid phone number';
      if (!billingAddress.addressLine1?.trim())
        newErrors.billing_addressLine1 = 'Address is required';
      if (!billingAddress.city?.trim()) newErrors.billing_city = 'City is required';
      if (!billingAddress.state?.trim()) newErrors.billing_state = 'State is required';
      if (!billingAddress.postalCode?.trim()) newErrors.billing_postalCode = 'PIN code is required';
      else if (!validatePinCode(billingAddress.postalCode))
        newErrors.billing_postalCode = 'Invalid PIN code';
    }

    return newErrors;
  };

  // Errors are shown only after the first submit, then stay in sync with what the user types
  const errors = submitAttempted ? computeErrors() : {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (Object.keys(computeErrors()).length === 0) {
      const finalBillingAddress = sameAsShipping
        ? { ...shippingAddress, type: 'billing' as const }
        : billingAddress;
      onSubmit(
        shippingAddress as Address,
        finalBillingAddress as Address,
        sameAsShipping,
        email.trim(),
      );
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
      hasError ? 'border-red-400' : 'border-gray-200'
    }`;

  const shippingSummary = (
    <div className="rounded-2xl border-2 border-[#D32F2F]/30 bg-red-50/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#D32F2F]" aria-hidden />
          <div>
            <p className="font-bold text-gray-900">{shippingAddress.fullName}</p>
            <p className="mt-1 text-sm text-gray-700">
              {shippingAddress.addressLine1}
              {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}
            </p>
            <p className="text-sm text-gray-600">
              {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.postalCode}
            </p>
            <p className="mt-1 text-sm text-gray-500">+91 {shippingAddress.phone}</p>
            <p className="mt-1 text-sm text-gray-500">{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpressMode(false)}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#D32F2F] hover:underline"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Change
        </button>
      </div>
      <CheckoutDeliveryHint pincode={shippingAddress.postalCode} />
    </div>
  );

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-6">
      {user && savedAddresses.filter((a) => a.type === 'shipping').length > 0 && !expressMode && (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
            Saved addresses
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {savedAddresses
              .filter((a) => a.type === 'shipping')
              .map((addr) => {
                const isSelected =
                  shippingAddress.fullName === addr.full_name &&
                  shippingAddress.addressLine1 === addr.address_line1 &&
                  shippingAddress.postalCode === addr.postal_code;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => {
                      applyAddress(addr, 'shipping');
                      setExpressMode(true);
                    }}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      isSelected
                        ? 'border-[#D32F2F] bg-red-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">{addr.full_name}</p>
                    <p className="mt-1 text-xs text-gray-600">{addr.address_line1}</p>
                    <p className="text-xs text-gray-600">
                      {addr.city}, {addr.state} – {addr.postal_code}
                    </p>
                    {addr.is_default && (
                      <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#D32F2F]">
                        Default
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {loadingAddresses && (
        <p className="text-sm text-gray-500 animate-pulse">Loading saved addresses…</p>
      )}

      {expressMode ? (
        shippingSummary
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-1 text-xl font-bold text-gray-900">Delivery details</h2>
          <p className="mb-5 text-sm text-gray-500">Fresh masalas, packed in Jaipur</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor={`${fid}-email`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id={`${fid}-email`}
                type="email"
                aria-invalid={!!errors.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(!!errors.email)}
                placeholder="you@email.com"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor={`${fid}-name`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                Full name <span className="text-red-600">*</span>
              </label>
              <input
                id={`${fid}-name`}
                type="text"
                aria-invalid={!!errors.shipping_fullName}
                value={shippingAddress.fullName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                }
                className={inputClass(!!errors.shipping_fullName)}
                placeholder="Name on the package"
                autoComplete="name"
              />
              {errors.shipping_fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor={`${fid}-phone`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                Mobile <span className="text-red-600">*</span>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#D32F2F]">
                <span className="flex items-center bg-gray-50 px-3 text-sm font-semibold text-gray-600 border-r border-gray-200">
                  +91
                </span>
                <input
                  id={`${fid}-phone`}
                  type="tel"
                  aria-invalid={!!errors.shipping_phone}
                  inputMode="numeric"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: normalizePhone(e.target.value),
                    })
                  }
                  className={`flex-1 px-3 py-2.5 text-sm focus:outline-none ${
                    errors.shipping_phone ? 'bg-red-50' : ''
                  }`}
                  placeholder="10-digit number"
                  autoComplete="tel-national"
                  maxLength={10}
                />
              </div>
              {errors.shipping_phone && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor={`${fid}-line1`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                House / flat / building <span className="text-red-600">*</span>
              </label>
              <input
                id={`${fid}-line1`}
                type="text"
                aria-invalid={!!errors.shipping_addressLine1}
                value={shippingAddress.addressLine1}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                }
                className={inputClass(!!errors.shipping_addressLine1)}
                placeholder="House no., building name"
                autoComplete="address-line1"
              />
              {errors.shipping_addressLine1 && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_addressLine1}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor={`${fid}-line2`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                Road / area / landmark
              </label>
              <input
                id={`${fid}-line2`}
                type="text"
                value={shippingAddress.addressLine2}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                }
                className={inputClass(false)}
                placeholder="Colony, landmark (optional)"
                autoComplete="address-line2"
              />
            </div>

            <div>
              <label htmlFor={`${fid}-pin`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                PIN code <span className="text-red-600">*</span>
              </label>
              <input
                id={`${fid}-pin`}
                type="text"
                aria-invalid={!!errors.shipping_postalCode || pinNotFound}
                inputMode="numeric"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                  })
                }
                className={inputClass(!!errors.shipping_postalCode)}
                placeholder="6-digit PIN"
                autoComplete="postal-code"
                maxLength={6}
              />
              {pinLookupLoading && (
                <p className="mt-1 text-xs text-gray-500">Looking up your area…</p>
              )}
              {errors.shipping_postalCode ? (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_postalCode}</p>
              ) : (
                pinNotFound && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    We couldn&apos;t find this PIN code. Please check it.
                  </p>
                )
              )}
              <CheckoutDeliveryHint pincode={shippingAddress.postalCode} />
            </div>

            <div>
              <label htmlFor={`${fid}-city`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                City <span className="text-red-600">*</span>
              </label>
              <input
                id={`${fid}-city`}
                type="text"
                aria-invalid={!!errors.shipping_city}
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className={inputClass(!!errors.shipping_city)}
                placeholder="City"
                autoComplete="address-level2"
              />
              {errors.shipping_city && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_city}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor={`${fid}-state`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                State <span className="text-red-600">*</span>
              </label>
              <select
                id={`${fid}-state`}
                aria-invalid={!!errors.shipping_state}
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className={inputClass(!!errors.shipping_state)}
                autoComplete="address-level1"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.shipping_state && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_state}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#D32F2F] focus:ring-[#D32F2F]"
          />
          Billing address same as delivery address
        </label>
      </div>

      {!sameAsShipping && (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Billing address</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor={`${fid}-bname`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                Full name <span className="text-red-600">*</span>
              </label>
              <input
                id={`${fid}-bname`}
                type="text"
                value={billingAddress.fullName}
                onChange={(e) =>
                  setBillingAddress({ ...billingAddress, fullName: e.target.value })
                }
                className={inputClass(!!errors.billing_fullName)}
              />
              {errors.billing_fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.billing_fullName}</p>
              )}
            </div>
            <div>
              <label htmlFor={`${fid}-bphone`} className="mb-1.5 block text-sm font-semibold text-gray-700">
                Mobile <span className="text-red-600">*</span>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-200">
                <span className="flex items-center bg-gray-50 px-3 text-sm font-semibold text-gray-600 border-r border-gray-200">
                  +91
                </span>
                <input
                  id={`${fid}-bphone`}
                  type="tel"
                  inputMode="numeric"
                  value={billingAddress.phone}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      phone: normalizePhone(e.target.value),
                    })
                  }
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                  maxLength={10}
                />
              </div>
              {errors.billing_phone && (
                <p className="mt-1 text-xs text-red-600">{errors.billing_phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="hidden items-center justify-between border-t border-orange-100 pt-6 lg:flex">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-300"
        >
          Back to cart
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-[#D32F2F] px-8 py-3 font-bold text-white shadow-lg transition hover:bg-[#B71C1C]"
        >
          {expressMode ? 'Deliver here · Continue' : 'Continue to payment'}
        </button>
      </div>
    </form>
  );
};
