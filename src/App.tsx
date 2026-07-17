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
  Leaf,
  CheckCircle2,
  Info,
  Globe,
  PlusCircle,
  HelpCircle,
  User,
  Briefcase,
  Database,
  RefreshCw,
  FileText,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  BookOpen,
  MessageSquare,
  Activity,
  CheckSquare,
  Copy,
  Check,
  Eye,
  Bookmark,
  LogOut,
  Building2
} from 'lucide-react';
import { SYSTEMIC_TABS } from './data';
import { FrictionPoint, Organization, SectorType, LookingForType, GapOfferRequest, Commitment, EvidenceLearning, SubmissionType, UserProfile } from './types';
import { Logo } from './components/Logo';
import LearnerJourneyFlow from './components/LearnerJourneyFlow';
import { GapsHeatmap } from './components/GapsHeatmap';
import { 
  getDbStatus, 
  fetchOrganisations, 
  addOrganisation, 
  fetchGapsOffers, 
  addGapOffer, 
  fetchCommitments, 
  addCommitment, 
  fetchEvidenceLearning, 
  addEvidenceLearning,
  DbStatus
} from './services/db';

// Helper functions to infer region from strings if explicit region is undefined
export function getRegionForGapOffer(item: any): 'north' | 'mid' | 'southwest' | 'southeast' | null {
  if (item.region) return item.region;
  const text = `${item.organization || ''} ${item.title || ''} ${item.content || ''}`.toLowerCase();
  if (text.includes('gwynedd') || text.includes('bangor') || text.includes('clwyd') || text.includes('wrexham') || text.includes('eryri') || text.includes('north') || text.includes('gogledd')) {
    return 'north';
  }
  if (text.includes('aberystwyth') || text.includes('ceredigion') || text.includes('powys') || text.includes('mid') || text.includes('canolbarth')) {
    return 'mid';
  }
  if (text.includes('swansea') || text.includes('llanelli') || text.includes('carmarthen') || text.includes('pembroke') || text.includes('south west') || text.includes('de-orllewin')) {
    return 'southwest';
  }
  if (text.includes('cardiff') || text.includes('newport') || text.includes('valleys') || text.includes('merthyr') || text.includes('aberdare') || text.includes('pontypridd') || text.includes('rhondda') || text.includes('south east') || text.includes('gwent') || text.includes('de-ddwyrain')) {
    return 'southeast';
  }
  return null;
}

export function getRegionForCommitment(item: any): 'north' | 'mid' | 'southwest' | 'southeast' | null {
  if (item.region) return item.region;
  const text = `${item.partnerName || ''} ${item.title || ''}`.toLowerCase();
  if (text.includes('gwynedd') || text.includes('bangor') || text.includes('clwyd') || text.includes('wrexham') || text.includes('eryri') || text.includes('north') || text.includes('gogledd')) {
    return 'north';
  }
  if (text.includes('aberystwyth') || text.includes('ceredigion') || text.includes('powys') || text.includes('mid') || text.includes('canolbarth')) {
    return 'mid';
  }
  if (text.includes('swansea') || text.includes('llanelli') || text.includes('carmarthen') || text.includes('pembroke') || text.includes('south west') || text.includes('de-orllewin')) {
    return 'southwest';
  }
  if (text.includes('cardiff') || text.includes('newport') || text.includes('valleys') || text.includes('merthyr') || text.includes('aberdare') || text.includes('pontypridd') || text.includes('rhondda') || text.includes('south east') || text.includes('gwent') || text.includes('de-ddwyrain')) {
    return 'southeast';
  }
  return null;
}

export function getRegionForEvidence(item: any): 'north' | 'mid' | 'southwest' | 'southeast' | null {
  if (item.region) return item.region;
  const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
  if (text.includes('gwynedd') || text.includes('bangor') || text.includes('clwyd') || text.includes('wrexham') || text.includes('eryri') || text.includes('north') || text.includes('gogledd')) {
    return 'north';
  }
  if (text.includes('aberystwyth') || text.includes('ceredigion') || text.includes('powys') || text.includes('mid') || text.includes('canolbarth')) {
    return 'mid';
  }
  if (text.includes('swansea') || text.includes('llanelli') || text.includes('carmarthen') || text.includes('pembroke') || text.includes('south west') || text.includes('de-orllewin')) {
    return 'southwest';
  }
  if (text.includes('cardiff') || text.includes('newport') || text.includes('valleys') || text.includes('merthyr') || text.includes('aberdare') || text.includes('pontypridd') || text.includes('rhondda') || text.includes('south east') || text.includes('gwent') || text.includes('de-ddwyrain')) {
    return 'southeast';
  }
  return null;
}

export function getRegionFromLocation(location: string): 'north' | 'mid' | 'southwest' | 'southeast' | null {
  const loc = location.toLowerCase();
  if (loc.includes('bangor') || loc.includes('wrexham') || loc.includes('clwyd') || loc.includes('gogledd') || loc.includes('north')) {
    return 'north';
  }
  if (loc.includes('aberystwyth') || loc.includes('ceredigion') || loc.includes('powys') || loc.includes('mid') || loc.includes('canolbarth')) {
    return 'mid';
  }
  if (loc.includes('swansea') || loc.includes('llanelli') || loc.includes('carmarthen') || loc.includes('pembroke') || loc.includes('south west') || loc.includes('de-orllewin')) {
    return 'southwest';
  }
  if (loc.includes('cardiff') || loc.includes('newport') || loc.includes('valleys') || loc.includes('merthyr') || loc.includes('aberdare') || loc.includes('pontypridd') || loc.includes('rhondda') || loc.includes('south east') || loc.includes('gwent') || loc.includes('de-ddwyrain')) {
    return 'southeast';
  }
  return null;
}

export function getCategoryForGapOffer(item: any): 'resource' | 'job' | 'funding' | 'others' {
  if (item.category && ['resource', 'job', 'funding', 'others'].includes(item.category)) {
    return item.category;
  }
  const text = `${item.title || ''} ${item.content || ''} ${item.organization || ''}`.toLowerCase();
  if (text.includes('funding') || text.includes('grant') || text.includes('budget') || text.includes('sponsor') || text.includes('finance') || text.includes('fund') || text.includes('capital') || text.includes('cost') || text.includes('subsidy') || text.includes('bursary')) {
    return 'funding';
  }
  if (text.includes('job') || text.includes('career') || text.includes('employment') || text.includes('apprenticeship') || text.includes('placement') || text.includes('internship') || text.includes('hire') || text.includes('recruitment') || text.includes('work experience') || text.includes('staff') || text.includes('role')) {
    return 'job';
  }
  if (text.includes('laptop') || text.includes('equipment') || text.includes('hardware') || text.includes('material') || text.includes('spaces') || text.includes('classroom') || text.includes('software') || text.includes('license') || text.includes('guidelines') || text.includes('mentoring') || text.includes('mentor') || text.includes('curriculum') || text.includes('advisor') || text.includes('outreach') || text.includes('panel')) {
    return 'resource';
  }
  return 'others';
}

export function getUrgencyForGapOffer(item: any): 'urgent' | 'not urgent' {
  if (item.urgency && ['urgent', 'not urgent'].includes(item.urgency)) {
    return item.urgency;
  }
  const text = `${item.title || ''} ${item.content || ''}`.toLowerCase();
  if (
    text.includes('urgent') ||
    text.includes('asap') ||
    text.includes('immediate') ||
    text.includes('critical') ||
    text.includes('desperate') ||
    text.includes('needed now') ||
    text.includes('emergency') ||
    text.includes('by next week') ||
    text.includes('struggle') ||
    text.includes('cannot access') ||
    text.includes('barrier') ||
    text.includes('priority') ||
    text.includes('missed')
  ) {
    return 'urgent';
  }
  return 'not urgent';
}

export function generateCombinationsOfGapsOffers(): GapOfferRequest[] {
  const types: SubmissionType[] = ['Gap', 'Offer', 'Request', 'Collaboration'];
  const regions: ('north' | 'mid' | 'southwest' | 'southeast')[] = ['north', 'mid', 'southwest', 'southeast'];
  const categories: ('resource' | 'job' | 'funding' | 'others')[] = ['resource', 'job', 'funding', 'others'];
  const urgencies: ('urgent' | 'not urgent')[] = ['urgent', 'not urgent'];

  const welshFirstNames = ['Dylan', 'Alys', 'Iolo', 'Ffion', 'Sion', 'Rhiannon', 'Marc', 'Ceri', 'Sian', 'Alun', 'Owen', 'Megan', 'Gareth', 'Elen', 'Rhys', 'Nia'];
  const welshLastNames = ['Griffiths', 'Vaughan', 'Rhys', 'Owen', 'Evans', 'Davies', 'Jenkins', 'Hughes', 'Thomas', 'Lloyd', 'Morgan', 'Jones', 'Williams', 'Prichard', 'Llewellyn', 'Wynne'];

  const orgPrefixes = {
    north: ['Eryri', 'Gwynedd', 'Clwyd', 'Wrexham', 'Bangor'],
    mid: ['Aberystwyth', 'Ceredigion', 'Powys', 'Mid-Wales', 'Dyfi'],
    southwest: ['Swansea', 'Pembrokeshire', 'Carmarthen', 'Llanelli', 'West-Wales'],
    southeast: ['Cardiff', 'Newport', 'Valleys', 'Rhondda', 'Pontypridd']
  };

  const orgSuffixes = {
    resource: ['Tech Hub', 'Resource Alliance', 'Digital Inclusion Group', 'Skills Network', 'Outreach Team'],
    job: ['Youth Association', 'Employment Forum', 'Apprenticeship Guild', 'Enterprise Partners', 'Careers Link'],
    funding: ['Community Foundation', 'Investment Trust', 'Sponsorship Board', 'Development Fund', 'Action Council'],
    others: ['Coalition', 'Collective', 'Collaborative', 'Ecosystem Network', 'Innovation Lab']
  };

  const templates: Record<string, Record<string, string>> = {
    Gap: {
      resource: 'Unmet digital hardware and advice resources in {region} communities',
      job: 'Lack of local placement or job pathways for young people in {region}',
      funding: 'Severe funding deficits for vocational pilot schemes in {region}',
      others: 'General systemic communication bottlenecks across {region} networks'
    },
    Offer: {
      resource: 'Provision of refurbished hardware and mentoring in {region}',
      job: 'Available apprentice placements and work shadowing in {region}',
      funding: 'New micro-grants and funding sponsorships available for {region}',
      others: 'Shared directory tools and administrative templates for {region}'
    },
    Request: {
      resource: 'Request for bilingual career advisors and laptops in {region}',
      job: 'Seeking local employer hosts for youth shadowing in {region}',
      funding: 'Urgent call for co-investment or community sponsorships in {region}',
      others: 'Inquiry regarding cross-referral guidelines for {region} partners'
    },
    Collaboration: {
      resource: 'Joint proposal for a mobile resources and hardware hub in {region}',
      job: 'Co-designing a green apprentice and placements pipeline in {region}',
      funding: 'Sponsorship pooling initiative for regional programs in {region}',
      others: 'Developing a shared regional data dashboard and referral pathway in {region}'
    }
  };

  const contentTemplates: Record<string, Record<string, string>> = {
    Gap: {
      resource: 'This entry highlights a critical lack of {category} resources in {region} Wales. Many youth are unable to participate in digital mapping programs due to a total lack of hardware and active local mentors.',
      job: 'We have identified a severe bottleneck in youth jobs and placements in {region} Wales. School-leavers and graduates face limited local options, forcing many to migrate away from their home communities.',
      funding: 'Ecosystem initiatives in {region} Wales are currently struggling due to a severe funding deficit. Local groups are operating at near-zero capacity and desperately need financial integration.',
      others: 'A general challenge has been recorded in {region} Wales regarding ecosystem navigation. There is an urgent need for coordinating local partners and streamlining public access points.'
    },
    Offer: {
      resource: 'We are pleased to offer a package of dedicated {category} resources to partners in {region} Wales. This includes fully refurbished laptops, bilingual materials, and volunteer mentoring hours.',
      job: 'Our partner network is opening up active placements, internships, and apprenticeships in {region} Wales. We want to host young people eager to build real-world digital and green-economy skills.',
      funding: 'A dedicated sponsorship and micro-grant fund has been unlocked for {region} Wales. Non-profit initiatives can apply for quick-release funding to cover pilot costs and travel bursaries.',
      others: 'We are sharing a set of guidelines, templates, and referral protocols with any active hub in {region} Wales to help co-design better pathways for local vulnerable learners.'
    },
    Request: {
      resource: 'We are seeking immediate assistance with {category} resources for our youth programs in {region} Wales. Laptops, study guides, and bilingual career panels are highly sought after.',
      job: 'We are looking for employer partners in {region} Wales who can offer short-term job shadow experiences. This is critical to bridge school-leavers into modern career paths.',
      funding: 'Our local youth initiative in {region} Wales is requesting co-investment or grant sponsorships. Even small bursaries will help us keep our transport subsidies alive this winter.',
      others: 'We are requesting contact from any regional partners in {region} Wales who want to align referral protocols and share intake workflows to prevent youth from dropping off.'
    },
    Collaboration: {
      resource: 'Let\'s co-create a mobile resource hub in {region} Wales! By pooling our hardware and volunteer mentors, we can run weekly pop-ups in isolated communities.',
      job: 'Seeking partners to design an employer-led placement pathway in {region} Wales. We want to standardise intake modules and provide joint mentor support.',
      funding: 'We are seeking co-applicants for a major Welsh Government community grant. Let\'s combine our regional efforts in {region} Wales to secure a sustainable long-term budget.',
      others: 'Let\'s build a unified referral pipeline in {region} Wales! We want to co-design a streamlined system connecting community hubs directly to employers.'
    }
  };

  const list: GapOfferRequest[] = [];

  types.forEach((type) => {
    regions.forEach((region) => {
      categories.forEach((category) => {
        urgencies.forEach((urgency) => {
          const regionStr = region === 'north' ? 'North' : region === 'mid' ? 'Mid' : region === 'southwest' ? 'South West' : 'South East';
          
          const comboId = `combo-${type}-${region}-${category}-${urgency}`.toLowerCase();
          
          // Deterministic selection based on string lengths
          const codeSum = type.length + region.length + category.length + urgency.length;
          const firstName = welshFirstNames[codeSum % welshFirstNames.length];
          const lastName = welshLastNames[(codeSum * 3) % welshLastNames.length];
          const submittedBy = `${firstName} ${lastName}`;
          
          const prefixes = orgPrefixes[region];
          const suffixes = orgSuffixes[category];
          const prefix = prefixes[codeSum % prefixes.length];
          const suffix = suffixes[(codeSum * 2) % suffixes.length];
          const organization = `${prefix} ${suffix}`;
          
          const contactEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${prefix.toLowerCase().replace(/[^a-z]/g, '')}-${category}.wales`;
          
          let title = templates[type][category].replace('{region}', regionStr);
          let content = contentTemplates[type][category].replace('{category}', category).replace('{region}', regionStr);
          
          if (urgency === 'urgent') {
            title = `[URGENT] ${title}`;
            content = `CRITICAL EXPEDITED TIMEFRAME: ${content} We require immediate cooperation.`;
          } else {
            content = `Planning Focus: ${content} This is scheduled for the upcoming strategic cycle.`;
          }
          
          const categoryToFrictionPoint: Record<string, FrictionPoint[]> = {
            resource: ['Visibility', 'Translation'],
            job: ['Progression', 'Transitions'],
            funding: ['Transitions', 'Navigation'],
            others: ['Family Awareness', 'Navigation']
          };
          
          const assignedTabList = categoryToFrictionPoint[category] || ['Visibility', 'Navigation'];
          const assignedTab = assignedTabList[urgency === 'urgent' ? 0 : 1];
          
          list.push({
            id: comboId,
            type,
            title,
            submittedBy,
            organization,
            contactEmail,
            content,
            assignedTab,
            region,
            category,
            urgency,
            workingWithOaha: codeSum % 3 === 0
          });
        });
      });
    });
  });

  return list;
}

const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'demo-org-clwyd',
    name: 'Clwyd Youth Innovators',
    type: 'organisation',
    contactEmail: 'info@clwydinnovators.org.uk',
    region: 'north',
    description: 'Bilingual community youth group organizing technical hardware distribution and mentor hubs across North Wales.',
    sector: 'Tech/Digital',
    savedItems: ['combo-gap-north-resource-urgent', 'combo-offer-north-job-not urgent', 'combo-request-north-funding-urgent']
  },
  {
    id: 'demo-ind-marc',
    name: 'Marc Davies',
    type: 'individual',
    contactEmail: 'marc.davies@clwyd-resource.wales',
    region: 'north',
    description: 'Lead facilitator and advocate for community-led youth job shadow arrangements.',
    savedItems: ['combo-request-north-job-urgent']
  },
  {
    id: 'demo-biz-valley',
    name: 'Valley Green Energy',
    type: 'business',
    contactEmail: 'hello@valleygreen.wales',
    region: 'southeast',
    description: 'Clean technology retrofitting enterprise providing fully-certified solar apprenticeships to Valley school-leavers.',
    sector: 'Green Economy',
    savedItems: ['combo-collab-southeast-job-not urgent']
  }
];

type AlphaTab = 'overview' | 'journey' | 'directory' | 'gaps_offers' | 'commitments' | 'evidence_learning';

export default function App() {
  // Alpha Active Tab View
  const [currentAlphaTab, setCurrentAlphaTab] = useState<AlphaTab>('overview');

  // Regional Map Filter State (selectedRegionFilter)
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');

  // Supabase Database Connection & Status States
  const [dbStatus, setDbStatus] = useState<DbStatus>({
    connected: false,
    usingSupabase: false,
    tables: {
      wales_organisations: false,
      wales_gaps_offers: false,
      wales_commitments: false,
      wales_evidence_learning: false
    }
  });
  const [checkingDb, setCheckingDb] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Core Entity States
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [gapsOffers, setGapsOffers] = useState<GapOfferRequest[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [evidenceLearning, setEvidenceLearning] = useState<EvidenceLearning[]>([]);
  
  // Loading indicators
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingGaps, setLoadingGaps] = useState(true);
  const [loadingCommitments, setLoadingCommitments] = useState(true);
  const [loadingEvidence, setLoadingEvidence] = useState(true);

  // Stage Selector State (shared or used in journey view)
  const [activeTab, setActiveTab] = useState<FrictionPoint>('Visibility');

  // Filters for directory
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [lookingForFilter, setLookingForFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [detailedOrg, setDetailedOrg] = useState<Organization | null>(null);
  const [detailedGap, setDetailedGap] = useState<GapOfferRequest | null>(null);

  // Form State for Adding new Initiative (Directory view)
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

  // Form State for Adding new Gaps/Offers/Requests
  const [isAddGapOpen, setIsAddGapOpen] = useState(false);
  const [gapSuccess, setGapSuccess] = useState('');
  const [gapError, setGapError] = useState('');
  const [gapForm, setGapForm] = useState({
    type: 'Gap' as SubmissionType,
    title: '',
    submittedBy: '',
    organization: '',
    contactEmail: '',
    content: '',
    assignedTab: 'Visibility' as FrictionPoint,
    region: '' as string,
    category: '' as string,
    urgency: '' as string,
    workingWithOaha: false
  });

  // Form State for Adding new Commitment
  const [isAddCommitOpen, setIsAddCommitOpen] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState('');
  const [commitError, setCommitError] = useState('');
  const [commitForm, setCommitForm] = useState({
    title: '',
    partnerName: '',
    owner: '',
    timescale: 'Q3 2026',
    progress: 'Drafting' as 'Drafting' | 'Active Pilot' | 'Completed',
    nextSteps: '',
    dependencies: '',
    assignedTab: 'Visibility' as FrictionPoint,
    region: '' as string
  });

  // Form State for Adding new Evidence / Learning Log
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [evidenceSuccess, setEvidenceSuccess] = useState('');
  const [evidenceError, setEvidenceError] = useState('');
  const [evidenceForm, setEvidenceForm] = useState({
    title: '',
    logType: 'Community Feedback' as 'Community Feedback' | 'Outcome Metric' | 'Barrier Encountered' | 'Key Decision' | 'Delivery Learning',
    assignedTab: 'Visibility' as FrictionPoint,
    description: '',
    whatChanged: '',
    region: '' as string
  });

  // Filter for Gaps/Offers submission list
  const [gapTypeFilter, setGapTypeFilter] = useState<string>('All');
  const [gapCategoryFilter, setGapCategoryFilter] = useState<string>('All');
  const [gapUrgencyFilter, setGapUrgencyFilter] = useState<string>('All');
  
  // Filter for Commitment Progress list
  const [commitProgressFilter, setCommitProgressFilter] = useState<string>('All');

  // Filter for Evidence logs list
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState<string>('All');

  // Contact Initiative popup modal
  const [contactOrg, setContactOrg] = useState<Organization | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    messageType: 'Collaboration',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  // User Profile and Authentication States
  const [registeredProfiles, setRegisteredProfiles] = useState<UserProfile[]>(() => {
    const cached = localStorage.getItem('wales_alpha_registered_profiles');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return DEMO_PROFILES; }
    }
    localStorage.setItem('wales_alpha_registered_profiles', JSON.stringify(DEMO_PROFILES));
    return DEMO_PROFILES;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('wales_alpha_user_profile');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return null; }
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [authAlertMessage, setAuthAlertMessage] = useState('');
  const [regForm, setRegForm] = useState({
    name: '',
    type: 'organisation' as 'organisation' | 'individual' | 'business',
    contactEmail: '',
    region: 'north' as 'north' | 'mid' | 'southwest' | 'southeast',
    description: '',
    sector: 'Tech/Digital'
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Toggle bookmark / saved item
  const toggleSaveItem = (itemId: string) => {
    if (!currentUser) {
      setAuthAlertMessage("Please log in or register a profile to save/bookmark this community item to your personal list.");
      setIsLoginModalOpen(true);
      return;
    }

    const currentSaved = currentUser.savedItems || [];
    const isSaved = currentSaved.includes(itemId);
    let updatedSavedItems: string[];
    if (isSaved) {
      updatedSavedItems = currentSaved.filter(id => id !== itemId);
    } else {
      updatedSavedItems = [...currentSaved, itemId];
    }

    const updatedUser = { ...currentUser, savedItems: updatedSavedItems };
    setCurrentUser(updatedUser);
    localStorage.setItem('wales_alpha_user_profile', JSON.stringify(updatedUser));

    // Update in registered profiles as well
    const updatedProfiles = registeredProfiles.map(p => p.id === currentUser.id ? updatedUser : p);
    setRegisteredProfiles(updatedProfiles);
    localStorage.setItem('wales_alpha_registered_profiles', JSON.stringify(updatedProfiles));
  };

  // Prepopulate Gap/Offer form when opening with a logged-in user
  const handleOpenAddGap = () => {
    if (currentUser) {
      setGapForm(prev => ({
        ...prev,
        submittedBy: currentUser.name,
        organization: currentUser.type === 'organisation' || currentUser.type === 'business' ? currentUser.name : 'Individual Partner',
        contactEmail: currentUser.contactEmail,
        region: currentUser.region || ''
      }));
    } else {
      setGapForm(prev => ({
        ...prev,
        submittedBy: '',
        organization: '',
        contactEmail: '',
        region: ''
      }));
    }
    setIsAddGapOpen(true);
  };

  // Mobile navigation state inside Directory: "map" vs "list" view toggle
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  // Leaflet references
  const mapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const markerObjectsRef = useRef<{ [id: string]: any }>({});

  // 1. Check Database Status and Load All Data on Mount
  const refreshAllData = async () => {
    setCheckingDb(true);
    
    // Check DB table exists
    const status = await getDbStatus();
    setDbStatus(status);
    setCheckingDb(false);

    // Fetch entities
    setLoadingOrgs(true);
    try {
      const orgs = await fetchOrganisations();
      setOrganizations(orgs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrgs(false);
    }

    setLoadingGaps(true);
    try {
      const gaps = await fetchGapsOffers();
      const combinations = generateCombinationsOfGapsOffers();
      setGapsOffers([...gaps, ...combinations]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGaps(false);
    }

    setLoadingCommitments(true);
    try {
      const commits = await fetchCommitments();
      setCommitments(commits);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCommitments(false);
    }

    setLoadingEvidence(true);
    try {
      const logs = await fetchEvidenceLearning();
      setEvidenceLearning(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEvidence(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // 2. Filter the organizations dynamically for directory
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      if (org.assignedTab !== activeTab) return false;
      if (sectorFilter !== 'All' && org.sector !== sectorFilter) return false;
      if (lookingForFilter !== 'All' && org.lookingFor !== lookingForFilter) return false;
      if (selectedRegionFilter !== 'All') {
        const r = getRegionFromLocation(org.location);
        if (r !== selectedRegionFilter) return false;
      }

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
  }, [organizations, activeTab, sectorFilter, lookingForFilter, searchQuery, selectedRegionFilter]);

  // 3. Filter the gaps, offers & requests dynamically
  const filteredGapsOffers = useMemo(() => {
    return gapsOffers.filter((g) => {
      if (gapTypeFilter !== 'All' && g.type !== gapTypeFilter) return false;
      
      // Filter by Region Focus
      if (selectedRegionFilter !== 'All') {
        const r = g.region || getRegionForGapOffer(g);
        if (r !== selectedRegionFilter) return false;
      }

      // Filter by category (what type: resource, job, funding, others)
      if (gapCategoryFilter !== 'All') {
        const cat = g.category || getCategoryForGapOffer(g);
        if (cat !== gapCategoryFilter) return false;
      }

      // Filter by urgency (urgent, not urgent, both)
      if (gapUrgencyFilter !== 'All') {
        const urg = g.urgency || getUrgencyForGapOffer(g);
        if (urg !== gapUrgencyFilter) return false;
      }

      return true;
    });
  }, [gapsOffers, gapTypeFilter, gapCategoryFilter, gapUrgencyFilter, selectedRegionFilter]);

  // 4. Filter the commitments dynamically
  const filteredCommitments = useMemo(() => {
    return commitments.filter((c) => {
      if (commitProgressFilter !== 'All' && c.progress !== commitProgressFilter) return false;
      if (selectedRegionFilter !== 'All') {
        const r = c.region || getRegionForCommitment(c);
        if (r !== selectedRegionFilter) return false;
      }
      return true;
    });
  }, [commitments, commitProgressFilter, selectedRegionFilter]);

  // 5. Filter the evidence and learning logs dynamically
  const filteredEvidenceLearning = useMemo(() => {
    return evidenceLearning.filter((e) => {
      if (evidenceTypeFilter !== 'All' && e.logType !== evidenceTypeFilter) return false;
      if (selectedRegionFilter !== 'All') {
        const r = e.region || getRegionForEvidence(e);
        if (r !== selectedRegionFilter) return false;
      }
      return true;
    });
  }, [evidenceLearning, evidenceTypeFilter, selectedRegionFilter]);

  // Tab Metadata helper for specific active styles
  const activeTabInfo = useMemo(() => {
    return SYSTEMIC_TABS.find((t) => t.id === activeTab) || SYSTEMIC_TABS[0];
  }, [activeTab]);

  // Tab Colors mapping
  const tabColorHex: { [key in FrictionPoint]: string } = {
    'Visibility': '#2E536B',       // Navy / Steel Blue
    'Family Awareness': '#3AB03A',  // Organic Green
    'Transitions': '#FF9900',      // Vibrant Orange
    'Navigation': '#2BB7BA',       // Teal
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

    const totalReferrals = organizations.filter(o => o.lookingFor === 'Referrals').length;
    const totalPartners = organizations.filter(o => o.lookingFor === 'Employer Partners').length;

    return { totalCount, tabCounts, totalReferrals, totalPartners };
  }, [organizations]);

  // Partnership info helper for the detailed view of gap, offer, request
  const detailedGapPartnershipInfo = useMemo(() => {
    if (!detailedGap) return null;
    const linkedOrg = detailedGap.organization 
      ? organizations.find(o => o.name && o.name.toLowerCase().trim() === detailedGap.organization.toLowerCase().trim()) 
      : null;
    const isOahaPartner = !!detailedGap.workingWithOaha || !!(linkedOrg && linkedOrg.workingWithOaha);

    const partnerFocus = linkedOrg 
      ? `Deploying joint initiatives for ${linkedOrg.assignedTab} stage, specifically: ${linkedOrg.currentProject}`
      : detailedGap.category === 'resource'
        ? 'Co-designing regional digital hardware hubs and bilingual training toolkits to resolve community equipment scarcity.'
        : detailedGap.category === 'job'
          ? 'Establishing joint apprentice host standards and cross-employer work shadow pathways for valley school-leavers.'
          : detailedGap.category === 'funding'
            ? 'Pooling local sponsorship funds and administering quick-release transport bursaries for low-income participants.'
            : 'Aligning multi-agency intake workflows and setting up secure, unified cross-referral pathways.';

    const partnerDuration = linkedOrg && linkedOrg.id.includes('cyo') 
      ? '18 Months (Since Jan 2025)' 
      : linkedOrg && linkedOrg.id.includes('clwyd') 
        ? '12 Months (Since July 2025)'
        : '10 Months (Since Sept 2025)';

    const partnerScope = linkedOrg 
      ? `${linkedOrg.sector} Sector Integration & Joint Delivery` 
      : 'Regional Collaboration & Technical Mapping Assistance';

    return {
      isOahaPartner,
      partnerFocus,
      partnerDuration,
      partnerScope
    };
  }, [detailedGap, organizations]);

  // 3. Initialize Leaflet Map on Mount (rendered on Directory tab)
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

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // Layer group for our pins
    const markersGroup = L.layerGroup().addTo(mapInstance);

    mapRef.current = mapInstance;
    markersGroupRef.current = markersGroup;

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

  // Sync Leaflet size when switching back to Directory
  useEffect(() => {
    if (currentAlphaTab === 'directory' && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [currentAlphaTab]);

  // Global click callback for map popup
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

  // Synchronize Leaflet map pins
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    markerObjectsRef.current = {};

    filteredOrganizations.forEach((org) => {
      const isSelected = org.id === selectedOrgId;
      
      let markerColor = '#51615a'; 
      let iconSymbol = '•';
      if (org.sector === 'Tech/Digital') {
        markerColor = '#2E536B'; 
        iconSymbol = 'T';
      } else if (org.sector === 'Green Economy') {
        markerColor = '#3AB03A'; 
        iconSymbol = 'G';
      } else if (org.sector === 'Creative') {
        markerColor = '#FF9900'; 
        iconSymbol = 'C';
      } else if (org.sector === 'Foundational') {
        markerColor = '#9E2A2B'; 
        iconSymbol = 'F';
      }

      const size = isSelected ? 48 : 36;
      
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative flex items-center justify-center rounded-full transition-all duration-300" 
               style="
                 width: ${size}px; 
                 height: ${size}px; 
                 background-color: ${markerColor}; 
                 border: 2.5px solid #ffffff; 
                 box-shadow: 0 4px 10px rgba(0,0,0,0.18);
                 transform: scale(${isSelected ? 1.25 : 1});
                 z-index: ${isSelected ? 9999 : 100};
               "
          >
            <span class="text-white text-xs font-bold font-mono select-none" style="margin-top: -1px;">${iconSymbol}</span>
            ${org.workingWithOaha ? `
              <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF9900] text-[8px] font-bold text-white border border-white" title="OAHA Partner">
                ★
              </span>
            ` : ''}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([org.latitude, org.longitude], { icon: customIcon })
        .addTo(markersGroupRef.current);

      markerObjectsRef.current[org.id] = marker;

      // Popup layout
      const popupHtml = `
        <div class="p-3 font-sans max-w-[210px] space-y-1">
          <h3 class="text-xs font-bold text-[#1a2521] leading-tight m-0">${org.name}</h3>
          <p class="text-[10px] text-[#51615a] m-0 flex items-center gap-1">
            <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${markerColor}"></span>
            ${org.sector} | ${org.location}
          </p>
          <p class="text-[10px] text-[#1a2521] line-clamp-2 leading-snug font-medium pt-1 m-0">"${org.currentProject}"</p>
          <div class="pt-2 flex flex-col gap-1.5">
            <button onclick="window.openDetailedOrgPopup('${org.id}')" class="w-full text-center py-1 bg-[#2E536B] hover:bg-[#2E536B]/90 text-[10px] text-white font-semibold rounded transition cursor-pointer">
              View Profile
            </button>
            <button onclick="window.openContactPopup('${org.id}')" class="w-full text-center py-1 bg-white hover:bg-[#fbfbf9] border border-[#e1e1db] text-[9px] text-[#51615a] font-medium rounded transition cursor-pointer">
              Send Message
            </button>
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

      marker.on('mouseover', () => marker.openPopup());
      marker.on('mouseout', () => marker.closePopup());

      marker.on('click', () => {
        marker.closePopup();
        setSelectedOrgId(org.id);
        
        if (window.innerWidth < 768) {
          setMobileView('list');
        }

        setTimeout(() => {
          const cardElement = document.getElementById(`card-${org.id}`);
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 150);
      });
    });

    if (filteredOrganizations.length > 0) {
      const group = L.featureGroup(Object.values(markerObjectsRef.current));
      mapRef.current.fitBounds(group.getBounds().pad(0.2), {
        maxZoom: 12,
        animate: true,
        duration: 0.8
      });
    } else {
      mapRef.current.setView([52.25, -3.8], 7.5, {
        animate: true,
        duration: 0.8
      });
    }
  }, [filteredOrganizations, activeTab, selectedOrgId]);

  // Card selection
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
    if (window.innerWidth < 768) {
      setMobileView('map');
    }
  };

  // Add Initiative Handler
  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInitiativeSubmit = async (e: FormEvent) => {
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

    const regionalCoords: { [key: string]: [number, number] } = {
      'Cardiff': [51.4816, -3.1791],
      'Swansea': [51.6214, -3.9436],
      'Newport': [51.5880, -2.9978],
      'Wrexham': [53.0430, -3.0018],
      'Bangor': [53.2274, -4.1293],
      'Valleys': [51.6800, -3.4200]
    };

    const baseCoord = regionalCoords[locationRegion] || [52.25, -3.8];
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

    try {
      await addOrganisation(newOrg);
      setOrganizations(prev => [newOrg, ...prev]);
      setFormSuccess(`Successfully mapped "${newOrg.name}" to Wales stage "${activeTab}"!`);
      
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

      setTimeout(() => {
        setIsAddOpen(false);
        setFormSuccess('');
        handleCardSelection(newOrg);
      }, 1500);
    } catch (e) {
      setFormError('Failed to save to database.');
    }
  };

  // Add Gap/Offer Handler
  const handleGapSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGapError('');
    setGapSuccess('');

    if (!gapForm.title.trim()) {
      setGapError('Please provide a descriptive title.');
      return;
    }
    if (!gapForm.content.trim()) {
      setGapError('Please explain the details.');
      return;
    }

    try {
      const added = await addGapOffer({
        ...gapForm,
        region: gapForm.region || undefined,
        category: gapForm.category || undefined,
        urgency: gapForm.urgency || undefined,
        workingWithOaha: gapForm.workingWithOaha
      });
      setGapsOffers(prev => [added, ...prev]);
      setGapSuccess('Successfully logged your community entry!');
      setGapForm({
        type: 'Gap',
        title: '',
        submittedBy: '',
        organization: '',
        contactEmail: '',
        content: '',
        assignedTab: 'Visibility',
        region: '',
        category: '',
        urgency: '',
        workingWithOaha: false
      });
      setTimeout(() => {
        setIsAddGapOpen(false);
        setGapSuccess('');
      }, 1500);
    } catch (err) {
      setGapError('Failed to submit entry.');
    }
  };

  // Add Commitment Handler
  const handleCommitSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCommitError('');
    setCommitSuccess('');

    if (!commitForm.title.trim()) {
      setCommitError('Please provide a commitment title.');
      return;
    }
    if (!commitForm.partnerName.trim()) {
      setCommitError('Please provide the partner organisation.');
      return;
    }

    try {
      const added = await addCommitment({
        ...commitForm,
        region: commitForm.region || undefined
      });
      setCommitments(prev => [added, ...prev]);
      setCommitSuccess('Successfully registered partner commitment!');
      setCommitForm({
        title: '',
        partnerName: '',
        owner: '',
        timescale: 'Q3 2026',
        progress: 'Drafting',
        nextSteps: '',
        dependencies: '',
        assignedTab: 'Visibility',
        region: ''
      });
      setTimeout(() => {
        setIsAddCommitOpen(false);
        setCommitSuccess('');
      }, 1500);
    } catch (err) {
      setCommitError('Failed to register commitment.');
    }
  };

  // Add Evidence Log Handler
  const handleEvidenceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEvidenceError('');
    setEvidenceSuccess('');

    if (!evidenceForm.title.trim()) {
      setEvidenceError('Please enter a descriptive log title.');
      return;
    }
    if (!evidenceForm.description.trim()) {
      setEvidenceError('Please enter the description of findings.');
      return;
    }

    try {
      const added = await addEvidenceLearning({
        ...evidenceForm,
        region: evidenceForm.region || undefined
      });
      setEvidenceLearning(prev => [added, ...prev]);
      setEvidenceSuccess('Successfully logged evidence & outcomes!');
      setEvidenceForm({
        title: '',
        logType: 'Community Feedback',
        assignedTab: 'Visibility',
        description: '',
        whatChanged: '',
        region: ''
      });
      setTimeout(() => {
        setIsAddEvidenceOpen(false);
        setEvidenceSuccess('');
      }, 1500);
    } catch (err) {
      setEvidenceError('Failed to save learning log.');
    }
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
    setContactSuccess('Message queued successfully! Our team will relay this to the partner.');

    setTimeout(() => {
      setContactOrg(null);
      setContactSuccess('');
    }, 1600);
  };

  // Copy SQL script Helper
  const handleCopySql = () => {
    const sql = `-- CREATE ALL TABLES FOR WALES EMPLOYMENT ECOSYSTEM MAPPING
-- Paste this script directly in the Supabase SQL Editor and click 'Run'.

-- 1. Create Wales Organisations table
CREATE TABLE IF NOT EXISTS wales_organisations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  key_contact TEXT,
  current_projects_count INT,
  impact TEXT,
  looking_for_detail TEXT,
  latitude FLOAT,
  longitude FLOAT,
  assigned_tab TEXT,
  sector TEXT,
  looking_for TEXT,
  capacity_status TEXT,
  current_project TEXT,
  solutions TEXT[],
  description TEXT,
  contact_email TEXT,
  website TEXT,
  working_with_oaha BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Gaps, Offers & Requests table
CREATE TABLE IF NOT EXISTS wales_gaps_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'Gap', 'Offer', 'Request', 'Collaboration', 'Evidence'
  title TEXT NOT NULL,
  submitted_by TEXT,
  organization TEXT,
  contact_email TEXT,
  content TEXT NOT NULL,
  assigned_tab TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Commitment Tracker table
CREATE TABLE IF NOT EXISTS wales_commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  owner TEXT,
  timescale TEXT,
  progress TEXT DEFAULT 'Drafting', -- 'Drafting', 'Active Pilot', 'Completed'
  next_steps TEXT,
  dependencies TEXT,
  assigned_tab TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Evidence and Learning Log table
CREATE TABLE IF NOT EXISTS wales_evidence_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  log_type TEXT NOT NULL, -- 'Community Feedback', 'Outcome Metric', 'Barrier', 'Key Decision', 'Learning'
  assigned_tab TEXT,
  description TEXT NOT NULL,
  what_changed TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Open public access policies (for prototype simplicity)
ALTER TABLE wales_organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wales_gaps_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wales_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wales_evidence_learning ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on organisations" ON wales_organisations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on organisations" ON wales_organisations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on gaps" ON wales_gaps_offers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on gaps" ON wales_gaps_offers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on commitments" ON wales_commitments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on commitments" ON wales_commitments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on learning" ON wales_evidence_learning FOR SELECT USING (true);
CREATE POLICY "Allow public insert on learning" ON wales_evidence_learning FOR INSERT WITH CHECK (true);
`;
    navigator.clipboard.writeText(sql);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  const activeTabClass = (tab: AlphaTab) => {
    return currentAlphaTab === tab 
      ? 'border-[#2E536B] text-[#2E536B] bg-[#2E536B]/5 font-semibold' 
      : 'border-transparent text-[#51615a] hover:text-[#1a2521] hover:bg-gray-50';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbf9] font-sans antialiased text-[#1a2521]">
      
      {/* HEADER */}
      <header className="flex-none border-b border-[#e1e1db] bg-white px-6 py-5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo className="w-14 h-14" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a2521] tracking-tight">
                Wales Employment Ecosystem Mapping
              </h1>
              <p className="text-xs text-[#51615a] mt-0.5 max-w-2xl">
                A dynamic shared digital environment validating insights, connecting priorities, tracking commitments, and logging outcomes.
              </p>
            </div>
          </div>

          {/* Utility Action Bar */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Database Control Buttons */}
            <div className="flex items-center gap-2 bg-gray-50 border border-[#e1e1db] rounded-xl px-3 py-1.5 shadow-xs text-xs">
              <span className="text-[10px] font-medium text-[#51615a]">Database Status</span>
              <span className="text-[#e1e1db] text-xs">|</span>
              <button 
                onClick={refreshAllData}
                disabled={checkingDb}
                title="Refresh database connection status"
                className="text-[#51615a] hover:text-[#2E536B] p-0.5 rounded transition cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingDb ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Profile Action Trigger */}
            {currentUser ? (
              <button
                onClick={() => setIsProfileViewOpen(true)}
                className="px-3.5 py-1.5 bg-sky-50 border border-sky-200 text-sky-800 rounded-xl flex items-center gap-2 hover:bg-sky-100/80 transition cursor-pointer text-xs font-semibold shadow-3xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></div>
                {currentUser.type === 'organisation' && <Building2 className="w-3.5 h-3.5 text-sky-700" />}
                {currentUser.type === 'business' && <Briefcase className="w-3.5 h-3.5 text-indigo-700" />}
                {currentUser.type === 'individual' && <User className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthAlertMessage('');
                  setIsLoginModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#2E536B] hover:bg-[#2E536B]/90 text-white rounded-xl flex items-center gap-1.5 transition cursor-pointer text-xs font-bold shadow-3xs"
              >
                <User className="w-3.5 h-3.5 text-white" />
                <span>Log In / Profile</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SIX MINIMUM ALPHA VIEW TABS SELECTOR */}
      <nav className="flex-none bg-white border-b border-[#e1e1db] px-6 sticky top-0 z-20 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex gap-1 py-2">
          <button onClick={() => setCurrentAlphaTab('overview')} className={`px-4 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTabClass('overview')}`}>
            <Activity className="w-4 h-4" />
            <span>Place overview</span>
          </button>
          <button onClick={() => setCurrentAlphaTab('journey')} className={`px-4 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTabClass('journey')}`}>
            <Globe className="w-4 h-4" />
            <span>Journey diagnostic</span>
          </button>
          <button onClick={() => setCurrentAlphaTab('directory')} className={`px-4 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTabClass('directory')}`}>
            <MapPin className="w-4 h-4" />
            <span>Organisation directory</span>
          </button>
          <button onClick={() => setCurrentAlphaTab('gaps_offers')} className={`px-4 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTabClass('gaps_offers')}`}>
            <AlertTriangle className="w-4 h-4" />
            <span>Gaps, offers & requests</span>
          </button>
          <button onClick={() => setCurrentAlphaTab('commitments')} className={`px-4 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTabClass('commitments')}`}>
            <ClipboardList className="w-4 h-4" />
            <span>Commitment tracker</span>
          </button>
          <button onClick={() => setCurrentAlphaTab('evidence_learning')} className={`px-4 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTabClass('evidence_learning')}`}>
            <BookOpen className="w-4 h-4" />
            <span>Evidence & learning log</span>
          </button>
        </div>
      </nav>

      {/* MAIN SWITCHBOARD CONTAINER */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">

        {/* 1. PLACE OVERVIEW PANEL */}
        {currentAlphaTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Interactive User Welcome / Onboarding Card */}
            {currentUser ? (
              <div className="bg-[#e0f2fe]/30 border border-sky-100 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs animate-fadeIn">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-700 flex-shrink-0 mt-1">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1a2521]">Croeso, {currentUser.name}!</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-sky-100 border-sky-300 text-sky-800 uppercase tracking-wider">
                        Active {currentUser.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#51615a] mt-1 leading-relaxed max-w-2xl">
                      Your Wales Employment Ecosystem workspace is active. You have bookmarked <span className="font-bold text-sky-800">{currentUser.savedItems?.length || 0} items</span>. Keep mapping priorities, tracking partner commitments, or log a gap to accelerate collaboration.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">
                  <button
                    onClick={() => setCurrentAlphaTab('gaps_offers')}
                    className="flex-1 md:flex-initial px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                  >
                    <span>Browse Gaps & Offers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsProfileViewOpen(true)}
                    className="px-3.5 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-sky-800 font-semibold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-[#e1e1db] rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 flex-shrink-0 mt-1">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1a2521]">Join the Wales Employment Ecosystem</h3>
                    <p className="text-xs text-[#51615a] mt-1 leading-relaxed max-w-2xl">
                      Create an Organisation, Business, or Individual profile in seconds to access saving/bookmarking capabilities, pre-populate publication forms, and track your active contributions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAuthAlertMessage('');
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full md:w-auto px-4 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/90 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <span>Set Up Your Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Place Outcomes Summary */}
            <div className="w-full bg-white rounded-2xl border border-[#e1e1db] p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#2E536B]/10 rounded-lg text-[#2E536B]">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-[#1a2521]">Wales Use Case (Active Alpha)</h2>
              </div>
              
              <p className="text-xs text-[#51615a] leading-relaxed">
                The initial alpha focuses on <strong>Wales</strong>, mapping youth journeys from education into employment and future workforce opportunities. This dashboard serves as a controlled, working prototype co-designed with Welsh partners to test whether a shared platform can accelerate place-based mobilisation from <strong>Insight → Priority → Pilot → Learning</strong>.
              </p>

              <div className="border-t border-[#e1e1db] pt-4 space-y-3">
                <h3 className="text-xs font-bold text-[#1a2521] uppercase tracking-wide">Target Priority Outcomes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <div className="p-1 bg-[#2E536B]/10 rounded-lg text-[#2E536B] mt-0.5">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#1a2521]">Reducing NEET Rate</h4>
                      <p className="text-[10px] text-[#51615a] mt-0.5">Reducing youth economic inactivity in former industrial valleys and isolated coastal cities.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <div className="p-1 bg-[#3AB03A]/10 rounded-lg text-[#3AB03A] mt-0.5">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#1a2521]">Green & Tech Pathways</h4>
                      <p className="text-[10px] text-[#51615a] mt-0.5">Directing vocational pathways towards high-growth Net Zero clean energy and digital tech industries.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <div className="p-1 bg-[#FF9900]/10 rounded-lg text-[#FF9900] mt-0.5">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#1a2521]">Bilingual Competency</h4>
                      <p className="text-[10px] text-[#51615a] mt-0.5">Integrating Welsh language and community identity as structural components of career discovery.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <div className="p-1 bg-[#9E2A2B]/10 rounded-lg text-[#9E2A2B] mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#1a2521]">Co-ordinated Handover</h4>
                      <p className="text-[10px] text-[#51615a] mt-0.5">Strengthening agency handovers so young learners don’t fall out of pipelines at transitions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Ecosystem Health Board */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e1e1db] rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-[#51615a]">Mapped Initiatives</span>
                <p className="text-2xl font-bold text-[#1a2521]">{organizations.length}</p>
              </div>
              <div className="bg-white border border-[#e1e1db] rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-[#51615a]">Gaps & Offers</span>
                <p className="text-2xl font-bold text-[#1a2521]">{gapsOffers.length}</p>
              </div>
              <div className="bg-white border border-[#e1e1db] rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-[#51615a]">Agreed Commitments</span>
                <p className="text-2xl font-bold text-[#1a2521]">{commitments.length}</p>
              </div>
              <div className="bg-white border border-[#e1e1db] rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-[#51615a]">Evidence Logs</span>
                <p className="text-2xl font-bold text-[#1a2521]">{evidenceLearning.length}</p>
              </div>
            </div>

            {/* Dynamic Alpha Setup Assistant (Help user set up Supabase) */}
            {!dbStatus.connected && (
              <div className="bg-white rounded-2xl border border-[#e1e1db] overflow-hidden shadow-xs">
                <div className="bg-[#1a2521] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-white">Alpha Setup: Supabase SQL Provisioning</h3>
                      <p className="text-[11px] text-gray-300">Run this SQL directly in your Supabase SQL editor to create all tables for the prototype.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="px-3.5 py-1.5 bg-[#2E536B] hover:bg-[#2E536B]/80 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {sqlCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                    <span>{sqlCopied ? 'SQL Copied!' : 'Copy SQL Script'}</span>
                  </button>
                </div>

                <div className="p-6 bg-slate-900/5 text-xs text-[#1a2521] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-thin border-t border-[#e1e1db]">
  {`-- COPY AND PASTE THIS SCRIPT IN SUPABASE SQL EDITOR:
  CREATE TABLE IF NOT EXISTS wales_organisations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    address TEXT,
    key_contact TEXT,
    current_projects_count INT,
    impact TEXT,
    looking_for_detail TEXT,
    latitude FLOAT,
    longitude FLOAT,
    assigned_tab TEXT,
    sector TEXT,
    looking_for TEXT,
    capacity_status TEXT,
    current_project TEXT,
    solutions TEXT[],
    description TEXT,
    contact_email TEXT,
    website TEXT,
    working_with_oaha BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS wales_gaps_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    submitted_by TEXT,
    organization TEXT,
    contact_email TEXT,
    content TEXT NOT NULL,
    assigned_tab TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS wales_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    owner TEXT,
    timescale TEXT,
    progress TEXT DEFAULT 'Drafting',
    next_steps TEXT,
    dependencies TEXT,
    assigned_tab TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS wales_evidence_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    log_type TEXT NOT NULL,
    assigned_tab TEXT,
    description TEXT NOT NULL,
    what_changed TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Turn on public RLS or access control
  ALTER TABLE wales_organisations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE wales_gaps_offers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE wales_commitments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE wales_evidence_learning ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow public select on organisations" ON wales_organisations FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on organisations" ON wales_organisations FOR INSERT WITH CHECK (true);

  CREATE POLICY "Allow public select on gaps" ON wales_gaps_offers FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on gaps" ON wales_gaps_offers FOR INSERT WITH CHECK (true);

  CREATE POLICY "Allow public select on commitments" ON wales_commitments FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on commitments" ON wales_commitments FOR INSERT WITH CHECK (true);

  CREATE POLICY "Allow public select on learning" ON wales_evidence_learning FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on learning" ON wales_evidence_learning FOR INSERT WITH CHECK (true);`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. JOURNEY & PATHWAY DIAGNOSTIC VIEW */}
        {currentAlphaTab === 'journey' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Embedded Active Journey Selector */}
            <div className="bg-white rounded-2xl border border-[#e1e1db] p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-[#1a2521] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#2E536B]" />
                <span>Life Stage Diagnostic View</span>
              </h2>
              <p className="text-xs text-[#51615a]">
                Select any stage along the young person’s pathway to drill down into corresponding friction points, existing provisions, active solutions, and aggregated local metrics.
              </p>
              
              <LearnerJourneyFlow
                activeTab={activeTab}
                onTabSelect={(tabId) => {
                  setActiveTab(tabId);
                  setSelectedOrgId(null);
                }}
                tabColorHex={tabColorHex}
              />
            </div>

            {/* Selected Stage Detail Deck */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Needs & Barriers */}
              <div className="bg-white border border-[#e1e1db] rounded-2xl p-6 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-xs font-bold uppercase tracking-wide">Systemic Needs & Barriers</h3>
                </div>
                <p className="text-xs text-[#1a2521] font-semibold">"{activeTabInfo.description}"</p>
                <div className="text-xs text-[#51615a] leading-relaxed pt-2 space-y-2">
                  <p>In this phase, young learners face repeated disconnects. The primary barrier involves a lack of local context-aware communication, leaving them unaware of active apprenticeships and green vocational pathways.</p>
                  <p className="border-l-2 border-rose-400 pl-3 italic text-[11px]">"We hear from youth that transport hurdles after hours prevent them from ever visiting county career events."</p>
                </div>
              </div>

              {/* Active Solutions Mapping */}
              <div className="bg-white border border-[#e1e1db] rounded-2xl p-6 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#2E536B]">
                  <Activity className="w-5 h-5" />
                  <h3 className="text-xs font-bold uppercase tracking-wide">Ecosystem Solutions</h3>
                </div>
                <p className="text-xs text-[#51615a] leading-relaxed">
                  How our mapped partners address this stage's core friction:
                </p>
                <ul className="text-xs text-[#51615a] space-y-2 pl-4 list-disc">
                  <li>Deploying mobile digital outreach units into rural cold spots.</li>
                  <li>Engaging local influencers and carers early to demystify STEM roles.</li>
                  <li>Drafting clear Welsh-bilingual storytelling materials with school networks.</li>
                </ul>
              </div>

              {/* Metrics & Insight Indicators */}
              <div className="bg-[#2E536B]/5 border border-[#2E536B]/15 rounded-2xl p-6 space-y-3 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-[#2E536B]">Active Stage Statistics</h3>
                  <div className="pt-2 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#51615a]">Mapped initiatives:</span>
                      <strong className="text-sm font-bold text-[#1a2521]">{stats.tabCounts[activeTab] || 0}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#51615a]">Commitments logged:</span>
                      <strong className="text-sm font-bold text-[#1a2521]">
                        {commitments.filter(c => c.assignedTab === activeTab).length}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#51615a]">Gaps/Requests active:</span>
                      <strong className="text-sm font-bold text-[#1a2521]">
                        {gapsOffers.filter(g => g.assignedTab === activeTab).length}
                      </strong>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentAlphaTab('directory')}
                  className="mt-4 w-full py-1.5 bg-[#2E536B]/10 hover:bg-[#2E536B]/20 text-[#2E536B] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Explore Stage Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* 3. ORGANISATION DIRECTORY VIEW */}
        {/* We use visibility controls so Leaflet map container does not unmount */}
        <div className={currentAlphaTab === 'directory' ? 'block' : 'hidden'}>
          <div className="space-y-6 animate-fadeIn">
            
            {/* Interactive Stage selector inside Directory */}
            <div className="bg-white rounded-2xl border border-[#e1e1db] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-[#51615a] uppercase tracking-wide">Filter Directory by Stage</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SYSTEMIC_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedOrgId(null);
                      }}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#2E536B] text-white border-[#2E536B]'
                          : 'bg-white hover:bg-gray-50 text-[#51615a] border-[#e1e1db]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsAddOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition duration-150 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Mapped Initiative</span>
              </button>
            </div>

            {/* Split Map & List layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Map Panel (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div id="wales-map-container" className="w-full flex flex-col h-[400px] md:h-[550px] rounded-2xl overflow-hidden border border-[#e1e1db] shadow-xs relative bg-[#fbfbf9]">
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e1e1db] shadow-xs text-[11px] flex items-center gap-2 text-[#1a2521]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColorHex }}></span>
                    <span>Plotting <strong>{filteredOrganizations.length}</strong> pins in Wales</span>
                  </div>

                  <div className="absolute top-3 right-3 z-[1000] hidden sm:flex items-center gap-2">
                    <span className="text-[10px] text-[#51615a] bg-white/95 border border-[#e1e1db] px-2.5 py-1.5 rounded-xl shadow-xs font-medium">
                      Sector: Tech (T) | Green (G) | Creative (C) | Foundational (F)
                    </span>
                  </div>

                  <div id="wales-leaflet-map" className="w-full h-full min-h-[350px]" style={{ touchAction: 'none' }} />

                  {filteredOrganizations.length === 0 && (
                    <div className="absolute inset-0 z-[999] bg-white/95 backdrop-blur-xs flex items-center justify-center p-6 text-center">
                      <div className="max-w-sm">
                        <HelpCircle className="w-10 h-10 text-[#51615a] mx-auto mb-2" />
                        <h3 className="text-sm font-semibold text-[#1a2521]">No stage pins plotted</h3>
                        <p className="text-xs text-[#51615a] mt-1">Adjust filters or register an initiative to plot markers on this section of Wales.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Connect CTA */}
                <div className="bg-gradient-to-br from-[#2E536B]/5 to-[#2E536B]/10 border border-[#2E536B]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-xs font-bold text-[#1a2521]">Want to scale your impact with Wales Ecosystem?</h4>
                    <p className="text-[11px] text-[#51615a]">Partner with the OAHA Ecosystem Team to unify local workforce pathways.</p>
                  </div>
                  <button 
                    onClick={() => handleOpenContact({ id: 'org-oaha', name: 'OAHA Wales Team' } as any, 'Hello! We want to apply as local partners.')}
                    className="px-4 py-1.5 bg-[#2E536B] hover:bg-[#2E536B]/90 text-white rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition"
                  >
                    Partner with OAHA
                  </button>
                </div>
              </div>

              {/* Directory Filter & List Panel (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Search / Filters panel */}
                <div className="bg-white border border-[#e1e1db] rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search organisations, locations, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#51615a] uppercase">Sector</label>
                      <select
                        value={sectorFilter}
                        onChange={(e) => setSectorFilter(e.target.value)}
                        className="w-full mt-1 px-2 py-1.5 text-xs border border-[#e1e1db] rounded-lg focus:outline-none focus:border-[#2E536B] bg-white"
                      >
                        <option value="All">All Sectors</option>
                        <option value="Tech/Digital">Tech / Digital</option>
                        <option value="Green Economy">Green Economy</option>
                        <option value="Creative">Creative</option>
                        <option value="Foundational">Foundational</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#51615a] uppercase">Looking For</label>
                      <select
                        value={lookingForFilter}
                        onChange={(e) => setLookingForFilter(e.target.value)}
                        className="w-full mt-1 px-2 py-1.5 text-xs border border-[#e1e1db] rounded-lg focus:outline-none focus:border-[#2E536B] bg-white"
                      >
                        <option value="All">All Demands</option>
                        <option value="Funding">Funding</option>
                        <option value="Referrals">Referrals</option>
                        <option value="Employer Partners">Employer Partners</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Organisations Scroll List */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {loadingOrgs ? (
                    <div className="py-12 text-center text-xs text-[#51615a]">Loading local directory...</div>
                  ) : filteredOrganizations.length === 0 ? (
                    <div className="bg-white border border-[#e1e1db] rounded-2xl p-8 text-center text-xs text-[#51615a]">
                      No organisations matched filters.
                    </div>
                  ) : (
                    filteredOrganizations.map((org) => (
                      <div
                        key={org.id}
                        id={`card-${org.id}`}
                        onClick={() => setSelectedOrgId(org.id)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                          org.id === selectedOrgId
                            ? 'bg-white border-[#2E536B] shadow-sm ring-1 ring-[#2E536B]/20'
                            : 'bg-white hover:bg-gray-50 border-[#e1e1db]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-[#1a2521] leading-tight">{org.name}</h4>
                            <p className="text-[10px] text-[#51615a] mt-0.5">{org.location}</p>
                          </div>
                          {org.workingWithOaha && (
                            <span className="text-[8px] bg-amber-100 text-[#986430] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                              ★ OAHA Partner
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#1a2521] mt-2 font-medium">"{org.currentProject}"</p>

                        <div className="mt-3 pt-2.5 border-t border-[#e1e1db] flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#51615a]">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-medium">{org.sector}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailedOrg(org);
                            }}
                            className="text-[#2E536B] hover:underline font-bold"
                          >
                            Read Profile
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* 4. GAPS, OFFERS & REQUESTS BOARD */}
        {currentAlphaTab === 'gaps_offers' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header controls */}
            <div className="bg-white rounded-2xl border border-[#e1e1db] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#1a2521]">Gaps, Offers & Requests Board</h2>
                <p className="text-xs text-[#51615a]">A central collaborative ledger to identify systemic gaps and share local resource capabilities.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedRegionFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 shadow-3xs animate-fadeIn">
                    <Filter className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span>Region: {selectedRegionFilter.charAt(0).toUpperCase() + selectedRegionFilter.slice(1)} Wales</span>
                    <button 
                      onClick={() => setSelectedRegionFilter('All')} 
                      className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-1"
                      title="Clear region filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {gapCategoryFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 text-[10px] font-bold border border-indigo-200 shadow-3xs animate-fadeIn">
                    <Filter className="w-3.5 h-3.5 text-indigo-700 animate-pulse" />
                    <span>Category: {gapCategoryFilter.charAt(0).toUpperCase() + gapCategoryFilter.slice(1)}</span>
                    <button 
                      onClick={() => setGapCategoryFilter('All')} 
                      className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-1"
                      title="Clear category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {gapUrgencyFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200 shadow-3xs animate-fadeIn">
                    <Filter className="w-3.5 h-3.5 text-rose-700 animate-pulse" />
                    <span>Urgency: {gapUrgencyFilter.charAt(0).toUpperCase() + gapUrgencyFilter.slice(1)}</span>
                    <button 
                      onClick={() => setGapUrgencyFilter('All')} 
                      className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-1"
                      title="Clear urgency filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <select
                  value={gapTypeFilter}
                  onChange={(e) => setGapTypeFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#e1e1db] rounded-xl focus:outline-none bg-white text-[#51615a] font-medium"
                >
                  <option value="All">All Entry Types</option>
                  <option value="Gap">Systemic Gaps</option>
                  <option value="Offer">Active Offers</option>
                  <option value="Request">Resource Requests</option>
                  <option value="Collaboration">Collaboration Ideas</option>
                </select>

                <select
                  value={gapCategoryFilter}
                  onChange={(e) => setGapCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#e1e1db] rounded-xl focus:outline-none bg-white text-[#51615a] font-medium"
                >
                  <option value="All">All Categories (What Type)</option>
                  <option value="resource">Resource</option>
                  <option value="job">Job / Placement</option>
                  <option value="funding">Funding / Grant</option>
                  <option value="others">Others</option>
                </select>

                <select
                  value={gapUrgencyFilter}
                  onChange={(e) => setGapUrgencyFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#e1e1db] rounded-xl focus:outline-none bg-white text-[#51615a] font-medium"
                >
                  <option value="All">All Urgencies</option>
                  <option value="urgent">Urgent</option>
                  <option value="not urgent">Not Urgent</option>
                </select>

                <button
                  onClick={handleOpenAddGap}
                  className="px-4 py-2 bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer ml-auto"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Log Entry</span>
                </button>
              </div>
            </div>

            {/* Heatmap Visualization Block */}
            <GapsHeatmap 
              gapsOffers={gapsOffers}
              filteredGapsOffers={filteredGapsOffers}
              organizations={organizations}
              selectedRegionFilter={selectedRegionFilter}
              onRegionFilterChange={setSelectedRegionFilter}
            />

            {/* Submissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingGaps ? (
                <div className="col-span-full py-12 text-center text-xs text-[#51615a]">Loading submissions...</div>
              ) : filteredGapsOffers.length === 0 ? (
                <div className="col-span-full bg-white border border-[#e1e1db] rounded-2xl p-12 text-center text-xs text-[#51615a]">
                  No logged submissions match this category or region filter.
                </div>
              ) : (
                filteredGapsOffers.map((item) => {
                  let badgeColor = 'bg-rose-50 border-rose-200 text-rose-700';
                  if (item.type === 'Offer') {
                    badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                  } else if (item.type === 'Request') {
                    badgeColor = 'bg-amber-50 border-amber-200 text-amber-700';
                  } else if (item.type === 'Collaboration') {
                    badgeColor = 'bg-blue-50 border-blue-200 text-blue-700';
                  } else if (item.type === 'Evidence') {
                    badgeColor = 'bg-purple-50 border-purple-200 text-purple-700';
                  }

                  const itemCategory = item.category || getCategoryForGapOffer(item);
                  const itemUrgency = item.urgency || getUrgencyForGapOffer(item);
                  const itemRegion = item.region || getRegionForGapOffer(item);
                  const isOahaPartner = !!item.workingWithOaha || (!!item.organization && organizations.some(o => o.name && o.name.toLowerCase() === item.organization.toLowerCase() && o.workingWithOaha));

                  // Colors for category
                  let catColor = 'bg-slate-50 border-slate-200 text-slate-700';
                  if (itemCategory === 'resource') catColor = 'bg-indigo-50 border-indigo-200 text-indigo-700';
                  else if (itemCategory === 'job') catColor = 'bg-sky-50 border-sky-200 text-sky-700';
                  else if (itemCategory === 'funding') catColor = 'bg-amber-50 border-amber-200 text-amber-700';

                  // Colors for urgency
                  let urgColor = itemUrgency === 'urgent' 
                    ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold' 
                    : 'bg-gray-50 border-gray-200 text-gray-500';

                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-[#e1e1db] p-5 flex flex-col justify-between space-y-4 hover:shadow-xs transition duration-200">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                              {item.type}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md border capitalize font-medium ${catColor}`}>
                              {itemCategory}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md border capitalize font-medium ${urgColor}`}>
                              {itemUrgency}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-gray-400 font-mono">Stage: {item.assignedTab}</span>
                            <button
                              onClick={() => toggleSaveItem(item.id)}
                              title={currentUser?.savedItems?.includes(item.id) ? "Remove from Profile bookmarks" : "Save/Bookmark to Profile"}
                              className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                                currentUser?.savedItems?.includes(item.id)
                                  ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                                  : 'bg-white border-[#e1e1db] text-gray-400 hover:text-amber-500 hover:border-amber-300'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" fill={currentUser?.savedItems?.includes(item.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {itemRegion && (
                            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 uppercase tracking-wide">
                              📍 {itemRegion.toUpperCase()} WALES
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-[#1a2521] leading-snug">{item.title}</h4>
                        </div>
                        
                        <p className="text-[11px] text-[#51615a] leading-relaxed line-clamp-4">
                          {item.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#e1e1db] flex items-center justify-between text-[10px] text-[#51615a]">
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-[#1a2521]">{item.organization || 'Individual partner'}</p>
                            {isOahaPartner && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] bg-amber-100 text-[#986430] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                ★ OAHA Partner
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-gray-400 mt-0.5">By {item.submittedBy || 'Anonymous'}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDetailedGap(item)}
                            className="text-[#2E536B] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View details</span>
                          </button>

                          {item.contactEmail && (
                            <button
                              onClick={() => handleOpenContact({ id: 'org-gap-relay', name: item.organization || 'Partner' } as any, `Hi ${item.submittedBy}, I saw your ${item.type} on the Wales Ecosystem Mapping platform: "${item.title}". We want to collaborate.`)}
                              className="text-[#2E536B] hover:underline font-bold flex items-center gap-0.5 cursor-pointer border-l border-gray-200 pl-2"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Contact</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* 5. COMMITMENT & PILOT TRACKER VIEW */}
        {currentAlphaTab === 'commitments' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header section */}
            <div className="bg-white rounded-2xl border border-[#e1e1db] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#1a2521]">Action Commitment & Pilot Tracker</h2>
                <p className="text-xs text-[#51615a]">Tracks tangible delivery targets, responsible partner leads, timescales, and current pilot metrics.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {selectedRegionFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 shadow-3xs animate-fadeIn">
                    <Filter className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span>Region: {selectedRegionFilter.charAt(0).toUpperCase() + selectedRegionFilter.slice(1)} Wales</span>
                    <button 
                      onClick={() => setSelectedRegionFilter('All')} 
                      className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-1"
                      title="Clear region filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                <select
                  value={commitProgressFilter}
                  onChange={(e) => setCommitProgressFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#e1e1db] rounded-xl focus:outline-none bg-white text-[#51615a]"
                >
                  <option value="All">All Progress Stages</option>
                  <option value="Drafting">Drafting</option>
                  <option value="Active Pilot">Active Pilot</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={() => setIsAddCommitOpen(true)}
                  className="px-4 py-2 bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Record Commitment</span>
                </button>
              </div>
            </div>

            {/* Commitments Table Board */}
            <div className="bg-white border border-[#e1e1db] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#e1e1db] text-[#51615a]">
                      <th className="p-4 font-bold">Action / Pilot Target</th>
                      <th className="p-4 font-bold">Partner Organisations</th>
                      <th className="p-4 font-bold">Lead Owner</th>
                      <th className="p-4 font-bold">Timescale</th>
                      <th className="p-4 font-bold">Stage Fit</th>
                      <th className="p-4 font-bold">Progress</th>
                      <th className="p-4 font-bold text-right">Dependencies / Next steps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1e1db]">
                    {loadingCommitments ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#51615a]">Loading commitments...</td>
                      </tr>
                    ) : filteredCommitments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#51615a]">No commitments logged match this progress or region filter.</td>
                      </tr>
                    ) : (
                      filteredCommitments.map((item) => {
                        let statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        if (item.progress === 'Active Pilot') {
                          statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                        } else if (item.progress === 'Completed') {
                          statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
                        }

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 font-semibold text-[#1a2521] max-w-xs">{item.title}</td>
                            <td className="p-4 text-[#51615a]">{item.partnerName}</td>
                            <td className="p-4 text-[#1a2521] font-medium">{item.owner || '—'}</td>
                            <td className="p-4 text-[#51615a] whitespace-nowrap">{item.timescale}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#2E536B]/10 text-[#2E536B]">
                                {item.assignedTab}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                {item.progress}
                              </span>
                            </td>
                            <td className="p-4 text-right text-[10px] text-[#51615a] max-w-xs space-y-1">
                              <p className="font-semibold text-[#1a2521]">Steps: {item.nextSteps || '—'}</p>
                              {item.dependencies && <p className="text-gray-500 italic">Dep: {item.dependencies}</p>}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 6. EVIDENCE & LEARNING LOG VIEW */}
        {currentAlphaTab === 'evidence_learning' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header bar */}
            <div className="bg-white rounded-2xl border border-[#e1e1db] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#1a2521]">Evidence & Learning Log</h2>
                <p className="text-xs text-[#51615a]">Allows local partners to record real outcomes, lived-experience feedback, and key adaptive delivery decisions.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {selectedRegionFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 shadow-3xs animate-fadeIn">
                    <Filter className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span>Region: {selectedRegionFilter.charAt(0).toUpperCase() + selectedRegionFilter.slice(1)} Wales</span>
                    <button 
                      onClick={() => setSelectedRegionFilter('All')} 
                      className="hover:text-rose-600 transition p-0.5 cursor-pointer ml-1"
                      title="Clear region filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                <select
                  value={evidenceTypeFilter}
                  onChange={(e) => setEvidenceTypeFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#e1e1db] rounded-xl focus:outline-none bg-white text-[#51615a]"
                >
                  <option value="All">All Log Categories</option>
                  <option value="Community Feedback">Community Feedback</option>
                  <option value="Outcome Metric">Outcome Metric</option>
                  <option value="Barrier Encountered">Barrier Encountered</option>
                  <option value="Key Decision">Key Decision</option>
                  <option value="Delivery Learning">Delivery Learning</option>
                </select>

                <button
                  onClick={() => setIsAddEvidenceOpen(true)}
                  className="px-4 py-2 bg-[#2E536B] hover:bg-[#2E536B]/90 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Log Outcome</span>
                </button>
              </div>
            </div>

            {/* Timeline Log Feed */}
            <div className="space-y-4 max-w-3xl mx-auto">
              {loadingEvidence ? (
                <div className="py-12 text-center text-xs text-[#51615a]">Loading learning log timeline...</div>
              ) : filteredEvidenceLearning.length === 0 ? (
                <div className="bg-white border border-[#e1e1db] rounded-2xl p-12 text-center text-xs text-[#51615a]">
                  No evidence or learning entries logged matching this category or region filter.
                </div>
              ) : (
                filteredEvidenceLearning.map((log) => {
                  let badgeColor = 'bg-blue-50 border-blue-200 text-blue-700';
                  if (log.logType === 'Outcome Metric') {
                    badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                  } else if (log.logType === 'Barrier Encountered') {
                    badgeColor = 'bg-red-50 border-red-200 text-red-700';
                  } else if (log.logType === 'Key Decision') {
                    badgeColor = 'bg-purple-50 border-purple-200 text-purple-700';
                  } else if (log.logType === 'Delivery Learning') {
                    badgeColor = 'bg-amber-50 border-amber-200 text-amber-700';
                  }

                  return (
                    <div key={log.id} className="bg-white border border-[#e1e1db] rounded-2xl p-5 shadow-xs flex gap-4 hover:border-gray-300 transition duration-150 text-left">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-[#2E536B]/5 flex items-center justify-center text-[#2E536B]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="w-0.5 h-full bg-gray-100 mt-2"></div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                            {log.logType}
                          </span>
                          <span className="text-[9px] text-[#51615a] font-mono bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                            Stage: {log.assignedTab}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#1a2521] leading-snug">{log.title}</h4>
                        
                        <p className="text-[11px] text-[#51615a] leading-relaxed">
                          {log.description}
                        </p>

                        {log.whatChanged && (
                          <div className="p-3 bg-slate-50 border-l-2 border-[#2E536B] rounded-r-xl text-[10px] text-[#51615a] leading-normal">
                            <strong className="text-[#1a2521] block">Adaptation / What Changed:</strong>
                            {log.whatChanged}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          MODALS AND POPUP SHEETS
          ========================================================================= */}

      {/* MODAL 1: ADD INITIATIVE TO DIRECTORY */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-scaleIn text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#e1e1db]">
              <div>
                <h3 className="text-base font-bold text-[#1a2521]">Map New Welsh Initiative</h3>
                <p className="text-[11px] text-[#51615a] mt-0.5">Place your organisation directly into the Welsh journey pathway.</p>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <form onSubmit={handleAddInitiativeSubmit} className="space-y-4 pt-4 text-xs">
              {formError && <p className="text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl font-medium">{formError}</p>}
              {formSuccess && <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">{formSuccess}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Organisation Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. South Wales Coding Guild"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Economic Sector Focus</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B] bg-white"
                  >
                    <option value="Tech/Digital">Tech / Digital</option>
                    <option value="Green Economy">Green Economy</option>
                    <option value="Creative">Creative</option>
                    <option value="Foundational">Foundational</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Welsh Hub Region</label>
                  <select
                    name="locationRegion"
                    value={formData.locationRegion}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B] bg-white"
                  >
                    <option value="Cardiff">Cardiff (Capital Region)</option>
                    <option value="Swansea">Swansea (South West)</option>
                    <option value="Newport">Newport (Southeast)</option>
                    <option value="Wrexham">Wrexham (Northeast)</option>
                    <option value="Bangor">Bangor (Northwest)</option>
                    <option value="Valleys">Valleys (Central Uplands)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Specific Town / City (Optional)</label>
                  <input
                    type="text"
                    name="customLocationName"
                    value={formData.customLocationName}
                    onChange={handleFormChange}
                    placeholder="e.g. Aberdare"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Brief Description *</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="What is your organisation's general objective in Wales?"
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Current Active Welsh Initiative *</label>
                <input
                  type="text"
                  name="currentProject"
                  value={formData.currentProject}
                  onChange={handleFormChange}
                  placeholder="e.g. Hosting bilingual code clubs at local community sports centres"
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Ecosystem Capacity Status</label>
                  <input
                    type="text"
                    name="capacityStatus"
                    value={formData.capacityStatus}
                    onChange={handleFormChange}
                    placeholder="e.g. Accepting Referrals"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Ecosystem Primary Need</label>
                  <select
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B] bg-white"
                  >
                    <option value="Referrals">Referrals</option>
                    <option value="Funding">Funding</option>
                    <option value="Employer Partners">Employer Partners</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Contact Email (Private / Internal)</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleFormChange}
                    placeholder="post@myorg.cymru"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleFormChange}
                    placeholder="https://myorg.cymru"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  name="workingWithOaha"
                  id="workingWithOaha"
                  checked={formData.workingWithOaha}
                  onChange={(e) => setFormData(prev => ({ ...prev, workingWithOaha: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#2E536B] focus:ring-[#2E536B]"
                />
                <label htmlFor="workingWithOaha" className="text-xs font-semibold text-[#51615a]">Is actively partnered with OAHA</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl shadow-xs transition duration-150 cursor-pointer text-center"
                >
                  Map & Save to Database
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-2.5 border border-[#e1e1db] hover:bg-gray-50 text-[#51615a] font-semibold rounded-xl transition cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG GAPS, OFFERS & REQUESTS ENTRY */}
      {isAddGapOpen && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-lg shadow-2xl p-6 md:p-8 animate-scaleIn text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#e1e1db]">
              <div>
                <h3 className="text-base font-bold text-[#1a2521]">Log Gaps, Offers & Requests Entry</h3>
                <p className="text-[11px] text-[#51615a] mt-0.5">Log support needed, active resource offers, or collaboration prompts.</p>
              </div>
              <button onClick={() => setIsAddGapOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <form onSubmit={handleGapSubmit} className="space-y-4 pt-4 text-xs">
              {gapError && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-xl">{gapError}</p>}
              {gapSuccess && <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xl">{gapSuccess}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Entry Type *</label>
                  <select
                    value={gapForm.type}
                    onChange={(e) => setGapForm(p => ({ ...p, type: e.target.value as SubmissionType }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Gap">Systemic Gap / Barrier</option>
                    <option value="Offer">Active Resource Offer</option>
                    <option value="Request">Resource Request</option>
                    <option value="Collaboration">Collaboration Idea</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Journey Stage Fit</label>
                  <select
                    value={gapForm.assignedTab}
                    onChange={(e) => setGapForm(p => ({ ...p, assignedTab: e.target.value as FrictionPoint }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl bg-white focus:outline-none"
                  >
                    {SYSTEMIC_TABS.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase"> Descriptive Title *</label>
                <input
                  type="text"
                  value={gapForm.title}
                  onChange={(e) => setGapForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Free refurbished laptops for coding clubs"
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Details / Content Description *</label>
                <textarea
                  value={gapForm.content}
                  onChange={(e) => setGapForm(p => ({ ...p, content: e.target.value }))}
                  rows={4}
                  placeholder="Explain the systemic barriers faced, or specific quantities, tools, resources, timeline details..."
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Region Focus</label>
                <select
                  value={gapForm.region}
                  onChange={(e) => setGapForm(p => ({ ...p, region: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                >
                  <option value="">Auto-Detect from Text / General Wales</option>
                  <option value="north">North Wales</option>
                  <option value="mid">Mid Wales</option>
                  <option value="southwest">South West Wales</option>
                  <option value="southeast">South East Wales</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">What Type (Category)</label>
                  <select
                    value={gapForm.category}
                    onChange={(e) => setGapForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    <option value="">Auto-Detect from Text</option>
                    <option value="resource">Resource (hardware, space, mentoring, etc)</option>
                    <option value="job">Job / Placement / Apprenticeship</option>
                    <option value="funding">Funding / Grant / Finance</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Urgency Level</label>
                  <select
                    value={gapForm.urgency}
                    onChange={(e) => setGapForm(p => ({ ...p, urgency: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    <option value="">Auto-Detect from Text</option>
                    <option value="urgent">Urgent</option>
                    <option value="not urgent">Not Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Your Name</label>
                  <input
                    type="text"
                    value={gapForm.submittedBy}
                    onChange={(e) => setGapForm(p => ({ ...p, submittedBy: e.target.value }))}
                    placeholder="Gareth Jenkins"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Organisation Name</label>
                  <input
                    type="text"
                    value={gapForm.organization}
                    onChange={(e) => setGapForm(p => ({ ...p, organization: e.target.value }))}
                    placeholder="Cymru Youth Outreach"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Contact Email (Internal Relay)</label>
                <input
                  type="email"
                  value={gapForm.contactEmail}
                  onChange={(e) => setGapForm(p => ({ ...p, contactEmail: e.target.value }))}
                  placeholder="gareth@cyo.cymru"
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gapWorkingWithOaha"
                  checked={gapForm.workingWithOaha || false}
                  onChange={(e) => setGapForm(p => ({ ...p, workingWithOaha: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#2E536B] focus:ring-[#2E536B]"
                />
                <label htmlFor="gapWorkingWithOaha" className="text-xs font-semibold text-[#51615a]">Is actively partnered/collaborating with OAHA</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl cursor-pointer">
                  Save Entry
                </button>
                <button type="button" onClick={() => setIsAddGapOpen(false)} className="px-5 py-2.5 border border-[#e1e1db] text-[#51615a] font-semibold rounded-xl cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG COMMITMENTS */}
      {isAddCommitOpen && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-lg shadow-2xl p-6 md:p-8 animate-scaleIn text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#e1e1db]">
              <div>
                <h3 className="text-base font-bold text-[#1a2521]">Log Partner Commitment</h3>
                <p className="text-[11px] text-[#51615a] mt-0.5">Log actionable delivery outcomes agreed upon by local partners.</p>
              </div>
              <button onClick={() => setIsAddCommitOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <form onSubmit={handleCommitSubmit} className="space-y-4 pt-4 text-xs">
              {commitError && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-xl">{commitError}</p>}
              {commitSuccess && <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xl">{commitSuccess}</p>}

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Commitment / Pilot Title *</label>
                <input
                  type="text"
                  value={commitForm.title}
                  onChange={(e) => setCommitForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Sponsor 5 solar retrofitting apprenticeships in Rhondda"
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Partner Organisations *</label>
                  <input
                    type="text"
                    value={commitForm.partnerName}
                    onChange={(e) => setCommitForm(p => ({ ...p, partnerName: e.target.value }))}
                    placeholder="e.g. Green Valley Builders & Cardiff Council"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Lead Owner</label>
                  <input
                    type="text"
                    value={commitForm.owner}
                    onChange={(e) => setCommitForm(p => ({ ...p, owner: e.target.value }))}
                    placeholder="e.g. Owen Thomas"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Timescale Target</label>
                  <input
                    type="text"
                    value={commitForm.timescale}
                    onChange={(e) => setCommitForm(p => ({ ...p, timescale: e.target.value }))}
                    placeholder="e.g. Q4 2026"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Initial Status</label>
                  <select
                    value={commitForm.progress}
                    onChange={(e) => setCommitForm(p => ({ ...p, progress: e.target.value as any }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    <option value="Drafting">Drafting</option>
                    <option value="Active Pilot">Active Pilot</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Stage Fit</label>
                  <select
                    value={commitForm.assignedTab}
                    onChange={(e) => setCommitForm(p => ({ ...p, assignedTab: e.target.value as FrictionPoint }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    {SYSTEMIC_TABS.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Region Focus</label>
                  <select
                    value={commitForm.region}
                    onChange={(e) => setCommitForm(p => ({ ...p, region: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    <option value="">Auto-Detect / General Wales</option>
                    <option value="north">North Wales</option>
                    <option value="mid">Mid Wales</option>
                    <option value="southwest">South West Wales</option>
                    <option value="southeast">South East Wales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Dependencies</label>
                  <input
                    type="text"
                    value={commitForm.dependencies}
                    onChange={(e) => setCommitForm(p => ({ ...p, dependencies: e.target.value }))}
                    placeholder="e.g. Needs community fund grant"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Key Next Steps</label>
                <textarea
                  value={commitForm.nextSteps}
                  onChange={(e) => setCommitForm(p => ({ ...p, nextSteps: e.target.value }))}
                  rows={2}
                  placeholder="Specify immediate concrete tasks..."
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl cursor-pointer">
                  Register Commitment
                </button>
                <button type="button" onClick={() => setIsAddCommitOpen(false)} className="px-5 py-2.5 border border-[#e1e1db] text-[#51615a] font-semibold rounded-xl cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: LOG EVIDENCE / OUTCOME */}
      {isAddEvidenceOpen && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-lg shadow-2xl p-6 md:p-8 animate-scaleIn text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#e1e1db]">
              <div>
                <h3 className="text-base font-bold text-[#1a2521]">Log Evidence & Outcome</h3>
                <p className="text-[11px] text-[#51615a] mt-0.5">Log data insight, community feedback, or critical delivery learning.</p>
              </div>
              <button onClick={() => setIsAddEvidenceOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <form onSubmit={handleEvidenceSubmit} className="space-y-4 pt-4 text-xs">
              {evidenceError && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-xl">{evidenceError}</p>}
              {evidenceSuccess && <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xl">{evidenceSuccess}</p>}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Evidence Type *</label>
                  <select
                    value={evidenceForm.logType}
                    onChange={(e) => setEvidenceForm(p => ({ ...p, logType: e.target.value as any }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    <option value="Community Feedback">Lived Experience Feedback</option>
                    <option value="Outcome Metric">Outcome Metric</option>
                    <option value="Barrier Encountered">Barrier Encountered</option>
                    <option value="Key Decision">Strategic Decision</option>
                    <option value="Delivery Learning">Delivery Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Journey Stage Fit</label>
                  <select
                    value={evidenceForm.assignedTab}
                    onChange={(e) => setEvidenceForm(p => ({ ...p, assignedTab: e.target.value as FrictionPoint }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    {SYSTEMIC_TABS.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#51615a] uppercase">Region Focus</label>
                  <select
                    value={evidenceForm.region}
                    onChange={(e) => setEvidenceForm(p => ({ ...p, region: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none"
                  >
                    <option value="">Auto-Detect / General Wales</option>
                    <option value="north">North Wales</option>
                    <option value="mid">Mid Wales</option>
                    <option value="southwest">South West Wales</option>
                    <option value="southeast">South East Wales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase"> Descriptive Title *</label>
                <input
                  type="text"
                  value={evidenceForm.title}
                  onChange={(e) => setEvidenceForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Transport limits engagement rates in Aberystwyth"
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">Insight Description / Finding *</label>
                <textarea
                  value={evidenceForm.description}
                  onChange={(e) => setEvidenceForm(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder="Detail aggregate findings, user voice statements, survey results, or barriers discovered..."
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#51615a] uppercase">What Changed / Strategic Adaptation</label>
                <textarea
                  value={evidenceForm.whatChanged}
                  onChange={(e) => setEvidenceForm(p => ({ ...p, whatChanged: e.target.value }))}
                  rows={2}
                  placeholder="e.g. Moving training times to 3:30 PM to align with local bus schedules."
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl cursor-pointer">
                  Log Evidence
                </button>
                <button type="button" onClick={() => setIsAddEvidenceOpen(false)} className="px-5 py-2.5 border border-[#e1e1db] text-[#51615a] font-semibold rounded-xl cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DETAILED ORGANISATION VIEW */}
      {detailedOrg && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-scaleIn text-left space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#2E536B] bg-[#2E536B]/5 px-2.5 py-1 rounded-md border border-[#2E536B]/15">
                  {detailedOrg.sector} Focus
                </span>
                <h3 className="text-base font-bold text-[#1a2521] pt-1.5">{detailedOrg.name}</h3>
                <p className="text-xs text-[#51615a] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{detailedOrg.address}</span>
                </p>
              </div>
              <button onClick={() => setDetailedOrg(null)} className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#51615a]">
              <div className="space-y-1">
                <h4 className="font-bold text-[#1a2521]">Our Profile Summary</h4>
                <p>{detailedOrg.description}</p>
              </div>

              {/* OAHA alignment / partnership status box */}
              <div>
                {detailedOrg.workingWithOaha ? (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 text-amber-800 rounded-2xl space-y-2">
                    <div className="flex items-center gap-1.5 border-b border-amber-200/50 pb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-900">OAHA partner</span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-amber-900">
                      <div>
                        <span className="block font-bold text-amber-950 text-[10px]">How we are working with OAHA:</span>
                        <p className="text-amber-800 leading-relaxed mt-0.5">Deploying joint initiatives for the {detailedOrg.assignedTab.toLowerCase()} stage, specifically: {detailedOrg.currentProject.toLowerCase()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200/30">
                        <div>
                          <span className="block font-bold text-amber-950 text-[9px] uppercase tracking-wider">Duration</span>
                          <span className="text-amber-800 text-[10px]">
                            {detailedOrg.id.includes('cyo') 
                              ? '18 months (since Jan 2025)' 
                              : detailedOrg.id.includes('clwyd') 
                                ? '12 months (since July 2025)'
                                : '10 months (since Sept 2025)'}
                          </span>
                        </div>
                        <div>
                          <span className="block font-bold text-amber-950 text-[9px] uppercase tracking-wider">Collaboration</span>
                          <span className="text-amber-800 text-[10px]">{detailedOrg.sector.toLowerCase()} sector integration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-2xl">
                    <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="text-[11px]">
                      <p className="font-bold text-[10px] uppercase tracking-wider text-gray-800">Not directly partnered with OAHA</p>
                      <p className="text-gray-500 mt-0.5 leading-relaxed">Independent participant in the wider Wales employment ecosystem.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-[#1a2521] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#2E536B]" />
                  <span>Current Active Welsh Project</span>
                </h4>
                <p className="font-medium text-[#1a2521]">"{detailedOrg.currentProject}"</p>
                <p className="text-[11px] text-[#51615a]"><strong>Ecosystem Impact:</strong> {detailedOrg.impact}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#1a2521]">Active Solutions Deployed for {detailedOrg.assignedTab}</h4>
                <ul className="space-y-1.5 pl-4 list-disc text-[11px]">
                  {detailedOrg.solutions.map((sol, index) => (
                    <li key={index}>{sol}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-[#e1e1db] text-[11px]">
                <div>
                  <span className="block font-bold text-[#1a2521]">Key Contact Point</span>
                  <span className="text-slate-500">{detailedOrg.keyContact}</span>
                </div>
                <div>
                  <span className="block font-bold text-[#1a2521]">Ecosystem Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border text-[9px]">
                    {detailedOrg.capacityStatus}
                  </span>
                </div>
              </div>

              {detailedOrg.lookingForDetail && (
                <div className="p-3.5 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-[11px]">
                  <strong className="text-[#986430] block">Ecosystem Request ({detailedOrg.lookingFor}):</strong>
                  <p className="text-[#986430] mt-0.5">{detailedOrg.lookingForDetail}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#e1e1db] flex gap-3">
              <button
                onClick={() => {
                  setDetailedOrg(null);
                  handleOpenContact(detailedOrg);
                }}
                className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl text-xs transition cursor-pointer text-center"
              >
                Send Message
              </button>
              {detailedOrg.website && (
                <a
                  href={detailedOrg.website}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="px-5 py-2.5 border border-[#e1e1db] hover:bg-gray-50 text-[#51615a] font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5B: DETAILED VIEW FOR GAP, OFFER, REQUEST */}
      {detailedGap && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-xl shadow-2xl p-6 animate-scaleIn text-left flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#e1e1db]">
              <div className="space-y-1 pr-6">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-indigo-50 border-indigo-200 text-indigo-700 uppercase tracking-wider">
                    {detailedGap.type}
                  </span>
                  {detailedGap.category && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md border capitalize font-medium bg-slate-50 border-slate-200 text-slate-700">
                      Category: {detailedGap.category}
                    </span>
                  )}
                  {detailedGap.urgency && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md border capitalize font-medium ${detailedGap.urgency === 'urgent' ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                      {detailedGap.urgency}
                    </span>
                  )}
                  {detailedGap.region && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md border bg-gray-100 text-gray-700 border-gray-200 uppercase tracking-wide font-semibold">
                      📍 {detailedGap.region}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[#1a2521] leading-snug">{detailedGap.title}</h3>
                <p className="text-[10px] text-gray-400 font-mono">Stage Fit: {detailedGap.assignedTab} Wales</p>
              </div>
              <button 
                onClick={() => setDetailedGap(null)} 
                className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer flex-shrink-0"
              >
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-5 py-4 text-xs text-[#51615a] pr-1">
              
              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider">Full Details & Description</h4>
                <p className="text-xs text-[#1a2521] whitespace-pre-wrap leading-relaxed bg-[#fafafa] border border-gray-100 p-4 rounded-2xl">
                  {detailedGap.content}
                </p>
              </div>

              {/* metadata card: Contact and OAHA Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Contact information */}
                <div className="border border-[#e1e1db] rounded-2xl p-4 bg-white space-y-3">
                  <h4 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider">Contact Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] text-gray-400 block font-medium">Submitted By</span>
                      <span className="text-[11px] font-semibold text-[#1a2521]">{detailedGap.submittedBy || 'Anonymous Partner'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block font-medium">Organization</span>
                      <span className="text-[11px] font-bold text-[#1a2521]">{detailedGap.organization || 'Individual Partner'}</span>
                    </div>
                    {detailedGap.contactEmail && (
                      <div>
                        <span className="text-[9px] text-gray-400 block font-medium">Internal Relay Email</span>
                        <span className="text-[11px] font-semibold text-[#2E536B]">{detailedGap.contactEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* OAHA Partnership info */}
                <div className="border border-[#e1e1db] rounded-2xl p-4 bg-white flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider">OAHA Partnership</h4>
                    <p className="text-[11px] leading-relaxed text-gray-400">
                      Alignment status with the <strong className="text-[#1a2521]">One Wales One Health Alliance (OAHA)</strong> ecosystem framework.
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-3">
                    {detailedGapPartnershipInfo?.isOahaPartner ? (
                      <div className="p-3.5 bg-amber-50/70 border border-amber-200 text-amber-800 rounded-2xl space-y-2">
                        <div className="flex items-center gap-1.5 border-b border-amber-200/50 pb-1.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                          <span className="font-bold text-[10px] uppercase tracking-wider text-amber-900">OAHA partner</span>
                        </div>
                        <div className="space-y-1.5 text-[11px] text-amber-900">
                          <div>
                            <span className="block font-bold text-amber-950 text-[10px]">How we are working with OAHA:</span>
                            <p className="text-amber-800 leading-relaxed mt-0.5">{detailedGapPartnershipInfo.partnerFocus}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200/30">
                            <div>
                              <span className="block font-bold text-amber-950 text-[9px] uppercase tracking-wider">Duration</span>
                              <span className="text-amber-800 text-[10px]">{detailedGapPartnershipInfo.partnerDuration.toLowerCase()}</span>
                            </div>
                            <div>
                              <span className="block font-bold text-amber-950 text-[9px] uppercase tracking-wider">Collaboration</span>
                              <span className="text-amber-800 text-[10px]">{detailedGapPartnershipInfo.partnerScope.toLowerCase()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-2xl">
                        <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div className="text-[11px]">
                          <p className="font-bold text-[10px] uppercase tracking-wider text-gray-800">Not directly partnered with OAHA</p>
                          <p className="text-gray-500 mt-0.5 leading-relaxed">Independent participant in the wider Wales employment ecosystem.</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#e1e1db] flex gap-3">
              {detailedGap.contactEmail ? (
                <button
                  onClick={() => {
                    const subject = `Inquiry: ${detailedGap.title}`;
                    const body = `Hi ${detailedGap.submittedBy || 'Partner'},\n\nI saw your ${detailedGap.type} post: "${detailedGap.title}" on the Wales Ecosystem Mapping platform. I would love to connect and learn more about this.\n\nBest regards,\n[Your Name]`;
                    setDetailedGap(null);
                    handleOpenContact({ id: 'org-gap-relay', name: detailedGap.organization || 'Partner' } as any, body);
                  }}
                  className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Collaborative Message</span>
                </button>
              ) : (
                <div className="flex-1 text-center py-2.5 bg-gray-50 border border-gray-100 text-gray-400 font-semibold rounded-xl text-xs">
                  No direct email listed.
                </div>
              )}
              <button
                onClick={() => toggleSaveItem(detailedGap.id)}
                className={`px-4 py-2.5 border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  currentUser?.savedItems?.includes(detailedGap.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                    : 'bg-white border-[#e1e1db] hover:bg-gray-50 text-[#51615a]'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={currentUser?.savedItems?.includes(detailedGap.id) ? "currentColor" : "none"} />
                <span>{currentUser?.savedItems?.includes(detailedGap.id) ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
              <button
                onClick={() => setDetailedGap(null)}
                className="px-5 py-2.5 border border-[#e1e1db] hover:bg-gray-50 text-[#51615a] font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 6: CONTACT INITIATIVE */}
      {contactOrg && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-md shadow-2xl p-6 animate-scaleIn text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e1db]">
              <div>
                <h3 className="text-sm font-bold text-[#1a2521]">Direct Outreach Relay</h3>
                <p className="text-[11px] text-[#51615a]">Relay a prompt to: <span className="font-bold text-[#2E536B]">{contactOrg.name}</span></p>
              </div>
              <button onClick={() => setContactOrg(null)} className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4 pt-3.5 text-xs">
              {contactError && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-xl">{contactError}</p>}
              {contactSuccess && <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xl">{contactSuccess}</p>}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#51615a] uppercase">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="e.g. Sian Roberts"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#51615a] uppercase">Your Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="sian@mycompany.com"
                    className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#51615a] uppercase">Relationship Intent</label>
                <select
                  name="messageType"
                  value={contactForm.messageType}
                  onChange={handleContactChange}
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none focus:border-[#2E536B]"
                >
                  <option value="Collaboration">Joint Collaboration</option>
                  <option value="Referral Hub">Referral Pipeline</option>
                  <option value="Employer Partnership">Employer Apprentice Integration</option>
                  <option value="Sponsorship Support">Resource / Sponsorship Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#51615a] uppercase">Relayed Message *</label>
                <textarea
                  name="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={handleContactChange}
                  placeholder="Describe your collaborative opportunity or request. This will be securely routed straight to their key contact point..."
                  className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl transition duration-150 cursor-pointer text-center"
                >
                  Relay Prompt
                </button>
                <button
                  type="button"
                  onClick={() => setContactOrg(null)}
                  className="px-4 py-2.5 border border-[#e1e1db] text-[#51615a] font-semibold rounded-xl transition cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: LOGIN & REGISTRATION */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-lg shadow-2xl p-6 animate-scaleIn text-left flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e1db] flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-[#1a2521]">Ecosystem Partner Account</h3>
                <p className="text-[11px] text-[#51615a]">Set up your profile to bookmark items & simplify publishing.</p>
              </div>
              <button onClick={() => setIsLoginModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 py-4 text-xs">
              {authAlertMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-medium leading-relaxed">
                  ⚠️ {authAlertMessage}
                </div>
              )}

              {/* DEMO PROFILES SECTION */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider">Quick Login (Select Demo Actor)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {registeredProfiles.slice(0, 3).map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        setCurrentUser(profile);
                        localStorage.setItem('wales_alpha_user_profile', JSON.stringify(profile));
                        setIsLoginModalOpen(false);
                      }}
                      className="p-3 border border-[#e1e1db] hover:border-sky-300 rounded-2xl bg-slate-50 hover:bg-sky-50/30 text-left transition cursor-pointer flex flex-col justify-between h-24 space-y-1"
                    >
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-500">
                          {profile.type}
                        </span>
                        <h5 className="font-bold text-[#1a2521] mt-1.5 truncate text-[11px]">{profile.name}</h5>
                      </div>
                      <span className="text-[9px] text-[#51615a] truncate font-mono">📍 {profile.region} wales</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#e1e1db]"></div>
                <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Or Register Custom Profile</span>
                <div className="flex-grow border-t border-[#e1e1db]"></div>
              </div>

              {/* REGISTRATION FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRegError('');
                  setRegSuccess('');

                  if (!regForm.name.trim()) {
                    setRegError('Please enter your name or organisation name.');
                    return;
                  }
                  if (!regForm.contactEmail.trim() || !regForm.contactEmail.includes('@')) {
                    setRegError('Please enter a valid email address.');
                    return;
                  }

                  const newId = `user-custom-${Date.now()}`;
                  const customProfile: UserProfile = {
                    id: newId,
                    name: regForm.name.trim(),
                    type: regForm.type,
                    contactEmail: regForm.contactEmail.trim(),
                    region: regForm.region,
                    description: regForm.description.trim() || undefined,
                    sector: regForm.sector,
                    savedItems: []
                  };

                  const updatedProfiles = [...registeredProfiles, customProfile];
                  setRegisteredProfiles(updatedProfiles);
                  localStorage.setItem('wales_alpha_registered_profiles', JSON.stringify(updatedProfiles));

                  setCurrentUser(customProfile);
                  localStorage.setItem('wales_alpha_user_profile', JSON.stringify(customProfile));

                  setRegSuccess('Profile successfully created! Logging you in...');
                  setTimeout(() => {
                    setIsLoginModalOpen(false);
                    setRegSuccess('');
                    setRegForm({
                      name: '',
                      type: 'organisation',
                      contactEmail: '',
                      region: 'north',
                      description: '',
                      sector: 'Tech/Digital'
                    });
                  }, 1200);
                }}
                className="space-y-4"
              >
                {regError && <p className="text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl">{regError}</p>}
                {regSuccess && <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">{regSuccess}</p>}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#51615a] uppercase">Name / Organisation Name *</label>
                    <input
                      type="text"
                      required
                      value={regForm.name}
                      onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Eryri Tech Hub"
                      className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#51615a] uppercase">Profile Type</label>
                    <select
                      value={regForm.type}
                      onChange={(e) => setRegForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none focus:border-[#2E536B]"
                    >
                      <option value="organisation">Organisation / OAHA Partner</option>
                      <option value="individual">Individual Practitioner</option>
                      <option value="business">Local Business / Employer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#51615a] uppercase">Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={regForm.contactEmail}
                      onChange={(e) => setRegForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="e.g. contact@eryri.wales"
                      className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#51615a] uppercase">Primary Welsh Region</label>
                    <select
                      value={regForm.region}
                      onChange={(e) => setRegForm(prev => ({ ...prev, region: e.target.value as any }))}
                      className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none focus:border-[#2E536B]"
                    >
                      <option value="north">North Wales</option>
                      <option value="mid">Mid Wales</option>
                      <option value="southwest">South West Wales</option>
                      <option value="southeast">South East Wales</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#51615a] uppercase">Primary Focus Sector</label>
                    <select
                      value={regForm.sector}
                      onChange={(e) => setRegForm(prev => ({ ...prev, sector: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-[#e1e1db] bg-white rounded-xl focus:outline-none focus:border-[#2E536B]"
                    >
                      <option value="Tech/Digital">Tech & Digital</option>
                      <option value="Green Economy">Green Economy / Net Zero</option>
                      <option value="Creative Industries">Creative Industries</option>
                      <option value="Foundational">Foundational Economy</option>
                      <option value="Other">Other Community Sector</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#51615a] uppercase">Brief Description (What you do/seek)</label>
                    <input
                      type="text"
                      value={regForm.description}
                      onChange={(e) => setRegForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g. Providing digital training for valleys youth"
                      className="w-full mt-1 px-3 py-2 border border-[#e1e1db] rounded-xl focus:outline-none focus:border-[#2E536B]"
                    />
                  </div>
                </div>

                <div className="pt-3.5 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl transition duration-150 cursor-pointer text-center"
                  >
                    Register Custom Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="px-4 py-2.5 border border-[#e1e1db] text-[#51615a] font-semibold rounded-xl transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: USER PROFILE VIEW & BOOKMARKS */}
      {isProfileViewOpen && currentUser && (
        <div className="fixed inset-0 bg-[#1a2521]/45 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl border border-[#e1e1db] w-full max-w-2xl shadow-2xl p-6 animate-scaleIn text-left flex flex-col max-h-[92vh]">
            <div className="flex items-start justify-between pb-3.5 border-b border-[#e1e1db] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2E536B]/10 rounded-2xl text-[#2E536B] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a2521]">{currentUser.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-150">
                      {currentUser.type}
                    </span>
                    <span className="text-[9px] text-[#51615a]">📍 {currentUser.region.toUpperCase()} WALES</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsProfileViewOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-5 h-5 text-[#51615a]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
              
              {/* Profile Details Card */}
              <div className="bg-slate-50 border border-[#e1e1db] p-4 rounded-2xl text-xs space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Workspace Profile Info</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase">Role Type</span>
                    <span className="text-[11px] font-medium capitalize text-[#1a2521]">{currentUser.type}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase">Primary Email</span>
                    <span className="text-[11px] font-mono text-[#2E536B]">{currentUser.contactEmail}</span>
                  </div>
                  {currentUser.description && (
                    <div className="col-span-2 border-t border-gray-200/50 pt-2">
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Description</span>
                      <p className="text-[11px] text-[#51615a] leading-relaxed mt-0.5">{currentUser.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* BOOKMARKS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Your Bookmarked / Saved Items ({currentUser.savedItems?.length || 0})</span>
                  </h4>
                  <span className="text-[9px] text-gray-400 font-semibold font-mono">Cleared on browser reset</span>
                </div>

                {(!currentUser.savedItems || currentUser.savedItems.length === 0) ? (
                  <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs">
                    <Bookmark className="w-5 h-5 mx-auto mb-2 text-gray-300" />
                    No saved items yet. Bookmark gaps, offers or requests to view them here.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {currentUser.savedItems.map((savedId) => {
                      const matchedItem = gapsOffers.find(g => g.id === savedId);
                      if (!matchedItem) return null;
                      return (
                        <div key={savedId} className="p-3 border border-gray-200 rounded-xl bg-white hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-1 truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-sky-50 border border-sky-100 text-sky-700 uppercase">
                                {matchedItem.type}
                              </span>
                              <span className="text-[9px] text-gray-400 uppercase font-bold font-mono">📍 {matchedItem.region || 'North'} Wales</span>
                            </div>
                            <h5 className="font-bold text-[#1a2521] truncate">{matchedItem.title}</h5>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                setDetailedGap(matchedItem);
                                setIsProfileViewOpen(false);
                              }}
                              className="px-2.5 py-1.5 bg-[#2E536B] hover:bg-[#2E536B]/90 text-white font-bold rounded-lg transition text-[10px]"
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => toggleSaveItem(savedId)}
                              className="p-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition"
                              title="Remove Bookmark"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* YOUR PUBLICATIONS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-[10px] font-bold text-[#1a2521] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Your Published Gaps, Offers & Requests ({
                      gapsOffers.filter(g => g.submittedBy === currentUser.name || g.organization === currentUser.name).length
                    })</span>
                  </h4>
                </div>

                {gapsOffers.filter(g => g.submittedBy === currentUser.name || g.organization === currentUser.name).length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs">
                    You haven't posted any items in this session.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {gapsOffers.filter(g => g.submittedBy === currentUser.name || g.organization === currentUser.name).map((matchedItem) => (
                      <div key={matchedItem.id} className="p-2.5 border border-gray-150 rounded-xl bg-white flex items-center justify-between gap-3 text-xs">
                        <div className="truncate">
                          <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 mr-2 uppercase">{matchedItem.type}</span>
                          <span className="font-bold text-[#1a2521] truncate">{matchedItem.title}</span>
                        </div>
                        <button
                          onClick={() => {
                            setDetailedGap(matchedItem);
                            setIsProfileViewOpen(false);
                          }}
                          className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-[10px] border border-gray-200 rounded-lg text-[#51615a] font-medium flex-shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SWITCH ACTORS UTILITY */}
              <div className="space-y-2 bg-slate-50 border border-[#e1e1db] p-3.5 rounded-2xl">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Switch Simulated Workspace Account</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {registeredProfiles.filter(p => p.id !== currentUser.id).slice(0, 4).map((altProfile) => (
                    <button
                      key={altProfile.id}
                      onClick={() => {
                        setCurrentUser(altProfile);
                        localStorage.setItem('wales_alpha_user_profile', JSON.stringify(altProfile));
                      }}
                      className="px-2.5 py-1.5 border border-gray-200 hover:border-sky-300 rounded-xl bg-white hover:bg-sky-50 text-[10px] font-semibold text-[#51615a] hover:text-sky-800 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3 text-gray-400" />
                      <span>{altProfile.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-3.5 border-t border-[#e1e1db] flex gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('wales_alpha_user_profile');
                  setIsProfileViewOpen(false);
                }}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs transition duration-150 cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Profile</span>
              </button>
              <button
                onClick={() => setIsProfileViewOpen(false)}
                className="flex-1 py-2.5 bg-[#2E536B] hover:bg-[#2E536B]/95 text-white font-bold rounded-xl text-xs transition cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
