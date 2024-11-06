import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import db from "@/db/drizzle";
import { users } from "@/db/userSchema";
import { eq } from "drizzle-orm";
import TwoFactorAuthForm from "./two-factor-auth-form";

export default async function MyAccount() {
  const session = await auth();

  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated,
    })
    .from(users)
    .where(eq(users.id, parseInt(session?.user?.id!)));

  return (
    <Card className="w-[350px]">
      <CardHeader>My Accounnt</CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
        {/* Two factor Auth Form */}
        <TwoFactorAuthForm
          twoFactorActivated={user.twoFactorActivated ?? false}
        />
      </CardContent>
    </Card>
  );
}
