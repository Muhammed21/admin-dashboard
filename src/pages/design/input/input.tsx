import { IoEyeOutline } from "react-icons/io5";

interface Props {
  type?: "text" | "password" | "email" | "number";
  children: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = ({ type = "text", children, onChange }: Props) => {
  const placeholder = String(children);
  return (
    <div className="max-w-72 w-full">
      {type === "text" || "email" ? (
        <input
          className="input bg-bg-filed border-[1.5px] w-full border-white/5 px-2.5 py-2 rounded-md text-h2"
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          id=""
          name=""
          required
        ></input>
      ) : (
        <div className="input flex w-full h-max rounded-md">
          <input
            className="pass bg-bg-filed border-y-[1.5px] border-l-[1.5px] w-full h-max border-white/5 px-2.5 py-2 text-h2 rounded-s-md"
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            id=""
            name=""
            required
          ></input>
          <button className="grid place-content-center bg-bg-filed px-2.5 py-1 w-max rounded-e-md border-[1.5px] border-white/5">
            <IoEyeOutline size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
