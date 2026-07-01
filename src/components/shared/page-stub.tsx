import { type LucideIcon, Construction } from "lucide-react";

interface PageStubProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  phase?: number;
}

export function PageStub({ title, description, icon: Icon = Construction, phase }: PageStubProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 py-20 dark:border-zinc-700 dark:bg-zinc-900/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <Icon className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
          {title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Halaman ini akan diimplementasikan pada tahap berikutnya.
        </p>
        {phase && (
          <span className="mt-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            Tahap {phase}
          </span>
        )}
      </div>
    </div>
  );
}
