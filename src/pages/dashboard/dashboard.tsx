import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../design/container/container";
import { Navigation } from "../design/navigation/navigation";
import { TopBar } from "../design/topbar/topBar";
import { CustomerTable } from "../design/customerTable/customerTable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Typographie } from "../design/typographie/typographie";
import { Register } from "../design/register/register";
import { AdminTable } from "../design/adminTable/adminTable";
import { ProductTable } from "../design/productTable/productTable";

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
            <CustomerTable></CustomerTable>
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
        return <TopBar>Clients</TopBar>;
      case 3:
        return <TopBar>Promotions</TopBar>;
      case 4:
        return (
          <div className="flex flex-col w-full">
            <TopBar>Admin</TopBar>
            <AdminTable></AdminTable>
          </div>
        );
      default:
        return <div>Bienvenue sur le tableau de bord</div>;
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
