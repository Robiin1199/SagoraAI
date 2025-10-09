import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { computeMetrics } from "@/inngest/functions/compute-metrics";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [computeMetrics]
});
