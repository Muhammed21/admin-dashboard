import { useEffect, useState } from "react";
import { Typographie } from "../typographie/typographie";
import { Input } from "../input/input";
import { TbAlertSquareRounded } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import { PrismaClient } from "@prisma/client";
import { Register } from "../register/register";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";

const prisma = new PrismaClient();

interface Order {
  id: number;
  email: string;
  password: string;
  name: string;
}

export const AdminTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/user/user");
        const data = await response.json();

        const formattedData = data.map((order: any) => ({
          id: order.id,
          date: new Date(order.createdAt).toLocaleDateString(),
          name: order.name,
          email: order.email,
          password: order.password,
        }));
        setOrders(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleRegister = () => {
    setIsRegisterVisible(!isRegisterVisible);
  };

  const deleteUser = async (email: string) => {
    try {
      const response = await fetch(`/api/user/${email}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.email !== email)
        );
      } else {
        console.error("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (orders.length === 0)
    return (
      <div className="w-full h-full grid place-content-center">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <TbAlertSquareRounded size={20} color="gray" />
          <Typographie size="h2" balise="h2" theme="gray">
            Aucun admin enregistrée
          </Typographie>
        </div>
      </div>
    );

  return (
    <div className="p-3 w-full">
      <div className="flex flex-col gap-1 w-full h-max bg-bg-filed border border-white/5 rounded-lg py-5">
        <div className="flex flex-col gap-4 w-full">
          <Typographie balise="h1" theme="white" className="pl-5 text-[18px]">
            Admins
          </Typographie>
          <hr className="border-none bg-white/5 h-[1px]" />
          <Register
            className={`transition-opacity duration-250 ${
              isRegisterVisible
                ? "opacity-1"
                : "opacity-0 h-0 pointer-events-none"
            }`}
          ></Register>
          {isRegisterVisible && (
            <hr className="border-none bg-white/5 h-[1px]" />
          )}
        </div>
        <table className="border-collapse table-auto w-full text-sm">
          <thead className="bg-bg-filed">
            <tr>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                Admins
              </td>
              <td className="border-b border-white/5 p-4 py-3 text-[#dfdfeb] text-h2 text-left">
                Name
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
                Email
              </td>
              <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
                Password
              </td>
              <td className="flex justify-end items-center pr-5 w-full h-8">
                <button
                  onClick={toggleRegister}
                  className="bg-white/5 hover:bg-white/10 transition-all ease-in-out delay-75 menuLink rounded-md p-1 text-h2"
                >
                  {isRegisterVisible ? (
                    <IoRemoveOutline size={18} />
                  ) : (
                    <IoAddOutline size={18} />
                  )}
                </button>
              </td>
            </tr>
          </thead>
          <tbody className="bg-bg-filed">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer transition ease-in-out delay-100"
              >
                <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                  #{order.id}
                </td>
                <td className="border-b border-white/5 p-4 text-[#A1A1AA] text-h2">
                  {order.name}
                </td>
                <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                  {order.email}
                </td>
                <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                  <div className="flex gap-2 justify-start items-center">
                    <Image
                      src="/Beta-Badge.svg"
                      alt=""
                      width={53}
                      height={20}
                    />
                    {order.password}
                  </div>
                </td>
                <td className="border-y border-white/5 p-4 pr-5 text-right">
                  <button
                    className="bg-white/5 hover:bg-white/10 transition-all ease-in-out delay-75 menuLink rounded-md py-2 px-2 text-h2"
                    onClick={() => deleteUser(order.email)}
                  >
                    Delete admin
                  </button>
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
