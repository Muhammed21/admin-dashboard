import clsx from "clsx";
import { Typographie } from "../typographie/typographie";
import { Icon } from "../icons/icon";

interface Props {
  kbd?: boolean;
  icon: "commandes" | "produits" | "clients" | "promotions" | "secure";
  kbdText?: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export const MenuLink = ({
  kbd,
  icon,
  kbdText,
  isActive,
  onClick,
  children,
}: Props) => {
  const activeTheme = isActive ? "menuLink bg-bg-filed" : "";
  const activeTextTheme = isActive ? "white" : "gray";

  return (
    <div
      className={clsx(
        activeTheme,
        "flex hover:bg-bg-filed/80 transition-all ease-in-out delay-[10ms] py-1 px-2 items-center justify-start gap-3 rounded-md h-max w-56 cursor-pointer"
      )}
      onClick={onClick}
    >
      {kbd ? (
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-3 w-full items-center justify-start">
            <Icon icon={icon} size={18} color={activeTextTheme}></Icon>
            <Typographie
              size="h2"
              balise="h2"
              theme={activeTextTheme}
              weight="medium"
              className="leading-normal"
            >
              {children}
            </Typographie>
          </div>
          <Typographie
            size="h3"
            balise="h2"
            theme="gray"
            weight="semibold"
            className="flex items-center justify-center leading-5 min-w-4 w-max h-4 p-1 rounded menuLink uppercase"
          >
            {kbdText}
          </Typographie>
        </div>
      ) : (
        <div className="flex gap-3 w-full items-center justify-start">
          <Icon icon={icon} size={18} color={activeTextTheme}></Icon>
          <Typographie
            size="h2"
            balise="h2"
            theme={activeTextTheme}
            weight="medium"
            className="leading-normal"
          >
            {children}
          </Typographie>
        </div>
      )}
    </div>
  );
};
