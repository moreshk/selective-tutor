'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type BillingInterval = 'lifetime' | 'year' | 'month' | 'week' | 'day';

interface Price extends Omit<Tables<'prices'>, 'interval'> {
  interval: 'year' | 'month' | 'week' | 'day' | null;
}

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

function formatInterval(interval: BillingInterval): string {
  switch (interval) {
    case 'day':
      return 'Daily';
    case 'week':
      return 'Weekly';
    case 'month':
      return 'Monthly';
    case 'year':
      return 'Yearly';
    case 'lifetime':
      return 'Lifetime';
    default:
      return (interval as string).charAt(0).toUpperCase() + (interval as string).slice(1);
  }
}

export default function Pricing({ user, products, subscription }: Props) {
  console.log('Pricing component received products:', products);

  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  ) as BillingInterval[];
  console.log('Available intervals:', intervals);

  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(() => {
    if (intervals.includes('month')) return 'month';
    if (intervals.includes('year')) return 'year';
    return intervals[0] || 'month';
  });
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-white" id="pricing-plans">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-blue-900 sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-blue-600 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-blue-900 sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          {/* <div className="relative self-center mt-6 bg-blue-100 rounded-lg p-0.5 flex sm:mt-8 border border-blue-200">
            {intervals.map((interval) => (
              <button
                key={interval}
                onClick={() => setBillingInterval(interval)}
                type="button"
                className={`${
                  billingInterval === interval
                    ? 'relative w-1/2 bg-white border-blue-200 shadow-sm text-blue-900'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-blue-700'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                {formatInterval(interval)} billing
              </button>
            ))}
          </div> */}
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            ) || product?.prices?.[0];
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'flex flex-col rounded-lg shadow-lg overflow-hidden',
                  {
                    'border-4 border-blue-500 ring-2 ring-blue-500 ring-opacity-50': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Freelancer',
                    'border-2 border-blue-200': !(subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Freelancer')
                  }
                )}
              >
                <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                  <h3
                    className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 text-blue-600"
                    id="tier-standard"
                  >
                    {product.name}
                  </h3>
                  <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                    {priceString}
                    <span className="ml-1 text-2xl font-medium text-gray-500">
                      /{billingInterval}
                    </span>
                  </div>
                  <p className="mt-5 text-lg text-gray-500">{product.description}</p>
                </div>
                <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                  <ul className="space-y-4">
                    {/* Add feature list items here if needed */}
                  </ul>
                  <Button
                    variant="slim"
                    type="button"
                    disabled={!user}
                    loading={priceIdLoading === price.id}
                    onClick={() => handleStripeCheckout(price)}
                    className="w-full py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                  >
                    {subscription ? 'Manage' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}