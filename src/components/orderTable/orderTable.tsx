import { useEffect, useState } from "react";
import { Typographie } from "../typographie/typographie";
import { Input } from "../input/input";
import { TbAlertSquareRounded } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Customer {
  id: number;
  date: string;
  customer: string;
  payment: string;
  fulfillment: string;
  total: string;
}

interface APIcustomer {
  id: number;
  createdAt: string;
  customerName: string;
  payment: string;
  fulfillment: string;
  total: string;
}

export const OrderTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order");
        const data: APIcustomer[] = await response.json();

        const formattedData: Customer[] = data.map((customer) => ({
          id: customer.id,
          date: new Date(customer.createdAt).toLocaleDateString(),
          customer: customer.customerName,
          payment: customer.payment,
          fulfillment: customer.fulfillment,
          total: `€ ${customer.total} EUR`,
        }));
        setCustomers(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = customers.filter((customer) =>
    customer.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (customers.length === 0)
    return (
      <div className="w-full h-full grid place-content-center">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <TbAlertSquareRounded size={20} color="gray" />
          <Typographie size="h2" balise="h2" theme="gray">
            Aucune commande enregistrée
          </Typographie>
        </div>
      </div>
    );

  return (
    <div className="p-3 w-full">
      <div className="flex flex-col gap-1 w-full h-max bg-bg-filed border border-white/5 rounded-lg py-5">
        <div className="flex flex-col gap-4 w-full">
          <Typographie balise="h1" theme="white" className="pl-5 text-[18px]">
            Orders
          </Typographie>
          <hr className="border-none bg-white/5 h-[1px]" />
          <div className="pl-5">
            <Input
              type="text"
              value="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <hr className="border-none bg-white/5 h-[1px]" />
        </div>
        <table className="border-collapse table-auto w-full text-sm">
          <thead className="bg-bg-filed">
            <tr>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                Orders
              </td>
              <td className="border-b border-white/5 p-4 py-3 text-[#dfdfeb] text-h2 text-left">
                Date
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
                Customer
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
                Payment
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
                Fulfillment
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-right">
                Order Total
              </td>
            </tr>
          </thead>
          <tbody className="bg-bg-filed">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer transition ease-in-out delay-100 hover:bg-white/10"
              >
                <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                  #{order.id}
                </td>
                <td className="border-b border-white/5 p-4 text-[#A1A1AA] text-h2">
                  {order.date}
                </td>
                <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                  {order.customer}
                </td>
                <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                  {order.payment === "Captured" && (
                    <div className="flex gap-2 justify-start items-center">
                      <div className="w-[9px] h-[9px] rounded-sm border border-[#379374] bg-[#10B981]"></div>
                      {order.payment}
                    </div>
                  )}
                  {order.payment === "Not captured" && (
                    <div className="flex gap-2 justify-start items-center">
                      <div className="w-[9px] h-[9px] rounded-sm border border-[#f76178] bg-[#FB7185]"></div>
                      {order.payment}
                    </div>
                  )}
                </td>
                <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                  {order.fulfillment === "Fulfilled" && (
                    <div className="flex gap-2 justify-start items-center">
                      <div className="w-[9px] h-[9px] rounded-sm border border-[#379374] bg-[#10B981]"></div>
                      {order.fulfillment}
                    </div>
                  )}
                  {order.fulfillment === "Not fulfilled" && (
                    <div className="flex gap-2 justify-start items-center">
                      <div className="w-[9px] h-[9px] rounded-sm border border-[#f76178] bg-[#FB7185]"></div>
                      {order.fulfillment}
                    </div>
                  )}
                </td>
                <td className="border-b border-white/5 p-4 pr-8 text-[#A1A1AA] text-h2 text-right">
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Typographie size="h2" balise="h2" theme="white" className="pl-5 pt-5">
          1 — {filteredOrders.length} résultat(s)
        </Typographie>
      </div>
    </div>
  );
};
