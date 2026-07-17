import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GapOfferRequest, FrictionPoint } from '../types';
import { SYSTEMIC_TABS } from '../data';
import { 
  Info, 
  MapPin, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight,
  Database,
  Sliders,
  CheckCircle2,
  Building2,
  Mail,
  FileText,
  Filter,
  X
} from 'lucide-react';

interface GapsHeatmapProps {
  gapsOffers: GapOfferRequest[];
  filteredGapsOffers?: GapOfferRequest[];
  organizations?: any[];
  selectedRegionFilter?: string;
  onRegionFilterChange?: (regionId: string) => void;
}

type TabType = 'map' | 'criteria';
type MapMetric = 'struggle' | 'help' | 'gap';

interface RegionData {
  id: string;
  name: string;
  welshName: string;
  struggleScore: number; // 0 - 100
  helpScore: number;      // 0 - 100
  gapScore: number;       // struggle - help
  details: string;
  color: string;
  path: string;
  center: [number, number]; // custom coordinate translation for SVG labels
}

function getGapOfferCoordinates(item: GapOfferRequest, organizations: any[]): [number, number] {
  // Try to find if there's an organization with matching name
  if (item.organization) {
    const org = organizations.find(o => o.name && o.name.toLowerCase().trim() === item.organization.toLowerCase().trim());
    if (org && org.latitude && org.longitude) {
      return [org.latitude, org.longitude];
    }
  }
  
  // Otherwise, fallback to region coordinate
  const regionCoords: Record<string, [number, number]> = {
    north: [53.05, -3.8],
    mid: [52.35, -3.60],
    southwest: [51.85, -4.30],
    southeast: [51.65, -3.15]
  };
  
  const region = item.region || 'mid';
  const baseCoords = regionCoords[region] || [52.25, -3.8];
  
  // Deterministic jitter/offset based on item ID hash so markers in the same region don't overlap perfectly
  let hash = 0;
  const str = item.id + item.title;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Calculate jitter between -0.15 and +0.15 degrees
  const latJitter = ((hash & 0xFF) / 255 - 0.5) * 0.35;
  const lngJitter = (((hash >> 8) & 0xFF) / 255 - 0.5) * 0.35;
  
  return [baseCoords[0] + latJitter, baseCoords[1] + lngJitter];
}

export const GapsHeatmap: React.FC<GapsHeatmapProps> = ({ 
  gapsOffers, 
  filteredGapsOffers = [],
  organizations = [],
  selectedRegionFilter = 'All', 
  onRegionFilterChange 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  
  // Tab 1 (Wales Map) State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('mid');
  const [mapMetric, setMapMetric] = useState<MapMetric>('gap');

  // Tab 2 (3-Criteria Heatmap) State
  const [selectedActivityId, setSelectedActivityId] = useState<FrictionPoint>('Visibility');

  // Real Leaflet Map Hooks for geographical Wales heat overlay
  const heatMapRef = useRef<any>(null);
  const regionLayersRef = useRef<Record<string, { coreCircle: any; midCircle: any; glowCircle: any }>>({});
  const gapsMarkersGroupRef = useRef<any>(null);

  useEffect(() => {
    if (activeTab !== 'map') return;

    const L = (window as any).L;
    if (!L) return;

    // Brief timeout to let container element render in DOM
    const timer = setTimeout(() => {
      const container = document.getElementById('wales-heatmap-real-map');
      if (!container || heatMapRef.current) return;

      const mapInstance = L.map('wales-heatmap-real-map', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      }).setView([52.25, -3.8], 7.5);

      // Light tiles to match organization directory
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        minZoom: 6
      }).addTo(mapInstance);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

      heatMapRef.current = mapInstance;
      gapsMarkersGroupRef.current = L.layerGroup().addTo(mapInstance);

      const regionCoords: Record<string, [number, number]> = {
        north: [53.05, -3.8],
        mid: [52.35, -3.60],
        southwest: [51.85, -4.30],
        southeast: [51.65, -3.15]
      };

      const layers: Record<string, { coreCircle: any; midCircle: any; glowCircle: any }> = {};

      regions.forEach((region) => {
        const coords = regionCoords[region.id] || [52.25, -3.8];
        
        let color = '#4F6C82';
        let radius = 28000;

        if (mapMetric === 'struggle') {
          color = region.struggleScore > 85 ? '#DE6B6B' : region.struggleScore > 65 ? '#E5A973' : '#E6C687';
          radius = 24000 + (region.struggleScore * 180);
        } else if (mapMetric === 'help') {
          color = region.helpScore > 80 ? '#63B38F' : region.helpScore > 50 ? '#5FAAB3' : '#DE7A7A';
          radius = 24000 + (region.helpScore * 180);
        } else { // 'gap' (Struggle vs Help Mismatch)
          color = region.gapScore > 50 ? '#DE6B6B' : region.gapScore > 10 ? '#E5A973' : region.gapScore > -10 ? '#E6C687' : '#5FAAB3';
          radius = 24000 + (Math.abs(region.gapScore) * 200);
        }

        const isSelected = selectedRegionId === region.id;

        // 1. Draw outer soft pulsing glow
        const glowCircle = L.circle(coords, {
          radius: radius * 1.8,
          stroke: false,
          fillColor: color,
          fillOpacity: isSelected ? 0.12 : 0.05,
          interactive: false
        }).addTo(mapInstance);

        // 2. Draw middle blended transition layer
        const midCircle = L.circle(coords, {
          radius: radius * 1.1,
          stroke: false,
          fillColor: color,
          fillOpacity: isSelected ? 0.25 : 0.14,
          interactive: false
        }).addTo(mapInstance);

        // 3. Draw interactive core circular layer
        const coreCircle = L.circle(coords, {
          radius: radius * 0.6,
          color: '#ffffff',
          weight: isSelected ? 2.5 : 0,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: isSelected ? 0.55 : 0.35,
        }).addTo(mapInstance);

        let tooltipText = `<b>${region.name}</b> (${region.welshName})<br/>`;
        if (mapMetric === 'struggle') tooltipText += `Struggle Index: ${region.struggleScore}%`;
        else if (mapMetric === 'help') tooltipText += `Help Index: ${region.helpScore}%`;
        else tooltipText += `Gap Index: ${region.gapScore > 0 ? '+' : ''}${region.gapScore}% (${region.gapScore > 10 ? 'Severe Deficit' : region.gapScore < -10 ? 'Resource Saturated' : 'Balanced'})`;

        coreCircle.bindTooltip(tooltipText, {
          permanent: false,
          direction: 'top'
        });

        coreCircle.on('click', () => {
          setSelectedRegionId(region.id);
        });

        layers[region.id] = { coreCircle, midCircle, glowCircle };
      });

      regionLayersRef.current = layers;

      // Add major Welsh cities as markers
      const cities = [
        { name: 'Bangor', coords: [53.228, -4.128] },
        { name: 'Cardiff (Capital)', coords: [51.481, -3.179] },
        { name: 'Aberystwyth', coords: [52.414, -4.085] },
        { name: 'Swansea', coords: [51.621, -3.943] }
      ];

      cities.forEach(city => {
        L.circleMarker(city.coords, {
          radius: 4.5,
          color: '#1a2521',
          weight: 1.5,
          fillColor: '#ffffff',
          fillOpacity: 1,
          interactive: true
        })
        .addTo(mapInstance)
        .bindTooltip(city.name, { permanent: false, direction: 'top' });
      });

      mapInstance.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (heatMapRef.current) {
        heatMapRef.current.remove();
        heatMapRef.current = null;
      }
    };
  }, [activeTab, mapMetric]);

  // Update circle highlights dynamically when selected region state changes
  useEffect(() => {
    if (activeTab !== 'map' || !regionLayersRef.current) return;

    regions.forEach((region) => {
      const layer = regionLayersRef.current[region.id];
      if (!layer) return;

      const isSelected = selectedRegionId === region.id;
      
      layer.coreCircle.setStyle({
        weight: isSelected ? 2.5 : 0,
        fillOpacity: isSelected ? 0.55 : 0.35
      });

      layer.midCircle.setStyle({
        fillOpacity: isSelected ? 0.25 : 0.14
      });

      layer.glowCircle.setStyle({
        fillOpacity: isSelected ? 0.12 : 0.05
      });
    });
  }, [selectedRegionId, activeTab]);

  // Synchronize Leaflet map pins for Gaps, Offers & Requests
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !heatMapRef.current || !gapsMarkersGroupRef.current) return;

    // Clear existing pins
    gapsMarkersGroupRef.current.clearLayers();

    // Plot pins
    const listToPlot = filteredGapsOffers || [];
    listToPlot.forEach((item) => {
      const coords = getGapOfferCoordinates(item, organizations || []);
      
      let markerColor = '#51615a';
      let iconSymbol = '•';
      let typeLabel = 'Insight';
      
      if (item.type === 'Gap') {
        markerColor = '#DE6B6B';
        iconSymbol = '!';
        typeLabel = 'Systemic Gap';
      } else if (item.type === 'Offer') {
        markerColor = '#63B38F';
        iconSymbol = '★';
        typeLabel = 'Active Offer';
      } else if (item.type === 'Request') {
        markerColor = '#E5A973';
        iconSymbol = '?';
        typeLabel = 'Resource Request';
      } else if (item.type === 'Collaboration') {
        markerColor = '#2BB7BA';
        iconSymbol = 'C';
        typeLabel = 'Collaboration';
      }

      const size = 30;
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" 
               style="
                 width: ${size}px; 
                 height: ${size}px; 
                 background-color: ${markerColor}; 
                 border: 2px solid #ffffff; 
                 box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                 cursor: pointer;
               "
          >
            <span class="text-white text-[11px] font-black select-none" style="margin-top: -1px;">${iconSymbol}</span>
            ${item.urgency === 'urgent' ? `
              <span class="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 border border-white animate-pulse" title="Urgent">
              </span>
            ` : ''}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker(coords, { icon: customIcon })
        .addTo(gapsMarkersGroupRef.current);

      const popupHtml = `
        <div class="p-3 font-sans max-w-[210px] space-y-1 text-left">
          <div class="flex items-center gap-1.5">
            <span class="text-[8px] font-bold px-1.5 py-0.5 rounded text-white" style="background-color: ${markerColor}">
              ${typeLabel}
            </span>
            ${item.category ? `
              <span class="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono uppercase">
                ${item.category}
              </span>
            ` : ''}
          </div>
          <h3 class="text-xs font-bold text-[#1a2521] leading-tight m-0 pt-1">${item.title}</h3>
          <p class="text-[10px] text-gray-500 m-0">By ${item.organization || item.submittedBy || 'Anonymous'}</p>
          <p class="text-[10px] text-[#1a2521] line-clamp-3 leading-snug pt-1 m-0">"${item.content}"</p>
          <div class="pt-2 border-t border-gray-100 mt-1 flex items-center justify-between text-[8px] text-gray-400">
            <span class="uppercase">📍 ${item.region ? item.region : 'General'}</span>
            ${item.urgency === 'urgent' ? '<span class="text-red-600 font-bold">● Urgent</span>' : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        autoPan: false,
        offset: [0, -size / 2]
      });

      marker.on('mouseover', () => marker.openPopup());
      marker.on('mouseout', () => marker.closePopup());
    });
  }, [filteredGapsOffers, activeTab, mapMetric, organizations]);

  // 1. DATA DEFINITIONS FOR WALES REGIONS
  const regions = useMemo<RegionData[]>(() => [
    {
      id: 'north',
      name: 'North Wales',
      welshName: 'Gogledd Cymru',
      struggleScore: 68,
      helpScore: 72,
      gapScore: -4, // Struggle (68) - Help (72)
      details: 'High digital progression and strong tech networks exist in Bangor & Wrexham, but remote agricultural valleys suffer from visibility and internet connection barriers.',
      color: 'emerald',
      // Coordinates of North Wales region
      path: 'M 35,30 C 35,45 25,40 20,35 C 25,25 35,15 50,10 C 65,5 85,15 100,20 C 115,25 130,30 140,45 C 150,60 140,80 135,90 C 115,95 100,85 85,90 C 75,95 65,85 55,85 C 58,70 62,60 55,55 C 48,50 50,40 46,30 Z',
      center: [80, 45]
    },
    {
      id: 'mid',
      name: 'Mid Wales',
      welshName: 'Canolbarth Cymru',
      struggleScore: 92,
      helpScore: 24,
      gapScore: 68, // Huge gap!
      details: 'Travel distances, lack of physical public transport, and language translation gaps are extremely severe. Active digital support structures remain highly scarce across Powys and Ceredigion.',
      color: 'rose',
      path: 'M 55,85 C 65,85 75,95 85,90 C 100,85 115,95 135,90 C 145,105 148,125 140,145 C 130,165 125,175 115,185 C 105,195 90,185 80,180 C 65,175 58,160 50,140 C 50,120 46,100 55,85 Z',
      center: [95, 130]
    },
    {
      id: 'southwest',
      name: 'South West Wales',
      welshName: 'De-orllewin Cymru',
      struggleScore: 74,
      helpScore: 55,
      gapScore: 19,
      details: 'Pembrokeshire and Carmarthenshire experience high family awareness challenges. Local digital skills mentoring has emerged in Swansea, but demands wider scale.',
      color: 'orange',
      path: 'M 50,140 C 58,160 65,175 80,180 C 90,185 95,200 90,220 C 85,240 75,250 65,255 C 58,260 45,250 38,250 C 30,250 15,245 8,230 C 4,215 12,205 22,200 C 35,195 38,180 38,170 C 38,160 46,150 50,140 Z',
      center: [45, 210]
    },
    {
      id: 'southeast',
      name: 'South East Wales',
      welshName: 'De-ddwyrain Cymru',
      struggleScore: 45,
      helpScore: 95,
      gapScore: -50, // Saturated support
      details: 'Cardiff and Newport act as high-density tech hubs, receiving substantial corporate sponsorships and equipment donations. A strong case exists for redistributing this resource to Mid Wales.',
      color: 'amber',
      path: 'M 90,180 C 105,195 115,185 140,170 C 148,180 152,200 148,220 C 144,240 135,250 128,255 C 115,260 105,255 92,250 C 88,240 90,220 90,180 Z',
      center: [120, 210]
    }
  ], []);

  // Selected region data
  const selectedRegion = useMemo(() => {
    return regions.find(r => r.id === selectedRegionId) || regions[1];
  }, [regions, selectedRegionId]);

  const activeHeatColor = useMemo(() => {
    if (mapMetric === 'struggle') {
      return selectedRegion.struggleScore > 85 ? '#DE6B6B' : selectedRegion.struggleScore > 65 ? '#E5A973' : '#E6C687';
    } else if (mapMetric === 'help') {
      return selectedRegion.helpScore > 80 ? '#63B38F' : selectedRegion.helpScore > 50 ? '#5FAAB3' : '#DE7A7A';
    } else { // 'gap'
      return selectedRegion.gapScore > 50 ? '#DE6B6B' : selectedRegion.gapScore > 10 ? '#E5A973' : selectedRegion.gapScore > -10 ? '#E6C687' : '#5FAAB3';
    }
  }, [selectedRegion, mapMetric]);

  // Color mapper for Wales regions based on chosen metric
  const getRegionFillColor = (region: RegionData) => {
    if (mapMetric === 'struggle') {
      const score = region.struggleScore;
      if (score > 85) return 'fill-rose-500 hover:fill-rose-600 stroke-rose-700';
      if (score > 65) return 'fill-orange-400 hover:fill-orange-500 stroke-orange-600';
      return 'fill-amber-300 hover:fill-amber-400 stroke-amber-500';
    } else if (mapMetric === 'help') {
      const score = region.helpScore;
      if (score > 80) return 'fill-emerald-500 hover:fill-emerald-600 stroke-emerald-700';
      if (score > 50) return 'fill-teal-400 hover:fill-teal-500 stroke-teal-600';
      return 'fill-rose-300 hover:fill-rose-400 stroke-rose-400';
    } else { // 'gap' (Struggle - Help)
      const score = region.gapScore;
      if (score > 50) return 'fill-red-500 hover:fill-red-600 stroke-red-700'; // Critical Undersupported
      if (score > 10) return 'fill-orange-400 hover:fill-orange-500 stroke-orange-600'; // Moderate Gap
      if (score > -10) return 'fill-yellow-400 hover:fill-yellow-500 stroke-yellow-500'; // Balanced
      return 'fill-cyan-400 hover:fill-cyan-500 stroke-cyan-600'; // Saturated (we help too much relative to struggle)
    }
  };

  // 2. DATA DEFINITIONS FOR THE GRADIENT 3-CRITERIA HEAT MAP
  // Matching presentation template provided by user:
  // Axes: Impact (Y) vs Probability (X).
  // 6 Journey Stages act as the activities.
  interface ActivityItem {
    id: FrictionPoint;
    label: string;
    subLabel: string;
    impact: number;       // 1 - 100 (Y-Axis Impact)
    probability: number;  // 1 - 100 (X-Axis Probability of encountering friction)
    description: string;
    metrics: string;
    strategicZone: 'Critical Deficit' | 'Saturated' | 'Strategic Balance' | 'Muted/Stable';
    color: string;
  }

  const activities = useMemo<ActivityItem[]>(() => [
    {
      id: 'Visibility',
      label: 'Stage 1: Visibility',
      subLabel: 'Reaching Families Directly',
      impact: 85,          // High Impact
      probability: 78,     // High Probability of Barrier
      description: 'Learners and isolated families do not know digital help exists. Reaching them requires physical, hyper-local marketing.',
      metrics: '78% awareness deficit recorded in rural areas',
      strategicZone: 'Critical Deficit',
      color: '#DE6B6B' // Soft Red
    },
    {
      id: 'Family Awareness',
      label: 'Stage 2: Family Awareness',
      subLabel: 'Combating Stigma & Myths',
      impact: 70,          // Medium-High Impact
      probability: 58,     // Medium Probability
      description: 'Stigma around lack of literacy or technology. Parents fear being judged or exposed.',
      metrics: '58% of parents cite privacy/stigma as primary barrier',
      strategicZone: 'Strategic Balance',
      color: '#E5A973' // Soft Orange
    },
    {
      id: 'Transitions',
      label: 'Stage 3: Transitions',
      subLabel: 'Primary to Secondary Handover',
      impact: 35,          // Low-Medium Impact
      probability: 88,     // Very High Probability
      description: 'Massive resource drops and digital accounts lost during primary to secondary high school transitions.',
      metrics: '88% of learners experience device disruption during summer',
      strategicZone: 'Saturated',
      color: '#E6C687' // Soft Yellow
    },
    {
      id: 'Navigation',
      label: 'Stage 4: Navigation',
      subLabel: 'Bespoke Support Guidance',
      impact: 62,          // Medium Impact
      probability: 40,     // Medium-Low Probability
      description: 'Providing a human guide or digital assistant to hold hands through onboarding processes.',
      metrics: '1:1 human assistance improves success rates by 3.5x',
      strategicZone: 'Strategic Balance',
      color: '#63B38F' // Soft Green
    },
    {
      id: 'Translation',
      label: 'Stage 5: Translation',
      subLabel: 'Welsh Language Alignment',
      impact: 90,          // Critical Impact
      probability: 25,     // Low Probability (because resources exist, but misplaced)
      description: 'Providing fully bilingual digital frameworks so learners do not suffer secondary cognitive load.',
      metrics: 'Welsh language compliance required for all public schemes',
      strategicZone: 'Muted/Stable',
      color: '#5FAAB3' // Soft Teal
    },
    {
      id: 'Progression',
      label: 'Stage 6: Progression',
      subLabel: 'Pathways to Higher Skills',
      impact: 48,          // Medium-Low Impact
      probability: 65,     // Medium-High Probability
      description: 'Bridging initial digital inclusion with sustainable tertiary paths, college access, or local jobs.',
      metrics: 'Progression index indicates 40% jump to advanced courses',
      strategicZone: 'Strategic Balance',
      color: '#E6C687' // Soft Yellow
    }
  ], []);

  const selectedActivity = useMemo(() => {
    return activities.find(a => a.id === selectedActivityId) || activities[0];
  }, [activities, selectedActivityId]);

  return (
    <div id="gaps-hybrid-heatmaps-container" className="space-y-6">
      
      {/* Upper Navigation & Tab Switcher */}
      <div className="bg-white rounded-2xl border border-[#e1e1db] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E536B]/10 rounded-xl text-[#2E536B]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1a2521]">Dual Perspective Heat Mapping</h3>
            <p className="text-[11px] text-[#51615a]">Analyze spatial distribution in Wales or explore systemic 3-criteria grids.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#F4F4F0] p-1 rounded-xl border border-[#e1e1db]">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'map' 
                ? 'bg-[#2E536B] text-white shadow-2xs' 
                : 'text-[#51615a] hover:text-[#2E536B]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Wales Regional Map</span>
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'criteria' 
                ? 'bg-[#2E536B] text-white shadow-2xs' 
                : 'text-[#51615a] hover:text-[#2E536B]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2. 3-Criteria Grid Map</span>
          </button>
        </div>
      </div>

      {/* RENDER TAB 1: WALES REGIONAL HEAT MAP */}
      {activeTab === 'map' && (
        <div id="wales-regional-heatmap-view" className="bg-white rounded-2xl border border-[#e1e1db] overflow-hidden shadow-xs">
          
          {/* Header Panel */}
          <div className="bg-[#1a2521] px-6 py-5 text-white border-b border-[#e1e1db]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-bold tracking-tight">Geographical Wales Heat Map Overlay</h4>
                </div>
                <p className="text-[11px] text-[#a3b1a9] leading-relaxed max-w-2xl">
                  Analyze which regions of Wales are receiving adequate support programs versus which are isolated and experiencing severe digital bottlenecks.
                </p>
              </div>

              {/* Metric Selectors */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 self-start sm:self-auto">
                <button
                  onClick={() => setMapMetric('gap')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition ${
                    mapMetric === 'gap' ? 'bg-[#2E536B] text-white' : 'text-[#a3b1a9] hover:text-white'
                  }`}
                >
                  Systemic Gap Index
                </button>
                <button
                  onClick={() => setMapMetric('struggle')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition ${
                    mapMetric === 'struggle' ? 'bg-[#2E536B] text-white' : 'text-[#a3b1a9] hover:text-white'
                  }`}
                >
                  Struggle Level (Gaps)
                </button>
                <button
                  onClick={() => setMapMetric('help')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition ${
                    mapMetric === 'help' ? 'bg-[#2E536B] text-white' : 'text-[#a3b1a9] hover:text-white'
                  }`}
                >
                  Help Received (Offers)
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Real Geographical Leaflet Wales Map */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-[#e1e1db] p-4 relative min-h-[440px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#2E536B] uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Real-World Geospatial Model</span>
                  </span>
                  <span className="text-[9px] text-[#51615a] bg-[#F4F4F0] px-2 py-0.5 rounded-md font-semibold">
                    Interactive Overlay
                  </span>
                </div>

                {/* Map Container */}
                <div 
                  id="wales-heatmap-real-map" 
                  className="w-full h-[340px] rounded-xl border border-gray-200 shadow-inner overflow-hidden z-10" 
                  style={{ minHeight: '340px' }}
                />

                {/* Legend bar */}
                <div className="mt-3 bg-[#F4F4F0]/60 border border-[#e1e1db]/60 p-2.5 rounded-xl flex items-center justify-between gap-2 text-[9px] text-[#51615a]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#DE6B6B' }} />
                    <span>Critical Deficit ({mapMetric === 'gap' ? '>50%' : mapMetric === 'struggle' ? '>85%' : '<30%'})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E5A973' }} />
                    <span>Moderate Gap</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E6C687' }} />
                    <span>Optimal Balance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#5FAAB3' }} />
                    <span>Saturated</span>
                  </div>
                </div>
              </div>

              {/* Region Details / Right Sidebar Column */}
              <div 
                className="lg:col-span-6 flex flex-col justify-between bg-[#F4F4F0]/30 rounded-2xl border-t border-r border-b p-6 transition-all duration-300"
                style={{ 
                  borderLeftWidth: '5px',
                  borderLeftColor: activeHeatColor,
                  borderTopColor: '#e1e1db',
                  borderRightColor: '#e1e1db',
                  borderBottomColor: '#e1e1db'
                }}
              >
                <div className="space-y-5">
                  <div className="space-y-1.5 pb-3 border-b border-[#e1e1db]">
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white transition-all duration-300"
                        style={{ backgroundColor: activeHeatColor }}
                      >
                        Region Diagnostic
                      </span>
                      <span className="text-[10px] font-bold text-[#51615a] italic">{selectedRegion.welshName}</span>
                    </div>
                    <h5 className="text-base font-extrabold text-[#1a2521] flex items-center gap-1.5 mt-2">
                      <MapPin 
                        className="w-4 h-4 shrink-0 transition-colors duration-300" 
                        style={{ color: activeHeatColor }}
                      />
                      <span>{selectedRegion.name}</span>
                    </h5>
                    <p className="text-[11px] text-[#51615a] leading-relaxed pt-1">
                      {selectedRegion.details}
                    </p>
                  </div>

                  {/* Quantitative Metrics bars */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h6 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider">Metrics Overlay Scorecard</h6>
                      <span className="text-[8px] font-extrabold uppercase text-[#2E536B] tracking-wide bg-white border border-[#e1e1db] px-1.5 py-0.5 rounded">
                        Map plot: {mapMetric.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Struggle score */}
                    <div className={`space-y-1 p-2 rounded-lg transition-all duration-300 ${mapMetric === 'struggle' ? 'bg-white border border-[#e1e1db]/80 shadow-3xs' : ''}`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold ${mapMetric === 'struggle' ? 'font-bold text-[#1a2521]' : 'text-slate-600'}`}>
                          Struggle / Challenge index:
                        </span>
                        <span className="font-black" style={{ color: mapMetric === 'struggle' ? activeHeatColor : '#DE6B6B' }}>
                          {selectedRegion.struggleScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 border border-slate-200/50 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${selectedRegion.struggleScore}%`,
                            backgroundColor: mapMetric === 'struggle' ? activeHeatColor : '#DE6B6B'
                          }} 
                        />
                      </div>
                    </div>

                    {/* Help Received score */}
                    <div className={`space-y-1 p-2 rounded-lg transition-all duration-300 ${mapMetric === 'help' ? 'bg-white border border-[#e1e1db]/80 shadow-3xs' : ''}`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold ${mapMetric === 'help' ? 'font-bold text-[#1a2521]' : 'text-slate-600'}`}>
                          Help Received (Support Program strength):
                        </span>
                        <span className="font-black" style={{ color: mapMetric === 'help' ? activeHeatColor : '#63B38F' }}>
                          {selectedRegion.helpScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 border border-slate-200/50 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${selectedRegion.helpScore}%`,
                            backgroundColor: mapMetric === 'help' ? activeHeatColor : '#63B38F'
                          }} 
                        />
                      </div>
                    </div>

                    {/* Gap Severity score */}
                    <div className={`space-y-1 p-2 rounded-lg transition-all duration-300 ${mapMetric === 'gap' ? 'bg-white border border-[#e1e1db]/80 shadow-3xs' : ''}`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold ${mapMetric === 'gap' ? 'font-bold text-[#1a2521]' : 'text-slate-600'}`}>
                          Systemic Gap (Struggle vs Help Mismatch):
                        </span>
                        <span className="font-black" style={{ color: mapMetric === 'gap' ? activeHeatColor : '#4F6C82' }}>
                          {selectedRegion.gapScore > 0 ? `+${selectedRegion.gapScore}% Deficit` : `${selectedRegion.gapScore}% Saturated`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 border border-slate-200/50 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min(100, Math.max(10, Math.abs(selectedRegion.gapScore)))}%`,
                            backgroundColor: mapMetric === 'gap' ? activeHeatColor : '#4F6C82'
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Regional strategic directive advice */}
                  <div className="bg-white p-4 rounded-xl border border-[#e1e1db]/85 shadow-3xs space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4.5 h-4.5 text-[#2E536B] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-[#2E536B] uppercase tracking-wider block">Strategic Recommendation</span>
                        <p className="text-[11px] text-[#1a2521] leading-relaxed">
                          {selectedRegion.gapScore > 30 ? (
                            <span><strong>High priority resource redirect:</strong> This region exhibits critical structural deficits. Redirection of unused or excess equipment donations, Welsh translations, and transition mentors from South East hubs is strongly advised.</span>
                          ) : selectedRegion.gapScore < -20 ? (
                            <span><strong>Strategic transition buffer:</strong> South East Wales is heavily saturated with tech funding. Maintain current support baseline, but cap or redirect any new corporate commitments towards Mid and West Wales valleys.</span>
                          ) : (
                            <span><strong>Systemic balance optimal:</strong> Current local volunteer offerings are in equilibrium with reported barriers. No drastic changes recommended. Focus on documentation of local best practices.</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Regional Filter Toggle Button */}
                    {onRegionFilterChange && (
                      <div className="pt-2 border-t border-dashed border-[#e1e1db]">
                        <button
                          onClick={() => {
                            if (selectedRegionFilter === selectedRegion.id) {
                              onRegionFilterChange('All');
                            } else {
                              onRegionFilterChange(selectedRegion.id);
                            }
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs ${
                            selectedRegionFilter === selectedRegion.id
                              ? 'bg-[#1a2521] hover:bg-[#1a2521]/90 text-white'
                              : 'bg-white hover:bg-[#F4F4F0] text-[#2E536B] border border-[#e1e1db]'
                          }`}
                        >
                          {selectedRegionFilter === selectedRegion.id ? (
                            <>
                              <X className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                              <span>Remove {selectedRegion.name} Filter</span>
                            </>
                          ) : (
                            <>
                              <Filter className="w-3.5 h-3.5 text-[#2E536B]" />
                              <span>Filter Project Grids to {selectedRegion.name}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* RENDER TAB 2: GRADIENT 3-CRITERIA HEAT MAP (MATCHING PRESENTATION TEMPLATE IMAGE) */}
      {activeTab === 'criteria' && (
        <div id="gradient-criteria-heatmap-view" className="bg-white rounded-2xl border border-[#e1e1db] overflow-hidden shadow-xs">
          
          {/* Header Panel */}
          <div className="bg-[#1a2521] px-6 py-5 text-white border-b border-[#e1e1db]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-bold tracking-tight">Systemic Alignment Grid Heat Map</h4>
                </div>
                <p className="text-[11px] text-[#a3b1a9] leading-relaxed max-w-2xl">
                  Maps the relationship between <strong>Challenge Impact</strong> (Y-Axis), <strong>Failure Probability / Deficit</strong> (X-Axis), and <strong>Strategic Urgency</strong>. White bubbles float on top of a continuous gradient backdrop.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT: Gradient 2D Axis Map Grid */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-[#51615a] uppercase tracking-wider flex items-center gap-1">
                      <span>📊 Systemic Risk & Alignment Grid</span>
                    </span>
                    <span className="text-[11px] text-[#51615a] flex items-center gap-1 bg-[#F4F4F0] px-2.5 py-1 rounded-lg border border-[#e1e1db]">
                      <Info className="w-3.5 h-3.5 text-[#2E536B]" />
                      <span>Click glass bubbles to inspect metrics</span>
                    </span>
                  </div>

                  {/* GRADIENT BACKDROP CANVAS WITH DIVIDER GRID */}
                  <div className="relative border border-[#e1e1db] rounded-2xl overflow-hidden h-[25rem] sm:h-[30rem] shadow-xs bg-slate-900">
                    
                    {/* Continuous smooth blended linear gradient backdrop */}
                    <div 
                      className="absolute inset-0 select-none pointer-events-none transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, rgba(222, 107, 107, 0.95) 0%, rgba(229, 169, 115, 0.9) 30%, rgba(230, 198, 135, 0.85) 55%, rgba(99, 179, 143, 0.8) 75%, rgba(95, 170, 179, 0.85) 100%)'
                      }}
                    />

                    {/* Highly polished, subtle glass-like Grid lines */}
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none border-t border-l border-white/10 select-none">
                      {Array.from({ length: 25 }).map((_, idx) => (
                        <div key={idx} className="border-r border-b border-white/10 backdrop-brightness-105" />
                      ))}
                    </div>

                    {/* Gradient overlay to soften corners and add depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />

                    {/* Axis Labels Overlay */}
                    
                    {/* Y-Axis Label: IMPACT */}
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[9px] font-black tracking-widest text-white/80 uppercase select-none pointer-events-none flex items-center gap-1">
                      <span>▲</span><span>Challenge Impact</span>
                    </div>

                    {/* X-Axis Label: PROBABILITY */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest text-white/80 uppercase select-none pointer-events-none flex items-center gap-1">
                      <span>Failure Probability / Deficit</span><span>►</span>
                    </div>

                    {/* Strategic Zone Label Overlays on Backdrop */}
                    <div className="absolute top-4 right-4 text-right pointer-events-none select-none opacity-45">
                      <div className="text-[9px] font-black tracking-wider text-white uppercase">Critical Deficit</div>
                      <div className="text-[7px] font-medium text-white/80">High Impact / High Threat</div>
                    </div>
                    
                    <div className="absolute bottom-12 left-12 pointer-events-none select-none opacity-45">
                      <div className="text-[9px] font-black tracking-wider text-white uppercase">Saturated / Stable</div>
                      <div className="text-[7px] font-medium text-white/80">Low Impact / Strong Support</div>
                    </div>

                    <div className="absolute top-4 left-12 pointer-events-none select-none opacity-30">
                      <div className="text-[8px] font-black tracking-wider text-white uppercase">Muted Transition</div>
                    </div>

                    {/* FLOATING WHITE BUBBLES */}
                    <div className="absolute left-16 right-8 top-8 bottom-12">
                      {activities.map((act) => {
                        const isSelected = selectedActivityId === act.id;
                        
                        return (
                          <button
                            key={act.id}
                            onClick={() => setSelectedActivityId(act.id)}
                            style={{
                              left: `${act.probability}%`,
                              top: `${100 - act.impact}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                            className={`absolute flex items-center gap-3 group cursor-pointer transition-all duration-300 ${
                              isSelected ? 'z-30 scale-110' : 'z-10 hover:z-20 hover:scale-105'
                            }`}
                          >
                            {/* Glassmorphic Concentric Circle Bubble */}
                            <div className="relative flex items-center justify-center">
                              {/* Pulsing Outer Aura */}
                              {isSelected && (
                                <span className="absolute inline-flex h-11 w-11 rounded-full bg-white/40 animate-ping" />
                              )}
                              
                              {/* Inner Glass Orb */}
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-white/45 border-white shadow-[0_0_20px_rgba(255,255,255,0.7)] scale-105' 
                                  : 'bg-white/20 border-white/35 group-hover:bg-white/35 shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                              } backdrop-blur-xs`}>
                                {/* Solid Color Inner Glow Bead */}
                                <div 
                                  className="w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm"
                                  style={{ 
                                    backgroundColor: act.color,
                                    boxShadow: `0 0 10px ${act.color}`
                                  }} 
                                />
                              </div>
                            </div>

                            {/* Crisp Typography Label Box next to bubble */}
                            <div className={`flex flex-col items-start bg-black/45 backdrop-blur-xs border border-white/10 rounded-lg px-2.5 py-1.5 text-left select-none shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 ${
                              isSelected ? 'border-white/30 bg-black/60' : 'group-hover:border-white/20 group-hover:bg-black/50'
                            }`}>
                              <span className="text-[8px] font-extrabold text-white/60 uppercase tracking-widest leading-none">
                                {act.id === 'Family Awareness' ? 'Awareness' : act.id}
                              </span>
                              <span className="text-[9.5px] font-black text-white tracking-tight mt-0.5 leading-none">
                                {act.label.split(':')[0]}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* Subtitle Alignment scale indicator */}
                <p className="text-[10px] text-[#51615a] italic text-center mt-3">
                  Diagonally aligned from bottom-left (Safe Zone) to top-right (Danger Area / Focus Need)
                </p>
              </div>

              {/* RIGHT: Selected Activity Diagnostic Sidebar */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-[#F4F4F0]/30 rounded-2xl border border-[#e1e1db] p-6">
                
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  
                  {/* Title identity */}
                  <div className="space-y-1.5 pb-2 border-b border-[#e1e1db]">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#2E536B] uppercase tracking-wider">Criteria Diagnostic</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        selectedActivity.strategicZone === 'Critical Deficit' ? 'bg-rose-100 text-rose-800' :
                        selectedActivity.strategicZone === 'Saturated' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {selectedActivity.strategicZone}
                      </span>
                    </div>

                    <h5 className="text-sm font-extrabold text-[#1a2521] leading-tight">
                      {selectedActivity.label}
                    </h5>
                    <p className="text-[10px] text-[#51615a] italic">
                      {selectedActivity.subLabel}
                    </p>
                    <p className="text-[11px] text-[#51615a] leading-relaxed pt-1.5">
                      {selectedActivity.description}
                    </p>
                  </div>

                  {/* Presentation template side blocks style matching the provided image layout */}
                  <div className="space-y-3 my-2 flex-1">
                    <h6 className="text-[9px] font-bold text-[#1a2521] uppercase tracking-wider">Strategic Grid Coordinates</h6>
                    
                    <div className="bg-white p-3 rounded-xl border border-[#e1e1db] space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-center">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-[#51615a] block text-[9px] font-semibold uppercase">Impact Coordinate</span>
                          <strong className="text-base font-black text-rose-800">{selectedActivity.impact}%</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-[#51615a] block text-[9px] font-semibold uppercase">Deficit Prob.</span>
                          <strong className="text-base font-black text-amber-800">{selectedActivity.probability}%</strong>
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-[#51615a] leading-relaxed pt-1 border-t border-slate-100 text-center">
                        Active Database submissions: <strong>{selectedActivity.metrics}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Legend blocks like on the right of the user's template image */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-[#51615a] uppercase tracking-wider block">Impact-Probability Legend</span>
                    
                    <div className="grid grid-cols-5 gap-1 shadow-3xs p-1 bg-white border border-[#e1e1db] rounded-lg">
                      <div className="h-4 rounded" style={{ backgroundColor: '#5FAAB3' }} title="Low Threat / Highly Supported" />
                      <div className="h-4 rounded" style={{ backgroundColor: '#63B38F' }} title="Minor Threat" />
                      <div className="h-4 rounded" style={{ backgroundColor: '#E6C687' }} title="Medium Threat / Actionable" />
                      <div className="h-4 rounded" style={{ backgroundColor: '#E5A973' }} title="High Threat" />
                      <div className="h-4 rounded" style={{ backgroundColor: '#DE6B6B' }} title="Critical Systemic Threat / Primary Bottleneck" />
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#e1e1db] text-[10px] text-[#51615a] space-y-1.5 leading-normal">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded" style={{ backgroundColor: '#DE6B6B' }} />
                        <strong>Red Zone (Impact &gt; 75, Prob &gt; 75):</strong> Severe bottlenecks. Needs immediate focus.
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded" style={{ backgroundColor: '#E5A973' }} />
                        <strong>Yellow/Orange (Med):</strong> Monitor active database, co-design programs.
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
