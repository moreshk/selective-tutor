'use client';

import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Tables } from '@/types_db';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}
export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      console.log('Requesting Stripe portal...');
      const response = await createStripePortal('/account');
      console.log('Stripe portal response:', response);
      if (response.error) {
        setError(response.error);
      } else if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating Stripe portal:', err);
      setError(
        'Could not create billing portal. Please try again later or contact support.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
  title="Your Plan"
  description={
    subscription
      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
      : 'You are not currently subscribed to any plan.'
  }
  footer={
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0 text-blue-700">Manage your subscription on Stripe.</p>
      <Button
        variant="slim"
        onClick={handleStripePortalRequest}
        loading={isSubmitting}
        className="bg-blue-900 text-white hover:bg-blue-800"
      >
        Open customer portal
      </Button>
    </div>
  }
>
  {error && <p className="text-red-500 mb-4">{error}</p>}
  <div className="mt-8 mb-4 text-xl font-semibold text-blue-900">
    {subscription ? (
      `${subscriptionPrice}/${subscription?.prices?.interval}`
    ) : (
      <Link href="/" className="text-blue-600 hover:text-blue-800">Choose your plan</Link>
    )}
  </div>
</Card>
  );
}
