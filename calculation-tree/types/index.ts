export type User = {
  id: string;
  username: string;
  password: string;
};

export type Operation = "+" | "-" | "*" | "/";

export type Node = {
  id: string;
  parentId: string | null;
  authorId: string;
  startNumber: number | null;
  operation: Operation | null;
  rightOperand: number | null;
  result: number;
};

export type TreeNodeType = Node & { children: TreeNodeType[] };
