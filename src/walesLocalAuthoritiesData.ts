// Wales 22 Local Authorities Census Deprivation & Systemic Data
export interface LocalAuthorityData {
  name: string;
  welshName: string;
  deprivationPct: number; // Household deprivation in 1+ dimensions (% ONS Census 2021)
  struggleScore: number;
  helpScore: number;
  gapScore: number;
  region: string;
  barriers: string[];
}

export const WALES_LOCAL_AUTHORITIES_DATA: Record<string, LocalAuthorityData> = {
  "Isle of Anglesey": {
    "name": "Isle of Anglesey",
    "welshName": "Ynys Môn",
    "deprivationPct": 51.2,
    "struggleScore": 68,
    "helpScore": 54,
    "region": "north",
    "barriers": [
      "Island isolation",
      "Digital coverage"
    ],
    "gapScore": 14
  },
  "Gwynedd": {
    "name": "Gwynedd",
    "welshName": "Gwynedd",
    "deprivationPct": 53.4,
    "struggleScore": 74,
    "helpScore": 50,
    "region": "north",
    "barriers": [
      "Rural transport",
      "Welsh language services"
    ],
    "gapScore": 24
  },
  "Conwy": {
    "name": "Conwy",
    "welshName": "Conwy",
    "deprivationPct": 52.1,
    "struggleScore": 65,
    "helpScore": 60,
    "region": "north",
    "barriers": [
      "Aging population",
      "Seasonal employment"
    ],
    "gapScore": 5
  },
  "Denbighshire": {
    "name": "Denbighshire",
    "welshName": "Sir Ddinbych",
    "deprivationPct": 54.8,
    "struggleScore": 72,
    "helpScore": 52,
    "region": "north",
    "barriers": [
      "Coastal poverty",
      "Digital skills gap"
    ],
    "gapScore": 20
  },
  "Flintshire": {
    "name": "Flintshire",
    "welshName": "Sir y Fflint",
    "deprivationPct": 48.6,
    "struggleScore": 58,
    "helpScore": 66,
    "region": "north",
    "barriers": [
      "Industrial transition",
      "Career progression"
    ],
    "gapScore": -8
  },
  "Wrexham": {
    "name": "Wrexham",
    "welshName": "Wrecsam",
    "deprivationPct": 53.9,
    "struggleScore": 70,
    "helpScore": 64,
    "region": "north",
    "barriers": [
      "Urban deprivation",
      "Youth engagement"
    ],
    "gapScore": 6
  },
  "Powys": {
    "name": "Powys",
    "welshName": "Powys",
    "deprivationPct": 48.9,
    "struggleScore": 82,
    "helpScore": 32,
    "region": "mid",
    "barriers": [
      "Extreme travel distances",
      "Public transport scarcity"
    ],
    "gapScore": 50
  },
  "Ceredigion": {
    "name": "Ceredigion",
    "welshName": "Ceredigion",
    "deprivationPct": 52.6,
    "struggleScore": 78,
    "helpScore": 38,
    "region": "mid",
    "barriers": [
      "Rural housing",
      "Broadband gaps"
    ],
    "gapScore": 40
  },
  "Pembrokeshire": {
    "name": "Pembrokeshire",
    "welshName": "Sir Benfro",
    "deprivationPct": 51.8,
    "struggleScore": 71,
    "helpScore": 48,
    "region": "southwest",
    "barriers": [
      "Coastal isolation",
      "Fuel poverty"
    ],
    "gapScore": 23
  },
  "Carmarthenshire": {
    "name": "Carmarthenshire",
    "welshName": "Sir Gaerfyrddin",
    "deprivationPct": 53.1,
    "struggleScore": 73,
    "helpScore": 52,
    "region": "southwest",
    "barriers": [
      "Rural poverty",
      "Childcare availability"
    ],
    "gapScore": 21
  },
  "Swansea": {
    "name": "Swansea",
    "welshName": "Abertawe",
    "deprivationPct": 54.2,
    "struggleScore": 69,
    "helpScore": 74,
    "region": "southwest",
    "barriers": [
      "Post-industrial pockets",
      "Youth unemployment"
    ],
    "gapScore": -5
  },
  "Neath Port Talbot": {
    "name": "Neath Port Talbot",
    "welshName": "Castell-nedd Port Talbot",
    "deprivationPct": 57.6,
    "struggleScore": 84,
    "helpScore": 58,
    "region": "southwest",
    "barriers": [
      "Industrial decline",
      "Health inequalities"
    ],
    "gapScore": 26
  },
  "Bridgend": {
    "name": "Bridgend",
    "welshName": "Pen-y-bont ar Ogwr",
    "deprivationPct": 53.5,
    "struggleScore": 66,
    "helpScore": 62,
    "region": "southeast",
    "barriers": [
      "Valley accessibility",
      "Training access"
    ],
    "gapScore": 4
  },
  "Vale of Glamorgan": {
    "name": "Vale of Glamorgan",
    "welshName": "Bro Morgannwg",
    "deprivationPct": 45.3,
    "struggleScore": 50,
    "helpScore": 68,
    "region": "southeast",
    "barriers": [
      "Rural-urban divide",
      "Affordable transport"
    ],
    "gapScore": -18
  },
  "Cardiff": {
    "name": "Cardiff",
    "welshName": "Caerdydd",
    "deprivationPct": 49.1,
    "struggleScore": 56,
    "helpScore": 92,
    "region": "southeast",
    "barriers": [
      "Inner-city deprivation",
      "Cost of living"
    ],
    "gapScore": -36
  },
  "Rhondda Cynon Taf": {
    "name": "Rhondda Cynon Taf",
    "welshName": "Rhondda Cynon Taf",
    "deprivationPct": 57.2,
    "struggleScore": 86,
    "helpScore": 60,
    "region": "southeast",
    "barriers": [
      "Valley topography",
      "Generational poverty"
    ],
    "gapScore": 26
  },
  "Merthyr Tydfil": {
    "name": "Merthyr Tydfil",
    "welshName": "Merthyr Tudful",
    "deprivationPct": 59.8,
    "struggleScore": 92,
    "helpScore": 55,
    "region": "southeast",
    "barriers": [
      "Health barriers",
      "Employment connectivity"
    ],
    "gapScore": 37
  },
  "Caerphilly": {
    "name": "Caerphilly",
    "welshName": "Caerffili",
    "deprivationPct": 56.4,
    "struggleScore": 80,
    "helpScore": 58,
    "region": "southeast",
    "barriers": [
      "Former coalfield hubs",
      "Digital inclusion"
    ],
    "gapScore": 22
  },
  "Blaenau Gwent": {
    "name": "Blaenau Gwent",
    "welshName": "Blaenau Gwent",
    "deprivationPct": 61.3,
    "struggleScore": 95,
    "helpScore": 48,
    "region": "southeast",
    "barriers": [
      "Severe deprivation",
      "Transport links"
    ],
    "gapScore": 47
  },
  "Torfaen": {
    "name": "Torfaen",
    "welshName": "Torfaen",
    "deprivationPct": 55.1,
    "struggleScore": 75,
    "helpScore": 56,
    "region": "southeast",
    "barriers": [
      "Valley transport",
      "Skill transitions"
    ],
    "gapScore": 19
  },
  "Monmouthshire": {
    "name": "Monmouthshire",
    "welshName": "Sir Fynwy",
    "deprivationPct": 42.1,
    "struggleScore": 42,
    "helpScore": 62,
    "region": "southeast",
    "barriers": [
      "Rural affordability",
      "Public transport"
    ],
    "gapScore": -20
  },
  "Newport": {
    "name": "Newport",
    "welshName": "Casnewydd",
    "deprivationPct": 54.7,
    "struggleScore": 72,
    "helpScore": 78,
    "region": "southeast",
    "barriers": [
      "Urban gaps",
      "Community integration"
    ],
    "gapScore": -6
  }
};
