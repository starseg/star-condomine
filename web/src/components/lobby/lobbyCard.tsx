import { Smiley, SmileySad } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import clsx from "clsx";

interface LobbyCardProps {
  href: string;
  title: string;
  type: string;
  status: number;
  ramais: string;
  location: string;
  brand: string;
}

export default function LobbyCard(props: LobbyCardProps) {
  return (
    <Link
      href={`${props.href}`}
      className={clsx(
        "p-4 border rounded-md lg:w-[30%] md:w-[45%] w-full h-[220px] flex flex-col justify-between hover:bg-stone-850 transition-colors",
        { "border-green-500": props.status === 0 },
        { "border-red-500": props.status === 1 }
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl">{props.title}</h2>
          <p>{props.type}</p>
        </div>
        <p>
          {props.status === 0 ? (
            <Smiley weight="fill" size={32} className="text-green-500" />
          ) : props.status === 1 ? (
            <SmileySad weight="fill" size={32} className="text-red-500" />
          ) : (
            ""
          )}
        </p>
      </div>
      <div className="flex justify-between items-end">
        <p className="w-1/2">
          Ramais:
          <br />
          {props.ramais}
        </p>
        <div className="w-1/2 text-right text-sm flex flex-col items-end">
          {props.brand ? (
            <img
              src={props.brand}
              alt="Marca das controladoras"
              className="w-1/2 py-4"
            />
          ) : (
            ""
          )}
          {props.location}
        </div>
      </div>
    </Link>
  );
}
