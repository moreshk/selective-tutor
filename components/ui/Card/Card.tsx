import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-blue-200 bg-white">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium text-blue-900">{title}</h3>
        <p className="text-blue-700">{description}</p>
        {children}
      </div>
      {footer && (
        <div className="p-4 border-t rounded-b-md border-blue-200 bg-blue-50">
          {footer}
        </div>
      )}
    </div>
  );
}