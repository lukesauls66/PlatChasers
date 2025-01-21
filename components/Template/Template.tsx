import NavBar from "@/components/NavBar";
import Footer from "../Footer";

type Props = {
  children: React.ReactNode;
};

function Template({ children }: Props) {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Template;
