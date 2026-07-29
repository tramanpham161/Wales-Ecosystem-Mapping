import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GapOfferRequest, FrictionPoint } from '../types';
import { SYSTEMIC_TABS } from '../data';
import { WALES_LOCAL_AUTHORITIES_DATA, LocalAuthorityData } from '../walesLocalAuthoritiesData';
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
  X,
  Plus,
  Search
} from 'lucide-react';

interface GapsHeatmapProps {
  gapsOffers: GapOfferRequest[];
  filteredGapsOffers?: GapOfferRequest[];
  organizations?: any[];
  selectedRegionFilter?: string;
  onRegionFilterChange?: (regionId: string) => void;
  activeStage?: string;
  onResetStageFilter?: () => void;
  gapTypeFilter?: string;
  onGapTypeFilterChange?: (type: string) => void;
  gapCategoryFilter?: string;
  onGapCategoryFilterChange?: (category: string) => void;
  gapUrgencyFilter?: string;
  onGapUrgencyFilterChange?: (urgency: string) => void;
  onOpenAddGap?: () => void;
}

type TabType = 'map' | 'criteria';
type MapMetric = 'deprivation' | 'gap' | 'struggle' | 'help';

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
  onRegionFilterChange,
  activeStage,
  onResetStageFilter,
  gapTypeFilter,
  onGapTypeFilterChange,
  gapCategoryFilter,
  onGapCategoryFilterChange,
  gapUrgencyFilter,
  onGapUrgencyFilterChange,
  onOpenAddGap
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  
  // Tab 1 (Wales Map) State
  const [selectedLAName, setSelectedLAName] = useState<string>('Merthyr Tydfil');
  const [mapMetric, setMapMetric] = useState<MapMetric>('deprivation');

  // Tab 2 (3-Criteria Heatmap) State
  const [selectedActivityId, setSelectedActivityId] = useState<FrictionPoint>('Home and Community');

  // Real Leaflet Map Hooks for geographical Wales heat overlay
  const heatMapRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const gapsMarkersGroupRef = useRef<any>(null);

  // Function to plot all markers on the map
  const plotAllMarkers = (L: any) => {
    if (!gapsMarkersGroupRef.current) return;
    gapsMarkersGroupRef.current.clearLayers();

    // 1. Plot pins for Mapped Organization Projects
    if (organizations && organizations.length > 0) {
      organizations.forEach((org) => {
        if (!org.latitude || !org.longitude) return;

        const coords: [number, number] = [org.latitude, org.longitude];
        const markerColor = '#29B6BD'; // Brand Teal for Mapped Projects
        const size = 26;

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-125 cursor-pointer shadow-md" 
                 style="
                   width: ${size}px; 
                   height: ${size}px; 
                   background-color: ${markerColor}; 
                   border: 2px solid #ffffff; 
                 "
                 title="${org.name}"
            >
              <span class="text-white text-[10px] font-black select-none">P</span>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        const marker = L.marker(coords, { icon: customIcon }).addTo(gapsMarkersGroupRef.current);

        const popupHtml = `
          <div class="p-3.5 font-sans w-56 space-y-2 text-left">
            <div class="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5">
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white bg-[#29B6BD]">
                Project
              </span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-[#1a2521] leading-snug break-words m-0">${org.name}</h4>
              <p class="text-[10px] text-slate-500 font-medium m-0 mt-1">📍 ${org.location} • ${org.sector || ''}</p>
            </div>
            <div class="pt-1">
              <button onclick="window.openDetailedOrgPopup && window.openDetailedOrgPopup('${org.id}')" class="w-full text-center py-1.5 bg-[#29B6BD] hover:bg-[#1d8e93] text-[10px] text-white font-bold rounded-md transition cursor-pointer shadow-2xs">
                View details
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, {
          closeButton: true,
          autoPan: false,
          offset: [0, -size / 2]
        });

        marker.on('mouseover', () => marker.openPopup());
      });
    }

    // 2. Plot pins for Offers, Requests & Collaborations
    const listToPlot = (filteredGapsOffers || []).filter(item => item.type !== 'Gap');
    listToPlot.forEach((item) => {
      const coords = getGapOfferCoordinates(item, organizations || []);
      
      let markerColor = '#51615a';
      let iconSymbol = '•';
      let typeLabel = 'Insight';
      
      if (item.type === 'Gap') {
        markerColor = '#DC2626'; // Red
        iconSymbol = '!';
        typeLabel = 'Project';
      } else if (item.type === 'Offer') {
        markerColor = '#0D9488'; // Teal
        iconSymbol = '★';
        typeLabel = 'Offer';
      } else if (item.type === 'Request') {
        markerColor = '#D97706'; // Amber
        iconSymbol = '?';
        typeLabel = 'Request';
      } else if (item.type === 'Collaboration') {
        markerColor = '#2563EB'; // Blue
        iconSymbol = 'C';
        typeLabel = 'Collaboration';
      }

      const size = 28;
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-125 cursor-pointer shadow-md" 
               style="
                 width: ${size}px; 
                 height: ${size}px; 
                 background-color: ${markerColor}; 
                 border: 2px solid #ffffff; 
               "
          >
            <span class="text-white text-[11px] font-black select-none" style="margin-top: -1px;">${iconSymbol}</span>
            ${item.urgency === 'urgent' ? `
              <span class="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-600 border border-white animate-pulse" title="Urgent">
              </span>
            ` : ''}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(gapsMarkersGroupRef.current);

      const popupHtml = `
        <div class="p-3.5 font-sans w-56 space-y-2 text-left">
          <div class="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5">
            <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white" style="background-color: ${markerColor}">
              ${typeLabel}
            </span>
          </div>
          <div>
            <h4 class="text-xs font-bold text-[#1a2521] leading-snug break-words m-0">${item.title}</h4>
            <p class="text-[10px] text-slate-500 font-medium m-0 mt-1">📍 ${(item.region || 'All').toUpperCase()} • ${item.organization || item.submittedBy || 'Partner'}</p>
          </div>
          <div class="pt-1">
            <button onclick="window.openDetailedGapOfferPopup && window.openDetailedGapOfferPopup('${item.id}')" class="w-full text-center py-1.5 bg-[#29B6BD] hover:bg-[#1d8e93] text-[10px] text-white font-bold rounded-md transition cursor-pointer shadow-2xs">
              View details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoPan: false,
        offset: [0, -size / 2]
      });

      marker.on('mouseover', () => marker.openPopup());
    });
  };

  // Initialize Leaflet Map and fetch Wales 22 Local Authorities GeoJSON Choropleth
  useEffect(() => {
    if (activeTab !== 'map') return;

    const L = (window as any).L;
    if (!L) return;

    const timer = setTimeout(() => {
      const container = document.getElementById('wales-heatmap-real-map');
      if (!container || heatMapRef.current) return;

      const mapInstance = L.map('wales-heatmap-real-map', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      }).setView([52.25, -3.8], 7.4);

      // Light tiles for clean baseline contrast
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        minZoom: 6
      }).addTo(mapInstance);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

      heatMapRef.current = mapInstance;
      gapsMarkersGroupRef.current = L.layerGroup().addTo(mapInstance);

      plotAllMarkers(L);

      // Fetch official Wales Local Authorities GeoJSON
      fetch('/wales_local_authorities.json')
        .then(res => res.json())
        .then(geoData => {
          if (!heatMapRef.current || !heatMapRef.current._container) return;

          const getFeatureStyle = (feature: any) => {
            const name = feature.properties?.LAD13NM || feature.properties?.LAD21NM || feature.properties?.LAD22NM || feature.properties?.name || '';
            const data = WALES_LOCAL_AUTHORITIES_DATA[name];
            const isSelected = selectedLAName === name;

            let fillColor = '#94a3b8';
            if (mapMetric === 'deprivation') {
              const pct = data?.deprivationPct || 50;
              if (pct >= 58) fillColor = '#be123c'; // Very High Deprivation (Critical Red)
              else if (pct >= 54) fillColor = '#f97316'; // High Deprivation (Orange High Gap)
              else if (pct >= 50) fillColor = '#eab308'; // Moderate Deprivation (Yellow)
              else if (pct >= 45) fillColor = '#06b6d4'; // Low-Moderate (Cyan)
              else fillColor = '#29B6BD'; // Low Deprivation (Logo Blue)
            } else if (mapMetric === 'gap') {
              const gap = data?.gapScore || 0;
              if (gap >= 30) fillColor = '#be123c'; // Severe Deficit
              else if (gap >= 15) fillColor = '#f97316'; // High Gap
              else if (gap >= -5) fillColor = '#eab308'; // Balanced
              else fillColor = '#06b6d4'; // Saturated
            } else if (mapMetric === 'struggle') {
              const st = data?.struggleScore || 50;
              if (st >= 80) fillColor = '#be123c';
              else if (st >= 65) fillColor = '#f97316';
              else if (st >= 50) fillColor = '#eab308';
              else fillColor = '#10b981';
            } else { // 'help'
              const hp = data?.helpScore || 50;
              if (hp >= 70) fillColor = '#047857';
              else if (hp >= 55) fillColor = '#0d9488';
              else if (hp >= 40) fillColor = '#d97706';
              else fillColor = '#e11d48';
            }

            return {
              fillColor,
              weight: isSelected ? 3 : 1.2,
              opacity: 1,
              color: isSelected ? '#0f172a' : '#ffffff',
              fillOpacity: isSelected ? 0.92 : 0.75
            };
          };

          const geoLayer = L.geoJSON(geoData, {
            style: getFeatureStyle,
            onEachFeature: (feature: any, layer: any) => {
              const name = feature.properties?.LAD13NM || feature.properties?.LAD21NM || feature.properties?.LAD22NM || feature.properties?.name || '';
              const data = WALES_LOCAL_AUTHORITIES_DATA[name];

              const tooltipContent = `
                <div class="p-2.5 font-sans space-y-1">
                  <div class="font-bold text-[#1a2521] text-xs flex items-center justify-between gap-2">
                    <span>${name}</span>
                    <span class="text-[10px] text-teal-700 font-semibold italic">${data?.welshName || ''}</span>
                  </div>
                  <div class="text-[10px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                    <div>📊 <strong>ONS Household Deprivation:</strong> ${data?.deprivationPct || 0}%</div>
                    <div>⚖️ <strong>Systemic Gap Index:</strong> ${data?.gapScore > 0 ? '+' : ''}${data?.gapScore || 0}%</div>
                    <div>⚠️ <strong>Primary Friction:</strong> ${data?.barriers?.[0] || 'N/A'}</div>
                  </div>
                </div>
              `;

              layer.bindTooltip(tooltipContent, { 
                permanent: false, 
                direction: 'top', 
                className: 'rounded-xl shadow-md border border-slate-200 bg-white p-0 overflow-hidden' 
              });

              layer.on({
                mouseover: (e: any) => {
                  const l = e.target;
                  l.setStyle({ weight: 2.8, color: '#0f172a', fillOpacity: 0.95 });
                  l.bringToFront();
                },
                mouseout: (e: any) => {
                  if (geoJsonLayerRef.current) {
                    geoJsonLayerRef.current.resetStyle(e.target);
                  }
                },
                click: (e: any) => {
                  setSelectedLAName(name);
                  if (heatMapRef.current && e.target.getBounds) {
                    heatMapRef.current.fitBounds(e.target.getBounds(), { padding: [20, 20] });
                  }
                }
              });
            }
          }).addTo(mapInstance);

          geoJsonLayerRef.current = geoLayer;
        })
        .catch(err => {
          console.error('Failed to load Wales GeoJSON:', err);
        });

      // Add key city markers
      const cities = [
        { name: 'Bangor', coords: [53.228, -4.128] },
        { name: 'Cardiff (Capital)', coords: [51.481, -3.179] },
        { name: 'Aberystwyth', coords: [52.414, -4.085] },
        { name: 'Swansea', coords: [51.621, -3.943] },
        { name: 'Wrexham', coords: [53.046, -2.993] },
        { name: 'Merthyr Tydfil', coords: [51.748, -3.378] }
      ];

      cities.forEach(city => {
        L.circleMarker(city.coords, {
          radius: 4,
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

  // Update styles on selected local authority change
  useEffect(() => {
    if (!geoJsonLayerRef.current || activeTab !== 'map') return;
    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const name = layer.feature?.properties?.LAD13NM || layer.feature?.properties?.LAD21NM || layer.feature?.properties?.LAD22NM || layer.feature?.properties?.name;
      if (name === selectedLAName) {
        layer.setStyle({ weight: 3, color: '#0f172a', fillOpacity: 0.95 });
        layer.bringToFront();
      } else {
        geoJsonLayerRef.current.resetStyle(layer);
      }
    });
  }, [selectedLAName, activeTab, mapMetric]);

  // Synchronize Leaflet map pins for Gaps, Offers, Requests & Mapped Projects
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !heatMapRef.current || !gapsMarkersGroupRef.current) return;

    plotAllMarkers(L);
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
    return regions[1];
  }, [regions]);

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
      id: 'Home and Community',
      label: 'Stage 1: Home and Community',
      subLabel: 'Reaching Families Directly',
      impact: 85,          // High Impact
      probability: 78,     // High Probability of Barrier
      description: 'Support, awareness, and opportunities rooted in family life, trusted community spaces, and early environment.',
      metrics: '78% awareness deficit recorded in rural areas',
      strategicZone: 'Critical Deficit',
      color: '#DE6B6B' // Soft Red
    },
    {
      id: 'School',
      label: 'Stage 2: School',
      subLabel: 'Primary & Secondary Education',
      impact: 70,          // Medium-High Impact
      probability: 58,     // Medium Probability
      description: 'Foundation learning, curriculum alignment, inspiring career awareness, and supported school transitions.',
      metrics: '58% of parents cite privacy/stigma as primary barrier',
      strategicZone: 'Strategic Balance',
      color: '#E5A973' // Soft Orange
    },
    {
      id: 'Post-16 Education and Training',
      label: 'Stage 3: Post-16 Ed. & Training',
      subLabel: 'Colleges & Apprenticeships',
      impact: 35,          // Low-Medium Impact
      probability: 88,     // Very High Probability
      description: 'Further education colleges, apprenticeships, vocational training, and higher education pathways.',
      metrics: '88% of learners experience device disruption during summer',
      strategicZone: 'Saturated',
      color: '#E6C687' // Soft Yellow
    },
    {
      id: 'Entry to Work',
      label: 'Stage 4: Entry to Work',
      subLabel: 'First Jobs & Career Entry',
      impact: 62,          // Medium Impact
      probability: 40,     // Medium-Low Probability
      description: 'Bridging education to early employment, inclusive recruitment, internships, and first-job navigation.',
      metrics: '1:1 human assistance improves success rates by 3.5x',
      strategicZone: 'Strategic Balance',
      color: '#63B38F' // Soft Green
    },
    {
      id: 'In Work',
      label: 'Stage 5: In Work',
      subLabel: 'Retention & Career Growth',
      impact: 90,          // Critical Impact
      probability: 25,     // Low Probability (because resources exist, but misplaced)
      description: 'Workplace culture, ongoing skill development, fair retention, and structured internal career progression.',
      metrics: 'Welsh language compliance required for all public schemes',
      strategicZone: 'Muted/Stable',
      color: '#5FAAB3' // Soft Teal
    },
    {
      id: 'Re-entry',
      label: 'Stage 6: Re-entry',
      subLabel: 'Upskilling & Returning to Work',
      impact: 48,          // Medium-Low Impact
      probability: 65,     // Medium-High Probability
      description: 'Navigating career transitions, returning to work after time away, adult upskilling, and lifelong learning.',
      metrics: 'Re-entry index indicates 40% jump to advanced courses',
      strategicZone: 'Strategic Balance',
      color: '#E6C687' // Soft Yellow
    }
  ], []);

  const selectedActivity = useMemo(() => {
    return activities.find(a => a.id === selectedActivityId) || activities[0];
  }, [activities, selectedActivityId]);

  return (
    <div id="gaps-hybrid-heatmaps-container" className="space-y-6">
      
      {/* UNIFIED DUAL PERSPECTIVE & MAP FILTER CONTROL PANEL */}
      <div className="bg-white rounded-2xl border border-[#e1e1db] p-5 shadow-xs space-y-4">
        {/* Row 1: Main Header, Perspective Tabs, and Add Log Entry Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#e1e1db]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#29B6BD]/10 rounded-xl text-[#176e73] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#1a2521]">Dual Perspective Ecosystem Mapping</h3>
                {activeStage && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#29B6BD]/10 text-[#176e73] border border-[#29B6BD]/20 text-[10px] font-bold">
                    Stage: {activeStage}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#51615a] mt-0.5">
                Analyse spatial distribution across Wales or explore systemic 3-criteria grids.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* Perspective Switcher */}
            <div className="flex bg-[#F4F4F0] p-1 rounded-xl border border-[#e1e1db]">
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'map' 
                    ? 'bg-[#29B6BD] text-white shadow-2xs' 
                    : 'text-[#51615a] hover:text-[#29B6BD]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>1. Wales Regional Map</span>
              </button>
              <button
                onClick={() => setActiveTab('criteria')}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'criteria' 
                    ? 'bg-[#29B6BD] text-white shadow-2xs' 
                    : 'text-[#51615a] hover:text-[#29B6BD]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>2. 3-Criteria Grid Map</span>
              </button>
            </div>

            {/* Log Entry Button */}
            {onOpenAddGap && (
              <button
                onClick={onOpenAddGap}
                className="px-4 py-2 bg-[#29B6BD] hover:bg-[#1d8e93] text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Log Entry</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Filter Selectors & Map Metric Layer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-xs font-bold text-[#1a2521] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#29B6BD]" />
              <span>Map Filters:</span>
            </span>

            {onGapTypeFilterChange && (
              <select
                value={gapTypeFilter || 'All'}
                onChange={(e) => onGapTypeFilterChange(e.target.value)}
                className="px-3 py-1.5 text-xs border border-[#e1e1db] rounded-xl focus:outline-none bg-white text-[#51615a] font-medium cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Offer">Offers</option>
                <option value="Request">Requests</option>
                <option value="Collaboration">Collaborations</option>
              </select>
            )}

            {onGapUrgencyFilterChange && (
              <select
                value={gapUrgencyFilter || 'All'}
                onChange={(e) => onGapUrgencyFilterChange(e.target.value)}
                className="px-3 py-1.5 text-xs border border-[#e1e1db] rounded-xl focus:outline-none bg-white text-[#51615a] font-medium cursor-pointer"
              >
                <option value="All">All Urgencies</option>
                <option value="urgent">Urgent</option>
                <option value="not urgent">Not Urgent</option>
              </select>
            )}
          </div>

          {/* Map Metric Layer Toggles */}
          {activeTab === 'map' && (
            <div className="flex items-center gap-1.5 bg-[#F4F4F0] border border-[#e1e1db] rounded-xl p-1 text-[10px]">
              <span className="px-2 font-bold text-[#51615a] text-[9px] uppercase tracking-wider hidden sm:inline">Choropleth Layer:</span>
              <button
                onClick={() => setMapMetric('deprivation')}
                className={`px-3 py-1 font-bold rounded-lg transition cursor-pointer ${
                  mapMetric === 'deprivation' ? 'bg-[#29B6BD] text-white shadow-2xs' : 'text-[#51615a] hover:text-[#1a2521]'
                }`}
              >
                ONS Deprivation Index
              </button>
              <button
                onClick={() => setMapMetric('gap')}
                className={`px-3 py-1 font-bold rounded-lg transition cursor-pointer ${
                  mapMetric === 'gap' ? 'bg-[#29B6BD] text-white shadow-2xs' : 'text-[#51615a] hover:text-[#1a2521]'
                }`}
              >
                Systemic Gap Index
              </button>
              <button
                onClick={() => setMapMetric('struggle')}
                className={`px-3 py-1 font-bold rounded-lg transition cursor-pointer ${
                  mapMetric === 'struggle' ? 'bg-[#29B6BD] text-white shadow-2xs' : 'text-[#51615a] hover:text-[#1a2521]'
                }`}
              >
                Struggle Level
              </button>
              <button
                onClick={() => setMapMetric('help')}
                className={`px-3 py-1 font-bold rounded-lg transition cursor-pointer ${
                  mapMetric === 'help' ? 'bg-[#29B6BD] text-white shadow-2xs' : 'text-[#51615a] hover:text-[#1a2521]'
                }`}
              >
                Help Received
              </button>
            </div>
          )}
        </div>

        {/* Row 3: Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#e1e1db]/60 text-xs">
          <span className="text-[#51615a] font-medium text-[11px]">Active Filters:</span>
          
          {/* Stage badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#29B6BD]/10 text-[#176e73] text-[11px] font-bold border border-[#29B6BD]/20">
            <span>Stage: {activeStage || 'All Stages'}</span>
            {activeStage && activeStage !== 'All Stages' && onResetStageFilter && (
              <button 
                onClick={onResetStageFilter} 
                className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-0.5"
                title="Reset to All Stages"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>

          {selectedRegionFilter && selectedRegionFilter !== 'All' && onRegionFilterChange && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              <Filter className="w-3 h-3 text-amber-700" />
              <span>Region: {selectedRegionFilter.charAt(0).toUpperCase() + selectedRegionFilter.slice(1)} Wales</span>
              <button 
                onClick={() => onRegionFilterChange('All')} 
                className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-0.5"
                title="Clear region filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {gapTypeFilter && gapTypeFilter !== 'All' && onGapTypeFilterChange && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
              <span>Type: {gapTypeFilter}</span>
              <button 
                onClick={() => onGapTypeFilterChange('All')} 
                className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-0.5"
                title="Clear type filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {gapUrgencyFilter && gapUrgencyFilter !== 'All' && onGapUrgencyFilterChange && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200">
              <span>Urgency: {gapUrgencyFilter}</span>
              <button 
                onClick={() => onGapUrgencyFilterChange('All')} 
                className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-0.5"
                title="Clear urgency filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filteredGapsOffers || gapsOffers) && (
            <span className="ml-auto text-[11px] text-[#51615a] font-medium">
              Showing <strong>{(filteredGapsOffers || gapsOffers).length}</strong> {(filteredGapsOffers || gapsOffers).length === 1 ? 'entry' : 'entries'} on map
            </span>
          )}
        </div>
      </div>

      {/* RENDER TAB 1: WALES REGIONAL HEAT MAP */}
      {activeTab === 'map' && (() => {
        const selectedLA = WALES_LOCAL_AUTHORITIES_DATA[selectedLAName] || WALES_LOCAL_AUTHORITIES_DATA['Merthyr Tydfil'];
        const allLAs = Object.values(WALES_LOCAL_AUTHORITIES_DATA);

        return (
          <div id="wales-regional-heatmap-view" className="bg-white rounded-2xl border border-[#e1e1db] overflow-hidden shadow-xs">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Real Geographical Leaflet Wales Map */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-[#e1e1db] p-4 relative min-h-[440px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-[#29B6BD] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#29B6BD]" />
                      <span>ONS Census Choropleth (22 Welsh Local Authorities)</span>
                    </span>
                    <span className="text-[9px] text-[#176e73] bg-[#f0fdfa] px-2 py-0.5 rounded-md font-extrabold border border-[#99f6e4]">
                      Exact Administrative Borders
                    </span>
                  </div>

                  {/* Map Container */}
                  <div 
                    id="wales-heatmap-real-map" 
                    className="w-full h-[360px] rounded-xl border border-gray-200 shadow-inner overflow-hidden z-10" 
                    style={{ minHeight: '360px' }}
                  />

                  {/* Legend bar */}
                  <div className="mt-3 bg-[#F4F4F0] border border-[#e1e1db] p-3 rounded-xl space-y-2 text-[10px] text-[#51615a]">
                    {/* Pin Types Legend */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#e1e1db]">
                      <span className="font-bold text-[#1a2521]">Map Markers:</span>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1" title="Mapped Organisation Projects">
                          <span className="w-4 h-4 rounded-full bg-[#29B6BD] text-white text-[9px] font-black flex items-center justify-center border border-white shadow-2xs">P</span>
                          <span className="font-semibold text-[#1a2521]">Projects</span>
                        </div>
                        <div className="flex items-center gap-1" title="Active Offers">
                          <span className="w-4 h-4 rounded-full bg-[#0D9488] text-white text-[9px] font-black flex items-center justify-center border border-white shadow-2xs">★</span>
                          <span className="font-semibold text-[#1a2521]">Offers</span>
                        </div>
                        <div className="flex items-center gap-1" title="Resource Requests">
                          <span className="w-4 h-4 rounded-full bg-[#D97706] text-white text-[9px] font-black flex items-center justify-center border border-white shadow-2xs">?</span>
                          <span className="font-semibold text-[#1a2521]">Requests</span>
                        </div>
                        <div className="flex items-center gap-1" title="Collaborations">
                          <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] font-black flex items-center justify-center border border-white shadow-2xs">C</span>
                          <span className="font-semibold text-[#1a2521]">Collaborations</span>
                        </div>
                      </div>
                    </div>

                    {/* Choropleth Heatmap Scale */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[9px]">
                      <span className="font-bold text-[#51615a]">
                        {mapMetric === 'deprivation' ? 'ONS Household Deprivation (% 1+ dim):' : 'Choropleth Scale:'}
                      </span>
                      {mapMetric === 'deprivation' ? (
                        <>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#29B6BD]" />
                            <span>&lt;45% Low</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]" />
                            <span>45-50%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#eab308]" />
                            <span>50-54%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#f97316]" />
                            <span>54-58% High</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#be123c]" />
                            <span>&gt;58% Very High</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#be123c]" />
                            <span>Critical Deficit</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#f97316]" />
                            <span>High Gap</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#eab308]" />
                            <span>Balanced</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]" />
                            <span>Supported</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Local Authority Diagnostic / Right Sidebar Column */}
                <div 
                  className="lg:col-span-6 flex flex-col justify-between bg-[#F4F4F0]/30 rounded-2xl border-t border-r border-b p-6 transition-all duration-300 border-l-4 border-l-[#29B6BD] border-[#e1e1db]"
                >
                  <div className="space-y-5">
                    
                    {/* Header & Local Authority Dropdown Selector */}
                    <div className="space-y-3 pb-3 border-b border-[#e1e1db]">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white bg-[#29B6BD]">
                          ONS Local Authority Profile
                        </span>
                        <span className="text-[10px] font-bold text-[#51615a] italic">{selectedLA.welshName}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <h5 className="text-lg font-extrabold text-[#1a2521] flex items-center gap-1.5">
                          <MapPin className="w-5 h-5 text-[#29B6BD] shrink-0" />
                          <span>{selectedLA.name}</span>
                        </h5>

                        {/* Dropdown selector for all 22 Local Authorities */}
                        <div className="relative">
                          <select
                            value={selectedLAName}
                            onChange={(e) => {
                              setSelectedLAName(e.target.value);
                            }}
                            className="px-3 py-1.5 text-xs border border-[#29B6BD] rounded-xl bg-white text-[#29B6BD] font-bold focus:outline-none focus:ring-2 focus:ring-[#29B6BD] shadow-2xs cursor-pointer"
                          >
                            {allLAs.map((la) => (
                              <option key={la.name} value={la.name}>
                                {la.name} ({la.welshName})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-[#51615a] leading-relaxed">
                        Official administrative boundary metrics for <strong>{selectedLA.name}</strong> ({selectedLA.welshName}) in {selectedLA.region.toUpperCase()} Wales.
                      </p>
                    </div>

                    {/* Scorecard */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h6 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider">Local Authority Metrics</h6>
                        <span className="text-[9px] font-extrabold uppercase text-[#29B6BD] tracking-wide bg-[#f0fdfa] border border-[#99f6e4] px-2 py-0.5 rounded-full">
                          2021 ONS Census Data
                        </span>
                      </div>
                      
                      {/* ONS Household Deprivation */}
                      <div className="space-y-1 p-2.5 rounded-xl bg-white border border-[#e1e1db]/80 shadow-3xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#1a2521]">
                            Household Deprivation (1+ Dimension):
                          </span>
                          <span className="font-black text-[#29B6BD]">
                            {selectedLA.deprivationPct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 border border-slate-200/50 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500 bg-[#29B6BD]" 
                            style={{ width: `${selectedLA.deprivationPct}%` }} 
                          />
                        </div>
                        <div className="text-[9px] text-slate-500 pt-0.5">
                          % of households deprived in Education, Employment, Health, or Housing.
                        </div>
                      </div>

                      {/* Systemic Gap Index */}
                      <div className="space-y-1 p-2.5 rounded-xl bg-white border border-[#e1e1db]/80 shadow-3xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#1a2521]">
                            Systemic Gap Index (Deficit vs Support):
                          </span>
                          <span className={`font-black ${selectedLA.gapScore > 20 ? 'text-rose-600' : 'text-teal-700'}`}>
                            {selectedLA.gapScore > 0 ? `+${selectedLA.gapScore}% Deficit` : `${selectedLA.gapScore}% Saturated`}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 border border-slate-200/50 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${selectedLA.gapScore > 20 ? 'bg-rose-600' : 'bg-teal-600'}`} 
                            style={{ width: `${Math.min(100, Math.max(15, Math.abs(selectedLA.gapScore) * 1.2))}%` }} 
                          />
                        </div>
                      </div>

                      {/* Key Local Friction Barriers */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Key Regional Friction Factors:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedLA.barriers.map((barrier, idx) => (
                            <span key={idx} className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
                              • {barrier}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-white p-4 rounded-xl border border-[#e1e1db]/85 shadow-3xs space-y-2">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="w-4.5 h-4.5 text-[#29B6BD] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#29B6BD] uppercase tracking-wider block">Targeted Intervention Note</span>
                          <p className="text-[11px] text-[#1a2521] leading-relaxed">
                            {selectedLA.deprivationPct > 55 ? (
                              <><strong>{selectedLA.name}</strong> exhibits high deprivation levels ({selectedLA.deprivationPct}%). Recommended focus: high-impact grassroots resourcing, transport access, and direct local partnership funding.</>
                            ) : (
                              <><strong>{selectedLA.name}</strong> maintains stable baseline support ({selectedLA.deprivationPct}% deprivation). Focus on cross-sector collaboration and digital connectivity.</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

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
                      <Info className="w-3.5 h-3.5 text-[#29B6BD]" />
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
                            <div className={`relative group/bubbleinfo flex flex-col items-start bg-black/45 backdrop-blur-xs border border-white/10 rounded-lg px-2.5 py-1.5 text-left select-none shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 ${
                              isSelected ? 'border-white/30 bg-black/60' : 'group-hover:border-white/20 group-hover:bg-black/50'
                            }`}>
                              <div className="flex items-center justify-between w-full gap-2">
                                <span className="text-[8px] font-extrabold text-white/60 uppercase tracking-widest leading-none">
                                  {act.id === 'Home and Community' ? 'Community' : act.id}
                                </span>
                                <span 
                                  className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black font-serif italic text-[9px] font-bold flex items-center justify-center transition cursor-help shrink-0"
                                  title="Stage information"
                                >
                                  i
                                </span>
                              </div>
                              <span className="text-[9.5px] font-black text-white tracking-tight mt-0.5 leading-none">
                                {act.label.split(':')[0]}
                              </span>

                              {/* Hover Tooltip explaining stage */}
                              <div className="absolute left-0 top-8 w-56 p-2.5 bg-[#1a2521] text-white rounded-lg shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover/bubbleinfo:opacity-100 transition-all duration-200 z-50 text-left">
                                <p className="text-[10px] font-bold text-emerald-400 mb-0.5">{act.label}</p>
                                <p className="text-[9.5px] text-slate-200 leading-normal">{act.description}</p>
                              </div>
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
                      <span className="text-[9px] font-bold text-[#176e73] uppercase tracking-wider">Criteria Diagnostic</span>
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
