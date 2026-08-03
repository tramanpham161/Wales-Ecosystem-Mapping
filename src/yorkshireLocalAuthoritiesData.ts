// Yorkshire Local Authorities Census Deprivation & Systemic Data
export interface LocalAuthorityData {
  name: string;
  welshName: string;
  deprivationPct: number;
  struggleScore: number;
  helpScore: number;
  gapScore: number;
  region: string;
  barriers: string[];
}

export const YORKSHIRE_LOCAL_AUTHORITIES_DATA: Record<string, LocalAuthorityData> = {
  "Kingston upon Hull": {
    "name": "Kingston upon Hull",
    "welshName": "East Yorkshire & Hull",
    "deprivationPct": 39.8,
    "struggleScore": 82,
    "helpScore": 40,
    "region": "east",
    "barriers": ["Coastal and estuary isolation", "High NEET rate in Orchard Park"],
    "gapScore": 42
  },
  "Bradford": {
    "name": "Bradford",
    "welshName": "West Yorkshire",
    "deprivationPct": 39.4,
    "struggleScore": 78,
    "helpScore": 42,
    "region": "west",
    "barriers": ["Youth NEET in Manningham & Girlington", "Post-16 vocational entry barriers"],
    "gapScore": 36
  },
  "Doncaster": {
    "name": "Doncaster",
    "welshName": "South Yorkshire",
    "deprivationPct": 37.1,
    "struggleScore": 75,
    "helpScore": 45,
    "region": "south",
    "barriers": ["Former mining community isolation", "Shift transport gaps to logistics hubs"],
    "gapScore": 30
  },
  "Rotherham": {
    "name": "Rotherham",
    "welshName": "South Yorkshire",
    "deprivationPct": 36.8,
    "struggleScore": 74,
    "helpScore": 48,
    "region": "south",
    "barriers": ["Heavy industry transition", "Apprenticeship access"],
    "gapScore": 26
  },
  "Barnsley": {
    "name": "Barnsley",
    "welshName": "South Yorkshire",
    "deprivationPct": 35.6,
    "struggleScore": 71,
    "helpScore": 46,
    "region": "south",
    "barriers": ["Rural outpost digital infrastructure", "Higher apprenticeship uptake"],
    "gapScore": 25
  },
  "Kirklees": {
    "name": "Kirklees",
    "welshName": "West Yorkshire",
    "deprivationPct": 34.7,
    "struggleScore": 69,
    "helpScore": 50,
    "region": "west",
    "barriers": ["Textile heritage vs green tech gap", "Valley connectivity"],
    "gapScore": 19
  },
  "Sheffield": {
    "name": "Sheffield",
    "welshName": "South Yorkshire",
    "deprivationPct": 34.2,
    "struggleScore": 72,
    "helpScore": 56,
    "region": "south",
    "barriers": ["East vs West district disparity", "Youth disengagement"],
    "gapScore": 16
  },
  "Wakefield": {
    "name": "Wakefield",
    "welshName": "West Yorkshire",
    "deprivationPct": 33.9,
    "struggleScore": 66,
    "helpScore": 52,
    "region": "west",
    "barriers": ["Logistics retention", "Creative career visibility"],
    "gapScore": 14
  },
  "Calderdale": {
    "name": "Calderdale",
    "welshName": "West Yorkshire",
    "deprivationPct": 32.1,
    "struggleScore": 64,
    "helpScore": 53,
    "region": "west",
    "barriers": ["Upper valley transport bottlenecks", "Travel times"],
    "gapScore": 11
  },
  "East Riding of Yorkshire": {
    "name": "East Riding of Yorkshire",
    "welshName": "East Yorkshire & Hull",
    "deprivationPct": 31.8,
    "struggleScore": 62,
    "helpScore": 54,
    "region": "east",
    "barriers": ["Rural & coastal transport gaps in Bridlington", "Seasonal employment volatility"],
    "gapScore": 8
  },
  "Leeds": {
    "name": "Leeds",
    "welshName": "West Yorkshire",
    "deprivationPct": 31.5,
    "struggleScore": 68,
    "helpScore": 62,
    "region": "west",
    "barriers": ["Inner city pocket deprivation (Harehills)", "Commercial core divide"],
    "gapScore": 6
  },
  "City of York": {
    "name": "City of York",
    "welshName": "North Yorkshire",
    "deprivationPct": 27.9,
    "struggleScore": 52,
    "helpScore": 58,
    "region": "north",
    "barriers": ["High housing costs for young workers", "Hidden pockets in Westfield"],
    "gapScore": -6
  },
  "North Yorkshire": {
    "name": "North Yorkshire",
    "welshName": "North Yorkshire",
    "deprivationPct": 29.4,
    "struggleScore": 56,
    "helpScore": 50,
    "region": "north",
    "barriers": ["Extensive rural transport distances across Scarborough & Selby", "Young talent retention"],
    "gapScore": 6
  },
  "North Yorkshire Council": {
    "name": "North Yorkshire Council",
    "welshName": "North Yorkshire",
    "deprivationPct": 29.4,
    "struggleScore": 56,
    "helpScore": 50,
    "region": "north",
    "barriers": ["Extensive rural transport distances across Scarborough & Selby", "Young talent retention"],
    "gapScore": 6
  }
};
