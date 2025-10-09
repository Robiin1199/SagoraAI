import { NextResponse } from "next/server";
import { getCashForecast } from "@/lib/api/cash";

export async function GET() {
  try {
    const forecast = await getCashForecast();
    return NextResponse.json(forecast);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
