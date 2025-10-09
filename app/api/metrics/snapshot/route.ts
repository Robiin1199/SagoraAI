import { NextResponse } from "next/server";
import { getCashSnapshot } from "@/lib/api/cash";

export async function GET() {
  try {
    const snapshot = await getCashSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
