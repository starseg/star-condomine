import { ReactNode } from "react";

interface MiniTableProps {
  title: string;
  cols: string[];
}

export default function MiniTable({
  title,
  cols,
  children,
}: MiniTableProps & { children?: ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col p-4 mt-4">
      <h2 className="text-xl text-center bg-stone-800 rounded-t border-b border-stone-700 py-1">
        {title}
      </h2>
      <div className="grid grid-cols-7 bg-stone-800 rounded-b py-1 px-4">
        {cols.map((col) => (
          <p key={Math.random()} className="col-span-2">
            {col}
          </p>
        ))}
        <p>Ações</p>
      </div>
      {children}
    </div>
  );
}
