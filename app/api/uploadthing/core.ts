import { inngest } from "@/inngest/client";
import { parseInvoiceCsv } from "@/lib/invoices/csv";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

type InvoiceUploadMetadata = {
  organizationId: string;
};

export const fileRouter = {
  invoices: f({ "text/csv": { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.organizationId) {
        throw new Error("Non autorisé");
      }
      return { organizationId: session.user.organizationId } satisfies InvoiceUploadMetadata;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`Impossible de récupérer le fichier uploadé (${response.status})`);
      }

      const csvContent = await response.text();
      const invoices = parseInvoiceCsv(csvContent);

      if (!invoices.length) {
        return { imported: 0 };
      }

      await prisma.$transaction(
        invoices.map((invoice) =>
          prisma.invoice.upsert({
            where: {
              organizationId_externalId: {
                organizationId: metadata.organizationId,
                externalId: invoice.externalId
              }
            },
            create: {
              organizationId: metadata.organizationId,
              externalId: invoice.externalId,
              customerName: invoice.customerName,
              amount: invoice.amount,
              currency: invoice.currency,
              issuedAt: invoice.issuedAt,
              dueAt: invoice.dueAt,
              paidAt: invoice.paidAt,
              status: invoice.status
            },
            update: {
              customerName: invoice.customerName,
              amount: invoice.amount,
              currency: invoice.currency,
              issuedAt: invoice.issuedAt,
              dueAt: invoice.dueAt,
              paidAt: invoice.paidAt,
              status: invoice.status
            }
          })
        )
      );

      await inngest.send({
        name: "metrics/compute",
        data: { organizationId: metadata.organizationId }
      });

      return { imported: invoices.length };
    })
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
