import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import NameForm from '@/components/ui/OnboardingForms/NameForm';

export default async function Onboarding() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  // Check if the user has already completed onboarding
  const { data: onboardingData } = await supabase
    .from('onboarding')
    .select('completed')
    .eq('id', user.id)
    .single();

  if (onboardingData && onboardingData.completed) {
    return redirect('/account');
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome! Let's get started.</h1>
        <NameForm userId={user.id} />
      </div>
    </div>
  );
}