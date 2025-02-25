import { useEffect, useState } from "react";
import { Typographie } from "../typographie/typographie";
import { Input } from "../input/input";
import { TbAlertSquareRounded, TbArrowBackUp } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { router } from "next/client";
import { Avatar } from "@/components/avatar/avatar";
import { FulfilledBtn } from "../button/fulfilledBtn";

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerDetail {
  id: number;
  email: string;
  name: string;
  adress: string;
  postal: number;
  city: string;
}

interface Customer {
  id: number;
  date: string;
  customer: string;
  email: string;
  payment: string;
  fulfillment: string;
  total: string;
  customerDetail: CustomerDetail;
  items: Item[];
}

interface APIcustomer {
  id: number;
  createdAt: string;
  customerName: string;
  email: string;
  payment: string;
  fulfillment: string;
  total: string;
  customer: {
    id: number;
    email: string;
    name: string;
    adress: string;
    postal: number;
    city: string;
  };
  items: {
    item: {
      id: number;
      name: string;
      price: number;
      quantity: number;
    };
  }[];
}

export const OrderTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const baseURL = `${window.location.protocol}//${window.location.host}`;

  const orderIdPage = (orderID: number) => {
    const newUrl = `${baseURL}/dashboard/dashboard?id=${orderID}`;
    window.history.pushState({ orderID }, "", newUrl);
    setSelectedOrderId(orderID);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order/order");
      const data: APIcustomer[] = await response.json();

      const formattedData: Customer[] = data.map((customer) => ({
        id: customer.id,
        date: new Date(customer.createdAt).toLocaleDateString(),
        customer: customer.customerName,
        email: customer.email,
        payment: customer.payment,
        fulfillment: customer.fulfillment,
        total: `€ ${customer.total} EUR`,
        customerDetail: {
          id: customer.customer.id,
          email: customer.customer.email,
          name: customer.customer.name,
          adress: customer.customer.adress,
          postal: customer.customer.postal,
          city: customer.customer.city,
        },
        items: customer.items.map((item) => ({
          id: item.item.id,
          name: item.item.name,
          price: item.item.price,
          quantity: item.item.quantity,
        })),
      }));

      setCustomers(formattedData);
      console.log(formattedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  if (selectedOrderId !== null) {
    const selectedOrder = customers.find(
      (customer) => customer.id === selectedOrderId
    );

    if (!selectedOrder) {
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
    }

    return (
      <div className="flex flex-col gap-3 p-3 w-full h-max">
        <button
          onClick={() => router.push("/")}
          className="flex w-max h-max items-center gap-1.5 transition-all duration-200 ease-in-out hover:text-gray"
        >
          <TbArrowBackUp />
          <Typographie size="h2" balise="h2">
            Back
          </Typographie>
        </button>
        <div className="flex flex-row items-center justify-between w-full h-max bg-bg-filed rounded-lg border border-white/5 p-5">
          <div className="flex flex-col gap-2">
            <Typographie size="h2" balise="h2" weight="semibold">
              #{selectedOrder.id}
            </Typographie>
            <Typographie
              size="h3"
              balise="h3"
              theme="muted-gray"
              weight="medium"
            >
              {selectedOrder.date} from Default Sales Channel
            </Typographie>
          </div>
          <div className="bg-black/15 py-[2.5px] h-max w-max px-1.5 border border-black/20 rounded-md flex gap-2 justify-start items-center">
            {selectedOrder.fulfillment === "Fulfilled" ? (
              <div className="w-[9px] h-[9px] rounded-sm border border-[#379374] bg-[#10B981]"></div>
            ) : (
              <div className="w-[9px] h-[9px] rounded-sm border border-[#f76178] bg-[#FB7185]"></div>
            )}
            <Typographie size="h3" balise="h3" theme="muted-gray">
              {selectedOrder.fulfillment}
            </Typographie>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full h-max bg-bg-filed rounded-lg border border-white/5 py-5">
          <Typographie size="h2" balise="h2" weight="semibold" className="pl-5">
            Summary
          </Typographie>
          <hr className="border-none bg-white/5 h-[1px]" />
          {selectedOrder.items.map((item, index: number) => (
            <div
              key={item.id}
              className="flex w-full px-5 justify-between items-center h-max"
            >
              <div className="flex gap-4 w-full">
                <div className="w-8 h-8 bg-white/5 rounded-md"></div>
                <div className="flex flex-col gap-1.5 items-start justify-start">
                  <Typographie size="h2" balise="h2" weight="semibold">
                    Item {index + 1}
                  </Typographie>
                  <Typographie
                    size="h2"
                    balise="h2"
                    theme="muted-gray"
                    className="uppercase"
                  >
                    • {item.name}
                  </Typographie>
                </div>
              </div>
              <div className="flex gap-4 w-full justify-between items-center">
                <div className="w-max flex gap-4 items-center">
                  <Typographie size="h2" balise="h2" theme="muted-gray">
                    {Number.isInteger(item.price)
                      ? item.price + ".00"
                      : item.price.toFixed(0)}{" "}
                    €
                  </Typographie>
                  <Typographie size="h2" balise="h2" theme="muted-gray">
                    {item.quantity}x
                  </Typographie>
                  <div className="bg-black/15 py-[2.5px] px-1.5 border border-black/20 rounded-md flex gap-2 justify-start items-center">
                    {selectedOrder.payment === "Captured" ? (
                      <div className="w-[9px] h-[9px] rounded-sm border border-[#379374] bg-[#10B981]"></div>
                    ) : (
                      <div className="w-[9px] h-[9px] rounded-sm border border-[#f76178] bg-[#FB7185]"></div>
                    )}
                    <Typographie size="h3" balise="h3" theme="muted-gray">
                      {selectedOrder.payment}
                    </Typographie>
                  </div>
                </div>
                <Typographie size="h2" balise="h2" theme="muted-gray">
                  {Number.isInteger(item.price)
                    ? item.price * item.quantity + ".00"
                    : item.price * item.quantity}{" "}
                  €
                </Typographie>
              </div>
            </div>
          ))}
          <hr className="border-none bg-white/5 h-[1px]" />
          <div className="flex w-full px-5 items-center justify-between">
            <Typographie
              size="h2"
              balise="h2"
              theme="gray"
              weight="medium"
              className="flex gap-2"
            >
              <TbArrowBackUp className="rotate-180" size={14} /> Order Total
            </Typographie>
            <Typographie size="h2" balise="h2" theme="gray" weight="regular">
              {selectedOrder.total}
            </Typographie>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full h-max bg-bg-filed rounded-lg border border-white/5 py-5">
          <Typographie size="h2" balise="h2" weight="semibold" className="pl-5">
            Customer
          </Typographie>
          <div className="flex flex-col h-max w-full">
            <div className="flex py-2 px-4 items-center justify-between w-full h-max border-y border-white/5">
              <Typographie size="h2" balise="h2" weight="medium" theme="gray">
                ID
              </Typographie>
              <Typographie
                size="h2"
                balise="h2"
                weight="regular"
                theme="muted-gray"
                className="flex items-center gap-2"
              >
                <Avatar
                  variant="cercle"
                  size={30}
                  placeholder={selectedOrder.customer.charAt(0)}
                />
                {selectedOrder.customer}
              </Typographie>
            </div>
            <div className="flex p-4 items-center justify-between w-full h-max border-b border-white/5">
              <Typographie size="h2" balise="h2" weight="medium" theme="gray">
                Contact
              </Typographie>
              <Typographie
                size="h2"
                balise="h2"
                weight="regular"
                theme="muted-gray"
              >
                {selectedOrder.customerDetail.email}
              </Typographie>
            </div>
            <div className="flex p-4 items-start justify-between w-full h-max border-b border-white/5">
              <Typographie size="h2" balise="h2" weight="medium" theme="gray">
                Shipping address
              </Typographie>
              <div className="flex flex-col gap-2 items-end">
                <Typographie
                  size="h2"
                  balise="h2"
                  weight="regular"
                  theme="muted-gray"
                >
                  {selectedOrder.customerDetail.adress}
                </Typographie>
                <Typographie
                  size="h2"
                  balise="h2"
                  weight="regular"
                  theme="muted-gray"
                >
                  {selectedOrder.customerDetail.city}
                </Typographie>
                <Typographie
                  size="h2"
                  balise="h2"
                  weight="regular"
                  theme="muted-gray"
                >
                  {selectedOrder.customerDetail.postal}
                </Typographie>
              </div>
            </div>
            {selectedOrder.fulfillment === "Not fulfilled" && (
              <FulfilledBtn
                id={selectedOrder.id}
                onFulfilled={fetchOrders}
                email={selectedOrder.customerDetail.email}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

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
                onClick={() => orderIdPage(order.id)}
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
