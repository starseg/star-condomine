"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatTeardropDots } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function FeedbackButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="fixed bottom-8 right-8 w-16 h-16">
          <Link
            href={"/feedback/new"}
            className="fixed bottom-8 right-8 bg-primary aspect-square rounded-full p-2"
          >
            <ChatTeardropDots size={48} color="black" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Deixe um feedback</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
