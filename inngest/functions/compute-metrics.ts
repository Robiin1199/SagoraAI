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

    type InvoiceRecord = {
      amount: number | string;
      issuedAt: Date;
      dueAt: Date | null;
      paidAt: Date | null;
      status: string;
    };

    const typedInvoices = invoices as InvoiceRecord[];

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
