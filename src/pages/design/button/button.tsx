import { clsx } from "clsx";
import { Typographie } from "../typographie/typographie";

interface Props {
  size: "small" | "base" | "large";
  isDisable?: false;
  type: "submit" | "reset" | "button";
  className?: String;
  children: React.ReactNode;
}

export const Button = ({
  size = "base",
  isDisable,
  children,
  type,
  className,
}: Props) => {
  return (
    <button
      type={type}
      disabled={isDisable}
      className={clsx(
        className,
        "flex items-center justify-center bg-[#52525B] input px-2 py-2 border border-mutedGray rounded-md h-max"
      )}
    >
      <Typographie size="h2" balise="h2" theme="gray" weight="medium">
        {children}
      </Typographie>
    </button>
  );
};
