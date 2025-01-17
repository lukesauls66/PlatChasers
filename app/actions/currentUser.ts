import { auth } from "@/auth";

export default async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error("Error getting session: ", error);
    return null;
  }
}
