import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
