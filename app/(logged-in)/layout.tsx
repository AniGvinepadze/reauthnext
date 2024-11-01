import { auth } from "@/auth";
import LogoutButton from "@/components/logout-button/LogoutButton";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoggeInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if(!session?.user?.id){
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[1440px] w-full">
      <nav className="bg-gray-200 flex justify-between p-4 items-center">
        <ul className="flex gap-4">
          <li>
            <Link href="/myAccount">
              {session?.user?.email && <div>{session.user.email}</div>}
            </Link>
          </li>
          <li>
            <Link href="/change-password">Changed Password</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <div className="flex-1 flex justify-center items-center">{children}</div>
    </div>
  );
}
