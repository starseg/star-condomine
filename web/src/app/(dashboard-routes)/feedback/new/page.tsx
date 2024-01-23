import { FeedbackForm } from "@/components/feedback/feedbackForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
};

export default function Feedback() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 text-center">Feedback</h1>
        <p className="text-base mt-2 mb-4 text-center">
          Sua opinião é importante, deixe aqui sua mensagem <br />
          que avaliaremos assim que possível.
        </p>
        <FeedbackForm />
      </section>
    </>
  );
}
