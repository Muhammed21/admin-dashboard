import { useState } from "react";
import { Button } from "../button/button";
import { Input } from "../input/input";
import clsx from "clsx";

interface Props {
  className?: string;
}

export const Register = ({ className }: Props) => {
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        className,
        "flex items-center justify-between gap-4 px-5"
      )}
    >
      <Input
        type="text"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value="Name"
      ></Input>
      <Input
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        value="Email"
      ></Input>
      <Input
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        value="Password"
      ></Input>
      <Button size="base" type="submit">
        Add Admin
      </Button>
    </form>
  );
};
