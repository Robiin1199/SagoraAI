import { parse } from "csv-parse/sync";
import { z } from "zod";

export type NormalizedInvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

const statusMap: Record<string, NormalizedInvoiceStatus> = {
  draft: "DRAFT",
  sent: "SENT",
  issued: "SENT",
  paid: "PAID",
  overdue: "OVERDUE",
  late: "OVERDUE",
  cancelled: "CANCELLED",
  canceled: "CANCELLED"
};

const rawInvoiceSchema = z.object({
  invoice_number: z.string().min(1),
  customer_name: z.string().min(1),
  amount: z.string().or(z.number()).transform((value) => {
    const normalized =
      typeof value === "number" ? value : Number(String(value).replace(/\s/g, "").replace(/,/, "."));
    if (Number.isNaN(normalized)) {
      throw new Error(`Montant invalide: ${value}`);
    }
    return normalized;
  }),
  currency: z.string().optional().default("EUR"),
  issued_at: z.string().min(1),
  due_at: z.string().optional(),
  paid_at: z.string().optional(),
  status: z.string().optional()
});

export type NormalizedInvoice = {
  externalId: string;
  customerName: string;
  amount: number;
  currency: string;
  issuedAt: Date;
  dueAt?: Date | null;
  paidAt?: Date | null;
  status: NormalizedInvoiceStatus;
};

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export function parseInvoiceCsv(csv: string): NormalizedInvoice[] {
  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as Record<string, string>[];

  return rows.map((row) => {
    const parsed = rawInvoiceSchema.parse({
      invoice_number: row.invoice_number ?? row.InvoiceNumber ?? row.invoiceNumber ?? row.number ?? row.id,
      customer_name: row.customer_name ?? row.Customer ?? row.customer ?? row.client,
      amount: row.amount ?? row.Amount ?? row.total,
      currency: row.currency ?? row.Currency ?? "EUR",
      issued_at: row.issued_at ?? row.IssuedAt ?? row.issued ?? row.date,
      due_at: row.due_at ?? row.DueAt ?? row.due ?? row.due_date,
      paid_at: row.paid_at ?? row.PaidAt ?? row.paid ?? row.paid_date,
      status: row.status ?? row.Status ?? row.state
    });

    const statusKey = parsed.status?.toLowerCase() ?? "";
    const status = statusMap[statusKey] ?? (parsed.paid_at ? "PAID" : "SENT");

    const issuedAt = parseDate(parsed.issued_at) ?? (() => {
      throw new Error(`Date d'émission invalide: ${parsed.issued_at}`);
    })();

    const currency = parsed.currency && parsed.currency.trim() ? parsed.currency.toUpperCase() : "EUR";

    return {
      externalId: parsed.invoice_number,
      customerName: parsed.customer_name,
      amount: parsed.amount,
      currency,
      issuedAt,
      dueAt: parseDate(parsed.due_at),
      paidAt: parseDate(parsed.paid_at),
      status
    } satisfies NormalizedInvoice;
  });
}
