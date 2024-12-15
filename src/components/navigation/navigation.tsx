import { useRouter } from "next/router";
import { Avatar } from "../avatar/avatar";
import { MenuLink } from "../menu-link/menuLink";
import { Typographie } from "../typographie/typographie";
import { MdLogout } from "react-icons/md";

interface Props {
  userName: React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const Navigation = ({
  userName,
  activeIndex,
  setActiveIndex,
}: Props) => {
  const router = useRouter();
  let primaryLetter = "";
  if (typeof userName === "string" && userName.length > 0) {
    primaryLetter = userName.charAt(0);
  }
  const logout = () => {
    localStorage.clear();
    router.push("/");
  };
  return (
    <div className="flex flex-col justify-between gap-3 p-3 bg-[#18181B] border-r border-white/5 w-max h-screen">
      <div className="flex gap-2.5 items-center justify-start w-full">
        <Avatar variant="square" size={36} placeholder="C"></Avatar>
        <Typographie size="h2" balise="h2" theme="white" weight="medium">
          Cheap Store
        </Typographie>
      </div>

      <div className="flex flex-col w-full h-full gap-2 pt-4 border-t border-white/5 border-dashed">
        <MenuLink
          kbd={true}
          icon="commandes"
          kbdText="x"
          isActive={activeIndex === 0}
          onClick={() => setActiveIndex(0)}
        >
          Orders
        </MenuLink>
        <MenuLink
          kbd={true}
          icon="produits"
          kbdText="⌘"
          isActive={activeIndex === 1}
          onClick={() => setActiveIndex(1)}
        >
          Produits
        </MenuLink>
        <MenuLink
          kbd={false}
          icon="clients"
          isActive={activeIndex === 2}
          onClick={() => setActiveIndex(2)}
        >
          Clients
        </MenuLink>
        <MenuLink
          kbd={false}
          icon="promotions"
          isActive={activeIndex === 3}
          onClick={() => setActiveIndex(3)}
        >
          Promotions
        </MenuLink>
        <MenuLink
          kbd={false}
          icon="secure"
          isActive={activeIndex === 4}
          onClick={() => setActiveIndex(4)}
        >
          Admin
        </MenuLink>
      </div>

      <div className="flex items-center justify-between w-full pt-4 border-t border-white/5 border-dashed">
        <div className="flex justify-start gap-2.5 items-center">
          <Avatar
            variant="cercle"
            size={36}
            placeholder={primaryLetter}
          ></Avatar>
          <Typographie size="h2" balise="h2" theme="white" weight="medium">
            {userName}
          </Typographie>
        </div>
        <button onClick={logout}>
          <MdLogout className="rotate-180 hover:opacity-70 transition-all ease-in-out duration-200" size={20} color="gray" />
        </button>
      </div>
    </div>
  );
};
