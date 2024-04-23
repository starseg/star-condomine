interface Props {
  title: string;
  content: string | number;
}

export default function Card(props: Props) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center w-52">
      <p className="w-full text-xl text-center rounded-xl p-3 bg-stone-800">
        {props.title}
      </p>
      <p className="flex items-center justify-center text-6xl text-primary font-semibold rounded-xl w-full aspect-square bg-stone-800">
        {props.content}
      </p>
    </div>
  );
}
