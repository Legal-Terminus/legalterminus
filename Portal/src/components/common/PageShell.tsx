import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export default function PageShell({ title, children }: Props) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      {children}
    </div>
  );
}
