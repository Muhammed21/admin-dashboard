import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button/button";
import { Avatar } from "../components/avatar/avatar";
import { Typographie } from "@/components/typographie/typographie";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard/dashboard");
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="overflow-hidden w-full h-screen flex flex-col items-center justify-center text-mutedGray gap-4">
      <div className="flex flex-col w-max h-max gap-4 items-center justify-center">
        <Avatar variant="square" size={50} />
        <div className="flex flex-col gap-2 items-center">
          <Typographie balise="h1" size="h1" theme="gray">
            Welcome to you Admin
          </Typographie>
          <Typographie balise="h3" size="h3" theme="muted-gray">
            Sign in to acces the account area
          </Typographie>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center h-max w-full gap-2.5"
        >
          <Input
            type="text"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            value="Email"
          ></Input>
          <Input
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            value="Password"
          ></Input>
          <Button type="submit" size="base" className="w-full">
            Continue with Email
          </Button>
        </form>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}
