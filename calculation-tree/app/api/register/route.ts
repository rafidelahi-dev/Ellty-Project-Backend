import { NextResponse } from "next/server";
import { register } from "@/lib/auth";

type RegisterBody = {
  username: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as RegisterBody;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = register(username, password);

    const safeUser = {
      id: user.id,
      username: user.username,
    };

    return NextResponse.json(safeUser, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error && err.message ? err.message : "Registration failed";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
