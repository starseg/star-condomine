import { FilePlus, FileSearch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface ActionButtonProps {
  url: string;
}

export default function ActionButton(
  props: ActionButtonProps,
  children: React.ReactNode
) {
  return (
    <Link
      href={`${props.url}`}
      className="w-56 flex gap-2 items-center text-3xl p-4 border border-stone-50 rounded-md hover:bg-stone-850 transition-colors"
    >
      {children}
    </Link>
  );
}
