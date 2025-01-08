import NavBar from "@/components/NavBar";

type Props = {
  children: React.ReactNode;
};

function Template({ children }: Props) {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
}

export default Template;
