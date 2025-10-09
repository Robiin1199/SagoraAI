import { describe, expect, it } from "vitest";

import { parseInvoiceCsv } from "@/lib/invoices/csv";

const sampleCsv = `invoice_number,customer_name,amount,currency,issued_at,due_at,paid_at,status
INV-001,Acme Corp,1250.50,EUR,2024-01-01,2024-01-30,2024-02-02,paid
INV-002,Beta SAS,980,,2024-02-05,2024-03-05,,sent`;

describe("parseInvoiceCsv", () => {
  it("normalises invoices with decimal handling and defaults", () => {
    const invoices = parseInvoiceCsv(sampleCsv);

    expect(invoices).toHaveLength(2);
    const [first, second] = invoices;

    expect(first.externalId).toBe("INV-001");
    expect(first.customerName).toBe("Acme Corp");
    expect(Number(first.amount)).toBeCloseTo(1250.5);
    expect(first.currency).toBe("EUR");
    expect(first.status).toBe("PAID");
    expect(first.paidAt?.toISOString()).toContain("2024-02-02");

    expect(second.currency).toBe("EUR");
    expect(second.status).toBe("SENT");
    expect(second.paidAt).toBeNull();
  });

  it("throws on invalid amount", () => {
    const csv = `invoice_number,customer_name,amount,issued_at
INV-003,Gamma,abc,2024-03-01`;

    expect(() => parseInvoiceCsv(csv)).toThrow(/Montant invalide/);
  });
});
