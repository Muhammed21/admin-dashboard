import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../../components/container/container";
import { Navigation } from "../../components/navigation/navigation";
import { TopBar } from "../../components/topbar/topBar";
import { OrderTable } from "@/components/orderTable/orderTable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Typographie } from "../../components/typographie/typographie";
import { CustomerTable } from "@/components/customer/customerTable";
import { AdminTable } from "@/components/admin/adminTable";
import { ProductTable } from "@/components/product/productTable";
import { PromotionTable } from "@/components/promotion/promotionTable";
import isNotExpired from "@/pages/api/auth/isNotExpired";

type User = {
  id: number;
  email: string;
  name: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            router.push("/");
          }
        })
        .catch(() => router.push("/"));
    }
  }, [router]);

  isNotExpired();

  if (!user)
    return (
      <div className="w-full h-screen grid place-content-center">
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

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <div className="flex flex-col w-full ">
            <TopBar>Commandes</TopBar>
            <OrderTable></OrderTable>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col w-full">
            <TopBar>Produits</TopBar>
            <ProductTable></ProductTable>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col w-full">
            <TopBar>Clients</TopBar>
            <CustomerTable></CustomerTable>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col w-full">
            <TopBar>Promotions</TopBar>
            <PromotionTable></PromotionTable>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col w-full">
            <TopBar>Admin</TopBar>
            <AdminTable></AdminTable>
          </div>
        );
    }
  };

  return (
    <Container>
      <div className="flex">
        <Navigation
          userName={user.name}
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
        />

        <div className="flex w-full">{renderContent()}</div>
      </div>
    </Container>
  );
}
