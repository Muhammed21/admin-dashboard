import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Typographie } from "../typographie/typographie";
import { Input } from "../input/input";

interface PromotionTableProps {
  id: number;
  code: string;
  createdAt: string;
  expireAt: string;
}

export const PromotionTable = () => {
  const [promotion, setPromotion] = useState<PromotionTableProps[]>([]);
  const [search, setSearch] = useState<string>("");
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

  const filteredPromotion = promotion.filter((promotion) => {
    return promotion.code.toLowerCase().includes(search.toLowerCase());
  });

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
    <div className="p-3 w-full">
      <div className="flex flex-col gap-1 w-full h-max bg-bg-filed border border-white/5 rounded-lg py-5">
        <div className="flex flex-col gap-4 w-full">
          <Typographie balise="h1" theme="white" className="pl-5 text-[18px]">
            Promotions
          </Typographie>
          <hr className="border-none bg-white/5 h-[1px]" />
          <div className="pl-5">
            <Input
              type="text"
              value="Search a promotion"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <hr className="border-none bg-white/5 h-[1px]" />
        </div>
        <table className="border-collapse table-auto w-full text-sm">
          <thead className="bg-bg-filed">
            <tr>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                Promotions
              </td>
              <td className="border-b border-white/5 p-4 py-3 text-[#dfdfeb] text-h2 text-left">
                Created at
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
                Expire at
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-right">
                Code
              </td>
            </tr>
          </thead>
          <tbody className="bg-bg-filed">
            {filteredPromotion.map((promotion) => (
              <tr
                key={promotion.id}
                className="transition ease-in-out delay-100"
              >
                <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                  #{promotion.id}
                </td>
                <td className="border-b border-white/5 p-4 text-[#A1A1AA] text-h2">
                  {promotion.createdAt.slice(0, 10)}
                </td>
                <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                  {promotion.expireAt.slice(0, 10)}
                </td>
                <td className="border-b border-white/5 p-4 pr-8 text-[#A1A1AA] text-h2 text-right">
                  {promotion.code}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Typographie size="h2" balise="h2" theme="white" className="pl-5 pt-5">
          1 — {filteredPromotion.length} résultat(s)
        </Typographie>
      </div>
    </div>
  );
};
