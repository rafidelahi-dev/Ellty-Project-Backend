import { users } from "./data";
import { User } from "@/types";
import { randomUUID } from "crypto";

export function register(username: string, password: string): User {
  const exists = users.find(u => u.username === username);
  if (exists) throw new Error("User exists");

  const user: User = {
    id: randomUUID(),
    username,
    password
  };

  users.push(user);
  return user;
}

export function login(username: string, password: string): User {
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) throw new Error("Invalid credentials");
  return user;
}
