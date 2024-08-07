import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900">
      <div className="flex flex-col items-center justify-center py-8 text-white">
        <p>&copy; {new Date().getFullYear()} Select Prep. All rights reserved.</p>
        <p className="mt-2">Made with ❤️ in Melbourne</p>
        <p className="mt-1">Burnside Heights, VIC</p>
        {/* <div className="mt-4">
          <Link
            href="/privacy"
            className="text-white transition duration-150 ease-in-out hover:text-zinc-200 mr-4"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
          >
            Terms of Use
          </Link>
        </div> */}
      </div>
    </footer>
  );
}