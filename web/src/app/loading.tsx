import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Image
      src="/loading-gear.svg"
      alt="Carregando..."
      width={204}
      height={204}
      priority={true}
    />
    </div>
  );
}
