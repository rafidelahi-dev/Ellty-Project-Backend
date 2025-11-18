"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import { Node, Operation } from "@/types";
import { TreeNodeType } from "@/types";

function buildTree(nodes: Node[]): TreeNodeType[] {
  const map = new Map<string, TreeNodeType>();

  nodes.forEach((n) => {
    map.set(n.id, { ...n, children: [] });
  });

  const roots: TreeNodeType[] = [];

  map.forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}


function TreeNode({
  node,
  onReply,
}: {
  node: TreeNodeType;
  onReply: (parentId: string, op: string, right: number) => void;
}) {

  const [op, setOp] = useState<Operation>("+");
  const [right, setRight] = useState<number>(1);

  return (
    <div className="ml-4 mt-4">
      <div className="bg-white border border-gray-200 shadow p-4 rounded-xl">
        <p className="text-lg font-bold text-gray-800">{node.result}</p>

        {node.operation && (
          <p className="text-sm text-gray-500">
            ({node.operation} {node.rightOperand})
          </p>
        )}

        <div className="mt-3 space-y-2">
          <div className="flex gap-2 items-center">
            <select
              value={op}
              onChange={(e) => setOp(e.target.value as Operation)}
              className="border border-gray-300 rounded-lg px-2 py-1"
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
            <input
              type="number"
              value={right}
              onChange={(e) => setRight(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded-lg px-2 py-1"
            />
            <button
              onClick={() => onReply(node.id, op, right)}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Reply
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onReply(node.id, "+", 1)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              +1
            </button>
            <button
              onClick={() => onReply(node.id, "-", 1)}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              -1
            </button>
            <button
              onClick={() => onReply(node.id, "*", 2)}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              ×2
            </button>
            <button
              onClick={() => onReply(node.id, "/", 2)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              ÷2
            </button>
          </div>
        </div>
      </div>

      {/* Indent the children */}
      <div className="border-l-2 border-gray-300 ml-4 pl-4">
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} onReply={onReply} />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    null
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  const [startNumber, setStartNumber] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);


  async function loadNodes() {
    const res = await fetch("/api/nodes");
    const data = await res.json();
    setNodes(data);
  }

  useEffect(() => {
    loadNodes();
  }, []);

  async function handleRegister() {
    setAuthError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setAuthError(err.error ?? "Registration failed");
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (e) {
      setAuthError("Registration error");
    }
  }

  async function handleLogin() {
    setAuthError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setAuthError(err.error ?? "Login failed");
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (e) {
      setAuthError("Login error");
    }
  }


  async function createRoot() {
    await fetch("/api/nodes/create", {
      method: "POST",
      body: JSON.stringify({ userId: user?.id, startNumber }),
    });
    loadNodes();
  }

  async function reply(parentId: string, op: string, right: number) {
    await fetch("/api/nodes/reply", {
      method: "POST",
      body: JSON.stringify({
        userId: user?.id,
        parentId,
        operation: op,
        rightOperand: right,
      }),
    });
    loadNodes();
  }

  const tree = buildTree(nodes);

  tree.map((root) => (
    <TreeNode key={root.id} node={root} onReply={reply} />
  ));


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Calculation Tree</h1>

        {/* Auth */}
        {!user && (
          <div className="bg-white p-5 rounded-xl shadow mb-6 max-w-md mx-auto space-y-3">
            <h2 className="text-lg font-semibold text-center">Sign up / Log in</h2>

            {authError && (
              <p className="text-sm text-red-600 text-center">{authError}</p>
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            <div className="flex gap-4">
              <button
                onClick={handleRegister}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
              >
                Register
              </button>

              <button
                onClick={handleLogin}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
              >
                Login
              </button>
            </div>
          </div>
        )}


        {/* Add Root */}
        {user && (
          <div className="bg-white p-5 rounded-xl shadow mb-6">
            <p className="mb-4 text-gray-700">
              Logged in as <strong>{user.username}</strong>
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(Number(e.target.value))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={createRoot}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700"
              >
                Create Root Node
              </button>
            </div>
          </div>
        )}

        {/* Tree */}
        <h2 className="text-xl font-semibold mb-4">Tree View</h2>

        {tree.length === 0 && (
          <p className="text-gray-500 text-center">No nodes yet.</p>
        )}

        <div>
          {tree.map((root) => (
            <TreeNode key={root.id} node={root} onReply={reply} />
          ))}
        </div>
      </div>
    </div>
  );
}
