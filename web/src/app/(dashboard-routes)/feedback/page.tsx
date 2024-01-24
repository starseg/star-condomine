import FeedbackList from "@/components/feedback/feedbackList";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedbacks",
};

export default function Feedbacks() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl mt-2 mb-4 text-center">Feedbacks</h1>
        <FeedbackList />
      </section>
    </>
  );
}
