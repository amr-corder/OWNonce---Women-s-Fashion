import { ShippingZoneName, ShippingRatesConfig } from '../types';

export const SHIPPING_ZONES: Record<ShippingZoneName, string[]> = {
  'Greater Cairo': ['Cairo', 'Giza'],
  'Alexandria': ['Alexandria', 'Borg Al Arab'],
  'Delta': [
    'Beheira',
    'Dakahlia',
    'Damietta',
    'Gharbia',
    'Kafr El Sheikh',
    'Monufia',
    'Qalyubia',
    'Sharqia',
  ],
  'Canal': ['Ismailia', 'Suez', 'Port Said'],
  'Upper Egypt': [
    'Aswan',
    'Asyut',
    'Beni Suef',
    'Fayoum',
    'Luxor',
    'Minya',
    'Qena',
    'Sohag',
    'Red Sea',
    'Matruh',
  ],
  'Beyond Zones': ['North Sinai', 'South Sinai', 'New Valley'],
};

export const ZONES: ShippingZoneName[] = [
  'Greater Cairo',
  'Alexandria',
  'Delta',
  'Canal',
  'Upper Egypt',
  'Beyond Zones',
];

export const ALL_GOVERNORATES: { name: string; zone: ShippingZoneName }[] = Object.entries(
  SHIPPING_ZONES
).flatMap(([zone, govs]) => govs.map((gov) => ({ name: gov, zone: zone as ShippingZoneName })));

export const DEFAULT_FIRST_KG_RATES: Record<string, Record<ShippingZoneName, number>> = {
  'Greater Cairo': {
    'Greater Cairo': 76,
    'Alexandria': 82,
    'Delta': 93,
    'Canal': 99,
    'Upper Egypt': 122,
    'Beyond Zones': 145,
  },
  'Alexandria': {
    'Greater Cairo': 82,
    'Alexandria': 76,
    'Delta': 93,
    'Canal': 99,
    'Upper Egypt': 122,
    'Beyond Zones': 145,
  },
  'Delta': {
    'Greater Cairo': 82,
    'Alexandria': 93,
    'Delta': 76,
    'Canal': 99,
    'Upper Egypt': 122,
    'Beyond Zones': 145,
  },
  'Canal': {
    'Greater Cairo': 82,
    'Alexandria': 93,
    'Delta': 99,
    'Canal': 76,
    'Upper Egypt': 122,
    'Beyond Zones': 145,
  },
  'Upper Egypt': {
    'Greater Cairo': 122,
    'Alexandria': 122,
    'Delta': 122,
    'Canal': 122,
    'Upper Egypt': 76,
    'Beyond Zones': 145,
  },
};

export const DEFAULT_ADDITIONAL_KG_RATES: Record<string, Record<ShippingZoneName, number>> = {
  'Greater Cairo': {
    'Greater Cairo': 6.6,
    'Alexandria': 9.2,
    'Delta': 11.8,
    'Canal': 15.7,
    'Upper Egypt': 17,
    'Beyond Zones': 6.6,
  },
  'Alexandria': {
    'Greater Cairo': 9.2,
    'Alexandria': 6.6,
    'Delta': 11.8,
    'Canal': 15.7,
    'Upper Egypt': 17,
    'Beyond Zones': 6.6,
  },
  'Delta': {
    'Greater Cairo': 9.2,
    'Alexandria': 11.8,
    'Delta': 6.6,
    'Canal': 15.7,
    'Upper Egypt': 17,
    'Beyond Zones': 6.6,
  },
  'Canal': {
    'Greater Cairo': 9.2,
    'Alexandria': 11.8,
    'Delta': 15.7,
    'Canal': 6.6,
    'Upper Egypt': 17,
    'Beyond Zones': 6.6,
  },
  'Upper Egypt': {
    'Greater Cairo': 9.2,
    'Alexandria': 11.8,
    'Delta': 15.7,
    'Canal': 17,
    'Upper Egypt': 6.6,
    'Beyond Zones': 6.6,
  },
};

export const DEFAULT_SHIPPING_CONFIG: ShippingRatesConfig = {
  originZone: 'Greater Cairo',
  firstKgRates: DEFAULT_FIRST_KG_RATES as any,
  additionalKgRates: DEFAULT_ADDITIONAL_KG_RATES as any,
};

export function getZoneForGovernorate(governorateName: string): ShippingZoneName | null {
  for (const [zone, govs] of Object.entries(SHIPPING_ZONES)) {
    if (govs.some((g) => g.toLowerCase() === governorateName.trim().toLowerCase())) {
      return zone as ShippingZoneName;
    }
  }
  return null;
}

export function calculateShippingCost({
  originZone,
  destinationZone,
  weightKg,
  config = DEFAULT_SHIPPING_CONFIG,
}: {
  originZone: ShippingZoneName;
  destinationZone: ShippingZoneName;
  weightKg: number;
  config?: ShippingRatesConfig;
}): {
  shippingCost: number;
  isCalculable: boolean;
  errorMessage?: string;
  firstKgRate: number;
  additionalKgRate: number;
} {
  // If origin is Beyond Zones, disable automatic calculation
  if (originZone === 'Beyond Zones') {
    return {
      shippingCost: 0,
      isCalculable: false,
      errorMessage: 'Shipping calculation from Beyond Zones is currently not configured.',
      firstKgRate: 0,
      additionalKgRate: 0,
    };
  }

  const firstKgOriginMap = config.firstKgRates?.[originZone] || DEFAULT_FIRST_KG_RATES[originZone];
  const additionalKgOriginMap =
    config.additionalKgRates?.[originZone] || DEFAULT_ADDITIONAL_KG_RATES[originZone];

  if (!firstKgOriginMap || !additionalKgOriginMap) {
    return {
      shippingCost: 0,
      isCalculable: false,
      errorMessage: `Rates for origin zone "${originZone}" are not configured.`,
      firstKgRate: 0,
      additionalKgRate: 0,
    };
  }

  const firstKgRate = firstKgOriginMap[destinationZone];
  const additionalKgRate = additionalKgOriginMap[destinationZone];

  if (firstKgRate === undefined || additionalKgRate === undefined) {
    return {
      shippingCost: 0,
      isCalculable: false,
      errorMessage: `Route from "${originZone}" to "${destinationZone}" is not configured.`,
      firstKgRate: 0,
      additionalKgRate: 0,
    };
  }

  const effectiveWeight = Math.max(0.1, weightKg);
  let shippingCost = 0;

  if (effectiveWeight <= 1) {
    shippingCost = firstKgRate;
  } else {
    shippingCost = firstKgRate + (effectiveWeight - 1) * additionalKgRate;
  }

  // Format to standard 1 or 2 decimals without altering exact precision
  const roundedCost = Number(shippingCost.toFixed(2));

  return {
    shippingCost: roundedCost,
    isCalculable: true,
    firstKgRate,
    additionalKgRate,
  };
}
