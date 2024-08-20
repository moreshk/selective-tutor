'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import { signInWithEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EmailSignInProps {
  allowPassword: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function EmailSignIn({
  allowPassword,
  redirectMethod,
  disableButton
}: EmailSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    await handleRequest(e, signInWithEmail, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8 bg-white text-blue-600">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email" className="text-blue-600">
              Email
            </label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-blue-800 text-white placeholder-blue-200"
            />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
            customClasses="bg-blue-900 text-white hover:bg-blue-900"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Sign in
          </Button>
        </div>
      </form>
      {allowPassword && (
        <>
          <p>
            <Link
              href="/signin/password_signin"
              className="font-light text-sm text-blue-600 hover:text-blue-800"
            >
              Sign in with email and password
            </Link>
          </p>
          <p>
            <Link
              href="/signin/signup"
              className="font-light text-sm text-blue-600 hover:text-blue-800"
            >
              Don't have an account? Sign up
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
