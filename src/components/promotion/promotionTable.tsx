import { useEffect, useState } from "react";

interface PromotionTableProps {
  id?: number;
  code?: string;
  createdAt?: string;
  expireAt?: string;
}

export const PromotionTable = () => {
  const [promotion, setPromotion] = useState<PromotionTableProps[]>([]);
  useEffect(() => {
    const fetchPromotion = async () => {
      const response = await fetch("/api/promotion/promotion");
      const json: PromotionTableProps[] = await response.json();
      setPromotion(json);
    };
    fetchPromotion();
  }, []);
  return (
    <div>
      {promotion.map((promo) => (
        <div key={promo.id}>{promo.code}</div>
      ))}
    </div>
  );
};
