import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-blue-900">
      <div className="flex flex-col items-center justify-center py-8 text-gray-100">
        <p>
          &copy; {new Date().getFullYear()} Select Prep. All rights reserved.
        </p>
        <p className="mt-2">Made with ❤️ in Melbourne</p>
        <p className="mt-1">Burnside Heights, VIC</p>
      </div>
    </footer>
  );
}