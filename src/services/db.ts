import { supabase } from '../supabase';
import { Organization, GapOfferRequest, Commitment, EvidenceLearning, FrictionPoint, SectorType, LookingForType } from '../types';
import { WELSH_ORGANIZATIONS } from '../data';

// Key names for localStorage fallbacks
const KEYS = {
  ORGANISATIONS: 'wales_alpha_organisations',
  GAPS_OFFERS: 'wales_alpha_gaps_offers',
  COMMITMENTS: 'wales_alpha_commitments',
  EVIDENCE_LEARNING: 'wales_alpha_evidence_learning',
};

// Initial data seeds for demo when empty - Exactly 2 Requests & 2 Activities per stage
const INITIAL_GAPS_OFFERS: GapOfferRequest[] = [
  // Stage 1: Home and Community
  {
    id: 'wales-hc-req-1',
    type: 'Request',
    title: 'Bilingual youth mentors needed for rural Gwynedd drop-in hubs',
    submittedBy: 'Siôn Gruffydd',
    organization: 'Gwynedd Community Council',
    contactEmail: 'sion@gwynedd.llyw.cymru',
    content: 'Young people in isolated farming communities need bilingual mentors for evening drop-in sessions.',
    assignedTab: 'Home and Community',
    region: 'north',
    category: 'resource',
    urgency: 'urgent'
  },
  {
    id: 'wales-hc-req-2',
    type: 'Request',
    title: 'Equipment funding for youth center Wi-Fi stations in Caerphilly',
    submittedBy: 'Rhiannon Evans',
    organization: 'Rhondda Youth Association',
    contactEmail: 'rhiannon@rhondda-youth.org.uk',
    content: 'Seeking £1,200 to equip 3 community centers in the Valleys with public internet terminals.',
    assignedTab: 'Home and Community',
    region: 'southeast',
    category: 'funding',
    urgency: 'not urgent'
  },
  {
    id: 'wales-hc-act-1',
    type: 'Activity',
    title: 'Community youth wellbeing & resilience workshops',
    submittedBy: 'Marc Davies',
    organization: 'Clwyd Youth Innovators',
    contactEmail: 'info@clwydinnovators.org.uk',
    content: 'Weekly interactive resilience and wellbeing sessions for teenagers and families.',
    assignedTab: 'Home and Community',
    region: 'north',
    category: 'resource',
    urgency: 'not urgent'
  },
  {
    id: 'wales-hc-act-2',
    type: 'Activity',
    title: 'Mobile internet and digital advice drop-in bus',
    submittedBy: 'Sian Owen',
    organization: 'West Wales Coastal Tech Hub',
    contactEmail: 'sian@westcoastaltech.cymru',
    content: 'Mobile van visiting 6 rural villages across Anglesey providing digital guidance.',
    assignedTab: 'Home and Community',
    region: 'mid',
    category: 'resource',
    urgency: 'urgent'
  },

  // Stage 2: School
  {
    id: 'wales-sch-req-1',
    type: 'Request',
    title: 'Seeking local employer speakers for Year 10 STEM week in Wrexham',
    submittedBy: 'Alun Hughes',
    organization: 'Eryri Youth Forum',
    contactEmail: 'alun@eryriyouth.wales',
    content: 'Looking for 5 local engineering and tech representatives for interactive talks in secondary schools.',
    assignedTab: 'School',
    region: 'north',
    category: 'resource',
    urgency: 'urgent'
  },
  {
    id: 'wales-sch-req-2',
    type: 'Request',
    title: 'Classroom Wi-Fi devices for secondary pupils in Merthyr Tydfil',
    submittedBy: 'Gareth Jenkins',
    organization: 'Merthyr Learning Partnership',
    contactEmail: 'gareth@merthyrlearning.wales',
    content: 'Seeking 10 mobile Wi-Fi dongles for low-income pupils studying for GCSE exams.',
    assignedTab: 'School',
    region: 'southeast',
    category: 'resource',
    urgency: 'not urgent'
  },
  {
    id: 'wales-sch-act-1',
    type: 'Activity',
    title: 'Free robotics and coding workshops for secondary schools',
    submittedBy: 'Dr. Elin Rees',
    organization: 'Cardiff STEM Academy',
    contactEmail: 'stem@cardiffacademy.wales',
    content: 'Offering hands-on robotics and coding bootcamps for Year 9-11 classes across Cardiff.',
    assignedTab: 'School',
    region: 'southeast',
    category: 'job',
    urgency: 'not urgent'
  },
  {
    id: 'wales-sch-act-2',
    type: 'Activity',
    title: 'School-to-work transition coaching bootcamps in Newport',
    submittedBy: 'Ceri Jenkins',
    organization: 'Gwent Youth Mentoring',
    contactEmail: 'ceri@gwentmentoring.org.uk',
    content: 'Intensive 1-on-1 career direction workshops for pupils at risk of dropping out.',
    assignedTab: 'School',
    region: 'southeast',
    category: 'resource',
    urgency: 'urgent'
  },

  // Stage 3: Post-16 Education and Training
  {
    id: 'wales-p16-req-1',
    type: 'Request',
    title: 'Subsidised bus passes for FE college students in Carmarthenshire',
    submittedBy: 'Dave Robinson',
    organization: 'Carmarthen Skills Alliance',
    contactEmail: 'dave@carmarthenskills.wales',
    content: 'Vocational students face up to £40/week bus fares to attend practical trade workshops.',
    assignedTab: 'Post-16 Education and Training',
    region: 'southwest',
    category: 'funding',
    urgency: 'urgent'
  },
  {
    id: 'wales-p16-req-2',
    type: 'Request',
    title: 'Refurbished laptops for vocational trainees in Swansea',
    submittedBy: 'Elen Vaughan',
    organization: 'Swansea Valley Youth Trust',
    contactEmail: 'elen@swanseayouth.wales',
    content: 'We need 12 refurbished laptops for young apprentices taking online theory modules.',
    assignedTab: 'Post-16 Education and Training',
    region: 'southwest',
    category: 'resource',
    urgency: 'not urgent'
  },
  {
    id: 'wales-p16-act-1',
    type: 'Activity',
    title: 'Paid 6-week summer tech internships in Cardiff Bay',
    submittedBy: 'Claire O’Connor',
    organization: 'Cardiff Digital Alliance',
    contactEmail: 'hello@cardiffdigital.wales',
    content: 'Paid internships in software design and digital marketing for post-16 learners aged 16-24.',
    assignedTab: 'Post-16 Education and Training',
    region: 'southeast',
    category: 'job',
    urgency: 'not urgent'
  },
  {
    id: 'wales-p16-act-2',
    type: 'Activity',
    title: 'Green trades retrofitting taster bootcamps in Pontypridd',
    submittedBy: 'Owen Thomas',
    organization: 'Green Valley Eco-Builders',
    contactEmail: 'owen@greenvalleybuilders.wales',
    content: 'Fast-track 2-week practical training on heat pumps and solar retrofitting.',
    assignedTab: 'Post-16 Education and Training',
    region: 'southeast',
    category: 'job',
    urgency: 'urgent'
  },

  // Stage 4: Entry to Work
  {
    id: 'wales-e2w-req-1',
    type: 'Request',
    title: 'Work experience hosts needed for job-seeking young adults in Bangor',
    submittedBy: 'Megan Lloyd',
    organization: 'Gwynedd Youth Employment Hub',
    contactEmail: 'megan@gwyneddyouth.gov.uk',
    content: 'Seeking local firms willing to host 1-week work experience placements for job-ready leavers.',
    assignedTab: 'Entry to Work',
    region: 'north',
    category: 'job',
    urgency: 'urgent'
  },
  {
    id: 'wales-e2w-req-2',
    type: 'Request',
    title: 'Interview clothing vouchers for young jobseekers in Rhondda',
    submittedBy: 'Rhys Davies',
    organization: 'Rhondda Skills Hub',
    contactEmail: 'rhys@rhonddaskills.org.uk',
    content: 'Requesting £50 clothing cards to support candidates attending formal employment interviews.',
    assignedTab: 'Entry to Work',
    region: 'southeast',
    category: 'funding',
    urgency: 'not urgent'
  },
  {
    id: 'wales-e2w-act-1',
    type: 'Activity',
    title: 'Digital CV building and mock interview bootcamps in Bridgend',
    submittedBy: 'Sara Thomas',
    organization: 'Bridgend Pathways',
    contactEmail: 'sara@bridgendpathways.org.uk',
    content: 'Weekly drop-in clinics for CV tailoring, LinkedIn profile setup, and mock employer interviews.',
    assignedTab: 'Entry to Work',
    region: 'southeast',
    category: 'resource',
    urgency: 'not urgent'
  },
  {
    id: 'wales-e2w-act-2',
    type: 'Activity',
    title: 'Fast-track apprenticeships entry hotline and placement support',
    submittedBy: 'Tomos Parry',
    organization: 'Wales Apprenticeship Network',
    contactEmail: 'tomos@walesapprenticeships.cymru',
    content: 'Direct matching hotline connecting 18-24 jobseekers with live local apprenticeship openings.',
    assignedTab: 'Entry to Work',
    region: 'mid',
    category: 'job',
    urgency: 'urgent'
  },

  // Stage 5: In Work
  {
    id: 'wales-iw-req-1',
    type: 'Request',
    title: 'In-work mental health support circles for entry-level workers in Neath',
    submittedBy: 'Catrin Price',
    organization: 'Neath Port Talbot Mind',
    contactEmail: 'catrin@nptmind.org.uk',
    content: 'Requesting partner counselors to co-facilitate evening peer circles for young employees.',
    assignedTab: 'In Work',
    region: 'southwest',
    category: 'resource',
    urgency: 'urgent'
  },
  {
    id: 'wales-iw-req-2',
    type: 'Request',
    title: 'Peer mentor pairing for young creative sector workers in Cardiff',
    submittedBy: 'Iwan Roberts',
    organization: 'Cardiff Creative Collective',
    contactEmail: 'iwan@cardiffcreative.wales',
    content: 'Looking for experienced media professionals to mentor junior designers and videographers.',
    assignedTab: 'In Work',
    region: 'southeast',
    category: 'resource',
    urgency: 'not urgent'
  },
  {
    id: 'wales-iw-act-1',
    type: 'Activity',
    title: 'Career progression and leadership masterclasses for young employees',
    submittedBy: 'Gethin Morgan',
    organization: 'South Wales Business Forum',
    contactEmail: 'gethin@swbusiness.wales',
    content: 'Monthly evening seminars covering workplace negotiations, leadership, and professional growth.',
    assignedTab: 'In Work',
    region: 'southeast',
    category: 'job',
    urgency: 'not urgent'
  },
  {
    id: 'wales-iw-act-2',
    type: 'Activity',
    title: 'Workplace rights and wage progression drop-in advice in Llanelli',
    submittedBy: 'Bethan Bowen',
    organization: 'Llanelli Workers Advice',
    contactEmail: 'bethan@llanelliadvice.org.uk',
    content: 'Free drop-in legal and union guidance for young workers navigating contract transitions.',
    assignedTab: 'In Work',
    region: 'southwest',
    category: 'resource',
    urgency: 'urgent'
  },

  // Stage 6: Re-entry
  {
    id: 'wales-re-req-1',
    type: 'Request',
    title: 'Supported placement links for young people exiting youth justice in Wrexham',
    submittedBy: 'Huw Williams',
    organization: 'Wrexham Youth Justice Partnership',
    contactEmail: 'huw@wrexhamjustice.gov.uk',
    content: 'Seeking empathetic employers willing to offer supported trial shifts for re-integrating youths.',
    assignedTab: 'Re-entry',
    region: 'north',
    category: 'job',
    urgency: 'urgent'
  },
  {
    id: 'wales-re-req-2',
    type: 'Request',
    title: 'Retraining bursary requests for care experienced young adults',
    submittedBy: 'Lowri Phillips',
    organization: 'Voices From Care Cymru',
    contactEmail: 'lowri@voicesfromcare.wales',
    content: 'Seeking £500 micro-grants to cover transport and tools for care leavers returning to study.',
    assignedTab: 'Re-entry',
    region: 'southeast',
    category: 'funding',
    urgency: 'not urgent'
  },
  {
    id: 'wales-re-act-1',
    type: 'Activity',
    title: 'Green construction retraining bootcamps for adult learners in Port Talbot',
    submittedBy: 'Dylan James',
    organization: 'Eco Trades Cymru',
    contactEmail: 'dylan@ecotrades.wales',
    content: 'Fully funded 4-week retraining program covering insulation installation and green trades.',
    assignedTab: 'Re-entry',
    region: 'southwest',
    category: 'job',
    urgency: 'not urgent'
  },
  {
    id: 'wales-re-act-2',
    type: 'Activity',
    title: 'Emergency step-back-in coaching for NEET young adults in Torfaen',
    submittedBy: 'Nia Edwards',
    organization: 'Torfaen Re-engage Network',
    contactEmail: 'nia@torfaenreengage.org.uk',
    content: 'Immediate intensive 1-on-1 caseworker support for young adults out of work for 6+ months.',
    assignedTab: 'Re-entry',
    region: 'southeast',
    category: 'resource',
    urgency: 'urgent'
  }
];

const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'commit-1',
    title: 'Launch mobile Welsh-language advisory pilot',
    partnerName: 'Cymru Youth Outreach (CYO) & Gwynedd Council',
    owner: 'Gareth Jenkins',
    timescale: 'Q3 2026',
    progress: 'Active Pilot',
    nextSteps: 'Rent mobile van, schedule visits to 4 remote villages, deploy bilingual advisor.',
    dependencies: 'Requires mobile vehicle hire subsidy.',
    assignedTab: 'Home and Community',
    region: 'southeast'
  },
  {
    id: 'commit-2',
    title: 'Establish bilingual creative media pathway',
    partnerName: 'Bangor Reach & Discover',
    owner: 'Elen Vaughan',
    timescale: 'Q4 2026',
    progress: 'Drafting',
    nextSteps: 'Finalise standard modules, recruit 3 local creative agencies for internships.',
    dependencies: 'Awaiting outcome of community fund grant.',
    assignedTab: 'In Work',
    region: 'north'
  },
  {
    id: 'commit-3',
    title: 'Distribute laptops and sponsor coding club',
    partnerName: 'Clwyd Youth Innovators',
    owner: 'Marc Davies',
    timescale: 'Complete',
    progress: 'Completed',
    nextSteps: 'All laptops distributed, mentoring programme kicked off with 15 regular attendees.',
    dependencies: 'None',
    assignedTab: 'Post-16 Education and Training',
    region: 'north'
  },
  {
    id: 'commit-4',
    title: 'Create localised green skills training curriculum',
    partnerName: 'Green Valley Eco-Builders & Neath Port Talbot College',
    owner: 'Owen Thomas',
    timescale: 'Q1 2027',
    progress: 'Drafting',
    nextSteps: 'Draft course modules, align with modern retrofitting certification frameworks, review with college dean.',
    dependencies: 'College curriculum board approval.',
    assignedTab: 'Re-entry',
    region: 'southeast'
  },
  {
    id: 'commit-5',
    title: 'Launch South Wales digital inclusion partnership',
    partnerName: 'West Wales Coastal Tech Hub & Cardiff Media Alliance',
    owner: 'Sian Owen',
    timescale: 'Q3 2026',
    progress: 'Active Pilot',
    nextSteps: 'Establish drop-in training schedules in 3 local libraries, register initial student cohort.',
    dependencies: 'Volunteer staff coordination.',
    assignedTab: 'School',
    region: 'mid'
  }
];

const INITIAL_EVIDENCE_LEARNING: EvidenceLearning[] = [
  {
    id: 'log-1',
    title: 'Lived Experience: Transport is the primary barrier in Bangor',
    logType: 'Community Feedback',
    assignedTab: 'Home and Community',
    description: 'A survey of 45 local young people in Bangor revealed that 75% missed advisory sessions simply because buses do not run after 5 PM from rural villages.',
    whatChanged: 'We are moving workshop timings to 3:30 PM and providing taxi vouchers where needed.',
    region: 'north'
  },
  {
    id: 'log-2',
    title: 'Tech Apprenticeship retention depends on early mentor pairing',
    logType: 'Delivery Learning',
    assignedTab: 'Re-entry',
    description: 'We found that young people from underrepresented backgrounds had a 40% higher retention rate in Welsh software firms if paired with a dedicated mentor in the first 2 weeks.',
    whatChanged: 'Drafting a "First 30 Days" employer guide to make mentor pairing mandatory for partners.',
    region: 'southeast'
  }
];

// Helper to check if a specific table exists in Supabase
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

export interface DbStatus {
  connected: boolean;
  usingSupabase: boolean;
  tables: {
    wales_organisations: boolean;
    wales_gaps_offers: boolean;
    wales_commitments: boolean;
    wales_evidence_learning: boolean;
  };
}

export async function getDbStatus(): Promise<DbStatus> {
  try {
    const orgs = await tableExists('wales_organisations');
    const gaps = await tableExists('wales_gaps_offers');
    const commits = await tableExists('wales_commitments');
    const logs = await tableExists('wales_evidence_learning');
    
    const anyConnected = orgs || gaps || commits || logs;
    return {
      connected: anyConnected,
      usingSupabase: anyConnected,
      tables: {
        wales_organisations: orgs,
        wales_gaps_offers: gaps,
        wales_commitments: commits,
        wales_evidence_learning: logs,
      }
    };
  } catch {
    return {
      connected: false,
      usingSupabase: false,
      tables: {
        wales_organisations: false,
        wales_gaps_offers: false,
        wales_commitments: false,
        wales_evidence_learning: false,
      }
    };
  }
}

// -------------------------------------------------------------------------
// 1. ORGANISATIONS SERVICE
// -------------------------------------------------------------------------
export async function fetchOrganisations(): Promise<Organization[]> {
  try {
    const { data, error } = await supabase.from('wales_organisations').select('*');
    if (error || !data) throw error || new Error('No data');

    if (data.length === 0) {
      // Seed table with default organizations if empty
      await seedOrganisations();
      return fetchOrganisations();
    }

    const localMap = new Map(WELSH_ORGANIZATIONS.map(o => [o.id, o.journeyStages]));
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.location,
      address: item.address,
      keyContact: item.key_contact || '',
      currentProjectsCount: item.current_projects_count || 0,
      impact: item.impact || '',
      lookingForDetail: item.looking_for_detail || '',
      latitude: item.latitude,
      longitude: item.longitude,
      assignedTab: item.assigned_tab as FrictionPoint,
      sector: item.sector as SectorType,
      lookingFor: item.looking_for as LookingForType,
      capacityStatus: item.capacity_status || '',
      currentProject: item.current_project || '',
      solutions: item.solutions || [],
      description: item.description || '',
      journeyStages: (item.journey_stages && Array.isArray(item.journey_stages) && item.journey_stages.length > 0)
        ? item.journey_stages
        : (item.journeyStages && Array.isArray(item.journeyStages) && item.journeyStages.length > 0)
        ? item.journeyStages
        : localMap.get(item.id) || (item.assigned_tab ? [item.assigned_tab] : []),
      contactEmail: item.contact_email,
      website: item.website,
      workingWithOaha: item.working_with_oaha ?? false
    }));
  } catch (e) {
    console.warn('Falling back to local storage for organizations:', e);
    const cached = localStorage.getItem(KEYS.ORGANISATIONS);
    if (cached) {
      return JSON.parse(cached);
    } else {
      localStorage.setItem(KEYS.ORGANISATIONS, JSON.stringify(WELSH_ORGANIZATIONS));
      return WELSH_ORGANIZATIONS;
    }
  }
}

export async function addOrganisation(org: Organization): Promise<Organization> {
  const dbItem = {
    id: org.id,
    name: org.name,
    location: org.location,
    address: org.address,
    key_contact: org.keyContact,
    current_projects_count: org.currentProjectsCount,
    impact: org.impact,
    looking_for_detail: org.lookingForDetail,
    latitude: org.latitude,
    longitude: org.longitude,
    assigned_tab: org.assignedTab,
    sector: org.sector,
    looking_for: org.lookingFor,
    capacity_status: org.capacityStatus,
    current_project: org.currentProject,
    solutions: org.solutions,
    description: org.description,
    contact_email: org.contactEmail,
    website: org.website,
    working_with_oaha: org.workingWithOaha
  };

  try {
    const { error } = await supabase.from('wales_organisations').insert([dbItem]);
    if (error) throw error;
  } catch (e) {
    console.warn('Saving organization locally due to database error:', e);
    const list = await fetchOrganisations();
    list.push(org);
    localStorage.setItem(KEYS.ORGANISATIONS, JSON.stringify(list));
  }
  return org;
}

async function seedOrganisations() {
  const dbItems = WELSH_ORGANIZATIONS.map(org => ({
    id: org.id,
    name: org.name,
    location: org.location,
    address: org.address,
    key_contact: org.keyContact,
    current_projects_count: org.currentProjectsCount,
    impact: org.impact,
    looking_for_detail: org.lookingForDetail,
    latitude: org.latitude,
    longitude: org.longitude,
    assigned_tab: org.assignedTab,
    sector: org.sector,
    looking_for: org.lookingFor,
    capacity_status: org.capacityStatus,
    current_project: org.currentProject,
    solutions: org.solutions,
    description: org.description,
    contact_email: org.contactEmail,
    website: org.website,
    working_with_oaha: org.workingWithOaha
  }));

  try {
    await supabase.from('wales_organisations').insert(dbItems);
  } catch (e) {
    console.error('Failed to seed remote organizations:', e);
  }
}

// -------------------------------------------------------------------------
// 2. GAPS, OFFERS & REQUESTS SERVICE
// -------------------------------------------------------------------------
export function serializeMetadata(content: string, category?: string, urgency?: string, workingWithOaha?: boolean): string {
  if (!category && !urgency && workingWithOaha === undefined) return content;
  return `__METADATA__category:${category || ''},urgency:${urgency || ''},oaha:${workingWithOaha !== undefined ? workingWithOaha : ''}__\n\n${content}`;
}

export function deserializeMetadata(serializedContent: string): { 
  content: string; 
  category?: 'resource' | 'job' | 'funding' | 'others'; 
  urgency?: 'urgent' | 'not urgent';
  workingWithOaha?: boolean;
} {
  if (!serializedContent) return { content: '' };
  const prefix = '__METADATA__';
  if (serializedContent.startsWith(prefix)) {
    const headerEnd = serializedContent.indexOf('__\n\n');
    if (headerEnd !== -1) {
      const headerStr = serializedContent.substring(prefix.length, headerEnd);
      const content = serializedContent.substring(headerEnd + 4);
      
      const parts = headerStr.split(',');
      const meta: any = { content };
      parts.forEach(part => {
        const colonIndex = part.indexOf(':');
        if (colonIndex !== -1) {
          const key = part.substring(0, colonIndex).trim();
          const val = part.substring(colonIndex + 1).trim();
          if (key === 'category') {
            meta.category = val || undefined;
          } else if (key === 'urgency') {
            meta.urgency = val || undefined;
          } else if (key === 'oaha') {
            meta.workingWithOaha = val === 'true' ? true : val === 'false' ? false : undefined;
          }
        }
      });
      return meta;
    }

    const match = serializedContent.match(/^__METADATA__category:(.*?),urgency:(.*?)__\n\n([\s\S]*)$/);
    if (match) {
      return {
        category: (match[1] || undefined) as any,
        urgency: (match[2] || undefined) as any,
        content: match[3]
      };
    }
  }
  return { content: serializedContent };
}

export async function fetchGapsOffers(): Promise<GapOfferRequest[]> {
  try {
    const { data, error } = await supabase.from('wales_gaps_offers').select('*').order('created_at', { ascending: false });
    if (error || !data) throw error || new Error('No data');

    if (data.length === 0) {
      await seedGapsOffers();
      return fetchGapsOffers();
    }

    return data.map(item => {
      const { content, category, urgency, workingWithOaha } = deserializeMetadata(item.content || '');
      return {
        id: item.id,
        type: item.type as any,
        title: item.title,
        submittedBy: item.submitted_by || '',
        organization: item.organization || '',
        contactEmail: item.contact_email || '',
        content: content,
        assignedTab: item.assigned_tab as FrictionPoint,
        region: item.region as any,
        category: category,
        urgency: urgency,
        workingWithOaha: workingWithOaha,
        createdAt: item.created_at
      };
    });
  } catch (e) {
    console.warn('Falling back to local storage for gaps/offers:', e);
    const cached = localStorage.getItem(KEYS.GAPS_OFFERS);
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.map((item: any) => {
        const { content, category, urgency, workingWithOaha } = deserializeMetadata(item.content || '');
        return {
          ...item,
          content,
          category: item.category || category,
          urgency: item.urgency || urgency,
          workingWithOaha: item.workingWithOaha !== undefined ? item.workingWithOaha : workingWithOaha
        };
      });
    } else {
      localStorage.setItem(KEYS.GAPS_OFFERS, JSON.stringify(INITIAL_GAPS_OFFERS));
      return INITIAL_GAPS_OFFERS;
    }
  }
}

async function seedGapsOffers() {
  const dbItems = INITIAL_GAPS_OFFERS.map(item => ({
    type: item.type,
    title: item.title,
    submitted_by: item.submittedBy,
    organization: item.organization,
    contact_email: item.contactEmail,
    content: serializeMetadata(item.content, item.category, item.urgency, item.workingWithOaha),
    assigned_tab: item.assignedTab,
    region: item.region
  }));

  try {
    await supabase.from('wales_gaps_offers').insert(dbItems);
  } catch (e) {
    console.error('Failed to seed remote gaps/offers:', e);
  }
}

export async function addGapOffer(item: Omit<GapOfferRequest, 'id'>): Promise<GapOfferRequest> {
  const tempId = Math.random().toString(36).substring(2, 11);
  const serializedContent = serializeMetadata(item.content, item.category, item.urgency, item.workingWithOaha);
  const dbItem = {
    type: item.type,
    title: item.title,
    submitted_by: item.submittedBy,
    organization: item.organization,
    contact_email: item.contactEmail,
    content: serializedContent,
    assigned_tab: item.assignedTab,
    region: item.region
  };

  try {
    const { data, error } = await supabase.from('wales_gaps_offers').insert([dbItem]).select();
    if (error) throw error;
    if (data && data[0]) {
      const { content, category, urgency, workingWithOaha } = deserializeMetadata(data[0].content || '');
      return {
        id: data[0].id,
        type: data[0].type,
        title: data[0].title,
        submittedBy: data[0].submitted_by,
        organization: data[0].organization,
        contactEmail: data[0].contact_email,
        content: content,
        assignedTab: data[0].assigned_tab,
        region: data[0].region,
        category: category,
        urgency: urgency,
        workingWithOaha: workingWithOaha,
        createdAt: data[0].created_at
      };
    }
  } catch (e) {
    console.warn('Saving gap/offer locally:', e);
  }

  const newItem: GapOfferRequest = { ...item, id: tempId, createdAt: new Date().toISOString() };
  const list = await fetchGapsOffers();
  list.unshift(newItem);
  localStorage.setItem(KEYS.GAPS_OFFERS, JSON.stringify(list));
  return newItem;
}

// -------------------------------------------------------------------------
// 3. COMMITMENTS SERVICE
// -------------------------------------------------------------------------
export async function fetchCommitments(): Promise<Commitment[]> {
  try {
    const { data, error } = await supabase.from('wales_commitments').select('*').order('created_at', { ascending: false });
    if (error || !data) throw error || new Error('No data');

    if (data.length === 0) {
      await seedCommitments();
      return fetchCommitments();
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      partnerName: item.partner_name || '',
      owner: item.owner || '',
      timescale: item.timescale || '',
      progress: item.progress as any,
      nextSteps: item.next_steps || '',
      dependencies: item.dependencies || '',
      assignedTab: item.assigned_tab as FrictionPoint,
      region: item.region as any,
      createdAt: item.created_at
    }));
  } catch (e) {
    console.warn('Falling back to local storage for commitments:', e);
    const cached = localStorage.getItem(KEYS.COMMITMENTS);
    if (cached) {
      return JSON.parse(cached);
    } else {
      localStorage.setItem(KEYS.COMMITMENTS, JSON.stringify(INITIAL_COMMITMENTS));
      return INITIAL_COMMITMENTS;
    }
  }
}

async function seedCommitments() {
  const dbItems = INITIAL_COMMITMENTS.map(item => ({
    title: item.title,
    partner_name: item.partnerName,
    owner: item.owner,
    timescale: item.timescale,
    progress: item.progress,
    next_steps: item.nextSteps,
    dependencies: item.dependencies,
    assigned_tab: item.assignedTab,
    region: item.region
  }));

  try {
    await supabase.from('wales_commitments').insert(dbItems);
  } catch (e) {
    console.error('Failed to seed remote commitments:', e);
  }
}

export async function addCommitment(item: Omit<Commitment, 'id'>): Promise<Commitment> {
  const tempId = Math.random().toString(36).substring(2, 11);
  const dbItem = {
    title: item.title,
    partner_name: item.partnerName,
    owner: item.owner,
    timescale: item.timescale,
    progress: item.progress,
    next_steps: item.nextSteps,
    dependencies: item.dependencies,
    assigned_tab: item.assignedTab,
    region: item.region
  };

  try {
    const { data, error } = await supabase.from('wales_commitments').insert([dbItem]).select();
    if (error) throw error;
    if (data && data[0]) {
      return {
        id: data[0].id,
        title: data[0].title,
        partnerName: data[0].partner_name,
        owner: data[0].owner,
        timescale: data[0].timescale,
        progress: data[0].progress,
        nextSteps: data[0].next_steps,
        dependencies: data[0].dependencies,
        assignedTab: data[0].assigned_tab,
        region: data[0].region,
        createdAt: data[0].created_at
      };
    }
  } catch (e) {
    console.warn('Saving commitment locally:', e);
  }

  const newItem: Commitment = { ...item, id: tempId, createdAt: new Date().toISOString() };
  const list = await fetchCommitments();
  list.unshift(newItem);
  localStorage.setItem(KEYS.COMMITMENTS, JSON.stringify(list));
  return newItem;
}

// -------------------------------------------------------------------------
// 4. EVIDENCE & LEARNING LOGS SERVICE
// -------------------------------------------------------------------------
export async function fetchEvidenceLearning(): Promise<EvidenceLearning[]> {
  try {
    const { data, error } = await supabase.from('wales_evidence_learning').select('*').order('created_at', { ascending: false });
    if (error || !data) throw error || new Error('No data');

    if (data.length === 0) {
      await seedEvidenceLearning();
      return fetchEvidenceLearning();
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      logType: item.log_type as any,
      assignedTab: item.assigned_tab as FrictionPoint,
      description: item.description || '',
      whatChanged: item.what_changed || '',
      region: item.region as any,
      createdAt: item.created_at
    }));
  } catch (e) {
    console.warn('Falling back to local storage for learning logs:', e);
    const cached = localStorage.getItem(KEYS.EVIDENCE_LEARNING);
    if (cached) {
      return JSON.parse(cached);
    } else {
      localStorage.setItem(KEYS.EVIDENCE_LEARNING, JSON.stringify(INITIAL_EVIDENCE_LEARNING));
      return INITIAL_EVIDENCE_LEARNING;
    }
  }
}

async function seedEvidenceLearning() {
  const dbItems = INITIAL_EVIDENCE_LEARNING.map(item => ({
    title: item.title,
    log_type: item.logType,
    assigned_tab: item.assignedTab,
    description: item.description,
    what_changed: item.whatChanged,
    region: item.region
  }));

  try {
    await supabase.from('wales_evidence_learning').insert(dbItems);
  } catch (e) {
    console.error('Failed to seed remote evidence/learning:', e);
  }
}

export async function addEvidenceLearning(item: Omit<EvidenceLearning, 'id'>): Promise<EvidenceLearning> {
  const tempId = Math.random().toString(36).substring(2, 11);
  const dbItem = {
    title: item.title,
    log_type: item.logType,
    assigned_tab: item.assignedTab,
    description: item.description,
    what_changed: item.whatChanged,
    region: item.region
  };

  try {
    const { data, error } = await supabase.from('wales_evidence_learning').insert([dbItem]).select();
    if (error) throw error;
    if (data && data[0]) {
      return {
        id: data[0].id,
        title: data[0].title,
        logType: data[0].log_type,
        assignedTab: data[0].assigned_tab,
        description: data[0].description,
        whatChanged: data[0].what_changed,
        region: data[0].region,
        createdAt: data[0].created_at
      };
    }
  } catch (e) {
    console.warn('Saving evidence log locally:', e);
  }

  const newItem: EvidenceLearning = { ...item, id: tempId, createdAt: new Date().toISOString() };
  const list = await fetchEvidenceLearning();
  list.unshift(newItem);
  localStorage.setItem(KEYS.EVIDENCE_LEARNING, JSON.stringify(list));
  return newItem;
}
