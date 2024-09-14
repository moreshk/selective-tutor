'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NameForm({ userId }: { userId: string }) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();

    // Update the users table
    const { error: userError } = await supabase
      .from('users')
      .update({ full_name: name })
      .eq('id', userId);

    if (userError) {
      console.error('Error updating user:', userError);
      setIsSubmitting(false);
      return;
    }

    // Update the onboarding table
    const { error: onboardingError } = await supabase
  .from('onboarding')
  .upsert({ id: userId, completed: true, user_type: 'student' }, { onConflict: 'id' });

    if (onboardingError) {
      console.error('Error updating onboarding:', onboardingError);
    }

    setIsSubmitting(false);
    router.push('/account');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Your Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}