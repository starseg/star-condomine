interface ItemProps {
  label: string;
  content: string;
}

export default function DetailItem(props: ItemProps) {
  return (
    <div className="flex flex-col justify-center gap-2 mb-4">
      <label className="text-lg">{props.label}:</label>
      <p className="bg-muted text-muted-foreground rounded-md px-4 py-1">
        {props.content}
      </p>
    </div>
  );
}
