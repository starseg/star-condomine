import Image from "next/image";

export default function LoadingIcon() {
  return (
    <Image
      src="/loading-gear.svg"
      alt="Carregando..."
      width={204}
      height={204}
      priority
    />
  );
}
