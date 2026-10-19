import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, 
  BarChart2, 
  Filter, 
  AlertTriangle, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  LayoutGrid, 
  RotateCcw,
  Info,
  CheckCircle2,
  TrendingUp,
  Search
} from 'lucide-react';

export interface LocalAuthorityData {
  id: string;
  name: string;
  region: string;
  onsCode: string;
  deprivedOneDimPercent: number;   // Household deprived in 1+ dimension %
  deprivedTwoDimPercent: number;   // Household deprived in 2+ dimensions %
  deprivedThreeDimPercent: number; // Household deprived in 3+ dimensions %
  notDeprivedPercent: number;      // Household not deprived %
  educationDeprivationPercent: number;
  employmentDeprivationPercent: number;
  healthDeprivationPercent: number;
  youthNeetPercent: number;        // Youth NEET %
  skillsDeficitPercent: number;    // Skill / Qualification deficit %
  housingDeprivedPercent: number;  // Housing deprivation %
  population: string;
  keyChallenge: string;
  mappedInitiativesCount: number;
  openGapsCount: number;
  highlightedPriority: string;
}

const YORKSHIRE_DISTRICTS: LocalAuthorityData[] = [
  {
    id: 'bradford',
    name: 'Bradford',
    region: 'West Yorkshire',
    onsCode: 'E08000032',
    deprivedOneDimPercent: 39.4,
    deprivedTwoDimPercent: 17.8,
    deprivedThreeDimPercent: 5.2,
    notDeprivedPercent: 37.6,
    educationDeprivationPercent: 23.5,
    employmentDeprivationPercent: 19.8,
    healthDeprivationPercent: 20.4,
    youthNeetPercent: 7.2,
    skillsDeficitPercent: 28.5,
    housingDeprivedPercent: 18.2,
    population: '546,400',
    keyChallenge: 'High youth unemployment in Manningham & Girlington; post-16 vocational entry barriers and language barriers.',
    mappedInitiativesCount: 6,
    openGapsCount: 18,
    highlightedPriority: 'Youth digital bootcamps, community tech equipment loans, and ESOL vocational pathways.'
  },
  {
    id: 'doncaster',
    name: 'Doncaster',
    region: 'South Yorkshire',
    onsCode: 'E08000017',
    deprivedOneDimPercent: 37.1,
    deprivedTwoDimPercent: 15.9,
    deprivedThreeDimPercent: 4.4,
    notDeprivedPercent: 42.6,
    educationDeprivationPercent: 21.2,
    employmentDeprivationPercent: 18.6,
    healthDeprivationPercent: 21.1,
    youthNeetPercent: 6.7,
    skillsDeficitPercent: 26.8,
    housingDeprivedPercent: 16.5,
    population: '308,100',
    keyChallenge: 'Former mining community isolation in Mexborough & Rossington; shift transport gaps to rail/iPort logistics hubs.',
    mappedInitiativesCount: 4,
    openGapsCount: 14,
    highlightedPriority: 'Clean energy & rail skills network, night-shift shuttle bus scheme for young recruits.'
  },
  {
    id: 'rotherham',
    name: 'Rotherham',
    region: 'South Yorkshire',
    onsCode: 'E08000018',
    deprivedOneDimPercent: 36.8,
    deprivedTwoDimPercent: 15.4,
    deprivedThreeDimPercent: 4.1,
    notDeprivedPercent: 43.7,
    educationDeprivationPercent: 20.8,
    employmentDeprivationPercent: 17.9,
    healthDeprivationPercent: 20.3,
    youthNeetPercent: 6.4,
    skillsDeficitPercent: 25.9,
    housingDeprivedPercent: 15.8,
    population: '265,800',
    keyChallenge: 'Transition from legacy steel to advanced manufacturing; early attrition among young industrial apprentices.',
    mappedInitiativesCount: 5,
    openGapsCount: 12,
    highlightedPriority: 'Advanced manufacturing mentor circles & mental health wrap-around for first-year apprentices.'
  },
  {
    id: 'barnsley',
    name: 'Barnsley',
    region: 'South Yorkshire',
    onsCode: 'E08000016',
    deprivedOneDimPercent: 36.2,
    deprivedTwoDimPercent: 15.1,
    deprivedThreeDimPercent: 3.9,
    notDeprivedPercent: 44.8,
    educationDeprivationPercent: 20.1,
    employmentDeprivationPercent: 17.5,
    healthDeprivationPercent: 21.6,
    youthNeetPercent: 6.1,
    skillsDeficitPercent: 25.2,
    housingDeprivedPercent: 15.2,
    population: '244,600',
    keyChallenge: 'Dearne Valley health-related worklessness and lack of digital connectivity in post-industrial villages.',
    mappedInitiativesCount: 4,
    openGapsCount: 11,
    highlightedPriority: 'Community health worker pathways, digital hub satellite centers in Dearne Valley.'
  },
  {
    id: 'hull',
    name: 'Kingston upon Hull, City of',
    region: 'East Yorkshire',
    onsCode: 'E06000010',
    deprivedOneDimPercent: 38.2,
    deprivedTwoDimPercent: 16.8,
    deprivedThreeDimPercent: 4.8,
    notDeprivedPercent: 40.2,
    educationDeprivationPercent: 22.4,
    employmentDeprivationPercent: 19.3,
    healthDeprivationPercent: 20.8,
    youthNeetPercent: 6.9,
    skillsDeficitPercent: 27.4,
    housingDeprivedPercent: 17.9,
    population: '267,100',
    keyChallenge: 'Estuary coastal-industrial isolation; high youth disengagement in Orchard Park & Bransholme estates.',
    mappedInitiativesCount: 5,
    openGapsCount: 15,
    highlightedPriority: 'Offshore wind and green maritime apprentice pipelines; youth enterprise seed funds.'
  },
  {
    id: 'wakefield',
    name: 'Wakefield',
    region: 'West Yorkshire',
    onsCode: 'E08000036',
    deprivedOneDimPercent: 34.8,
    deprivedTwoDimPercent: 14.2,
    deprivedThreeDimPercent: 3.6,
    notDeprivedPercent: 47.4,
    educationDeprivationPercent: 19.2,
    employmentDeprivationPercent: 16.7,
    healthDeprivationPercent: 19.0,
    youthNeetPercent: 5.5,
    skillsDeficitPercent: 23.4,
    housingDeprivedPercent: 14.9,
    population: '353,300',
    keyChallenge: 'Disparity between central warehouse logistics growth and historic five towns youth retention.',
    mappedInitiativesCount: 4,
    openGapsCount: 10,
    highlightedPriority: 'Creative media studio traineeships & rural-fringe transport vouchers.'
  },
  {
    id: 'kirklees',
    name: 'Kirklees',
    region: 'West Yorkshire',
    onsCode: 'E08000034',
    deprivedOneDimPercent: 34.5,
    deprivedTwoDimPercent: 14.4,
    deprivedThreeDimPercent: 3.8,
    notDeprivedPercent: 47.3,
    educationDeprivationPercent: 19.5,
    employmentDeprivationPercent: 16.2,
    healthDeprivationPercent: 18.2,
    youthNeetPercent: 5.6,
    skillsDeficitPercent: 23.8,
    housingDeprivedPercent: 16.1,
    population: '433,300',
    keyChallenge: 'Dewsbury and Batley textile legacy economic conversion; high minority ethnic youth unemployment pockets.',
    mappedInitiativesCount: 5,
    openGapsCount: 13,
    highlightedPriority: 'Textile-to-tech maker labs & bi-lingual enterprise incubation.'
  },
  {
    id: 'calderdale',
    name: 'Calderdale',
    region: 'West Yorkshire',
    onsCode: 'E08000033',
    deprivedOneDimPercent: 33.7,
    deprivedTwoDimPercent: 13.9,
    deprivedThreeDimPercent: 3.5,
    notDeprivedPercent: 48.9,
    educationDeprivationPercent: 18.7,
    employmentDeprivationPercent: 15.8,
    healthDeprivationPercent: 18.1,
    youthNeetPercent: 5.1,
    skillsDeficitPercent: 22.6,
    housingDeprivedPercent: 15.3,
    population: '206,600',
    keyChallenge: 'Steep valley topography isolating young people in upper valley towns (Todmorden, Hebden) from Halifax jobs.',
    mappedInitiativesCount: 4,
    openGapsCount: 9,
    highlightedPriority: 'Valley digital remote working hubs and on-demand micro-transit for young apprentices.'
  },
  {
    id: 'sheffield',
    name: 'Sheffield',
    region: 'South Yorkshire',
    onsCode: 'E08000019',
    deprivedOneDimPercent: 33.4,
    deprivedTwoDimPercent: 14.1,
    deprivedThreeDimPercent: 3.7,
    notDeprivedPercent: 48.8,
    educationDeprivationPercent: 18.4,
    employmentDeprivationPercent: 15.9,
    healthDeprivationPercent: 17.8,
    youthNeetPercent: 5.2,
    skillsDeficitPercent: 21.8,
    housingDeprivedPercent: 16.9,
    population: '556,500',
    keyChallenge: 'Pronounced east-west divide; high deprivation in Burngreave, Manor & Darnall contrasting affluent south-west.',
    mappedInitiativesCount: 8,
    openGapsCount: 22,
    highlightedPriority: 'East Sheffield community innovation corridor & University-backed non-graduate apprenticeships.'
  },
  {
    id: 'leeds',
    name: 'Leeds',
    region: 'West Yorkshire',
    onsCode: 'E08000035',
    deprivedOneDimPercent: 32.2,
    deprivedTwoDimPercent: 13.4,
    deprivedThreeDimPercent: 3.4,
    notDeprivedPercent: 51.0,
    educationDeprivationPercent: 17.6,
    employmentDeprivationPercent: 14.9,
    healthDeprivationPercent: 16.7,
    youthNeetPercent: 4.8,
    skillsDeficitPercent: 19.8,
    housingDeprivedPercent: 17.5,
    population: '812,000',
    keyChallenge: 'Inner-city pockets in Harehills, Burmantofts & Beeston disconnected from booming financial/digital core.',
    mappedInitiativesCount: 11,
    openGapsCount: 26,
    highlightedPriority: 'Neighborhood tech access centers & direct corporate youth sponsorship coalitions.'
  },
  {
    id: 'east_riding',
    name: 'East Riding of Yorkshire',
    region: 'East Yorkshire',
    onsCode: 'E06000011',
    deprivedOneDimPercent: 31.0,
    deprivedTwoDimPercent: 11.8,
    deprivedThreeDimPercent: 2.7,
    notDeprivedPercent: 54.5,
    educationDeprivationPercent: 16.2,
    employmentDeprivationPercent: 13.5,
    healthDeprivationPercent: 15.4,
    youthNeetPercent: 3.9,
    skillsDeficitPercent: 18.6,
    housingDeprivedPercent: 14.1,
    population: '342,200',
    keyChallenge: 'Dispersed rural and coastal villages (Bridlington, Hornsea) with seasonal employment and long commute distances.',
    mappedInitiativesCount: 3,
    openGapsCount: 7,
    highlightedPriority: 'Coastal youth skills accelerator & rural digital enterprise loans.'
  },
  {
    id: 'north_yorkshire',
    name: 'North Yorkshire',
    region: 'North Yorkshire',
    onsCode: 'E06000065',
    deprivedOneDimPercent: 29.8,
    deprivedTwoDimPercent: 11.2,
    deprivedThreeDimPercent: 2.4,
    notDeprivedPercent: 56.6,
    educationDeprivationPercent: 15.4,
    employmentDeprivationPercent: 12.8,
    healthDeprivationPercent: 14.6,
    youthNeetPercent: 3.6,
    skillsDeficitPercent: 17.5,
    housingDeprivedPercent: 14.8,
    population: '615,400',
    keyChallenge: 'Scarborough coastal deprivation and rural Dales lack of youth training facilities.',
    mappedInitiativesCount: 4,
    openGapsCount: 8,
    highlightedPriority: 'Green agriculture & tech training hubs in market towns.'
  },
  {
    id: 'york',
    name: 'York',
    region: 'North Yorkshire',
    onsCode: 'E06000014',
    deprivedOneDimPercent: 27.9,
    deprivedTwoDimPercent: 10.1,
    deprivedThreeDimPercent: 2.1,
    notDeprivedPercent: 59.9,
    educationDeprivationPercent: 14.2,
    employmentDeprivationPercent: 11.7,
    healthDeprivationPercent: 13.9,
    youthNeetPercent: 3.2,
    skillsDeficitPercent: 15.4,
    housingDeprivedPercent: 15.6,
    population: '202,800',
    keyChallenge: 'High housing costs locking out young talent; low-wage tourism economy traps.',
    mappedInitiativesCount: 4,
    openGapsCount: 6,
    highlightedPriority: 'Bio-tech and railway tech degree apprenticeships for local residents.'
  }
];

const WALES_DISTRICTS: LocalAuthorityData[] = [
  {
    id: 'blaenau',
    name: 'Blaenau Gwent',
    region: 'South East Wales',
    onsCode: 'W06000019',
    deprivedOneDimPercent: 39.1,
    deprivedTwoDimPercent: 17.5,
    deprivedThreeDimPercent: 5.1,
    notDeprivedPercent: 38.3,
    educationDeprivationPercent: 23.4,
    employmentDeprivationPercent: 20.5,
    healthDeprivationPercent: 21.2,
    youthNeetPercent: 7.1,
    skillsDeficitPercent: 28.2,
    housingDeprivedPercent: 16.8,
    population: '66,900',
    keyChallenge: 'Highest household deprivation in Wales; limited post-16 vocational transit down Ebbw Valley corridor.',
    mappedInitiativesCount: 5,
    openGapsCount: 15,
    highlightedPriority: 'Ebbw Vale digital tech academy & valley community transport shuttle.'
  },
  {
    id: 'merthyr',
    name: 'Merthyr Tydfil',
    region: 'South East Wales',
    onsCode: 'W06000024',
    deprivedOneDimPercent: 38.8,
    deprivedTwoDimPercent: 17.2,
    deprivedThreeDimPercent: 4.9,
    notDeprivedPercent: 39.1,
    educationDeprivationPercent: 23.1,
    employmentDeprivationPercent: 20.2,
    healthDeprivationPercent: 21.0,
    youthNeetPercent: 7.0,
    skillsDeficitPercent: 27.9,
    housingDeprivedPercent: 17.1,
    population: '58,800',
    keyChallenge: 'Post-coalfield youth isolation and transport gaps down the Taff Corridor.',
    mappedInitiativesCount: 6,
    openGapsCount: 16,
    highlightedPriority: 'CYO mobile career vans & Valleys green retrofit apprenticeships.'
  },
  {
    id: 'rct',
    name: 'Rhondda Cynon Taf',
    region: 'South East Wales',
    onsCode: 'W06000016',
    deprivedOneDimPercent: 36.5,
    deprivedTwoDimPercent: 15.1,
    deprivedThreeDimPercent: 4.2,
    notDeprivedPercent: 44.2,
    educationDeprivationPercent: 21.0,
    employmentDeprivationPercent: 18.1,
    healthDeprivationPercent: 19.5,
    youthNeetPercent: 6.2,
    skillsDeficitPercent: 24.8,
    housingDeprivedPercent: 15.4,
    population: '237,700',
    keyChallenge: 'Evening shift public transport gaps for young logistics & retail workers in upper Rhondda.',
    mappedInitiativesCount: 8,
    openGapsCount: 22,
    highlightedPriority: 'Evening valley bus pass guarantee & construction apprenticeships.'
  },
  {
    id: 'caerphilly',
    name: 'Caerphilly',
    region: 'South East Wales',
    onsCode: 'W06000018',
    deprivedOneDimPercent: 35.8,
    deprivedTwoDimPercent: 14.8,
    deprivedThreeDimPercent: 4.0,
    notDeprivedPercent: 45.4,
    educationDeprivationPercent: 20.5,
    employmentDeprivationPercent: 17.6,
    healthDeprivationPercent: 19.1,
    youthNeetPercent: 5.9,
    skillsDeficitPercent: 24.1,
    housingDeprivedPercent: 15.2,
    population: '175,900',
    keyChallenge: 'Former coalfield community youth digital inclusion and apprenticeships in light manufacturing.',
    mappedInitiativesCount: 6,
    openGapsCount: 14,
    highlightedPriority: 'Oakdale industrial park youth shuttle & digital skills makerspace.'
  },
  {
    id: 'neath',
    name: 'Neath Port Talbot',
    region: 'South West Wales',
    onsCode: 'W06000012',
    deprivedOneDimPercent: 36.9,
    deprivedTwoDimPercent: 15.6,
    deprivedThreeDimPercent: 4.3,
    notDeprivedPercent: 43.2,
    educationDeprivationPercent: 21.4,
    employmentDeprivationPercent: 18.7,
    healthDeprivationPercent: 20.1,
    youthNeetPercent: 6.5,
    skillsDeficitPercent: 25.5,
    housingDeprivedPercent: 15.7,
    population: '142,300',
    keyChallenge: 'Industrial steel transition impact on young engineering recruits & coastal valley health disparities.',
    mappedInitiativesCount: 5,
    openGapsCount: 13,
    highlightedPriority: 'Celtic Sea green hydrogen & renewable fabrication apprenticeships.'
  },
  {
    id: 'torfaen',
    name: 'Torfaen',
    region: 'South East Wales',
    onsCode: 'W06000020',
    deprivedOneDimPercent: 35.2,
    deprivedTwoDimPercent: 14.5,
    deprivedThreeDimPercent: 3.8,
    notDeprivedPercent: 46.5,
    educationDeprivationPercent: 19.9,
    employmentDeprivationPercent: 17.2,
    healthDeprivationPercent: 18.8,
    youthNeetPercent: 5.7,
    skillsDeficitPercent: 23.6,
    housingDeprivedPercent: 15.0,
    population: '92,300',
    keyChallenge: 'Pontypool and Blaenavon valley public transit connectivity to Cwmbran commercial hubs.',
    mappedInitiativesCount: 4,
    openGapsCount: 10,
    highlightedPriority: 'Valley transit youth passes & med-tech health science traineeships.'
  },
  {
    id: 'newport',
    name: 'Newport',
    region: 'South East Wales',
    onsCode: 'W06000022',
    deprivedOneDimPercent: 34.9,
    deprivedTwoDimPercent: 14.7,
    deprivedThreeDimPercent: 4.1,
    notDeprivedPercent: 46.3,
    educationDeprivationPercent: 19.6,
    employmentDeprivationPercent: 17.0,
    healthDeprivationPercent: 18.4,
    youthNeetPercent: 5.6,
    skillsDeficitPercent: 23.0,
    housingDeprivedPercent: 17.2,
    population: '159,600',
    keyChallenge: 'Pillgwenlly and Ringland youth services deficit; compound semiconductor cluster talent pipeline.',
    mappedInitiativesCount: 7,
    openGapsCount: 18,
    highlightedPriority: 'Newport semiconductor cluster technician scholarships & community youth mentors.'
  },
  {
    id: 'swansea',
    name: 'Swansea',
    region: 'South West Wales',
    onsCode: 'W06000011',
    deprivedOneDimPercent: 34.4,
    deprivedTwoDimPercent: 14.2,
    deprivedThreeDimPercent: 3.8,
    notDeprivedPercent: 47.6,
    educationDeprivationPercent: 19.1,
    employmentDeprivationPercent: 16.5,
    healthDeprivationPercent: 18.0,
    youthNeetPercent: 5.2,
    skillsDeficitPercent: 22.1,
    housingDeprivedPercent: 17.0,
    population: '238,500',
    keyChallenge: 'Eastside & Penderry child poverty pockets contrasted with university tech district.',
    mappedInitiativesCount: 9,
    openGapsCount: 20,
    highlightedPriority: 'Bay Campus tech incubators for non-graduates & Townhill community creative workshops.'
  },
  {
    id: 'bridgend',
    name: 'Bridgend',
    region: 'South East Wales',
    onsCode: 'W06000013',
    deprivedOneDimPercent: 34.1,
    deprivedTwoDimPercent: 13.9,
    deprivedThreeDimPercent: 3.6,
    notDeprivedPercent: 48.4,
    educationDeprivationPercent: 18.8,
    employmentDeprivationPercent: 16.2,
    healthDeprivationPercent: 17.7,
    youthNeetPercent: 5.1,
    skillsDeficitPercent: 21.9,
    housingDeprivedPercent: 15.3,
    population: '145,500',
    keyChallenge: 'Upper Llynfi & Garw valley travel constraints; post-automotive plant re-skilling.',
    mappedInitiativesCount: 5,
    openGapsCount: 11,
    highlightedPriority: 'Valleys micro-mobility electric bikes & automotive green retrofitting credentials.'
  },
  {
    id: 'wrexham',
    name: 'Wrexham',
    region: 'North Wales',
    onsCode: 'W06000006',
    deprivedOneDimPercent: 34.0,
    deprivedTwoDimPercent: 13.9,
    deprivedThreeDimPercent: 3.5,
    notDeprivedPercent: 48.6,
    educationDeprivationPercent: 18.9,
    employmentDeprivationPercent: 16.4,
    healthDeprivationPercent: 17.8,
    youthNeetPercent: 5.3,
    skillsDeficitPercent: 22.5,
    housingDeprivedPercent: 14.8,
    population: '135,100',
    keyChallenge: 'Industrial estate shift transit; cross-border employment gaps to Cheshire.',
    mappedInitiativesCount: 5,
    openGapsCount: 12,
    highlightedPriority: 'Wrexham Industrial Estate green shift shuttles & advanced pharma apprenticeships.'
  },
  {
    id: 'denbighshire',
    name: 'Denbighshire',
    region: 'North Wales',
    onsCode: 'W06000004',
    deprivedOneDimPercent: 34.2,
    deprivedTwoDimPercent: 14.1,
    deprivedThreeDimPercent: 3.6,
    notDeprivedPercent: 48.1,
    educationDeprivationPercent: 19.0,
    employmentDeprivationPercent: 16.6,
    healthDeprivationPercent: 18.1,
    youthNeetPercent: 5.4,
    skillsDeficitPercent: 22.8,
    housingDeprivedPercent: 16.2,
    population: '95,800',
    keyChallenge: 'Rhyl West coastal deprivation pocket; youth employment seasonality.',
    mappedInitiativesCount: 4,
    openGapsCount: 11,
    highlightedPriority: 'Rhyl coastal digital enterprise school & year-round hospitality management credentials.'
  },
  {
    id: 'carmarthenshire',
    name: 'Carmarthenshire',
    region: 'South West Wales',
    onsCode: 'W06000010',
    deprivedOneDimPercent: 33.9,
    deprivedTwoDimPercent: 13.7,
    deprivedThreeDimPercent: 3.4,
    notDeprivedPercent: 49.0,
    educationDeprivationPercent: 18.5,
    employmentDeprivationPercent: 15.9,
    healthDeprivationPercent: 17.5,
    youthNeetPercent: 4.9,
    skillsDeficitPercent: 21.6,
    housingDeprivedPercent: 14.9,
    population: '187,900',
    keyChallenge: 'Llanelli town-center youth disengagement and rural west bus route contraction.',
    mappedInitiativesCount: 6,
    openGapsCount: 12,
    highlightedPriority: 'Pentref Tegfan health & well-being life science youth traineeships.'
  },
  {
    id: 'pembrokeshire',
    name: 'Pembrokeshire',
    region: 'South West Wales',
    onsCode: 'W06000009',
    deprivedOneDimPercent: 33.6,
    deprivedTwoDimPercent: 13.5,
    deprivedThreeDimPercent: 3.3,
    notDeprivedPercent: 49.6,
    educationDeprivationPercent: 18.2,
    employmentDeprivationPercent: 15.7,
    healthDeprivationPercent: 17.2,
    youthNeetPercent: 4.8,
    skillsDeficitPercent: 21.3,
    housingDeprivedPercent: 15.8,
    population: '123,400',
    keyChallenge: 'Pembroke Dock and Milford Haven industrial harbor transitions; seasonal tourism swings.',
    mappedInitiativesCount: 4,
    openGapsCount: 9,
    highlightedPriority: 'Milford Haven floating offshore wind marine apprentice network.'
  },
  {
    id: 'conwy',
    name: 'Conwy',
    region: 'North Wales',
    onsCode: 'W06000003',
    deprivedOneDimPercent: 33.5,
    deprivedTwoDimPercent: 13.3,
    deprivedThreeDimPercent: 3.2,
    notDeprivedPercent: 50.0,
    educationDeprivationPercent: 18.1,
    employmentDeprivationPercent: 15.5,
    healthDeprivationPercent: 17.0,
    youthNeetPercent: 4.6,
    skillsDeficitPercent: 21.0,
    housingDeprivedPercent: 16.5,
    population: '114,800',
    keyChallenge: 'Aging demographic skew in Colwyn Bay and Llandudno limiting local youth career options.',
    mappedInitiativesCount: 4,
    openGapsCount: 8,
    highlightedPriority: 'Creative tech and adventure tourism enterprise incubators.'
  },
  {
    id: 'gwynedd',
    name: 'Gwynedd',
    region: 'North Wales',
    onsCode: 'W06000002',
    deprivedOneDimPercent: 33.3,
    deprivedTwoDimPercent: 13.1,
    deprivedThreeDimPercent: 3.1,
    notDeprivedPercent: 50.5,
    educationDeprivationPercent: 18.0,
    employmentDeprivationPercent: 15.4,
    healthDeprivationPercent: 16.9,
    youthNeetPercent: 4.5,
    skillsDeficitPercent: 20.8,
    housingDeprivedPercent: 17.8,
    population: '117,400',
    keyChallenge: 'Severe rural holiday home housing pressures in Llŷn Peninsula pushing out local youth.',
    mappedInitiativesCount: 5,
    openGapsCount: 10,
    highlightedPriority: 'Welsh language digital media production & rural eco-construction credentials.'
  },
  {
    id: 'ceredigion',
    name: 'Ceredigion',
    region: 'Mid Wales',
    onsCode: 'W06000008',
    deprivedOneDimPercent: 32.8,
    deprivedTwoDimPercent: 12.6,
    deprivedThreeDimPercent: 2.9,
    notDeprivedPercent: 51.7,
    educationDeprivationPercent: 17.5,
    employmentDeprivationPercent: 14.8,
    healthDeprivationPercent: 16.2,
    youthNeetPercent: 4.2,
    skillsDeficitPercent: 19.8,
    housingDeprivedPercent: 17.4,
    population: '71,500',
    keyChallenge: 'Aberystwyth graduate retention and remote agricultural community broadband voids.',
    mappedInitiativesCount: 4,
    openGapsCount: 7,
    highlightedPriority: 'Agri-tech robotics traineeships and mid-Wales remote co-working passes.'
  },
  {
    id: 'powys',
    name: 'Powys',
    region: 'Mid Wales',
    onsCode: 'W06000023',
    deprivedOneDimPercent: 32.2,
    deprivedTwoDimPercent: 12.2,
    deprivedThreeDimPercent: 2.7,
    notDeprivedPercent: 53.9,
    educationDeprivationPercent: 16.5,
    employmentDeprivationPercent: 14.1,
    healthDeprivationPercent: 15.4,
    youthNeetPercent: 3.9,
    skillsDeficitPercent: 19.2,
    housingDeprivedPercent: 15.6,
    population: '133,200',
    keyChallenge: 'Sparsest population density in England & Wales; critical public transit scarcity.',
    mappedInitiativesCount: 4,
    openGapsCount: 9,
    highlightedPriority: 'Powys rural on-demand transit & digital community workhubs.'
  },
  {
    id: 'anglesey',
    name: 'Isle of Anglesey',
    region: 'North Wales',
    onsCode: 'W06000001',
    deprivedOneDimPercent: 33.1,
    deprivedTwoDimPercent: 12.9,
    deprivedThreeDimPercent: 3.0,
    notDeprivedPercent: 51.0,
    educationDeprivationPercent: 17.9,
    employmentDeprivationPercent: 15.2,
    healthDeprivationPercent: 16.8,
    youthNeetPercent: 4.7,
    skillsDeficitPercent: 21.2,
    housingDeprivedPercent: 16.1,
    population: '68,900',
    keyChallenge: 'Island geographic isolation in Holyhead; post-ferry port modernization needs.',
    mappedInitiativesCount: 4,
    openGapsCount: 8,
    highlightedPriority: 'Holyhead marine energy academy & island youth travel network.'
  },
  {
    id: 'flintshire',
    name: 'Flintshire',
    region: 'North Wales',
    onsCode: 'W06000005',
    deprivedOneDimPercent: 31.2,
    deprivedTwoDimPercent: 12.1,
    deprivedThreeDimPercent: 2.8,
    notDeprivedPercent: 53.9,
    educationDeprivationPercent: 16.8,
    employmentDeprivationPercent: 14.3,
    healthDeprivationPercent: 15.9,
    youthNeetPercent: 4.0,
    skillsDeficitPercent: 19.0,
    housingDeprivedPercent: 14.2,
    population: '155,000',
    keyChallenge: 'Broughton aerospace cluster supply chain transitions and Deeside youth upskilling.',
    mappedInitiativesCount: 5,
    openGapsCount: 9,
    highlightedPriority: 'AMRC Cymru advanced manufacturing precision engineering apprenticeships.'
  },
  {
    id: 'cardiff',
    name: 'Cardiff',
    region: 'South East Wales',
    onsCode: 'W06000015',
    deprivedOneDimPercent: 30.8,
    deprivedTwoDimPercent: 12.2,
    deprivedThreeDimPercent: 3.0,
    notDeprivedPercent: 54.0,
    educationDeprivationPercent: 16.5,
    employmentDeprivationPercent: 14.2,
    healthDeprivationPercent: 15.8,
    youthNeetPercent: 3.9,
    skillsDeficitPercent: 18.2,
    housingDeprivedPercent: 18.0,
    population: '362,400',
    keyChallenge: 'Severe inner-city southern arc deprivation (Ely, Adamsdown, Splott).',
    mappedInitiativesCount: 12,
    openGapsCount: 30,
    highlightedPriority: 'Cardiff Media Alliance mentoring & creative industry diversity charter.'
  },
  {
    id: 'vale',
    name: 'Vale of Glamorgan',
    region: 'South East Wales',
    onsCode: 'W06000014',
    deprivedOneDimPercent: 29.2,
    deprivedTwoDimPercent: 11.1,
    deprivedThreeDimPercent: 2.5,
    notDeprivedPercent: 57.2,
    educationDeprivationPercent: 15.0,
    employmentDeprivationPercent: 13.0,
    healthDeprivationPercent: 14.6,
    youthNeetPercent: 3.4,
    skillsDeficitPercent: 16.9,
    housingDeprivedPercent: 15.9,
    population: '131,800',
    keyChallenge: 'Barry waterfront regeneration pockets versus wealthy rural hinterland divide.',
    mappedInitiativesCount: 4,
    openGapsCount: 8,
    highlightedPriority: 'Barry creative maritime makerspace & youth enterprise grants.'
  },
  {
    id: 'monmouthshire',
    name: 'Monmouthshire',
    region: 'South East Wales',
    onsCode: 'W06000021',
    deprivedOneDimPercent: 27.6,
    deprivedTwoDimPercent: 10.2,
    deprivedThreeDimPercent: 2.1,
    notDeprivedPercent: 60.1,
    educationDeprivationPercent: 13.9,
    employmentDeprivationPercent: 11.8,
    healthDeprivationPercent: 13.5,
    youthNeetPercent: 2.9,
    skillsDeficitPercent: 15.2,
    housingDeprivedPercent: 14.6,
    population: '93,000',
    keyChallenge: 'High rural house prices locking out local young workers; agricultural transport barriers.',
    mappedInitiativesCount: 3,
    openGapsCount: 6,
    highlightedPriority: 'Rural apprenticeships in land-based tech & affordable youth travel passes.'
  }
];

interface PlaceCensusMapProps {
  placeName: 'Wales' | 'Yorkshire';
}

export const PlaceCensusMap: React.FC<PlaceCensusMapProps> = ({ placeName }) => {
  const [activePlace, setActivePlace] = useState<'Wales' | 'Yorkshire'>(placeName);

  // Keep activePlace synced if parent switches
  useEffect(() => {
    setActivePlace(placeName);
  }, [placeName]);

  const isYorkshire = activePlace.toLowerCase() === 'yorkshire';
  const districts = useMemo(() => isYorkshire ? YORKSHIRE_DISTRICTS : WALES_DISTRICTS, [isYorkshire]);

  const regions = useMemo(() => Array.from(new Set(districts.map(d => d.region))), [districts]);

  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedMetric, setSelectedMetric] = useState<'deprived' | 'neet' | 'skills' | 'housing'>('deprived');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(districts[0]?.id || 'blaenau');
  const [activeMapView, setActiveMapView] = useState<'map' | 'cards'>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Refs for managing Leaflet without memory leaks or race conditions
  const leafletMapRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);
  const selectedDistrictIdRef = useRef<string>(selectedDistrictId);
  const selectedMetricRef = useRef(selectedMetric);

  // Keep refs in sync
  useEffect(() => {
    selectedDistrictIdRef.current = selectedDistrictId;
  }, [selectedDistrictId]);

  useEffect(() => {
    selectedMetricRef.current = selectedMetric;
  }, [selectedMetric]);

  // When place changes, reset selection to first district in that place
  useEffect(() => {
    if (districts.length > 0) {
      setSelectedDistrictId(districts[0].id);
      selectedDistrictIdRef.current = districts[0].id;
    }
    setSelectedRegion('All');
    setSearchQuery('');
  }, [activePlace, districts]);

  const filteredDistricts = useMemo(() => {
    return districts.filter(d => {
      const matchRegion = selectedRegion === 'All' || d.region === selectedRegion;
      const matchSearch = searchQuery.trim() === '' || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.onsCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [districts, selectedRegion, searchQuery]);

  const selectedDistrict = useMemo(() => {
    return districts.find(d => d.id === selectedDistrictId) || districts[0];
  }, [districts, selectedDistrictId]);

  // Metric color scale calculation
  const getMetricFillColor = (d: LocalAuthorityData, metric: 'deprived' | 'neet' | 'skills' | 'housing') => {
    switch (metric) {
      case 'deprived': {
        const p = d.deprivedOneDimPercent;
        if (p >= 38.0) return '#be123c'; // rose-700
        if (p >= 35.0) return '#ea580c'; // orange-600
        if (p >= 33.0) return '#eab308'; // yellow-500
        if (p >= 30.0) return '#06b6d4'; // cyan-500
        return '#0d9488'; // teal-600
      }
      case 'neet': {
        const p = d.youthNeetPercent;
        if (p >= 6.5) return '#be123c';
        if (p >= 5.5) return '#ea580c';
        if (p >= 4.5) return '#eab308';
        if (p >= 3.8) return '#06b6d4';
        return '#0d9488';
      }
      case 'skills': {
        const p = d.skillsDeficitPercent;
        if (p >= 26.0) return '#be123c';
        if (p >= 23.0) return '#ea580c';
        if (p >= 20.0) return '#eab308';
        if (p >= 17.0) return '#06b6d4';
        return '#0d9488';
      }
      case 'housing': {
        const p = d.housingDeprivedPercent;
        if (p >= 17.5) return '#be123c';
        if (p >= 16.0) return '#ea580c';
        if (p >= 15.0) return '#eab308';
        if (p >= 14.0) return '#06b6d4';
        return '#0d9488';
      }
    }
  };

  const getMetricLabelAndValue = (d: LocalAuthorityData) => {
    switch (selectedMetric) {
      case 'deprived':
        return { label: 'Household Deprivation (1+ Dim)', value: `${d.deprivedOneDimPercent}%` };
      case 'neet':
        return { label: 'Youth NEET Rate (16-24)', value: `${d.youthNeetPercent}%` };
      case 'skills':
        return { label: 'Skills Deficit (Level 2)', value: `${d.skillsDeficitPercent}%` };
      case 'housing':
        return { label: 'Housing Deprivation', value: `${d.housingDeprivedPercent}%` };
    }
  };

  // Helper to match GeoJSON feature with district in state
  const matchFeatureToDistrict = (feature: any) => {
    const rawName = (
      feature.properties?.LAD13NM || 
      feature.properties?.LAD24NM || 
      feature.properties?.LAD22NM || 
      feature.properties?.name || 
      ''
    ).trim();

    const code = (
      feature.properties?.LAD13CD || 
      feature.properties?.LAD24CD || 
      feature.properties?.LAD22CD || 
      feature.properties?.code || 
      ''
    ).trim();

    if (code) {
      const byCode = districts.find(d => d.onsCode === code);
      if (byCode) return byCode;
    }

    const clean = rawName.toLowerCase();
    return districts.find(d => {
      const dName = d.name.toLowerCase();
      return dName === clean || dName.includes(clean) || clean.includes(dName);
    });
  };

  // Layer style applicator
  const applyLayerStyle = (layer: any, feature: any, targetSelectedId: string, metric: any) => {
    const matched = matchFeatureToDistrict(feature);
    const isSelected = matched && matched.id === targetSelectedId;
    const fillColor = matched ? getMetricFillColor(matched, metric) : '#94a3b8';

    layer.setStyle({
      fillColor,
      weight: isSelected ? 3.5 : 1.2,
      opacity: 1,
      color: isSelected ? '#0d4b4f' : '#ffffff',
      fillOpacity: isSelected ? 0.92 : 0.68
    });

    if (isSelected && layer.bringToFront) {
      layer.bringToFront();
    }
  };

  // --------------------------------------------------------------------------
  // LEAFLET MAP INITIALIZATION & EVENT WIRING
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (activeMapView !== 'map') return;

    const L = (window as any).L;
    if (!L) return;

    let isMounted = true;

    // Destroy any existing map
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
      geoLayerRef.current = null;
    }

    const timer = setTimeout(() => {
      const container = document.getElementById('deprivation-native-map-container');
      if (!container || !isMounted) return;

      const centerCoords: [number, number] = isYorkshire ? [53.8, -1.4] : [52.28, -3.75];
      const zoomLevel = isYorkshire ? 8.2 : 7.6;

      const map = L.map('deprivation-native-map-container', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      }).setView(centerCoords, zoomLevel);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 5,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      leafletMapRef.current = map;

      const jsonUrl = isYorkshire
        ? (import.meta.env.BASE_URL + 'yorkshire_local_authorities.json')
        : (import.meta.env.BASE_URL + 'wales_local_authorities.json');

      fetch(jsonUrl)
        .then(res => res.json())
        .then(geoData => {
          if (!isMounted || !leafletMapRef.current) return;

          const geoLayer = L.geoJSON(geoData, {
            style: (feature: any) => {
              const matched = matchFeatureToDistrict(feature);
              const isSelected = matched && matched.id === selectedDistrictIdRef.current;
              const fillColor = matched ? getMetricFillColor(matched, selectedMetricRef.current) : '#94a3b8';

              return {
                fillColor,
                weight: isSelected ? 3.5 : 1.2,
                opacity: 1,
                color: isSelected ? '#0d4b4f' : '#ffffff',
                fillOpacity: isSelected ? 0.92 : 0.68
              };
            },
            onEachFeature: (feature: any, layer: any) => {
              const matched = matchFeatureToDistrict(feature);

              if (matched) {
                // Interactive rich tooltip
                layer.bindTooltip(`
                  <div style="font-family: Inter, sans-serif; padding: 6px 8px; min-width: 160px; line-height: 1.3;">
                    <div style="font-weight: 800; font-size: 13px; color: #1a2521; margin-bottom: 2px;">
                      ${matched.name}
                    </div>
                    <div style="font-size: 11px; color: #51615a; margin-bottom: 3px;">
                      ONS Code: <strong style="color: #176e73;">${matched.onsCode}</strong>
                    </div>
                    <div style="font-size: 11px; color: #1a2521; font-weight: 700;">
                      Deprivation: <span style="color: #be123c; font-size: 12px;">${matched.deprivedOneDimPercent}%</span> (1+ Dim)
                    </div>
                    <div style="font-size: 10px; color: #ea580c; font-weight: 600;">
                      Youth NEET: ${matched.youthNeetPercent}%
                    </div>
                    <div style="font-size: 10px; color: #176e73; font-weight: 800; margin-top: 4px; border-top: 1px dashed #d8d8d2; padding-top: 3px;">
                      👉 Click to inspect area statistics
                    </div>
                  </div>
                `, { sticky: true, opacity: 0.98, className: 'leaflet-custom-tooltip' });

                layer.on({
                  click: () => {
                    // 1. Immediately update state
                    setSelectedDistrictId(matched.id);
                    selectedDistrictIdRef.current = matched.id;

                    // 2. Re-style all layers immediately so this region highlights
                    if (geoLayerRef.current) {
                      geoLayerRef.current.eachLayer((l: any) => {
                        applyLayerStyle(l, l.feature, matched.id, selectedMetricRef.current);
                      });
                    }

                    // 3. Bring to front and pan gently
                    layer.bringToFront();
                    if (layer.getBounds && leafletMapRef.current) {
                      leafletMapRef.current.panTo(layer.getBounds().getCenter(), { animate: true, duration: 0.35 });
                    }
                  },
                  mouseover: (e: any) => {
                    const l = e.target;
                    const isCurr = matched.id === selectedDistrictIdRef.current;
                    if (!isCurr) {
                      l.setStyle({
                        weight: 2.5,
                        color: '#29B6BD',
                        fillOpacity: 0.85
                      });
                      if (l.bringToFront) l.bringToFront();
                    }
                  },
                  mouseout: (e: any) => {
                    const l = e.target;
                    applyLayerStyle(l, l.feature, selectedDistrictIdRef.current, selectedMetricRef.current);
                  }
                });
              }
            }
          }).addTo(leafletMapRef.current);

          geoLayerRef.current = geoLayer;
          leafletMapRef.current.fitBounds(geoLayer.getBounds().pad(0.06));
          map.invalidateSize();
        })
        .catch(err => {
          console.error("Error loading GeoJSON for deprivation map:", err);
        });
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        geoLayerRef.current = null;
      }
    };
  }, [activePlace, activeMapView]);

  // Re-apply styles when selectedDistrictId or selectedMetric changes
  useEffect(() => {
    selectedDistrictIdRef.current = selectedDistrictId;
    selectedMetricRef.current = selectedMetric;

    if (geoLayerRef.current && activeMapView === 'map') {
      geoLayerRef.current.eachLayer((layer: any) => {
        applyLayerStyle(layer, layer.feature, selectedDistrictId, selectedMetric);
      });
    }
  }, [selectedDistrictId, selectedMetric, activeMapView]);

  // Reset map view to full bounds
  const handleResetMapView = () => {
    if (leafletMapRef.current && geoLayerRef.current) {
      leafletMapRef.current.fitBounds(geoLayerRef.current.getBounds().pad(0.06), { animate: true });
    }
  };

  // Programmatic select and pan to district
  const handleSelectDistrict = (districtId: string) => {
    setSelectedDistrictId(districtId);
    selectedDistrictIdRef.current = districtId;

    if (geoLayerRef.current && activeMapView === 'map') {
      geoLayerRef.current.eachLayer((layer: any) => {
        applyLayerStyle(layer, layer.feature, districtId, selectedMetric);
        const matched = matchFeatureToDistrict(layer.feature);
        if (matched && matched.id === districtId) {
          layer.bringToFront();
          if (leafletMapRef.current && layer.getBounds) {
            leafletMapRef.current.panTo(layer.getBounds().getCenter(), { animate: true, duration: 0.4 });
          }
        }
      });
    }
  };

  // Direct link to ONS Census 2021 external portal for the active district
  const onsExternalUrl = `https://www.ons.gov.uk/census/maps/choropleth/population/household-deprivation/hh-deprivation/household-is-deprived-in-one-dimension?lad=${selectedDistrict.onsCode}`;

  return (
    <div className="w-full bg-white rounded-2xl border border-[#e1e1db] p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Header & Source Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e1e1db] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
              ONS Census 2021 Data Layer
            </span>
            <span className="text-xs text-[#51615a]">Household Deprivation & Need Analysis</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1a2521] tracking-tight mt-1 flex items-center gap-2 flex-wrap">
            <span>{activePlace} Household Deprivation Map</span>
            <span className="text-sm font-semibold text-[#51615a]">
              ({districts.length} Local Authority Areas)
            </span>
          </h3>
        </div>

        {/* Place Switcher + Direct ONS Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-lg border border-[#d8d8d2] p-0.5 bg-[#F4F4F0]">
            <button
              onClick={() => setActivePlace('Wales')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                !isYorkshire
                  ? 'bg-[#176e73] text-white shadow-2xs'
                  : 'text-[#51615a] hover:text-[#1a2521]'
              }`}
            >
              Wales ({WALES_DISTRICTS.length})
            </button>
            <button
              onClick={() => setActivePlace('Yorkshire')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                isYorkshire
                  ? 'bg-[#176e73] text-white shadow-2xs'
                  : 'text-[#51615a] hover:text-[#1a2521]'
              }`}
            >
              Yorkshire ({YORKSHIRE_DISTRICTS.length})
            </button>
          </div>

          <a 
            href={onsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-[#176e73] border border-[#d8d8d2] text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Open official ONS Census map in a new tab"
          >
            <span>ONS Census Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="bg-[#f0f9f9] border border-[#c4e9ea] rounded-xl p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#176e73] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1c4b4e] leading-relaxed">
          <strong>Interactive Deprivation Map (Zero Cookie Popups):</strong> Click any district directly on the map below to immediately inspect its 4-dimension ONS household deprivation profile, youth NEET rate, population, and strategic intervention priorities on the right panel.
        </div>
      </div>

      {/* Main Controls Bar: View mode, Metrics, and Region filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#F4F4F0] p-2.5 rounded-xl border border-[#e1e1db]">
        {/* View Switcher: Interactive Map vs Grid Cards */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-[#51615a] px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#176e73]" />
            <span>Display:</span>
          </span>
          <button
            onClick={() => setActiveMapView('map')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeMapView === 'map'
                ? 'bg-[#176e73] text-white shadow-2xs'
                : 'text-[#51615a] hover:bg-white/80'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setActiveMapView('cards')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeMapView === 'cards'
                ? 'bg-[#176e73] text-white shadow-2xs'
                : 'text-[#51615a] hover:bg-white/80'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>District Cards</span>
          </button>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-bold text-[#51615a] px-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#176e73]" />
            <span>Color Metric:</span>
          </span>
          <button
            onClick={() => setSelectedMetric('deprived')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              selectedMetric === 'deprived' 
                ? 'bg-[#176e73] text-white' 
                : 'text-[#51615a] hover:bg-white'
            }`}
          >
            1+ Dim Deprived
          </button>
          <button
            onClick={() => setSelectedMetric('neet')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              selectedMetric === 'neet' 
                ? 'bg-[#176e73] text-white' 
                : 'text-[#51615a] hover:bg-white'
            }`}
          >
            Youth NEET
          </button>
          <button
            onClick={() => setSelectedMetric('skills')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              selectedMetric === 'skills' 
                ? 'bg-[#176e73] text-white' 
                : 'text-[#51615a] hover:bg-white'
            }`}
          >
            Skills Deficit
          </button>
          <button
            onClick={() => setSelectedMetric('housing')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              selectedMetric === 'housing' 
                ? 'bg-[#176e73] text-white' 
                : 'text-[#51615a] hover:bg-white'
            }`}
          >
            Housing
          </button>
        </div>

        {/* Region Filter */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-bold text-[#51615a] px-1">Region:</span>
          <button
            onClick={() => setSelectedRegion('All')}
            className={`px-2 py-0.5 text-xs font-bold rounded-md transition cursor-pointer ${
              selectedRegion === 'All' ? 'bg-[#29B6BD] text-slate-950' : 'text-[#51615a] hover:bg-white'
            }`}
          >
            All
          </button>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-2 py-0.5 text-xs font-bold rounded-md transition cursor-pointer ${
                selectedRegion === r ? 'bg-[#29B6BD] text-slate-950' : 'text-[#51615a] hover:bg-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Jump & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#e1e1db]">
        {/* District Jump Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#1a2521] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#176e73]" />
            <span>Currently Selected:</span>
          </span>
          <select
            value={selectedDistrictId}
            onChange={(e) => handleSelectDistrict(e.target.value)}
            className="text-xs font-bold text-[#1a2521] bg-[#F4F4F0] border border-[#d8d8d2] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#176e73] cursor-pointer"
          >
            {filteredDistricts.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.onsCode}) - {d.deprivedOneDimPercent}% Deprivation
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#51615a]">
            {filteredDistricts.length} areas in view
          </span>
        </div>

        {/* Search Input for Quick Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#51615a] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search district name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-[#F4F4F0] border border-[#d8d8d2] rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#176e73] w-56"
          />
        </div>
      </div>

      {/* Main Grid: Map / Visuals (Left 7 cols) + District Detail Inspector (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Map or Cards Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* NATIVE LEAFLET CHOROPLETH MAP */}
          {activeMapView === 'map' && (
            <div className="space-y-3">
              <div className="bg-[#fbfbf9] rounded-2xl border border-[#e1e1db] overflow-hidden shadow-xs">
                
                {/* Map Sub-Header Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#F4F4F0] border-b border-[#e1e1db] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-[#1a2521]">
                      {activePlace} Local Authority Choropleth:
                    </span>
                    <span className="font-extrabold text-[#176e73]">{selectedDistrict.name}</span>
                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#d8d8d2] text-[#51615a]">
                      {selectedDistrict.onsCode}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleResetMapView}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#51615a] hover:text-[#176e73] bg-white px-2 py-1 rounded border border-[#d8d8d2] transition cursor-pointer"
                    title="Reset map zoom & position"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset View</span>
                  </button>
                </div>

                {/* Leaflet Map DOM Node */}
                <div className="relative w-full h-[520px] bg-[#f8f8f6]">
                  <div 
                    id="deprivation-native-map-container" 
                    className="w-full h-full z-0 cursor-pointer"
                  />

                  {/* Active District Floating Pill */}
                  <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-[#d8d8d2] rounded-xl px-3 py-2 shadow-sm text-xs pointer-events-none">
                    <div className="font-bold text-[#1a2521] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#176e73]" />
                      <span>{selectedDistrict.name}</span>
                    </div>
                    <div className="text-[10px] text-[#51615a] mt-0.5">
                      Deprived in 1+ dim: <strong className="text-[#be123c]">{selectedDistrict.deprivedOneDimPercent}%</strong>
                    </div>
                  </div>

                  {/* Legend Overlay */}
                  <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-[#d8d8d2] rounded-xl p-2.5 shadow-sm text-[10px] text-[#1a2521] space-y-1">
                    <span className="font-bold block text-[#51615a] uppercase tracking-wider text-[9px]">
                      Deprivation Index Ramp
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#0d9488]" />
                      <span>Lower (&lt;30%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#06b6d4]" />
                      <span>Moderate (30-33%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#eab308]" />
                      <span>Elevated (33-35%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#ea580c]" />
                      <span>High (35-38%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#be123c]" />
                      <span>Severe (&ge;38%)</span>
                    </div>
                  </div>
                </div>

                {/* Sub-bar hint */}
                <div className="p-3 bg-[#F4F4F0]/80 border-t border-[#e1e1db] flex items-center justify-between text-xs text-[#51615a]">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#176e73]" />
                    <span>
                      Click any polygon to inspect district details or use the quick selection chips below.
                    </span>
                  </div>
                  <span className="font-bold text-[#176e73]">
                    {selectedDistrict.name}: {selectedDistrict.deprivedOneDimPercent}% Deprived
                  </span>
                </div>
              </div>

              {/* Quick Select District Chips */}
              <div className="bg-[#fbfbf9] p-3 rounded-xl border border-[#e1e1db] space-y-2">
                <span className="text-xs font-bold text-[#51615a] block">
                  Click any {activePlace} district to highlight and inspect:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {filteredDistricts.map((d) => {
                    const isSelected = selectedDistrictId === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => handleSelectDistrict(d.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#176e73] text-white shadow-2xs font-bold ring-2 ring-[#29B6BD]'
                            : 'bg-white text-[#1a2521] border border-[#e1e1db] hover:border-[#176e73]'
                        }`}
                      >
                        <span>{d.name}</span>
                        <span className={`text-[10px] font-mono px-1 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#51615a]'
                        }`}>
                          {d.deprivedOneDimPercent}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DISTRICT CARDS GRID VIEW */}
          {activeMapView === 'cards' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#51615a]">
                <span className="font-bold">Select a District to inspect ONS Census profile:</span>
                <span>{filteredDistricts.length} Local Authority Areas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredDistricts.map((d) => {
                  const isSelected = selectedDistrictId === d.id;
                  const mData = getMetricLabelAndValue(d);

                  return (
                    <button
                      key={d.id}
                      onClick={() => handleSelectDistrict(d.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs relative ${
                        isSelected
                          ? 'ring-2 ring-[#29B6BD] border-[#176e73] bg-[#176e73]/5 scale-[1.01]'
                          : 'border-[#e1e1db] bg-white hover:border-[#29B6BD]'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-[#51615a] uppercase tracking-wider">{d.region}</span>
                            <span className="text-[9px] font-mono text-[#176e73] bg-teal-50 border border-teal-200 px-1 rounded">{d.onsCode}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-[#1a2521]">{d.name}</h4>
                        </div>
                        <span className="text-xs font-extrabold px-2 py-1 rounded-lg border bg-[#176e73] text-white shadow-2xs">
                          {mData.value}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#51615a] line-clamp-2 mt-0.5">
                        {d.keyChallenge}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-[#176e73] font-bold pt-1.5 border-t border-[#e1e1db]/60">
                        <span className="flex items-center gap-1">
                          <BarChart2 className="w-3 h-3 text-[#29B6BD]" />
                          <span>{d.mappedInitiativesCount} Initiatives</span>
                        </span>
                        <span className="text-amber-800">{d.openGapsCount} Active Gaps</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected District Need Inspector Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-[#F4F4F0] text-[#1a2521] rounded-2xl p-6 border border-[#e1e1db] space-y-4 shadow-sm sticky top-4">
          <div className="flex items-center justify-between border-b border-[#e1e1db] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176e73]">
                  District Need Inspector
                </span>
                <span className="text-[9px] font-mono bg-[#176e73] text-white px-1.5 py-0.5 rounded font-bold">
                  {selectedDistrict.onsCode}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1a2521] flex items-center gap-2 mt-0.5">
                <MapPin className="w-5 h-5 text-[#29B6BD]" />
                <span>{selectedDistrict.name}</span>
              </h3>
              <span className="text-xs text-[#51615a]">{selectedDistrict.region}</span>
            </div>
            <span className="text-xs bg-white text-[#51615a] px-2.5 py-1 rounded-md font-semibold border border-[#e1e1db]">
              Pop: {selectedDistrict.population}
            </span>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-3 border border-[#e1e1db]">
              <span className="text-[10px] font-bold text-[#51615a] block uppercase">1+ Dim Deprived</span>
              <p className="text-2xl font-extrabold text-[#176e73] mt-0.5">{selectedDistrict.deprivedOneDimPercent}%</p>
              <span className="text-[10px] text-[#51615a]">ONS Census 2021</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-[#e1e1db]">
              <span className="text-[10px] font-bold text-[#51615a] block uppercase">Youth NEET Rate</span>
              <p className="text-2xl font-extrabold text-amber-700 mt-0.5">{selectedDistrict.youthNeetPercent}%</p>
              <span className="text-[10px] text-[#51615a]">Ages 16-24</span>
            </div>
          </div>

          {/* ONS Household Deprivation Breakdown (0, 1, 2, 3+ Dims) */}
          <div className="bg-white p-3 rounded-xl border border-[#e1e1db] space-y-2">
            <span className="text-[11px] font-bold text-[#1a2521] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#176e73]" />
              <span>ONS Household Deprivation Breakdown</span>
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="p-1.5 rounded-lg bg-teal-50 border border-teal-100">
                <span className="text-[9px] text-teal-800 font-bold block">0 Dim (None)</span>
                <span className="text-xs font-extrabold text-teal-900">{selectedDistrict.notDeprivedPercent}%</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[9px] text-amber-800 font-bold block">1 Dim</span>
                <span className="text-xs font-extrabold text-amber-900">{selectedDistrict.deprivedOneDimPercent}%</span>
              </div>
              <div className="p-1.5 rounded-lg bg-orange-50 border border-orange-200">
                <span className="text-[9px] text-orange-800 font-bold block">2 Dims</span>
                <span className="text-xs font-extrabold text-orange-900">{selectedDistrict.deprivedTwoDimPercent}%</span>
              </div>
              <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-[9px] text-rose-800 font-bold block">3+ Dims</span>
                <span className="text-xs font-extrabold text-rose-900">{selectedDistrict.deprivedThreeDimPercent}%</span>
              </div>
            </div>
          </div>

          {/* 4 ONS Dimension Specific Bars */}
          <div className="bg-white p-3.5 rounded-xl border border-[#e1e1db] space-y-2.5">
            <span className="text-[11px] font-bold text-[#1a2521] block">ONS 4-Dimension Deprivation Profile:</span>
            
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#51615a] mb-0.5">
                  <span>Education Deprivation</span>
                  <span className="text-[#176e73] font-bold">{selectedDistrict.educationDeprivationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#176e73] h-full rounded-full transition-all duration-300" style={{ width: `${selectedDistrict.educationDeprivationPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#51615a] mb-0.5">
                  <span>Employment Deprivation</span>
                  <span className="text-amber-700 font-bold">{selectedDistrict.employmentDeprivationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full transition-all duration-300" style={{ width: `${selectedDistrict.employmentDeprivationPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#51615a] mb-0.5">
                  <span>Health Deprivation</span>
                  <span className="text-teal-700 font-bold">{selectedDistrict.healthDeprivationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#29B6BD] h-full rounded-full transition-all duration-300" style={{ width: `${selectedDistrict.healthDeprivationPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#51615a] mb-0.5">
                  <span>Housing Deprivation</span>
                  <span className="text-rose-700 font-bold">{selectedDistrict.housingDeprivedPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full transition-all duration-300" style={{ width: `${selectedDistrict.housingDeprivedPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Challenges & Priorities */}
          <div className="space-y-3 pt-1 text-xs">
            <div className="bg-white p-3 rounded-xl border border-[#e1e1db] space-y-1">
              <span className="font-bold text-[#1a2521] flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Primary Structural Challenge:</span>
              </span>
              <p className="text-[#51615a] leading-relaxed">
                {selectedDistrict.keyChallenge}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e1e1db] space-y-1">
              <span className="font-bold text-[#176e73] flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#29B6BD]" />
                <span>Targeted Accelerator Priority:</span>
              </span>
              <p className="text-[#51615a] leading-relaxed">
                {selectedDistrict.highlightedPriority}
              </p>
            </div>
          </div>

          {/* Mapped Activity summary & Direct ONS Map Button */}
          <div className="pt-3 border-t border-[#e1e1db] flex flex-col gap-2.5 text-xs text-[#51615a]">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-[#1a2521] font-bold">{selectedDistrict.mappedInitiativesCount}</strong> Mapped Initiatives
              </div>
              <div>
                <strong className="text-amber-800 font-bold">{selectedDistrict.openGapsCount}</strong> Active Gaps
              </div>
            </div>

            <a
              href={onsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-[#176e73] font-bold text-center border border-[#d8d8d2] rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <span>Explore {selectedDistrict.name} on ONS.gov.uk</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
