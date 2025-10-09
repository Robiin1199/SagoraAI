import { NextResponse } from "next/server";
import { getCashScenarios } from "@/lib/api/cash";

export async function GET() {
  try {
    const scenarios = await getCashScenarios();
    return NextResponse.json(scenarios);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
