import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Typographie } from "../typographie/typographie";

interface PromotionTableProps {
  id?: number;
  code?: string;
  createdAt?: string;
  expireAt?: string;
}

export const PromotionTable = () => {
  const [promotion, setPromotion] = useState<PromotionTableProps[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await fetch("/api/promotion/promotion");
        const json: PromotionTableProps[] = await response.json();
        setPromotion(json);
      } catch (error) {
        console.error("Erreur lors de la récupération des promotions :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotion();
  }, []);

  if (isLoading)
    return (
      <div className="w-full h-full grid place-content-center">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <AiOutlineLoading3Quarters
            size={20}
            color="gray"
            className="animate-spin"
          />
          <Typographie size="h2" balise="h2" theme="gray">
            Chargement en cours
          </Typographie>
        </div>
      </div>
    );

  return (
    <div>
      {promotion.map((promo) => (
        <div key={promo.id}>{promo.code}</div>
      ))}
    </div>
  );
};
