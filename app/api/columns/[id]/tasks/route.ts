import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title } = await req.json();
  const count = await prisma.task.count({ where: { columnId: id } });
  const task = await prisma.task.create({
    data: { title, columnId: id, order: count },
  });
  return NextResponse.json(task, { status: 201 });
}