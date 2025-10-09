import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";

const seedCash = Number(process.env.METRIC_SEED_CASH ?? 250_000);
const seedBurn = Number(process.env.METRIC_SEED_BURN ?? 85_000);

export const computeMetrics = inngest.createFunction(
  { id: "compute-metrics" },
  { event: "metrics/compute" },
  async ({ event }) => {
    const organizationId = event.data.organizationId as string | undefined;

    if (!organizationId) {
      return { status: "missing-organization" };
    }

    const invoices = await prisma.invoice.findMany({
      where: { organizationId }
    });

    const isDecimalLike = (value: unknown): value is { toNumber(): number } => {
      return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as { toNumber?: unknown }).toNumber === "function"
      );
    };

    const toNumber = (value: unknown): number => {
      if (value === null || value === undefined) {
        return 0;
      }

      if (typeof value === "number") {
        return value;
      }

      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
      }

      if (typeof value === "bigint") {
        return Number(value);
      }

      if (isDecimalLike(value)) {
        const parsed = value.toNumber();
        return Number.isFinite(parsed) ? parsed : 0;
      }

      const fallback = Number(value);
      return Number.isFinite(fallback) ? fallback : 0;
    };

    type RawInvoice = (typeof invoices)[number];

    type InvoiceRecord = {
      amount: number;
      issuedAt: Date;
      dueAt: Date | null;
      paidAt: Date | null;
      status: string;
    };

    const typedInvoices: InvoiceRecord[] = invoices.map(
      (invoice: RawInvoice): InvoiceRecord => ({
        amount: toNumber(invoice.amount),
        issuedAt: invoice.issuedAt,
        dueAt: invoice.dueAt,
        paidAt: invoice.paidAt,
        status: String(invoice.status)
      })
    );

    const paidCash = typedInvoices
      .filter((invoice) => invoice.paidAt)
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    const cash = seedCash + paidCash;
    const burn = seedBurn > 0 ? -seedBurn : seedBurn;

    const outstanding = typedInvoices
      .filter((invoice) => invoice.status === "SENT" || invoice.status === "OVERDUE")
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const salesLast90Days = typedInvoices
      .filter((invoice) => invoice.issuedAt >= ninetyDaysAgo)
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    const averageDailySales = salesLast90Days > 0 ? salesLast90Days / 90 : 0;
    const dso = averageDailySales > 0 ? outstanding / averageDailySales : 0;
    const runwayMonths = burn !== 0 ? cash / Math.abs(burn) : Infinity;

    await prisma.metricSnapshot.create({
      data: {
        organizationId,
        cash,
        burn,
        runwayMonths: Number.isFinite(runwayMonths) ? runwayMonths : 0,
        dso
      }
    });

    return {
      status: "computed",
      metrics: {
        cash,
        burn,
        runwayMonths,
        dso
      }
    };
  }
);
