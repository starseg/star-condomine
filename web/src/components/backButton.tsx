"use client";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  function goBack() {
    router.back();
  }
  return (
    <button className="hover:scale-110 transition ease-in" onClick={goBack}>
      <ArrowLeft size={"2.5rem"} />
    </button>
  );
};

export default BackButton;
