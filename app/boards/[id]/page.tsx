import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BoardClient from "./BoardClient";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const board = await prisma.board.findFirst({
    where: { id, userId: session.user.id! },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: { tasks: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!board) redirect("/dashboard");

  return <BoardClient board={board} />;
}