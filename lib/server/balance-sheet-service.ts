import "server-only";

import type { BalanceSheet } from "@/lib/api/balance-sheet";

const BALANCE_SHEET: BalanceSheet = {
  company: "Sagora",
  years: [
    {
      year: 2023,
      currency: "EUR",
      assets: [
        {
          id: "fixed-assets",
          label: "Actifs immobilisés",
          type: "NON_CURRENT_ASSET",
          items: [
            { label: "Immobilisations incorporelles", amount: 380_000 },
            { label: "Immobilisations corporelles", amount: 245_000 },
            { label: "Matériel & équipements", amount: 165_000 }
          ]
        },
        {
          id: "current-assets",
          label: "Actifs circulants",
          type: "CURRENT_ASSET",
          items: [
            { label: "Stocks & WIP", amount: 102_000 },
            { label: "Créances clients", amount: 298_000 },
            { label: "Autres actifs courants", amount: 76_000 }
          ]
        },
        {
          id: "cash",
          label: "Trésorerie",
          type: "CASH",
          items: [{ label: "Trésorerie disponible", amount: 661_400 }]
        }
      ],
      liabilities: [
        {
          id: "equity",
          label: "Capitaux propres",
          type: "EQUITY",
          items: [
            { label: "Capital social", amount: 520_000 },
            { label: "Réserves", amount: 180_000 },
            { label: "Résultat net", amount: 95_000 }
          ]
        },
        {
          id: "financial-debt",
          label: "Dettes financières",
          type: "NON_CURRENT_LIABILITY",
          items: [
            { label: "Emprunts bancaires", amount: 280_000 },
            { label: "Obligations de location", amount: 68_000 }
          ]
        },
        {
          id: "current-liabilities",
          label: "Passifs courants",
          type: "CURRENT_LIABILITY",
          items: [
            { label: "Fournisseurs & charges à payer", amount: 265_000 },
            { label: "Dettes fiscales & sociales", amount: 95_400 },
            { label: "Autres passifs courants", amount: 424_000 }
          ]
        }
      ]
    },
    {
      year: 2022,
      currency: "EUR",
      assets: [
        {
          id: "fixed-assets",
          label: "Actifs immobilisés",
          type: "NON_CURRENT_ASSET",
          items: [
            { label: "Immobilisations incorporelles", amount: 350_000 },
            { label: "Immobilisations corporelles", amount: 252_000 },
            { label: "Matériel & équipements", amount: 140_000 }
          ]
        },
        {
          id: "current-assets",
          label: "Actifs circulants",
          type: "CURRENT_ASSET",
          items: [
            { label: "Stocks & WIP", amount: 98_000 },
            { label: "Créances clients", amount: 270_000 },
            { label: "Autres actifs courants", amount: 72_000 }
          ]
        },
        {
          id: "cash",
          label: "Trésorerie",
          type: "CASH",
          items: [{ label: "Trésorerie disponible", amount: 548_300 }]
        }
      ],
      liabilities: [
        {
          id: "equity",
          label: "Capitaux propres",
          type: "EQUITY",
          items: [
            { label: "Capital social", amount: 520_000 },
            { label: "Réserves", amount: 170_000 },
            { label: "Résultat net", amount: 68_000 }
          ]
        },
        {
          id: "financial-debt",
          label: "Dettes financières",
          type: "NON_CURRENT_LIABILITY",
          items: [
            { label: "Emprunts bancaires", amount: 310_000 },
            { label: "Obligations de location", amount: 55_000 }
          ]
        },
        {
          id: "current-liabilities",
          label: "Passifs courants",
          type: "CURRENT_LIABILITY",
          items: [
            { label: "Fournisseurs & charges à payer", amount: 250_000 },
            { label: "Dettes fiscales & sociales", amount: 87_300 },
            { label: "Autres passifs courants", amount: 270_000 }
          ]
        }
      ]
    },
    {
      year: 2021,
      currency: "EUR",
      assets: [
        {
          id: "fixed-assets",
          label: "Actifs immobilisés",
          type: "NON_CURRENT_ASSET",
          items: [
            { label: "Immobilisations incorporelles", amount: 325_000 },
            { label: "Immobilisations corporelles", amount: 240_000 },
            { label: "Matériel & équipements", amount: 132_000 }
          ]
        },
        {
          id: "current-assets",
          label: "Actifs circulants",
          type: "CURRENT_ASSET",
          items: [
            { label: "Stocks & WIP", amount: 88_000 },
            { label: "Créances clients", amount: 242_000 },
            { label: "Autres actifs courants", amount: 65_000 }
          ]
        },
        {
          id: "cash",
          label: "Trésorerie",
          type: "CASH",
          items: [{ label: "Trésorerie disponible", amount: 472_800 }]
        }
      ],
      liabilities: [
        {
          id: "equity",
          label: "Capitaux propres",
          type: "EQUITY",
          items: [
            { label: "Capital social", amount: 520_000 },
            { label: "Réserves", amount: 150_000 },
            { label: "Résultat net", amount: 52_000 }
          ]
        },
        {
          id: "financial-debt",
          label: "Dettes financières",
          type: "NON_CURRENT_LIABILITY",
          items: [
            { label: "Emprunts bancaires", amount: 330_000 },
            { label: "Obligations de location", amount: 48_000 }
          ]
        },
        {
          id: "current-liabilities",
          label: "Passifs courants",
          type: "CURRENT_LIABILITY",
          items: [
            { label: "Fournisseurs & charges à payer", amount: 225_000 },
            { label: "Dettes fiscales & sociales", amount: 76_800 },
            { label: "Autres passifs courants", amount: 163_000 }
          ]
        }
      ]
    }
  ]
};

export function loadBalanceSheet(): BalanceSheet {
  return BALANCE_SHEET;
}

