import { clsx } from "clsx";

interface Props {
  variant: "square" | "cercle";
  size: 30 | 36 | 40 | 50;
  placeholder?: string;
}

export const Avatar = ({ variant, size = 36, placeholder }: Props) => {
  let sizeStyle: string = "";
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
        variant === "square" && "rounded-md",
        "border border-white/5 p-[3px]"
      )}
    >
      <div
        className={clsx(
          "grid place-content-center text-gray uppercase font-medium bg-white/10 w-full h-full",
          variant === "square" && "rounded-[3px]",
          variant === "cercle" && "rounded-full"
        )}
      >
        {placeholder}
      </div>
    </div>
  );
};
