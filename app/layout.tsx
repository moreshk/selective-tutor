import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';

const title = 'Select Prep - Selective School Exam Preparation';
const description = 'Comprehensive preparation for selective school exams, covering Written Expression, Numerical Reasoning, Verbal Reasoning, and more.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    images: [
      {
        url: '/light-logo.png',
        width: 800,
        height: 600,
        alt: 'Select Prep Logo',
      },
    ],
  },
  icons: {
    icon: '/light-logo.png',
    shortcut: '/logo.png',
    apple: '/light-logo.png',
  },
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Navbar />
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        >
          {children}
        </main>
        <Footer />
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}