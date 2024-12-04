interface Props {
  children: React.ReactNode;
}

export const Container = ({ children }: Props) => {
  return <section className=" m-0">{children}</section>;
};
