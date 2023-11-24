import { Smiley, SmileyMeh, SmileySad } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import clsx from 'clsx';

interface LobbyCardProps {
  href: String;
  title: String;
  type: String;
  status: number;
  ramais: String;
  location: String;
}

export default function LobbyCard(props: LobbyCardProps) {
  return (
    <Link
      href={`${props.href}`}
      className={clsx(
        "p-4 border rounded-md w-[30%] h-[170px] flex flex-col justify-between hover:bg-stone-850 transition-colors",
        {
          "border-green-500" : props.status === 0,
        },
        {
          "border-red-500" : props.status === 1,
        },
        {
          "border-yellow-500" : props.status === 2,
        }
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl">{props.title}</h2>
          <p>{props.type}</p>
        </div>
        <p>
          {props.status === 0 ? (
            <Smiley weight="fill" size={32} className="text-green-500" />
          ) : props.status === 1 ? (
            <SmileySad weight="fill" size={32} className="text-red-500" />
          ): (
            <SmileyMeh weight="fill" size={32} className="text-yellow-500" />
          )}
        </p>
      </div>
      <div className="flex justify-between items-end">
        <p>
          Ramais:
          <br />
          {props.ramais}
        </p>
        <p>{props.location}</p>
      </div>
    </Link>
  );
}
