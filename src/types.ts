export interface Plan {
  id: 'silver' | 'gold' | 'platinum';
  name: string;
  pricePerSqFt: number;
  warrantyInstallation: string;
  warrantyManufacturer: string;
  maintenance: string;
  color: string;
}

export interface QuoteData {
  sqft: number;
  removalPercentage: number;
  paymentMethod: 'ACH' | 'NO_ACH';
  downPayment: number;
  firmaYGana: boolean;
  clienteVip: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'silver',
    name: 'SILVER',
    pricePerSqFt: 7.25,
    warrantyInstallation: '1 año',
    warrantyManufacturer: 'Limitada de por Vida',
    maintenance: 'No incluida',
    color: '#c0c0c0'
  },
  {
    id: 'gold',
    name: 'GOLD',
    pricePerSqFt: 8.00,
    warrantyInstallation: '10 años',
    warrantyManufacturer: 'Limitada de por Vida',
    maintenance: 'No incluida',
    color: '#f29e1f'
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    pricePerSqFt: 9.50,
    warrantyInstallation: '10 años',
    warrantyManufacturer: 'Limitada de por Vida',
    maintenance: '1 cada 2 años (Incluida)',
    color: '#e5e4e2'
  }
];

export const CONSTANTS = {
  REMOVAL_RATE: 2.50,
  PIECE_RATE: 2.50,
  IVU: 1.115,
  TASAS: {
    Y5: 0.0599 / 12,
    Y7: 0.0799 / 12,
    Y10: 0.0999 / 12
  }
};
