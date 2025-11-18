import { NextResponse } from "next/server";
import { nodes } from "@/lib/data";
import { Node } from "@/types";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { userId, startNumber } = await req.json();

  const newNode: Node = {
    id: randomUUID(),
    parentId: null,
    authorId: userId,
    startNumber,
    operation: null,
    rightOperand: null,
    result: startNumber
  };

  nodes.push(newNode);
  return NextResponse.json(newNode);
}
