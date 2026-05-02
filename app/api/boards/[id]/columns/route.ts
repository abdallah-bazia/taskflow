import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { title } = await req.json();
  const count = await prisma.column.count({ where: { boardId: id } });
  const column = await prisma.column.create({
    data: { title, boardId: id, order: count },
  });
  return NextResponse.json(column, { status: 201 });
}