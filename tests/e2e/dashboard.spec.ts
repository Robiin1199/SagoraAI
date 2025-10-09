import { expect, test } from "@playwright/test";

// The Google SSO flow cannot be automated in CI without dedicated credentials.
// We keep the scenario documented here and skip execution by default.
test.describe.skip("Authentication and dashboard journey", () => {
  test("logs in with Google, uploads invoices CSV and displays KPIs", async ({ page }) => {
    await page.goto("/");

    // The following steps are illustrative; they rely on Google OAuth redirect which
    // is not executable in this sandbox environment.
    await page.getByRole("button", { name: /Google/ }).click();
    await page.waitForURL(/accounts.google.com/);

    // After returning from Google the dashboard should display KPI cards populated
    // from MetricSnapshot records computed by Inngest after CSV upload.
    await page.goto("/");
    await expect(page.getByText(/Cash disponible/)).toBeVisible();
    await expect(page.getByText(/Importer vos factures/)).toBeVisible();
  });
});
