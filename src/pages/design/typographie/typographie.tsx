import localFont from "next/dist/compiled/@next/font/dist/local";
import { clsx } from "clsx";

interface Props {
  size?: "h1" | "h2" | "h3";
  balise?: "h1" | "h2" | "h3";
  theme?: "white" | "muted-gray" | "gray";
  fontFamily?: "inter";
  weight?: "regular" | "medium" | "semibold";
  className?: String;
  children: React.ReactNode;
}

export const Typographie = ({
  size = "h2",
  balise: Balise = "h2",
  theme,
  weight = "regular",
  className,
  children,
}: Props) => {
  let sizeStyle: String = "";
  let themeStyle: String = "";
  let weightStyle: String = "";

  switch (size) {
    case "h1":
      sizeStyle = "text-h1";
      break;
    case "h2":
      sizeStyle = "text-h2";
      break;
    case "h3":
      sizeStyle = "text-h3";
      break;
  }

  switch (theme) {
    case "white":
      themeStyle = "text-white";
      break;
    case "muted-gray":
      themeStyle = "text-mutedGray";
      break;
    case "gray":
      themeStyle = "text-gray";
      break;
  }

  switch (weight) {
    case "regular":
      weightStyle = "font-normal";
      break;
    case "medium":
      weightStyle = "font-medium";
      break;
    case "semibold":
      weightStyle = "font-semibold";
      break;
  }
  return (
    <Balise
      className={clsx(sizeStyle, className, themeStyle, weightStyle, "w-max")}
    >
      {children}
    </Balise>
  );
};
