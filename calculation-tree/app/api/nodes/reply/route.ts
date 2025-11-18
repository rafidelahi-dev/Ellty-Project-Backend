import { NextResponse } from "next/server";
import { nodes } from "@/lib/data";
import { Node, Operation } from "@/types";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { userId, parentId, operation, rightOperand } =
    (await req.json()) as {
      userId: string;
      parentId: string;
      operation: Operation;
      rightOperand: number;
    };

  const parent = nodes.find(n => n.id === parentId);
  if (!parent)
    return NextResponse.json({ error: "Parent not found" }, { status: 404 });

  let result = parent.result;

  switch (operation) {
    case "+": result += rightOperand; break;
    case "-": result -= rightOperand; break;
    case "*": result *= rightOperand; break;
    case "/":
      if (rightOperand === 0)
        return NextResponse.json({ error: "Divide by zero" }, { status: 400 });
      result /= rightOperand;
      break;
  }

  const newNode: Node = {
    id: randomUUID(),
    parentId,
    authorId: userId,
    startNumber: null,
    operation,
    rightOperand,
    result
  };

  nodes.push(newNode);
  return NextResponse.json(newNode);
}
