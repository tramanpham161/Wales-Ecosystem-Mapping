import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GapOfferRequest, FrictionPoint } from '../types';
import { SYSTEMIC_TABS } from '../data';
import { WALES_LOCAL_AUTHORITIES_DATA, LocalAuthorityData } from '../walesLocalAuthoritiesData';
import { YORKSHIRE_LOCAL_AUTHORITIES_DATA } from '../yorkshireLocalAuthoritiesData';
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
  placeName?: 'Wales' | 'Yorkshire';
}


type TabType = 'map' | 'criteria';
type MapMetric = 'deprivation' | 'gap' | 'struggle' | 'help';

interface RegionData {
  id: string;
  name: string;
  welshName: string;
  struggleScore: number;
  helpScore: number;
  gapScore: number;
  details: string;
  color: string;
  path: string;
  center: [number, number];
}

function getGapOfferCoordinates(item: GapOfferRequest, organizations: any[], isYorkshire: boolean): [number, number] {
  if (item.organization) {
    const org = organizations.find(o => o.name && o.name.toLowerCase().trim() === item.organization.toLowerCase().trim());
    if (org && org.latitude && org.longitude) {
      return [org.latitude, org.longitude];
    }
  }
  
  const regionCoords: Record<string, [number, number]> = isYorkshire ? {
    west: [53.80, -1.75],
    south: [53.45, -1.45],
    north: [54.00, -1.20],
    east: [53.75, -0.35]
  } : {
    north: [53.05, -3.8],
    mid: [52.35, -3.60],
    southwest: [51.85, -4.30],
    southeast: [51.65, -3.15]
  };
  
  const region = item.region || (isYorkshire ? 'west' : 'mid');
  const baseCoords = regionCoords[region] || (isYorkshire ? [53.78, -1.55] : [53.75, -1.50]);
  
  let hash = 0;
  const str = item.id + item.title;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const latJitter = ((hash & 0xFF) / 255 - 0.5) * 0.15;
  const lngJitter = (((hash >> 8) & 0xFF) / 255 - 0.5) * 0.15;
  
  return [baseCoords[0] + latJitter, baseCoords[1] + lngJitter];
}

export function getSectorMarkerStyle(sectorName?: string) {
  const s = (sectorName || '').toLowerCase().trim();
  if (s.includes('charity')) {
    return { color: '#E11D48', symbol: 'C', name: 'Charity' };
  }
  if (s.includes('community')) {
    return { color: '#059669', symbol: 'CO', name: 'Community organisation' };
  }
  if (s.includes('partnership')) {
    return { color: '#2563EB', symbol: 'P', name: 'Partnership' };
  }
  if (s.includes('anchor')) {
    return { color: '#7C3AED', symbol: 'A', name: 'Anchor institution' };
  }
  if (s.includes('public body')) {
    return { color: '#0284C7', symbol: 'PB', name: 'Public body' };
  }
  if (s.includes('local authority')) {
    return { color: '#0D9488', symbol: 'LA', name: 'Local authority' };
  }
  if (s.includes('funder')) {
    return { color: '#D97706', symbol: 'F', name: 'Funder' };
  }
  if (s === 'fe' || s.includes('further education') || s.includes('college')) {
    return { color: '#EA580C', symbol: 'FE', name: 'FE' };
  }
  if (s === 'he' || s.includes('higher education') || s.includes('university')) {
    return { color: '#4F46E5', symbol: 'HE', name: 'HE' };
  }
  if (s.includes('employer')) {
    return { color: '#0891B2', symbol: 'E', name: 'Employer' };
  }
  if (s.includes('independent training') || s.includes('training provider')) {
    return { color: '#65A30D', symbol: 'TP', name: 'Independent training provider' };
  }
  if (s.includes('tech') || s.includes('digital')) {
    return { color: '#29B6BD', symbol: 'T', name: 'Tech/Digital' };
  }
  if (s.includes('green')) {
    return { color: '#3AB03A', symbol: 'G', name: 'Green Economy' };
  }
  if (s.includes('creative')) {
    return { color: '#FF9900', symbol: 'Cr', name: 'Creative' };
  }
  if (s.includes('foundational')) {
    return { color: '#9E2A2B', symbol: 'Fn', name: 'Foundational' };
  }
  return { color: '#29B6BD', symbol: 'O', name: sectorName || 'Organisation' };
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
  onOpenAddGap,
  placeName = 'Wales'
}) => {
  const isYorkshire = placeName?.toLowerCase() === 'yorkshire';
  const [activeTab, setActiveTab] = useState<TabType>('map');
  
  const [selectedLAName, setSelectedLAName] = useState<string>(isYorkshire ? 'Bradford' : 'Merthyr Tydfil');
  const [mapMetric, setMapMetric] = useState<MapMetric>('deprivation');

  useEffect(() => {
    if (isYorkshire) {
      if (!YORKSHIRE_LOCAL_AUTHORITIES_DATA[selectedLAName]) {
        setSelectedLAName('Bradford');
      }
    } else {
      if (!WALES_LOCAL_AUTHORITIES_DATA[selectedLAName]) {
        setSelectedLAName('Merthyr Tydfil');
      }
    }
  }, [isYorkshire, selectedLAName]);

  const [selectedActivityId, setSelectedActivityId] = useState<FrictionPoint>('Home and Community');

  const laData: Record<string, any> = isYorkshire ? YORKSHIRE_LOCAL_AUTHORITIES_DATA : WALES_LOCAL_AUTHORITIES_DATA;

  const getLAData = (rawName: string) => {
    const clean = (rawName || '').trim();
    if (laData[clean]) return { name: clean, data: laData[clean] };

    if (clean.includes('Hull') || clean.includes('Kingston upon Hull')) return { name: 'Kingston upon Hull', data: laData['Kingston upon Hull'] };
    if (clean.includes('York') && !clean.includes('North') && !clean.includes('East')) return { name: 'City of York', data: laData['City of York'] };
    if (clean.includes('East Riding')) return { name: 'East Riding of Yorkshire', data: laData['East Riding of Yorkshire'] };
    if (clean.includes('Kirklees')) return { name: 'Kirklees', data: laData['Kirklees'] };
    if (clean.includes('Calderdale')) return { name: 'Calderdale', data: laData['Calderdale'] };
    if (clean.includes('Bradford')) return { name: 'Bradford', data: laData['Bradford'] };
    if (clean.includes('Leeds')) return { name: 'Leeds', data: laData['Leeds'] };
    if (clean.includes('Sheffield')) return { name: 'Sheffield', data: laData['Sheffield'] };
    if (clean.includes('Wakefield')) return { name: 'Wakefield', data: laData['Wakefield'] };
    if (clean.includes('Barnsley')) return { name: 'Barnsley', data: laData['Barnsley'] };
    if (clean.includes('Doncaster')) return { name: 'Doncaster', data: laData['Doncaster'] };
    if (clean.includes('Rotherham')) return { name: 'Rotherham', data: laData['Rotherham'] };
    if (clean.includes('North Yorkshire')) return { name: 'North Yorkshire', data: laData['North Yorkshire'] };
    
    return { name: clean, data: undefined };
  };

  const heatMapRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const gapsMarkersGroupRef = useRef<any>(null);

  const plotAllMarkers = (L: any) => {
    if (!gapsMarkersGroupRef.current) return;
    gapsMarkersGroupRef.current.clearLayers();

    // Only show spots for Requests and Activities per requirements
    const listToPlot = (filteredGapsOffers || []).filter(item => 
      item.type === 'Request' || item.type === 'Gap' || item.type === 'Offer' || item.type === 'Collaboration' || item.type === 'Activity' || item.type === 'Project'
    );

    listToPlot.forEach((item) => {
      const coords = getGapOfferCoordinates(item, organizations || [], isYorkshire);
      
      const isRequest = item.type === 'Request' || item.type === 'Gap';
      const markerColor = isRequest ? '#D97706' : '#0D9488';
      const iconSymbol = isRequest ? '?' : '★';
      const typeLabel = isRequest ? 'Request' : 'Activity';

      const size = 28;
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-125 cursor-pointer shadow-md" 
               style="width: ${size}px; height: ${size}px; background-color: ${markerColor}; border: 2px solid #ffffff;"
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

      marker.bindPopup(popupHtml, { closeButton: true, autoPan: false, offset: [0, -size / 2] });
      marker.on('mouseover', () => marker.openPopup());
    });
  };

  useEffect(() => {
    if (activeTab !== 'map') return;

    const L = (window as any).L;
    if (!L) return;

    const timer = setTimeout(() => {
      const container = document.getElementById('wales-heatmap-real-map');
      if (!container || heatMapRef.current) return;

      const centerCoords: [number, number] = isYorkshire ? [53.85, -1.25] : [52.25, -3.8];
      const zoomLevel = isYorkshire ? 8.1 : 7.4;

      const mapInstance = L.map('wales-heatmap-real-map', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      }).setView(centerCoords, zoomLevel);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        minZoom: 6
      }).addTo(mapInstance);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

      heatMapRef.current = mapInstance;
      gapsMarkersGroupRef.current = L.layerGroup().addTo(mapInstance);

      plotAllMarkers(L);

      const fetchGeoJSON = isYorkshire
        ? fetch(import.meta.env.BASE_URL + 'yorkshire_local_authorities.json')
            .then(res => {
              if (!res.ok) throw new Error("Failed to load yorkshire json");
              return res.json();
            })
            .then((geoData) => {
              const featureNames = geoData.features.map((f: any) => f.properties?.LAD22NM || f.properties?.name);
              console.log("GeoJSON District Names:", featureNames);
              return geoData;
            })
            .catch((err) => {
              console.error("GeoJSON fetch error:", err);
              return { type: "FeatureCollection", features: [] }; // Return empty collection as fallback
            })
        : fetch(import.meta.env.BASE_URL + 'wales_local_authorities.json').then(res => res.json());

      fetchGeoJSON
        .then((geoData: any) => {
          if (!heatMapRef.current || !heatMapRef.current._container) return;

          const getFeatureStyle = (feature: any) => {
            const rawName = (feature.properties?.LAD24NM || feature.properties?.LAD22NM || feature.properties?.LAD13NM || feature.properties?.name || '').trim();
            const { name, data } = getLAData(rawName);
            const isSelected = selectedLAName === name;

            let fillColor = '#94a3b8';
            if (mapMetric === 'deprivation') {
              const pct = data?.deprivationPct || 35;
              if (isYorkshire) {
                if (pct >= 38) fillColor = '#be123c';
                else if (pct >= 35) fillColor = '#f97316';
                else if (pct >= 32) fillColor = '#eab308';
                else if (pct >= 29) fillColor = '#06b6d4';
                else fillColor = '#29B6BD';
              } else {
                if (pct >= 58) fillColor = '#be123c';
                else if (pct >= 54) fillColor = '#f97316';
                else if (pct >= 50) fillColor = '#eab308';
                else if (pct >= 45) fillColor = '#06b6d4';
                else fillColor = '#29B6BD';
              }
            } else if (mapMetric === 'gap') {
              const gap = data?.gapScore || 0;
              if (gap >= 25) fillColor = '#be123c';
              else if (gap >= 15) fillColor = '#f97316';
              else if (gap >= 5) fillColor = '#eab308';
              else fillColor = '#06b6d4';
            } else if (mapMetric === 'struggle') {
              const st = data?.struggleScore || 50;
              if (st >= 75) fillColor = '#be123c';
              else if (st >= 70) fillColor = '#f97316';
              else if (st >= 65) fillColor = '#eab308';
              else fillColor = '#10b981';
            } else {
              const hp = data?.helpScore || 50;
              if (hp >= 60) fillColor = '#047857';
              else if (hp >= 50) fillColor = '#0d9488';
              else if (hp >= 45) fillColor = '#d97706';
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
              const rawName = (feature.properties?.LAD24NM || feature.properties?.LAD22NM || feature.properties?.LAD13NM || feature.properties?.name || '').trim();
              const { name, data } = getLAData(rawName);

              const tooltipContent = `
                <div class="p-2.5 font-sans space-y-1">
                  <div class="font-bold text-[#1a2521] text-xs flex items-center justify-between gap-2">
                    <span>${name}</span>
                    <span class="text-[10px] text-teal-700 font-semibold italic">${data?.welshName || ''}</span>
                  </div>
                  <div class="text-[10px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                    <div>📊 <strong>Household Deprivation:</strong> ${data?.deprivationPct || 0}%</div>
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
          console.error('Failed to load GeoJSON:', err);
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
  }, [activeTab, mapMetric, isYorkshire]);

  useEffect(() => {
    if (!geoJsonLayerRef.current || activeTab !== 'map') return;
    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const rawName = layer.feature?.properties?.LAD24NM || layer.feature?.properties?.LAD22NM || layer.feature?.properties?.LAD13NM || layer.feature?.properties?.name;
      const { name } = getLAData(rawName || '');
      if (name === selectedLAName) {
        layer.setStyle({ weight: 3, color: '#0f172a', fillOpacity: 0.95 });
        layer.bringToFront();
      } else {
        geoJsonLayerRef.current.resetStyle(layer);
      }
    });
  }, [selectedLAName, activeTab, mapMetric]);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !heatMapRef.current || !gapsMarkersGroupRef.current) return;
    plotAllMarkers(L);
  }, [filteredGapsOffers, activeTab, mapMetric, organizations]);

  const activities = useMemo<any[]>(() => [
    {
      id: 'Home and Community',
      label: 'Stage 1: Home and Community',
      subLabel: 'Reaching Families Directly',
      impact: 85,
      probability: 78,
      description: 'Support, awareness, and opportunities rooted in family life, trusted community spaces, and early environment.',
      color: '#DE6B6B'
    },
    {
      id: 'School',
      label: 'Stage 2: School',
      subLabel: 'Primary & Secondary Education',
      impact: 70,
      probability: 58,
      description: 'Foundation learning, curriculum alignment, inspiring career awareness, and supported school transitions.',
      color: '#E5A973'
    },
    {
      id: 'Post-16 Education and Training',
      label: 'Stage 3: Post-16 Ed. & Training',
      subLabel: 'Colleges & Apprenticeships',
      impact: 35,
      probability: 88,
      description: 'Further education colleges, apprenticeships, vocational training, and higher education pathways.',
      color: '#E6C687'
    },
    {
      id: 'Entry to Work',
      label: 'Stage 4: Entry to Work',
      subLabel: 'First Jobs & Career Entry',
      impact: 62,
      probability: 40,
      description: 'Bridging education to early employment, inclusive recruitment, internships, and first-job navigation.',
      color: '#63B38F'
    },
    {
      id: 'In Work',
      label: 'Stage 5: In Work',
      subLabel: 'Retention & Career Growth',
      impact: 90,
      probability: 25,
      description: 'Workplace culture, ongoing skill development, fair retention, and structured internal career progression.',
      color: '#5FAAB3'
    },
    {
      id: 'Re-entry',
      label: 'Stage 6: Re-entry',
      subLabel: 'Upskilling & Returning to Work',
      impact: 48,
      probability: 65,
      description: 'Navigating career transitions, returning to work after time away, adult upskilling, and lifelong learning.',
      color: '#E6C687'
    }
  ], []);

  const selectedActivity = useMemo(() => {
    return activities.find(a => a.id === selectedActivityId) || activities[0];
  }, [activities, selectedActivityId]);

  return (
    <div id="gaps-hybrid-heatmaps-container" className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#e1e1db] p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#e1e1db]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#29B6BD]/10 rounded-xl text-[#176e73] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#1a2521]">Ecosystem Heat Map ({isYorkshire ? 'Yorkshire' : 'Wales'})</h3>
                {activeStage && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#29B6BD]/10 text-[#176e73] border border-[#29B6BD]/20 text-[10px] font-bold">
                    Stage: {activeStage}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#51615a] mt-0.5">
                Analyse spatial distribution and local authority profiles across {isYorkshire ? 'Yorkshire' : 'Wales'}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
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

        <div className="flex flex-wrap items-center justify-between gap-3">
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

          <div className="flex items-center gap-1.5 bg-[#F4F4F0] border border-[#e1e1db] rounded-xl p-1.5 text-[11px] font-bold text-[#1a2521]">
            <span className="text-[#51615a] text-[10px] uppercase tracking-wider">Choropleth Layer:</span>
            <span className="px-2.5 py-0.5 bg-[#29B6BD] text-white rounded-lg text-xs font-bold shadow-2xs">ONS Deprivation Index</span>
          </div>
        </div>
      </div>

      {(() => {
        const laData = isYorkshire ? YORKSHIRE_LOCAL_AUTHORITIES_DATA : WALES_LOCAL_AUTHORITIES_DATA;
        const allLAs = Object.values(laData);
        const selectedLA = laData[selectedLAName] || allLAs[0];

        return (
          <div id="wales-regional-heatmap-view" className="bg-white rounded-2xl border border-[#e1e1db] overflow-hidden shadow-xs">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-[#e1e1db] p-4 relative min-h-[440px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-[#29B6BD] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#29B6BD]" />
                      <span>ONS Census Choropleth</span>
                    </span>
                  </div>
                  <div 
                    id="wales-heatmap-real-map" 
                    className="w-full h-[360px] rounded-xl border border-gray-200 shadow-inner overflow-hidden z-10" 
                    style={{ minHeight: '360px' }}
                  />

                  {/* ONS Choropleth & Spot Legend */}
                  <div className="mt-4 pt-3 border-t border-[#e1e1db] space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-[#1a2521] uppercase tracking-wider text-[10px] block mb-1">
                          Map Spots Legend:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F4F0] border border-[#e1e1db] rounded-lg font-bold text-[#1a2521] text-[11px]">
                            <span className="w-4 h-4 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[10px] font-black">?</span>
                            <span>Requests</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F4F0] border border-[#e1e1db] rounded-lg font-bold text-[#1a2521] text-[11px]">
                            <span className="w-4 h-4 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-[10px] font-black">★</span>
                            <span>Activities</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F4F0] border border-[#e1e1db] rounded-lg font-bold text-[#1a2521] text-[11px]">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                            </span>
                            <span>Urgent Priority</span>
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className="font-bold text-[#1a2521] uppercase tracking-wider text-[10px] block mb-1">
                          Household Deprivation:
                        </span>
                        <div className="flex items-center gap-1 sm:justify-end">
                          <span className="w-3.5 h-3.5 rounded-xs bg-[#29B6BD]" title="Lowest Deprivation" />
                          <span className="w-3.5 h-3.5 rounded-xs bg-[#06b6d4]" />
                          <span className="w-3.5 h-3.5 rounded-xs bg-[#eab308]" />
                          <span className="w-3.5 h-3.5 rounded-xs bg-[#f97316]" />
                          <span className="w-3.5 h-3.5 rounded-xs bg-[#be123c]" title="Highest Deprivation" />
                          <span className="text-[10px] text-[#51615a] font-semibold ml-1">Low → High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 flex flex-col justify-between bg-[#F4F4F0]/30 rounded-2xl border p-6 border-l-4 border-l-[#29B6BD] border-[#e1e1db]">
                  <div className="space-y-5">
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
                        <select
                          value={selectedLAName}
                          onChange={(e) => setSelectedLAName(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-[#29B6BD] rounded-xl bg-white text-[#29B6BD] font-bold focus:outline-none shadow-2xs cursor-pointer"
                        >
                          {allLAs.map((la) => (
                            <option key={la.name} value={la.name}>
                              {la.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-3 border border-[#e1e1db] shadow-2xs">
                        <span className="text-[10px] font-bold text-[#51615a] block uppercase tracking-wider">Deprivation Rate</span>
                        <p className="text-2xl font-extrabold text-[#176e73] mt-0.5">{selectedLA.deprivationPct}%</p>
                        <span className="text-[10px] text-[#51615a]">ONS Census 2021 (1+ Dim)</span>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-[#e1e1db] shadow-2xs">
                        <span className="text-[10px] font-bold text-[#51615a] block uppercase tracking-wider">Systemic Gap Score</span>
                        <p className={`text-2xl font-extrabold mt-0.5 ${selectedLA.gapScore > 10 ? 'text-rose-700' : selectedLA.gapScore > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {selectedLA.gapScore > 0 ? `+${selectedLA.gapScore}` : selectedLA.gapScore}
                        </p>
                        <span className="text-[10px] text-[#51615a]">Struggle vs Help Index</span>
                      </div>
                    </div>

                    {/* Progress Bars for Struggle & Help */}
                    <div className="bg-white p-4 rounded-xl border border-[#e1e1db] space-y-3 shadow-2xs">
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-[#1a2521] mb-1">
                          <span className="flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            <span>Community Struggle Level:</span>
                          </span>
                          <span className="text-amber-700">{selectedLA.struggleScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${selectedLA.struggleScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-[#1a2521] mb-1">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#29B6BD]" />
                            <span>Support & Help Received:</span>
                          </span>
                          <span className="text-[#176e73]">{selectedLA.helpScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#29B6BD] h-full rounded-full transition-all duration-500" style={{ width: `${selectedLA.helpScore}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Key Barriers */}
                    {selectedLA.barriers && selectedLA.barriers.length > 0 && (
                      <div className="bg-white p-4 rounded-xl border border-[#e1e1db] space-y-2 shadow-2xs">
                        <span className="text-[11px] font-bold text-[#1a2521] flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-[#29B6BD]" />
                          <span>Key Identified Local Barriers:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedLA.barriers.map((barrier: string, idx: number) => (
                            <span 
                              key={idx} 
                              className="px-2.5 py-1 bg-[#F4F4F0] border border-[#e1e1db] rounded-lg text-[11px] font-semibold text-[#51615a] flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#29B6BD]" />
                              {barrier}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* External ONS Link */}
                    <div className="pt-2">
                      <a
                        href={`https://www.ons.gov.uk/census/maps/choropleth/population/household-deprivation/hh-deprivation/household-is-deprived-in-one-dimension`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-[#176e73] hover:bg-[#12585c] text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                      >
                        <span>Explore ONS Census Data ({selectedLA.name})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
