import ActionButton from "../actionButton";

interface ActionSetProps {
  register: string;
  list: string;
}

export default function ActionSet(props: ActionSetProps) {
  return (
    <div className="flex gap-4">
      <ActionButton url={`${props.register}`} type="+" text="Registrar" />
      <ActionButton url={`${props.list}`} type="-" text="Listar" />
    </div>
  );
}
