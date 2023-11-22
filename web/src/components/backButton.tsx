import Link from 'next/link';
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

interface BackButtonProps {
  url: String
}

const BackButton: React.FC<BackButtonProps> = (props) => {

  return (
    <Link href={`${props.url}`} className="absolute top-8 left-8 hover:scale-110 transition ease-in">
          <ArrowLeft size={"3rem"} />
        </Link>
  );
}

export default BackButton;
