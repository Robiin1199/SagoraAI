import "server-only";

import { graphQLRequest, USE_MOCKS } from "@/lib/api/graphql-client";
import { loadBalanceSheet } from "@/lib/server/balance-sheet-service";

export type BalanceSheetGroupType =
  | "NON_CURRENT_ASSET"
  | "CURRENT_ASSET"
  | "CASH"
  | "EQUITY"
  | "NON_CURRENT_LIABILITY"
  | "CURRENT_LIABILITY";

export type BalanceSheetItem = {
  label: string;
  amount: number;
};

export type BalanceSheetGroup = {
  id: string;
  label: string;
  type: BalanceSheetGroupType;
  items: BalanceSheetItem[];
};

export type BalanceSheetYear = {
  year: number;
  currency: string;
  assets: BalanceSheetGroup[];
  liabilities: BalanceSheetGroup[];
};

export type BalanceSheet = {
  company: string;
  years: BalanceSheetYear[];
};

export async function getBalanceSheet(): Promise<BalanceSheet> {
  if (USE_MOCKS) {
    return loadBalanceSheet();
  }

  const data = await graphQLRequest<{ balanceSheet: BalanceSheet }>(
    `#graphql
    query BalanceSheet {
      balanceSheet {
        company
        years {
          year
          currency
          assets {
            id
            label
            type
            items {
              label
              amount
            }
          }
          liabilities {
            id
            label
            type
            items {
              label
              amount
            }
          }
        }
      }
    }
  `
  );

  return data.balanceSheet;
}

