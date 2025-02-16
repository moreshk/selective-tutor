import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Pricing from '@/components/ui/Pricing/Pricing';

import {
  getUserDetails,
  getSubscription,
  getUser,
  getProducts
} from '@/utils/supabase/queries';

export default async function Account() {
  const supabase = createClient();
  const [user, userDetails, subscription, products] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase),
    getProducts(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  const { data: onboarding } = await supabase
    .from('onboarding')
    .select('student_name')
    .eq('id', user.id)
    .single();

    return (
      <section className="mb-32 bg-white">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col">
            <h1 className="text-4xl font-extrabold text-blue-900 sm:text-center sm:text-6xl">
              Account
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl text-blue-700 sm:text-center sm:text-2xl">
              We partnered with Stripe for a simplified billing.
            </p>
          </div>
        </div>
        <div className="p-4">
          <CustomerPortalForm subscription={subscription} />
          <Pricing
            user={user}
            products={products ?? []}
            subscription={subscription}
          />
          <NameForm userName={userDetails?.full_name ?? ''} />
          <EmailForm userEmail={user.email} />
          
        </div>
      </section>
    );
  }