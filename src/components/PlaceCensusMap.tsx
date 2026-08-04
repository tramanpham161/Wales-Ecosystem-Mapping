import React, { useState } from 'react';
import { MapPin, Info, BarChart2, Filter, AlertTriangle, Layers, ExternalLink, Sparkles } from 'lucide-react';

interface LocalAuthorityData {
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
    id: 'hull',
    name: 'Kingston upon Hull',
    region: 'East Yorkshire & Hull',
    onsCode: 'E06000010',
    deprivedOneDimPercent: 39.8,
    deprivedTwoDimPercent: 18.2,
    deprivedThreeDimPercent: 5.6,
    notDeprivedPercent: 36.4,
    educationDeprivationPercent: 24.1,
    employmentDeprivationPercent: 21.5,
    healthDeprivationPercent: 22.8,
    youthNeetPercent: 7.5,
    skillsDeficitPercent: 29.2,
    housingDeprivedPercent: 18.9,
    population: '267,100',
    keyChallenge: 'Coastal and estuary isolation, high NEET rate in Orchard Park and Bransholme, skill transition to offshore wind energy.',
    mappedInitiativesCount: 7,
    openGapsCount: 19,
    highlightedPriority: 'Humber clean energy apprenticeships, digital inclusion hubs, and maritime engineering traineeships.'
  },
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
    highlightedPriority: 'AMRC STEM academy precision engineering placements & in-work mentor support.'
  },
  {
    id: 'barnsley',
    name: 'Barnsley',
    region: 'South Yorkshire',
    onsCode: 'E08000016',
    deprivedOneDimPercent: 35.6,
    deprivedTwoDimPercent: 14.8,
    deprivedThreeDimPercent: 3.8,
    notDeprivedPercent: 45.8,
    educationDeprivationPercent: 20.1,
    employmentDeprivationPercent: 17.2,
    healthDeprivationPercent: 19.8,
    youthNeetPercent: 5.8,
    skillsDeficitPercent: 24.7,
    housingDeprivedPercent: 14.9,
    population: '244,600',
    keyChallenge: 'Digital infrastructure deficit in rural outposts (Goldthorpe, Grimethorpe) & lower higher-apprenticeship uptake.',
    mappedInitiativesCount: 3,
    openGapsCount: 10,
    highlightedPriority: 'Barnsley Digital Futures hub, cyber security bootcamps, and rural evening youth transport.'
  },
  {
    id: 'kirklees',
    name: 'Kirklees (Huddersfield)',
    region: 'West Yorkshire',
    onsCode: 'E08000034',
    deprivedOneDimPercent: 34.7,
    deprivedTwoDimPercent: 14.2,
    deprivedThreeDimPercent: 3.6,
    notDeprivedPercent: 47.5,
    educationDeprivationPercent: 19.4,
    employmentDeprivationPercent: 16.1,
    healthDeprivationPercent: 18.2,
    youthNeetPercent: 5.0,
    skillsDeficitPercent: 22.4,
    housingDeprivedPercent: 15.1,
    population: '433,300',
    keyChallenge: 'Disconnect between textile heritage and green engineering; Dewsbury-Huddersfield student transport cost barriers.',
    mappedInitiativesCount: 4,
    openGapsCount: 11,
    highlightedPriority: 'Green retrofitting trades guild, heat pump apprenticeships, and subsidized student travel passes.'
  },
  {
    id: 'sheffield',
    name: 'Sheffield',
    region: 'South Yorkshire',
    onsCode: 'E08000019',
    deprivedOneDimPercent: 34.2,
    deprivedTwoDimPercent: 14.0,
    deprivedThreeDimPercent: 3.7,
    notDeprivedPercent: 48.1,
    educationDeprivationPercent: 18.9,
    employmentDeprivationPercent: 16.8,
    healthDeprivationPercent: 18.9,
    youthNeetPercent: 5.1,
    skillsDeficitPercent: 21.8,
    housingDeprivedPercent: 16.9,
    population: '584,800',
    keyChallenge: 'Stark eastern vs western district disparity; disengaged youth in Manor Castle, Burngreave, and Wybourn.',
    mappedInitiativesCount: 8,
    openGapsCount: 22,
    highlightedPriority: 'Sheffield Manor Castle youth trust, hospital trust health careers, and second-chance justice re-entry.'
  },
  {
    id: 'wakefield',
    name: 'Wakefield',
    region: 'West Yorkshire',
    onsCode: 'E08000036',
    deprivedOneDimPercent: 33.9,
    deprivedTwoDimPercent: 13.8,
    deprivedThreeDimPercent: 3.4,
    notDeprivedPercent: 48.9,
    educationDeprivationPercent: 18.6,
    employmentDeprivationPercent: 15.9,
    healthDeprivationPercent: 18.1,
    youthNeetPercent: 4.8,
    skillsDeficitPercent: 22.1,
    housingDeprivedPercent: 13.8,
    population: '353,300',
    keyChallenge: 'Logistics sector turnover & low creative career visibility for Castleford and Pontefract school-leavers.',
    mappedInitiativesCount: 3,
    openGapsCount: 9,
    highlightedPriority: 'Wakefield creative cultural pathways, Hepworth gallery design apprenticeships, and WYCA fast-track.'
  },
  {
    id: 'calderdale',
    name: 'Calderdale (Halifax)',
    region: 'West Yorkshire',
    onsCode: 'E08000033',
    deprivedOneDimPercent: 32.1,
    deprivedTwoDimPercent: 12.7,
    deprivedThreeDimPercent: 3.1,
    notDeprivedPercent: 52.1,
    educationDeprivationPercent: 17.5,
    employmentDeprivationPercent: 14.8,
    healthDeprivationPercent: 17.0,
    youthNeetPercent: 4.4,
    skillsDeficitPercent: 20.3,
    housingDeprivedPercent: 13.2,
    population: '211,400',
    keyChallenge: 'Valley geography transport bottlenecks in Todmorden & Hebden Bridge; travel time for post-16 training.',
    mappedInitiativesCount: 3,
    openGapsCount: 8,
    highlightedPriority: 'Calder Valley youth collective mobile advice vans, homework device loans, and peer mental health.'
  },
  {
    id: 'eastriding',
    name: 'East Riding of Yorkshire',
    region: 'East Yorkshire & Hull',
    onsCode: 'E06000011',
    deprivedOneDimPercent: 31.8,
    deprivedTwoDimPercent: 11.9,
    deprivedThreeDimPercent: 2.8,
    notDeprivedPercent: 53.5,
    educationDeprivationPercent: 16.8,
    employmentDeprivationPercent: 13.9,
    healthDeprivationPercent: 16.4,
    youthNeetPercent: 4.1,
    skillsDeficitPercent: 19.8,
    housingDeprivedPercent: 12.6,
    population: '343,200',
    keyChallenge: 'Rural and coastal transport gaps in Bridlington and Hornsea; seasonal youth employment volatility.',
    mappedInitiativesCount: 4,
    openGapsCount: 10,
    highlightedPriority: 'Coastal green energy traineeships, agricultural tech apprenticeships, and mobile youth hubs.'
  },
  {
    id: 'leeds',
    name: 'Leeds',
    region: 'West Yorkshire',
    onsCode: 'E08000035',
    deprivedOneDimPercent: 31.5,
    deprivedTwoDimPercent: 12.9,
    deprivedThreeDimPercent: 3.3,
    notDeprivedPercent: 52.3,
    educationDeprivationPercent: 17.2,
    employmentDeprivationPercent: 15.1,
    healthDeprivationPercent: 16.8,
    youthNeetPercent: 4.2,
    skillsDeficitPercent: 19.5,
    housingDeprivedPercent: 17.4,
    population: '812,000',
    keyChallenge: 'Severe inner-city deprivation (Gipton, Harehills, Beeston) contrasted with thriving commercial core.',
    mappedInitiativesCount: 10,
    openGapsCount: 24,
    highlightedPriority: 'Leeds FinTech diversity alliance non-degree fast-track & Harehills community digital hub.'
  },
  {
    id: 'york',
    name: 'City of York',
    region: 'North Yorkshire',
    onsCode: 'E06000014',
    deprivedOneDimPercent: 27.9,
    deprivedTwoDimPercent: 9.8,
    deprivedThreeDimPercent: 2.1,
    notDeprivedPercent: 60.2,
    educationDeprivationPercent: 13.9,
    employmentDeprivationPercent: 11.8,
    healthDeprivationPercent: 13.5,
    youthNeetPercent: 3.5,
    skillsDeficitPercent: 14.8,
    housingDeprivedPercent: 14.2,
    population: '202,800',
    keyChallenge: 'High housing costs for young workers; pockets of hidden deprivation in Westfield and Clifton wards.',
    mappedInitiativesCount: 5,
    openGapsCount: 9,
    highlightedPriority: 'York creative tech apprenticeships, affordable youth housing support, and rail innovation academy.'
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
    educationDeprivationPercent: 23.8,
    employmentDeprivationPercent: 20.9,
    healthDeprivationPercent: 21.5,
    youthNeetPercent: 7.4,
    skillsDeficitPercent: 28.2,
    housingDeprivedPercent: 16.8,
    population: '66,900',
    keyChallenge: 'High youth NEET rate and limited post-16 vocational options in upper valleys.',
    mappedInitiativesCount: 5,
    openGapsCount: 15,
    highlightedPriority: 'Ebbw Vale tech academy & community transport shuttle.'
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
    keyChallenge: 'Evening shift public transport gaps for young logistics & retail workers.',
    mappedInitiativesCount: 8,
    openGapsCount: 22,
    highlightedPriority: 'Evening valley bus pass guarantee & construction apprenticeships.'
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
    keyChallenge: 'Justice system re-entry pathways and industrial park apprentice retention.',
    mappedInitiativesCount: 6,
    openGapsCount: 14,
    highlightedPriority: 'Wrexham Youth Justice referral pipeline & green skills academy.'
  },
  {
    id: 'gwynedd',
    name: 'Gwynedd',
    region: 'North Wales',
    onsCode: 'W06000002',
    deprivedOneDimPercent: 33.2,
    deprivedTwoDimPercent: 12.8,
    deprivedThreeDimPercent: 3.1,
    notDeprivedPercent: 50.9,
    educationDeprivationPercent: 17.8,
    employmentDeprivationPercent: 14.9,
    healthDeprivationPercent: 16.2,
    youthNeetPercent: 4.8,
    skillsDeficitPercent: 21.0,
    housingDeprivedPercent: 18.6,
    population: '117,400',
    keyChallenge: 'Rural isolation, high housing costs, and lack of bilingual career guidance.',
    mappedInitiativesCount: 7,
    openGapsCount: 19,
    highlightedPriority: 'Bilingual mobile career advisors & Eryri eco-tourism traineeships.'
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
  }
];

interface PlaceCensusMapProps {
  placeName: 'Wales' | 'Yorkshire';
}

export const PlaceCensusMap: React.FC<PlaceCensusMapProps> = ({ placeName }) => {
  const isYorkshire = placeName.toLowerCase() === 'yorkshire';
  const districts = isYorkshire ? YORKSHIRE_DISTRICTS : WALES_DISTRICTS;

  const regions = Array.from(new Set(districts.map(d => d.region)));

  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedMetric, setSelectedMetric] = useState<'deprived' | 'neet' | 'skills' | 'housing'>('deprived');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(districts[0].id);

  const filteredDistricts = selectedRegion === 'All' 
    ? districts 
    : districts.filter(d => d.region === selectedRegion);

  const selectedDistrict = districts.find(d => d.id === selectedDistrictId) || filteredDistricts[0] || districts[0];

  // Utility to get metric value & color density
  const getMetricData = (d: LocalAuthorityData) => {
    switch (selectedMetric) {
      case 'deprived':
        return { value: `${d.deprivedOneDimPercent}%`, label: 'Deprived in 1+ dimension' };
      case 'neet':
        return { value: `${d.youthNeetPercent}%`, label: 'Youth NEET rate (16-24)' };
      case 'skills':
        return { value: `${d.skillsDeficitPercent}%`, label: 'Level 2 skills deficit' };
      case 'housing':
        return { value: `${d.housingDeprivedPercent}%`, label: 'Housing deprivation' };
    }
  };

  const getHeatBg = (percent: number) => {
    if (percent >= 37.0) return 'bg-rose-900 text-white border-rose-950';
    if (percent >= 35.0) return 'bg-amber-600 text-white border-amber-700';
    if (percent >= 33.0) return 'bg-amber-500 text-slate-950 border-amber-600';
    return 'bg-teal-100 text-[#176e73] border-teal-200';
  };

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
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1a2521] tracking-tight mt-1">
            {placeName} Household Deprivation Map (ONS Choropleth)
          </h3>
        </div>

        <a 
          href={`https://www.ons.gov.uk/census/maps/choropleth/population/household-deprivation/hh-deprivation/household-is-deprived-in-one-dimension?lad=${selectedDistrict.onsCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#1a2521] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto"
        >
          <span>View ONS Map for {selectedDistrict.name}</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#176e73]" />
        </a>
      </div>

      <p className="text-sm text-[#51615a] leading-relaxed">
        {isYorkshire 
          ? 'ONS Census 2021 data shows that across South, West, North, and East Yorkshire & Hull, household deprivation in at least one dimension averages 34.5%. This choropleth maps local district deficits across all 13 Yorkshire local authority areas to align targeted accelerator interventions.'
          : 'Official ONS Census indicators highlight structural household deprivation across South East Wales, the Valleys, and rural Gwynedd. We align place-based funding directly to district need metrics.'
        }
      </p>

      {/* Region & Metric Selector Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F4F4F0]/80 p-2 rounded-xl border border-[#e1e1db]">
        {/* Region Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-[#51615a] px-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#176e73]" />
            <span>Region:</span>
          </span>
          <button
            onClick={() => setSelectedRegion('All')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${selectedRegion === 'All' ? 'bg-[#176e73] text-white' : 'text-[#51615a] hover:bg-white'}`}
          >
            All {placeName}
          </button>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${selectedRegion === r ? 'bg-[#176e73] text-white' : 'text-[#51615a] hover:bg-white'}`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-bold text-[#51615a] px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#176e73]" />
            <span>Indicator:</span>
          </span>
          <button
            onClick={() => setSelectedMetric('deprived')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${selectedMetric === 'deprived' ? 'bg-[#29B6BD] text-slate-950' : 'text-[#51615a] hover:bg-white'}`}
          >
            1+ Dim Deprived (%)
          </button>
          <button
            onClick={() => setSelectedMetric('neet')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${selectedMetric === 'neet' ? 'bg-[#29B6BD] text-slate-950' : 'text-[#51615a] hover:bg-white'}`}
          >
            Youth NEET (%)
          </button>
          <button
            onClick={() => setSelectedMetric('skills')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${selectedMetric === 'skills' ? 'bg-[#29B6BD] text-slate-950' : 'text-[#51615a] hover:bg-white'}`}
          >
            Skills Deficit (%)
          </button>
          <button
            onClick={() => setSelectedMetric('housing')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${selectedMetric === 'housing' ? 'bg-[#29B6BD] text-slate-950' : 'text-[#51615a] hover:bg-white'}`}
          >
            Housing Deprivation (%)
          </button>
        </div>
      </div>

      {/* Main Grid: Choropleth Local Authority Cards + District Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* District Choropleth Map Cards (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#51615a]">
            <span className="font-bold">Select a District to inspect ONS Census profile:</span>
            <span>{filteredDistricts.length} Local Authority Areas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDistricts.map((d) => {
              const isSelected = selectedDistrictId === d.id;
              const valPercent = selectedMetric === 'deprived' ? d.deprivedOneDimPercent :
                                 selectedMetric === 'neet' ? d.youthNeetPercent * 5 :
                                 selectedMetric === 'skills' ? d.skillsDeficitPercent : d.housingDeprivedPercent * 2;
              const heatClass = getHeatBg(valPercent);
              const mData = getMetricData(d);

              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrictId(d.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs relative ${
                    isSelected
                      ? 'ring-2 ring-[#29B6BD] border-[#176e73] bg-[#176e73]/5 scale-[1.01]'
                      : 'border-[#e1e1db] bg-white hover:border-teal-400'
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
                    <span className={`text-xs font-extrabold px-2 py-1 rounded-lg border shadow-2xs ${heatClass}`}>
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

          {/* Map Legend */}
          <div className="bg-[#F4F4F0]/60 p-3 rounded-xl border border-[#e1e1db] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#51615a]">
            <span className="font-bold">ONS Deprivation Severity Scale:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-teal-100 border border-teal-300"></span>
                <span>Lower (&lt;33%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500 border border-amber-600"></span>
                <span>Moderate (33-35%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-rose-900 border border-rose-950"></span>
                <span>High (&gt;37%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected District Inspector Panel (Right 5 Cols) */}
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

          {/* ONS Household Deprivation Breakdown (1, 2, 3+ Dims) */}
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
                  <span className="text-[#176e73]">{selectedDistrict.educationDeprivationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#176e73] h-full rounded-full" style={{ width: `${selectedDistrict.educationDeprivationPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#51615a] mb-0.5">
                  <span>Employment Deprivation</span>
                  <span className="text-amber-700">{selectedDistrict.employmentDeprivationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${selectedDistrict.employmentDeprivationPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#51615a] mb-0.5">
                  <span>Health Deprivation</span>
                  <span className="text-teal-700">{selectedDistrict.healthDeprivationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#29B6BD] h-full rounded-full" style={{ width: `${selectedDistrict.healthDeprivationPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#51615a] mb-0.5">
                  <span>Housing Deprivation</span>
                  <span className="text-rose-700">{selectedDistrict.housingDeprivedPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full" style={{ width: `${selectedDistrict.housingDeprivedPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

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
          <div className="pt-3 border-t border-[#e1e1db] flex flex-col gap-2 text-xs text-[#51615a]">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-[#1a2521] font-bold">{selectedDistrict.mappedInitiativesCount}</strong> Mapped Initiatives
              </div>
              <div>
                <strong className="text-amber-800 font-bold">{selectedDistrict.openGapsCount}</strong> Active Gaps
              </div>
            </div>

            <a
              href={`https://www.ons.gov.uk/census/maps/choropleth/population/household-deprivation/hh-deprivation/household-is-deprived-in-one-dimension?lad=${selectedDistrict.onsCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-1 py-2 bg-[#176e73] hover:bg-[#12585c] text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <span>Explore Official ONS Interactive Map ({selectedDistrict.name})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
