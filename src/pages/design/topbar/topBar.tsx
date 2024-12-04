import Image from "next/image";
import { Typographie } from "../typographie/typographie";

interface Props {
  children: React.ReactNode;
}

export const TopBar = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-between bg-[#18181B] border-b border-white/5 w-full h-max px-4 py-5">
      <div className="flex w-max h-max gap-2.5 items-center justify-start">
        <Image src="/leftBar-icon.svg" alt="" width={16} height={16} />
        <Typographie
          balise="h2"
          weight="medium"
          className="text-[#71717A] text-[14px]"
        >
          {children}
        </Typographie>
      </div>
      <div className="flex w-max h-max gap-2 items-center justify-start">
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-darkgreen opacity-75 items-center justify-center"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-darkgreen"></span>
        </span>
        <Typographie
          size="h3"
          balise="h3"
          weight="medium"
          className="text-darkgreen"
        >
          Aucun problème détecté
        </Typographie>
      </div>
    </div>
  );
};
