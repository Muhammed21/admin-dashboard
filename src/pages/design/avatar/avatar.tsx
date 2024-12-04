import { clsx } from "clsx";

interface Props {
  variant: "square" | "cercle";
  size: 30 | 36 | 40 | 50;
}

export const Avatar = ({ variant, size = 36 }: Props) => {
  let sizeStyle: String = "";
  switch (size) {
    case 30:
      sizeStyle = "w-[30px] h-[30px]";
      break;
    case 36:
      sizeStyle = "w-[36px] h-[36px]";
      break;
    case 40:
      sizeStyle = "w-[40px] h-[40px]";
      break;
    case 50:
      sizeStyle = "w-[50px] h-[50px]";
      break;
  }
  return (
    <div
      className={clsx(
        "bg-gray-200",
        sizeStyle,
        variant === "cercle" && "rounded-full",
        variant === "square" && "rounded-lg",
        "border border-white/5 p-[3px]"
      )}
    >
      <div
        className={clsx(
          "bg-bg-filed w-full h-full",
          variant === "square" && "rounded-md",
          variant === "cercle" && "rounded-full"
        )}
      ></div>
    </div>
  );
};
