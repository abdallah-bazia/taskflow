import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const boards = await prisma.board.findMany({
    where: { userId: session.user.id! },
    orderBy: { createdAt: "desc" },
  });

  return <DashboardClient boards={boards} user={session.user} />;
}