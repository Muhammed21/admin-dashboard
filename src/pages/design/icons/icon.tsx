import { HiOutlineShoppingCart } from "react-icons/hi";
import { PiTagBold } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";
import { RiDiscountPercentLine } from "react-icons/ri";
import { GrUserAdmin } from "react-icons/gr";

interface Props {
  icon: "commandes" | "produits" | "clients" | "promotions" | "secure";
  color: string;
  size: number;
}

export const Icon = ({ icon, color, size }: Props) => {
  switch (icon) {
    case "commandes":
      return <HiOutlineShoppingCart size={size} color={color} />;
    case "produits":
      return <PiTagBold size={size} color={color} />;
    case "clients":
      return <HiOutlineUsers size={size} color={color} />;
    case "promotions":
      return <RiDiscountPercentLine size={size} color={color} />;
    case "secure":
      return <GrUserAdmin size={size} color={color} />;
    default:
      return null;
  }
};
