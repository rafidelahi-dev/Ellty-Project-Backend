import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

type LoginBody = {
  username: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as LoginBody;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = login(username, password);

    const safeUser = {
      id: user.id,
      username: user.username,
    };

    return NextResponse.json(safeUser, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error && err.message ? err.message : "Login failed";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
