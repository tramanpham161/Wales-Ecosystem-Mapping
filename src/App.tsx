/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, ChangeEvent, FormEvent } from 'react';
import {
  MapPin,
  Filter,
  Plus,
  Search,
  Mail,
  ExternalLink,
  X,
  Layers,
  Sparkles,
  Users,
  TrendingUp,
  CheckCircle2,
  Share2,
  Info,
  Globe,
  PlusCircle,
  HelpCircle,
  User,
  Briefcase
} from 'lucide-react';
import { SYSTEMIC_TABS, WELSH_ORGANIZATIONS } from './data';
import { FrictionPoint, Organization, SectorType, LookingForType } from './types';
import { Logo } from './components/Logo';
import LearnerJourneyFlow from './components/LearnerJourneyFlow';

export default function App() {
  const [organizations, setOrganizations] = useState<Organization[]>(WELSH_ORGANIZATIONS);
  const [activeTab, setActiveTab] = useState<FrictionPoint>('Visibility');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [lookingForFilter, setLookingForFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [detailedOrg, setDetailedOrg] = useState<Organization | null>(null);

  // Form State for Adding new Initiative
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    locationRegion: 'Cardiff',
    customLocationName: '',
    sector: 'Tech/Digital' as SectorType,
    lookingFor: 'Referrals' as LookingForType,
    capacityStatus: 'Accepting Referrals',
    currentProject: '',
    solutionsText: '',
    description: '',
    contactEmail: '',
    website: '',
    workingWithOaha: false
  });

  // State for Contact Initiative popup modal
  const [contactOrg, setContactOrg] = useState<Organization | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    messageType: 'Collaboration',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  // Mobile navigation state: "map" vs "list" view toggle
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  // Leaflet references
  const mapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const markerObjectsRef = useRef<{ [id: string]: any }>({});

  // 1. Filter the organizations dynamically
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      // 1. Match currently active tab (Friction Point)
      if (org.assignedTab !== activeTab) return false;

      // 2. Match Sector Filter
      if (sectorFilter !== 'All' && org.sector !== sectorFilter) return false;

      // 3. Match Looking For Filter
      if (lookingForFilter !== 'All' && org.lookingFor !== lookingForFilter) return false;

      // 4. Match Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = org.name.toLowerCase().includes(query);
        const matchesLocation = org.location.toLowerCase().includes(query);
        const matchesProject = org.currentProject.toLowerCase().includes(query);
        const matchesDesc = org.description.toLowerCase().includes(query);
        const matchesSolutions = org.solutions.some(s => s.toLowerCase().includes(query));
        return matchesName || matchesLocation || matchesProject || matchesDesc || matchesSolutions;
      }

      return true;
    });
  }, [organizations, activeTab, sectorFilter, lookingForFilter, searchQuery]);

  // 2. Tab Metadata helper for specific active styles
  const activeTabInfo = useMemo(() => {
    return SYSTEMIC_TABS.find((t) => t.id === activeTab) || SYSTEMIC_TABS[0];
  }, [activeTab]);

  // Tab Colors mapping
  const tabColorHex: { [key in FrictionPoint]: string } = {
    'Visibility': '#2E536B',       // Navy / Steel Blue
    'Family Awareness': '#3AB03A',  // Organic Green
    'Transitions': '#FF9900',      // Vibrant Orange
    'Navigation': '#2BB7BA',       // Teal / Robin's Egg
    'Translation': '#986430',      // Bronze
    'Progression': '#9E2A2B'       // Crimson / Warm Red
  };

  const activeColorHex = tabColorHex[activeTab] || '#2E536B';

  // Stats Counters
  const stats = useMemo(() => {
    const totalCount = organizations.length;
    const tabCounts = SYSTEMIC_TABS.reduce((acc, tab) => {
      acc[tab.id] = organizations.filter(o => o.assignedTab === tab.id).length;
      return acc;
    }, {} as { [key in FrictionPoint]: number });

    const sectorCounts = organizations.reduce((acc, org) => {
      acc[org.sector] = (acc[org.sector] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const totalReferrals = organizations.filter(o => o.lookingFor === 'Referrals').length;
    const totalPartners = organizations.filter(o => o.lookingFor === 'Employer Partners').length;

    return { totalCount, tabCounts, sectorCounts, totalReferrals, totalPartners };
  }, [organizations]);

  // 3. Initialize Leaflet Map on Mount
  useEffect(() => {
    const L = (window as any).L;
    if (!L || mapRef.current) return;

    // Center map over Wales
    const mapInstance = L.map('wales-leaflet-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([52.25, -3.8], 7.5);

    // Light-mode minimalist tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      minZoom: 6
    }).addTo(mapInstance);

    // Zoom controls at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // Layer group for our pins
    const markersGroup = L.layerGroup().addTo(mapInstance);

    mapRef.current = mapInstance;
    markersGroupRef.current = markersGroup;

    // Reset view bounds originally
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 400);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 3b. Setup global click callback for Leaflet popup names to open modal details and contact popup
  useEffect(() => {
    (window as any).openDetailedOrgPopup = (id: string) => {
      const found = organizations.find(o => o.id === id);
      if (found) {
        setDetailedOrg(found);
      }
    };
    (window as any).openContactPopup = (id: string) => {
      const found = organizations.find(o => o.id === id);
      if (found) {
        handleOpenContact(found);
      }
    };
    return () => {
      delete (window as any).openDetailedOrgPopup;
      delete (window as any).openContactPopup;
    };
  }, [organizations]);

  // 4. Synchronize pins whenever filteredOrganizations or activeTab / selectedOrgId changes
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current || !markersGroupRef.current) return;

    // Clear previous layer pins
    markersGroupRef.current.clearLayers();
    markerObjectsRef.current = {};

    filteredOrganizations.forEach((org) => {
      const isSelected = org.id === selectedOrgId;
      
      // Determine sector theme colors matching "Sand & Slate" guidelines
      let markerColor = '#51615a'; // default Charcoal Light
      let iconSymbol = '•';
      if (org.sector === 'Tech/Digital') {
        markerColor = '#2E536B'; // Navy
        iconSymbol = '⚙';
      } else if (org.sector === 'Green Economy') {
        markerColor = '#3AB03A'; // Organic Green
        iconSymbol = '♣';
      } else if (org.sector === 'Creative') {
        markerColor = '#FF9900'; // Vibrant Orange
        iconSymbol = '✦';
      } else if (org.sector === 'Foundational') {
        markerColor = '#986430'; // Bronze
        iconSymbol = '▰';
      }

      const size = isSelected ? 34 : 26;
      const shadowSize = size + 12;
      const borderStyle = isSelected 
        ? `border-[#1a2521] scale-125 shadow-[0_0_15px_rgba(26,37,33,0.2)] border-[3px]` 
        : `border-[#e1e1db] border-2 hover:scale-110`;

      // Custom divIcon marker with precise CSS (flashing effect removed)
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center transition-all duration-300" style="width: ${size}px; height: ${size}px;">
            <!-- Outer static ring for selected state -->
            ${isSelected ? `
              <div class="absolute rounded-full opacity-20" style="background-color: ${activeColorHex}; width: ${shadowSize}px; height: ${shadowSize}px;"></div>
              <div class="absolute rounded-full opacity-10" style="background-color: ${activeColorHex}; width: ${shadowSize + 8}px; height: ${shadowSize + 8}px;"></div>
            ` : ''}
            <!-- Inner static Ring (no flashing) -->
            <div class="absolute rounded-full opacity-10" style="background-color: ${markerColor}; width: ${size * 1.5}px; height: ${size * 1.5}px;"></div>
            <!-- Physical Dot -->
            <div class="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${borderStyle}" style="background-color: ${markerColor}; font-size: ${isSelected ? '14px' : '10px'};">
              ${iconSymbol}
            </div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
      });

      const marker = L.marker([org.latitude, org.longitude], { icon: customIcon })
        .addTo(markersGroupRef.current);

      markerObjectsRef.current[org.id] = marker;

      // Popup Content Layout styled to exactly match Sand & Slate rules and hover-optimized
      const popupHtml = `
        <div class="p-1.5 min-w-[220px] font-sans">
          <div class="flex items-center gap-1.5 text-[10px] text-[#51615a] mb-1">
            <span class="inline-block w-1.5 h-1.5 rounded-full" style="background-color: ${markerColor};"></span>
            ${org.location}
          </div>
          <h4 class="font-sans font-bold text-sm text-[#2E536B] leading-tight mb-1">
            ${org.name}
          </h4>
          <p class="text-[11px] text-[#51615a] leading-normal line-clamp-2 mb-2">${org.description}</p>
          
          ${org.website ? `
            <div class="text-[10px] text-[#51615a] mb-1.5 flex items-center gap-1.5">
              <span class="font-semibold text-[#1a2521]">Website:</span>
              <span class="text-[#2E536B] font-semibold hover:underline break-all">
                ${org.website.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            </div>
          ` : ''}

          <div class="flex items-center gap-1 text-[10px] text-[#51615a] mb-2">
            <span>Working with OAHA:</span>
            <span class="${org.workingWithOaha ? 'text-[#3AB03A] font-bold' : 'text-[#51615a]'}">
              ${org.workingWithOaha ? 'Yes' : 'No'}
            </span>
          </div>

          <div class="flex flex-wrap gap-1 mb-2">
            <span class="inline-block text-[9px] font-semibold px-2 py-0.5 rounded bg-[#fbfbf9] text-[#1a2521] border border-[#e1e1db]">
              ${org.sector}
            </span>
            <span class="inline-block text-[9px] px-2 py-0.5 rounded bg-[#fbfbf9] text-[#986430] border border-[#e1e1db]">
              ${org.capacityStatus}
            </span>
          </div>
          <div class="flex items-center justify-between pt-1.5 border-t border-[#e1e1db] mt-1 text-[9px]">
            <span class="font-semibold text-[#2E536B]">Stage: ${org.assignedTab}</span>
            <span class="text-[#51615a] italic font-medium">Click dot to select list</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        autoPan: false,
        offset: [0, -size / 2]
      });

      // Show popup on hover (mouseover)
      marker.on('mouseover', function () {
        marker.openPopup();
      });

      // Hide popup when hover ends (mouseout)
      marker.on('mouseout', function () {
        marker.closePopup();
      });

      // Synchronize back on click
      marker.on('click', () => {
        marker.closePopup();
        setSelectedOrgId(org.id);
        
        // On mobile, auto-switch to list view to show the highlighted card
        if (window.innerWidth < 768) {
          setMobileView('list');
        }

        // Scroll to card smoothly
        setTimeout(() => {
          const cardElement = document.getElementById(`card-${org.id}`);
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 150);
      });
    });

    // Fit map bounds to show plotted pins neatly
    if (filteredOrganizations.length > 0) {
      const group = L.featureGroup(Object.values(markerObjectsRef.current));
      mapRef.current.fitBounds(group.getBounds().pad(0.2), {
        maxZoom: 12,
        animate: true,
        duration: 0.8
      });
    } else {
      // Zoom out slightly back to Wales center
      mapRef.current.setView([52.25, -3.8], 7.5, {
        animate: true,
        duration: 0.8
      });
    }
  }, [filteredOrganizations, activeTab, selectedOrgId]);

  // 5. Card click: Pan map to marker, open Leaflet popup
  const handleCardSelection = (org: Organization) => {
    setSelectedOrgId(org.id);
    const marker = markerObjectsRef.current[org.id];
    if (marker && mapRef.current) {
      mapRef.current.setView([org.latitude, org.longitude], 11, {
        animate: true,
        duration: 1.0
      });
      setTimeout(() => {
        marker.openPopup();
      }, 350);
    }
    // Switch view to map on mobile so they see the pan instantly
    if (window.innerWidth < 768) {
      setMobileView('map');
    }
  };

  // 6. Handle submission of the new initiative
  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInitiativeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { name, locationRegion, customLocationName, currentProject, solutionsText, description, contactEmail, website } = formData;

    if (!name.trim()) {
      setFormError('Please enter the organisation or initiative name.');
      return;
    }
    if (!currentProject.trim()) {
      setFormError('Please specify the current Welsh project initiative.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please write a brief description of the organisation.');
      return;
    }

    // Geolocation mapping based on Welsh regions (approximate and slightly jittered)
    const regionalCoords: { [key: string]: [number, number] } = {
      'Cardiff': [51.4816, -3.1791],
      'Swansea': [51.6214, -3.9436],
      'Newport': [51.5880, -2.9978],
      'Wrexham': [53.0430, -3.0018],
      'Bangor': [53.2274, -4.1293],
      'Valleys': [51.6800, -3.4200]
    };

    const baseCoord = regionalCoords[locationRegion] || [52.25, -3.8];
    // Add small random jitter so pins do not overlap exactly
    const jitterLat = baseCoord[0] + (Math.random() - 0.5) * 0.015;
    const jitterLng = baseCoord[1] + (Math.random() - 0.5) * 0.015;

    const finalLocation = customLocationName.trim() 
      ? `${locationRegion} (${customLocationName.trim()})` 
      : locationRegion;

    const solutionsArray = solutionsText.trim()
      ? solutionsText.split('\n').filter(line => line.trim() !== '')
      : ['Actively mapping pathways', 'Fostering peer mentorship', 'Cooperating with local businesses'];

    const newOrg: Organization = {
      id: `custom-org-${Date.now()}`,
      name: name.trim(),
      location: finalLocation,
      address: `${finalLocation}, Wales`,
      keyContact: 'Lead Coordinator',
      currentProjectsCount: 1,
      impact: 'Initiated regional connectivity pathways to support young learners.',
      lookingForDetail: `Actively seeking ecosystem support on: ${formData.lookingFor}.`,
      latitude: jitterLat,
      longitude: jitterLng,
      assignedTab: activeTab,
      sector: formData.sector,
      lookingFor: formData.lookingFor,
      capacityStatus: formData.capacityStatus,
      currentProject: currentProject.trim(),
      solutions: solutionsArray,
      description: description.trim(),
      contactEmail: contactEmail.trim() || undefined,
      website: website.trim() || undefined,
      workingWithOaha: formData.workingWithOaha
    };

    // Update organizations array state
    setOrganizations(prev => [newOrg, ...prev]);
    setFormSuccess(`Successfully mapped "${newOrg.name}" to Wales stage "${activeTab}"!`);
    
    // Clear form except default selections
    setFormData({
      name: '',
      locationRegion: 'Cardiff',
      customLocationName: '',
      sector: 'Tech/Digital',
      lookingFor: 'Referrals',
      capacityStatus: 'Accepting Referrals',
      currentProject: '',
      solutionsText: '',
      description: '',
      contactEmail: '',
      website: '',
      workingWithOaha: false
    });

    // Close modal after a brief period
    setTimeout(() => {
      setIsAddOpen(false);
      setFormSuccess('');
      // Automatically select and focus the newly created initiative on the map
      handleCardSelection(newOrg);
    }, 1500);
  };

  // Contact modal actions
  const handleOpenContact = (org: Organization, defaultMessage?: string) => {
    setContactOrg(org);
    setContactForm({
      name: '',
      email: '',
      messageType: org.id === 'org-oaha' ? 'Employer Partnership' : 'Collaboration',
      message: defaultMessage || ''
    });
    setContactSuccess('');
    setContactError('');
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    if (!name.trim()) {
      setContactError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setContactError('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setContactError('Please write your message.');
      return;
    }

    setContactError('');
    setContactSuccess('Message sent successfully! They will get back to you shortly.');

    // Automatically close the contact dialog after a short delay
    setTimeout(() => {
      setContactOrg(null);
      setContactSuccess('');
    }, 1600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbf9] font-sans antialiased text-[#1a2521]">
      
      {/* 1. Header and Mission Statement */}
      <header className="flex-none border-b border-[#e1e1db] bg-white px-6 py-5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-4">
            {/* Custom Logo based on user's attachment */}
            <Logo className="w-14 h-14" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a2521] tracking-tight">
              Wales Employment Ecosystem Mapping
            </h1>
          </div>
          <p className="text-sm text-[#51615a] leading-relaxed max-w-4xl mt-1">
            A place-based collaboration helping Wales connect investment, skills, employers, community insight, and youth voice into clearer routes for young people.
          </p>
        </div>
      </header>

      {/* 2. Top-Level Ecosystem Statistics Ribbon */}
      <section className="flex-none bg-[#fbfbf9] border-b border-[#e1e1db] px-6 py-2.5 relative z-10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-3 text-[#51615a]">
          <div className="flex items-center gap-6 divide-x divide-[#e1e1db]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#51615a]" />
              <span>Initiatives tracked: <strong className="text-[#1a2521] font-semibold">{stats.totalCount}</strong></span>
            </div>
            <div className="flex items-center gap-2 pl-6">
              <Layers className="w-4 h-4 text-[#51615a]" />
              <span>Active in stage: <strong className="text-[#1a2521] font-semibold">{stats.tabCounts[activeTab] || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2 pl-6">
              <TrendingUp className="w-4 h-4 text-[#51615a]" />
              <span>Seeking partners: <strong className="text-[#2E536B] font-semibold">{stats.totalPartners}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Learner Journey Flow (Stick Figures and Moving transition) */}
      <section className="flex-none bg-[#fbfbf9] px-6 pt-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <LearnerJourneyFlow
            activeTab={activeTab}
            onTabSelect={(tabId) => {
              setActiveTab(tabId);
              setSelectedOrgId(null);
            }}
            tabColorHex={tabColorHex}
          />
        </div>
      </section>



      {/* Interactive Banner detailing the selected Friction Stage */}
      <section 
        className="flex-none px-6 py-4 border-b transition-colors duration-300"
        style={{ 
          backgroundColor: `${activeColorHex}08`, 
          borderColor: '#e1e1db'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: activeColorHex }} />
            <div>
              <h2 className="text-sm font-bold text-[#1a2521] flex items-center gap-2">
                Stage Focus: <span style={{ color: activeColorHex }}>{activeTabInfo.id}</span>
              </h2>
              <p className="text-xs text-[#51615a] leading-relaxed mt-1 max-w-4xl">
                {activeTabInfo.description}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAddOpen(true)}
            id="btn-add-initiative"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-medium text-white shadow-sm transition-all duration-200 cursor-pointer self-start md:self-center"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Initiative to {activeTab}</span>
          </button>
        </div>
      </section>

      {/* 4. Split-Screen Main Content Layout (Natural page scroll with height-bound panels) */}
      <main className="max-w-7xl w-full mx-auto p-4 flex flex-col md:flex-row gap-4">
        
        {/* Mobile View Toggle Controller */}
        <div className="flex md:hidden bg-white p-1.5 rounded-xl border border-[#e1e1db] gap-1.5 mb-2 flex-none w-full">
          <button
            onClick={() => setMobileView('map')}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold tracking-wide transition-all ${
              mobileView === 'map' ? 'bg-[#2E536B] text-white' : 'text-[#51615a]'
            }`}
          >
            🗺 Interactive map ({filteredOrganizations.length})
          </button>
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold tracking-wide transition-all ${
              mobileView === 'list' ? 'bg-[#2E536B] text-white' : 'text-[#51615a]'
            }`}
          >
            📂 Directory list ({filteredOrganizations.length})
          </button>
        </div>

        {/* LEFT COLUMN: Map Placeholder & Frame (60% width) */}
        <div 
          className={`w-full md:flex-[0.6] flex flex-col gap-4 ${
            mobileView === 'map' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <section 
            id="wales-map-container"
            className="w-full flex flex-col h-[400px] md:h-[530px] rounded-2xl overflow-hidden border border-[#e1e1db] shadow-sm relative bg-[#fbfbf9]"
          >
            {/* Map Overlay Badge */}
            <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e1e1db] shadow-sm text-[11px] flex items-center gap-2 text-[#1a2521]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColorHex }}></span>
              <span>Plotting <strong>{filteredOrganizations.length}</strong> pins in Wales</span>
            </div>

            <div className="absolute top-3 right-3 z-[1000] hidden sm:flex items-center gap-2">
              <span className="text-[10px] text-[#51615a] bg-white/90 border border-[#e1e1db] px-2.5 py-1 rounded-lg shadow-xs">
                Sector legend: ⚙ Tech | ♣ Green | ✦ Creative | ▰ Foundational
              </span>
            </div>

            {/* Leaflet Physical Node Map */}
            <div 
              id="wales-leaflet-map" 
              className="w-full h-full min-h-[350px] md:h-full"
              style={{ touchAction: 'none' }}
            />

            {/* Map fallback banner */}
            {filteredOrganizations.length === 0 && (
              <div className="absolute inset-0 z-[999] bg-white/90 backdrop-blur-xs flex items-center justify-center p-6 text-center pointer-events-none">
                <div className="max-w-sm">
                  <HelpCircle className="w-10 h-10 text-[#51615a] mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1a2521]">No stage pins plotted</h3>
                  <p className="text-xs text-[#51615a] mt-1">Adjust Sector/Capacity filters or register a new initiative to plot markers on this section of Wales.</p>
                </div>
              </div>
            )}
          </section>

          {/* Engaging CTA banner for companies to join the ecosystem */}
          <div className="bg-gradient-to-br from-[#2E536B]/5 to-[#2E536B]/10 border border-[#2E536B]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs transition duration-300 hover:border-[#2E536B]/45">
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9900] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9900]"></span>
                </span>
                <span className="text-[10px] font-bold text-[#2E536B] tracking-wider uppercase">Join Wales' Leading Ecosystem</span>
              </div>
              <h3 className="text-sm font-bold text-[#1a2521] tracking-tight">
                Want to connect, align, or scale your impact with OAHA?
              </h3>
              <p className="text-[11px] text-[#51615a] leading-normal max-w-lg">
                Whether you are an employer seeking diverse local apprentices, a community group coordinating referrals, or an advisory hub—partner with us to unify pathways in Wales.
              </p>
            </div>
            <button
              onClick={() => {
                const oahaOrg: Organization = {
                  id: 'org-oaha',
                  name: 'OAHA Ecosystem Initiative',
                  location: 'Wales',
                  address: 'Wales HQ, Cardiff',
                  keyContact: 'OAHA Partnerships Lead',
                  currentProjectsCount: 1,
                  impact: 'Integrating educational systems and local business pipelines across Wales.',
                  lookingForDetail: 'New employer partners and mapped community initiatives',
                  latitude: 52.25,
                  longitude: -3.8,
                  assignedTab: 'Visibility',
                  sector: 'Foundational',
                  lookingFor: 'Employer Partners',
                  capacityStatus: 'Accepting Partners',
                  currentProject: 'Wales Systemic Integration & Friction Mapping',
                  solutions: [],
                  description: 'Our team coordinates systemic partnerships and maps regional employment networks across Welsh communities.'
                };
                handleOpenContact(oahaOrg, "Hi OAHA Ecosystem Team,\n\nWe would love to discuss joining the Wales Employment Ecosystem! Please share details on how our company/initiative can collaborate, register our work, and participate in systemic alignment projects.");
              }}
              className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-white" />
              <span>Connect & Join Ecosystem</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Filter bar and scrollable Directory container (40% width) */}
        <section 
          id="wales-directory-container"
          className={`w-full md:flex-[0.4] h-[550px] md:h-[700px] flex flex-col min-h-0 bg-white border border-[#e1e1db] rounded-2xl overflow-hidden shadow-sm ${
            mobileView === 'list' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* A. Sticky Filter and Search Bar */}
          <div className="flex-none bg-[#fbfbf9] p-4 border-b border-[#e1e1db] space-y-3">
            
            {/* Search Input field */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#51615a]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search initiative, city, solution..."
                className="w-full bg-white border border-[#e1e1db] rounded-xl pl-9 pr-8 py-2 text-xs text-[#1a2521] placeholder-[#51615a] focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#51615a] hover:text-[#1a2521]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Select Dropdowns */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] text-[#51615a] mb-1.5 flex items-center gap-1 font-medium">
                  <Filter className="w-3 h-3 text-[#51615a]" /> Sector
                </label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full bg-white border border-[#e1e1db] rounded-lg px-2.5 py-1.5 text-xs text-[#1a2521] focus:outline-none focus:border-[#1a2521] cursor-pointer"
                >
                  <option value="All">All Sectors</option>
                  <option value="Tech/Digital">Tech / Digital</option>
                  <option value="Green Economy">Green Economy</option>
                  <option value="Creative">Creative</option>
                  <option value="Foundational">Foundational</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-[#51615a] mb-1.5 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#51615a]" /> Looking for
                </label>
                <select
                  value={lookingForFilter}
                  onChange={(e) => setLookingForFilter(e.target.value)}
                  className="w-full bg-white border border-[#e1e1db] rounded-lg px-2.5 py-1.5 text-xs text-[#1a2521] focus:outline-none focus:border-[#1a2521] cursor-pointer"
                >
                  <option value="All">All Needs</option>
                  <option value="Referrals">Referrals</option>
                  <option value="Funding">Funding</option>
                  <option value="Employer Partners">Employer Partners</option>
                </select>
              </div>
            </div>

            {/* Showing status summary */}
            <div className="flex items-center justify-between text-[10px] text-[#51615a] pt-1">
              <span>Directory results: <strong className="text-[#1a2521] font-semibold">{filteredOrganizations.length} matched</strong></span>
              {(sectorFilter !== 'All' || lookingForFilter !== 'All' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSectorFilter('All');
                    setLookingForFilter('All');
                    setSearchQuery('');
                  }}
                  className="text-[#9E2A2B] hover:text-[#9E2A2B]/80 underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* B. Scrollable vertical cards list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            
            {/* Fallback state */}
            {filteredOrganizations.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-[#e1e1db] rounded-2xl bg-[#fbfbf9]">
                <Info className="w-8 h-8 text-[#51615a] mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-[#1a2521]">No stage partners matching</h4>
                <p className="text-xs text-[#51615a] max-w-xs mx-auto mt-1">
                  No organisations found matching these filters in this stage. Try clearing active filters or selecting a different systemic friction point.
                </p>
                <button
                  onClick={() => {
                    setSectorFilter('All');
                    setLookingForFilter('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-3 py-1.5 text-xs bg-[#2E536B] text-white rounded-lg border border-[#2E536B] hover:bg-[#2E536B]/90 cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredOrganizations.map((org) => {
                const isSelected = org.id === selectedOrgId;
                
                // Color badges depending on sector matching "Sand & Slate"
                let sectorBadgeClass = 'bg-[#51615a]/10 text-[#51615a] border-[#e1e1db]';
                if (org.sector === 'Tech/Digital') sectorBadgeClass = 'bg-[#2E536B]/10 text-[#2E536B] border-[#2E536B]/20';
                else if (org.sector === 'Green Economy') sectorBadgeClass = 'bg-[#3AB03A]/10 text-[#3AB03A] border-[#3AB03A]/20';
                else if (org.sector === 'Creative') sectorBadgeClass = 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20';
                else if (org.sector === 'Foundational') sectorBadgeClass = 'bg-[#986430]/10 text-[#986430] border-[#986430]/20';

                return (
                  <article
                    key={org.id}
                    id={`card-${org.id}`}
                    onClick={() => handleCardSelection(org)}
                    className={`p-5 rounded-xl border transition-all duration-200 text-left cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#fbfbf9] shadow-[0_4px_12px_rgba(26,37,33,0.06)]'
                        : 'bg-white border-[#e1e1db] hover:border-[#51615a]/40 hover:bg-[#fbfbf9]/40'
                    }`}
                    style={{
                      borderLeft: isSelected ? `4px solid ${activeColorHex}` : undefined,
                      borderColor: isSelected ? activeColorHex : undefined
                    }}
                  >
                    {/* Title with "click for popup" hint */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-base text-[#1a2521] tracking-tight group-hover:text-[#2E536B] transition-colors">
                        {org.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailedOrg(org);
                        }}
                        className="text-[10px] text-[#2E536B] font-semibold hover:underline bg-[#2E536B]/5 px-2 py-0.5 rounded"
                        title="View extensive details"
                      >
                        More details →
                      </button>
                    </div>

                    {/* Multi-row detailed grid */}
                    <div className="space-y-2.5 text-xs text-[#51615a]">
                      {/* Address & Region */}
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#51615a]/80 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-[#1a2521]">Address:</span> {org.address}
                        </div>
                      </div>

                      {/* Key Contact person */}
                      <div className="flex items-start gap-1.5">
                        <User className="w-3.5 h-3.5 mt-0.5 text-[#51615a]/80 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-[#1a2521]">Key contact:</span> {org.keyContact}
                        </div>
                      </div>

                      {/* Website link */}
                      {org.website && (
                        <div className="flex items-start gap-1.5">
                          <Globe className="w-3.5 h-3.5 mt-0.5 text-[#2E536B]/80 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-[#1a2521]">Website:</span>{' '}
                            <a
                              href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#2E536B] hover:underline font-semibold inline-flex items-center gap-1 transition"
                            >
                              {org.website.replace(/^https?:\/\/(www\.)?/, '')}
                              <ExternalLink className="w-3 h-3 text-[#2E536B]" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* What they are working on */}
                      <div className="bg-[#fbfbf9] rounded-lg p-3 border border-[#e1e1db] text-xs">
                        <span className="block text-[10px] text-[#51615a] mb-1 font-semibold flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-[#2E536B]" /> What they are working on:
                        </span>
                        <p className="text-[#1a2521] leading-relaxed italic">
                          "{org.currentProject}"
                        </p>
                      </div>

                      {/* Project count and capacity status */}
                      <div className="grid grid-cols-2 gap-2 border-t border-b border-[#e1e1db]/60 py-2">
                        <div>
                          <span className="block text-[10px] text-[#818e87] mb-0.5">Active projects</span>
                          <span className="font-bold text-[#1a2521] text-xs">{org.currentProjectsCount} Active</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#818e87] mb-0.5">Capacity status</span>
                          <span className="font-semibold text-[#986430] text-xs">{org.capacityStatus}</span>
                        </div>
                      </div>

                      {/* Impact so far */}
                      <div className="flex items-start gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 mt-0.5 text-[#3AB03A] flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-[#1a2521]">Impact so far:</span> {org.impact}
                        </div>
                      </div>

                      {/* What they are looking for */}
                      <div className="p-2.5 bg-[#e1e1db]/20 border border-[#e1e1db]/60 rounded text-xs text-[#1a2521]">
                        <span className="font-semibold text-[#2E536B] block mb-0.5 text-[10px]">
                          Looking for ({org.lookingFor}):
                        </span>
                        {org.lookingForDetail}
                      </div>

                      {/* Working with OAHA status indicator */}
                      <div className="flex items-center gap-1.5 text-xs py-1">
                        <span className="font-semibold text-[#1a2521]">Working with OAHA:</span>
                        {org.workingWithOaha ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#3AB03A]/10 text-[#3AB03A] border border-[#3AB03A]/20">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#51615a]/10 text-[#51615a] border border-[#e1e1db]">
                            No
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Badges & Contact Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#e1e1db] gap-2 mt-4">
                      <div>
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${sectorBadgeClass}`}>
                          {org.sector}
                        </span>
                      </div>

                      {/* Connection panel */}
                      <div className="flex items-center gap-2">
                        {org.contactEmail && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenContact(org);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#2E536B] hover:bg-[#2E536B]/90 text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
                            title="Contact initiative"
                          >
                            <Mail className="w-3.5 h-3.5 text-white" />
                            <span>Contact initiative</span>
                          </button>
                        )}
                        {org.website && (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-white border border-[#e1e1db] text-[#51615a] hover:text-[#1a2521] hover:bg-[#fbfbf9] transition"
                            title="Visit website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* 5. ADD INITIATIVE DRAWER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-[#1a2521]/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white border border-[#e1e1db] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#e1e1db] bg-[#fbfbf9]">
              <div>
                <h3 className="text-base font-bold text-[#1a2521] flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#2E536B]" />
                  Add Wales Youth Initiative
                </h3>
                <p className="text-xs text-[#51615a] mt-0.5">
                  Your submission will be mapped and linked to stage <strong>{activeTab}</strong>.
                </p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-[#51615a] hover:text-[#1a2521] p-1.5 rounded-lg bg-white border border-[#e1e1db] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleAddInitiativeSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-white">
              
              {formError && (
                <div className="p-3 bg-[#9E2A2B]/10 border border-[#9E2A2B]/20 text-[#9E2A2B] text-xs rounded-xl flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-[#3AB03A]/10 border border-[#3AB03A]/20 text-[#3AB03A] text-xs rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Grid 1: Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                  Organisation / Initiative Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. South Wales Tech Hub"
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
                />
              </div>

              {/* Grid 2: Regional Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                    Welsh Region / City *
                  </label>
                  <select
                    name="locationRegion"
                    value={formData.locationRegion}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] focus:outline-none focus:border-[#1a2521] transition cursor-pointer"
                  >
                    <option value="Cardiff">Cardiff</option>
                    <option value="Swansea">Swansea</option>
                    <option value="Newport">Newport</option>
                    <option value="Wrexham">Wrexham</option>
                    <option value="Bangor">Bangor</option>
                    <option value="Valleys">Valleys</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                    Specific Town / Sub-location
                  </label>
                  <input
                    type="text"
                    name="customLocationName"
                    value={formData.customLocationName}
                    onChange={handleFormChange}
                    placeholder="e.g. Rhondda, Caerphilly, Anglesey"
                    className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
                  />
                </div>
              </div>

              {/* Grid 3: Sector & Looking For */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                    Primary Sector
                  </label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] focus:outline-none focus:border-[#1a2521] transition cursor-pointer"
                  >
                    <option value="Tech/Digital">Tech / Digital</option>
                    <option value="Green Economy">Green Economy</option>
                    <option value="Creative">Creative</option>
                    <option value="Foundational">Foundational</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                    Primary Looking For Needs
                  </label>
                  <select
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] focus:outline-none focus:border-[#1a2521] transition cursor-pointer"
                  >
                    <option value="Referrals">Referrals</option>
                    <option value="Funding">Funding</option>
                    <option value="Employer Partners">Employer Partners</option>
                  </select>
                </div>
              </div>

              {/* Grid 4: Capacity Status */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                  Capacity Status *
                </label>
                <input
                  type="text"
                  name="capacityStatus"
                  value={formData.capacityStatus}
                  onChange={handleFormChange}
                  placeholder="e.g. Accepting Referrals, Recruiting Mentors"
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
                />
              </div>

              {/* Grid 5: Current Project (Welsh Initiative) */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                  Current Welsh Initiative Description *
                </label>
                <textarea
                  name="currentProject"
                  value={formData.currentProject}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="e.g. Launching retrofitting workshops for Rhondda apprentices in low-carbon solar grids."
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition resize-none"
                />
              </div>

              {/* Grid 6: Solutions List */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2521] mb-1.5 flex items-center justify-between">
                  <span>Specific Solutions (One per line)</span>
                  <span className="text-[10px] text-[#51615a]">Provide up to 3 solutions</span>
                </label>
                <textarea
                  name="solutionsText"
                  value={formData.solutionsText}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="e.g.&#10;Distributing local training transport vouchers&#10;Matching students with wind farm engineers&#10;Translating micro-credentials into Welsh"
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition resize-none"
                />
              </div>

              {/* Grid 7: Brief description */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                  General Overview Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Brief summary of your mission and long term goal for young people in Wales."
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition resize-none"
                />
              </div>

              {/* Grid 7.5: Working with OAHA Toggle */}
              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="workingWithOaha"
                  name="workingWithOaha"
                  checked={formData.workingWithOaha}
                  onChange={(e) => setFormData(prev => ({ ...prev, workingWithOaha: e.target.checked }))}
                  className="w-4 h-4 text-[#2E536B] bg-white border-[#e1e1db] rounded focus:ring-[#2E536B] focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="workingWithOaha" className="text-xs font-semibold text-[#1a2521] select-none cursor-pointer">
                  This organisation works with OAHA
                </label>
              </div>

              {/* Grid 8: Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                    Contact Email (Bilingual Optional)
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleFormChange}
                    placeholder="post@initiative.wales"
                    className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleFormChange}
                    placeholder="https://initiative.wales"
                    className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
                  />
                </div>
              </div>

            </form>

            {/* Modal Footer */}
            <div className="flex-none p-4 border-t border-[#e1e1db] bg-[#fbfbf9] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-lg bg-white hover:bg-[#fbfbf9] text-xs font-semibold text-[#51615a] border border-[#e1e1db] cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                onClick={handleAddInitiativeSubmit}
                className="px-4 py-2 rounded-lg bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-semibold text-white shadow-sm cursor-pointer"
              >
                Map to Ecosystem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5b. COMPREHENSIVE ORGANISATION DETAILS MODAL POPUP */}
      {detailedOrg && (
        <div className="fixed inset-0 bg-[#1a2521]/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] transition-all duration-300">
          <div className="bg-white border border-[#e1e1db] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-[#e1e1db] bg-[#fbfbf9]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-[#2E536B]/10 text-[#2E536B] border border-[#2E536B]/20">
                    {detailedOrg.sector}
                  </span>
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-[#51615a]/10 text-[#51615a] border border-[#e1e1db]">
                    Stage: {detailedOrg.assignedTab}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1a2521] tracking-tight">
                  {detailedOrg.name}
                </h3>
              </div>
              <button 
                onClick={() => setDetailedOrg(null)}
                className="p-1.5 rounded-lg text-[#51615a] hover:text-[#1a2521] hover:bg-[#e1e1db]/50 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* About overview */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-[#51615a] font-bold">About the organisation</span>
                <p className="text-xs text-[#1a2521] leading-relaxed">
                  {detailedOrg.description}
                </p>
              </div>

              {/* Grid of Key Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#fbfbf9] p-4 rounded-xl border border-[#e1e1db]">
                <div className="space-y-1">
                  <span className="block text-[10px] text-[#51615a] font-semibold">Address / venue</span>
                  <p className="text-xs text-[#1a2521] flex items-start gap-1.5 leading-normal">
                    <MapPin className="w-3.5 h-3.5 text-[#51615a] mt-0.5 flex-shrink-0" />
                    <span>{detailedOrg.address}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] text-[#51615a] font-semibold">Key contact person</span>
                  <p className="text-xs text-[#1a2521] flex items-start gap-1.5 leading-normal">
                    <User className="w-3.5 h-3.5 text-[#51615a] mt-0.5 flex-shrink-0" />
                    <span>{detailedOrg.keyContact}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] text-[#51615a] font-semibold">Active initiative count</span>
                  <p className="text-xs text-[#1a2521] font-bold">
                    {detailedOrg.currentProjectsCount} Ongoing projects
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] text-[#51615a] font-semibold">Current capacity status</span>
                  <p className="text-xs font-semibold text-[#986430]">
                    {detailedOrg.capacityStatus}
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#e1e1db]/50">
                  <span className="block text-[10px] text-[#51615a] font-semibold">Working with OAHA</span>
                  <p className="text-xs text-[#1a2521] font-bold mt-1">
                    {detailedOrg.workingWithOaha ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-[#3AB03A]/10 text-[#3AB03A] border border-[#3AB03A]/20">
                        Yes, this organisation is an active OAHA collaborator
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-medium bg-[#51615a]/10 text-[#51615a] border border-[#e1e1db]">
                        No current recorded OAHA collaboration
                      </span>
                    )}
                  </p>
                </div>

                {detailedOrg.website && (
                  <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#e1e1db]/50">
                    <span className="block text-[10px] text-[#51615a] font-semibold">Official website</span>
                    <p className="text-xs mt-1">
                      <a
                        href={detailedOrg.website.startsWith('http') ? detailedOrg.website : `https://${detailedOrg.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2E536B] hover:underline font-semibold inline-flex items-center gap-1.5 transition bg-[#2E536B]/5 border border-[#2E536B]/15 px-2.5 py-1 rounded"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#2E536B]" />
                        <span>{detailedOrg.website.replace(/^https?:\/\/(www\.)?/, '')} ↗</span>
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* What they are working on */}
              <div className="space-y-2">
                <span className="block text-[10px] text-[#51615a] font-bold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#2E536B]" /> Active Welsh project work
                </span>
                <div className="p-4 rounded-xl border border-[#e1e1db] bg-white text-xs text-[#1a2521] italic leading-relaxed shadow-xs">
                  "{detailedOrg.currentProject}"
                </div>
              </div>

              {/* Impact so far */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-[#51615a] font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#3AB03A]" /> Strategic impact so far
                </span>
                <p className="text-xs text-[#1a2521] leading-relaxed bg-[#3AB03A]/5 border border-[#3AB03A]/15 p-3.5 rounded-xl">
                  {detailedOrg.impact}
                </p>
              </div>

              {/* What they are looking for */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-[#51615a] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9900]" /> Collaboration and ecosystem support needs
                </span>
                <div className="p-4 bg-[#e1e1db]/25 border border-[#e1e1db] rounded-xl text-xs text-[#1a2521] space-y-1">
                  <strong className="text-xs text-[#2E536B] block">Primary need: {detailedOrg.lookingFor}</strong>
                  <p className="leading-relaxed text-[#51615a]">
                    {detailedOrg.lookingForDetail}
                  </p>
                </div>
              </div>

              {/* Solutions lists */}
              <div className="space-y-2">
                <span className="block text-[10px] text-[#51615a] font-bold">Active operational solutions</span>
                <div className="grid grid-cols-1 gap-2">
                  {detailedOrg.solutions.map((sol, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-white border border-[#e1e1db]/70 rounded-xl shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#3AB03A] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-[#1a2521] leading-relaxed">{sol}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex-none p-5 border-t border-[#e1e1db] bg-[#fbfbf9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10px] text-[#818e87]">
                Collaborative regional record
              </span>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setDetailedOrg(null)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-[#e1e1db] bg-white text-xs font-semibold text-[#51615a] hover:bg-[#fbfbf9] rounded-lg transition cursor-pointer animate-none"
                >
                  Close dossier
                </button>

                {detailedOrg.website && (
                  <a
                    href={detailedOrg.website.startsWith('http') ? detailedOrg.website : `https://${detailedOrg.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-[#e1e1db] bg-white text-xs font-semibold text-[#51615a] hover:text-[#1a2521] hover:bg-[#fbfbf9] rounded-lg transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visit Website</span>
                  </a>
                )}

                {detailedOrg.contactEmail && (
                  <button
                    onClick={() => {
                      setDetailedOrg(null);
                      handleOpenContact(detailedOrg);
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2E536B] hover:bg-[#2E536B]/90 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-white" />
                    <span>Contact initiative</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5c. DYNAMIC IN-APP CONTACT POPUP BOX */}
      {contactOrg && (
        <div className="fixed inset-0 bg-[#1a2521]/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] transition-all duration-300">
          <div className="bg-white border border-[#e1e1db] rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-[#e1e1db] bg-[#fbfbf9]">
              <div>
                <span className="text-[10px] font-semibold text-[#2E536B] px-2 py-0.5 rounded bg-[#2E536B]/5 border border-[#2E536B]/15">
                  Connect space
                </span>
                <h3 className="text-base font-bold text-[#1a2521] mt-1.5 leading-snug">
                  Contact {contactOrg.name}
                </h3>
              </div>
              <button 
                onClick={() => setContactOrg(null)}
                className="p-1.5 rounded-lg text-[#51615a] hover:text-[#1a2521] hover:bg-[#e1e1db]/50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleContactSubmit} className="p-5 space-y-4">
              {contactError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                  {contactError}
                </div>
              )}

              {contactSuccess && (
                <div className="p-3 bg-[#3AB03A]/10 border border-[#3AB03A]/20 rounded-lg text-xs text-[#3AB03A] font-semibold">
                  {contactSuccess}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#1a2521]">
                  Your name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="e.g. Catrin Jones"
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#1a2521]">
                  Your email address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="e.g. catrin@example.wales"
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#1a2521]">
                  Subject or message type
                </label>
                <select
                  name="messageType"
                  value={contactForm.messageType}
                  onChange={handleContactChange}
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] focus:outline-none focus:border-[#1a2521] cursor-pointer"
                >
                  <option value="Collaboration">Ecosystem collaboration</option>
                  <option value="Referral">Learner or youth referral</option>
                  <option value="Employer Partnership">Employer partnership inquiry</option>
                  <option value="Funding Support">Funding or resource support</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#1a2521]">
                  Your message *
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  rows={4}
                  placeholder="Write details of your proposal, inquiry, or referral pathways..."
                  className="w-full bg-white border border-[#e1e1db] rounded-lg p-2.5 text-xs text-[#1a2521] placeholder-[#51615a]/50 focus:outline-none focus:border-[#1a2521] focus:ring-1 focus:ring-[#1a2521] transition resize-none"
                  required
                />
              </div>

              {/* Modal Footer inside form */}
              <div className="flex justify-end gap-2.5 pt-2.5 border-t border-[#e1e1db]">
                <button
                  type="button"
                  onClick={() => setContactOrg(null)}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-[#fbfbf9] text-xs font-semibold text-[#51615a] border border-[#e1e1db] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!contactSuccess}
                  className="px-4 py-2 rounded-lg bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-semibold text-white shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Dashboard Footer / Metadata status styled according to Sand & Slate design rules */}
      <footer className="flex-none border-t border-[#e1e1db] bg-white py-6 px-8 relative z-10 text-center space-y-4">
        {/* 1. Footnote / Description Block */}
        <p className="font-sans text-xs leading-relaxed text-[#51615a] max-w-lg mx-auto font-normal">
          This microsite is a simple progress space for OAHA. Return to our main site at{" "}
          <a
            href="https://oaha.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-[#2E536B] transition-colors hover:text-[#2BB7BA]"
          >
            oaha.uk
          </a>{" "}
          or connect with us on LinkedIn:{" "}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-[#2E536B] transition-colors hover:text-[#2BB7BA]"
          >
            LinkedIn
          </a>.
        </p>

        {/* 2. Logo & Copyright Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-[#818e87] font-semibold">
          {/* Mini Brand Logo */}
          <span className="opacity-85 transition-opacity duration-300 hover:opacity-100 flex items-center justify-center h-5 w-5">
            <Logo size="sm" className="max-h-5 max-w-5" />
          </span>
          {/* Copyright Notice */}
          <span>© 2026 OAHA UK. Operational update initiative.</span>
        </div>
      </footer>
    </div>
  );
}
