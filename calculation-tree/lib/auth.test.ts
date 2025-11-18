import { describe, it, expect, beforeEach } from "vitest";
import { register, login } from "./auth";
import { users } from "./data";

describe("auth", () => {
  beforeEach(() => {
    users.length = 0;
  });

  it("register creates user", () => {
    const user = register("alice", "password");
    expect(user.username).toBe("alice");
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(user.id);
  });

  it("register throws on duplicate username", () => {
    register("bob", "1234");
    expect(() => register("bob", "another")).toThrowError("User exists");
  });

  it("login returns user on correct credentials", () => {
    const created = register("carol", "secret");
    const loggedIn = login("carol", "secret");
    expect(loggedIn.id).toBe(created.id);
    expect(loggedIn.username).toBe("carol");
  });

  it("login throws on bad credentials", () => {
    register("dave", "abcd");
    expect(() => login("dave", "wrong")).toThrowError("Invalid credentials");
    expect(() => login("nope", "abcd")).toThrowError("Invalid credentials");
  });
});
