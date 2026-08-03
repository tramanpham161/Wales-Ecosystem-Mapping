export type FrictionPoint =
  | 'Home and Community'
  | 'School'
  | 'Post-16 Education and Training'
  | 'Entry to Work'
  | 'In Work'
  | 'Re-entry';

export type SectorType = 
  | 'Charity'
  | 'Community organisation'
  | 'Partnership'
  | 'Anchor institution'
  | 'Public body'
  | 'Local authority'
  | 'Funder'
  | 'FE'
  | 'HE'
  | 'Employer'
  | 'Independent training provider'
  | 'Tech/Digital'
  | 'Green Economy'
  | 'Creative'
  | 'Foundational';

export type StrategicRoleType = 
  | 'Delivers'
  | 'Funds'
  | 'Influences'
  | 'Convenes'
  | 'Connects'
  | 'Amplifies'
  | 'Generates evidence'
  | 'Builds capacity';

export type ThematicAreaType = 
  | 'Careers'
  | 'Employability'
  | 'Skills'
  | 'Youth voice'
  | 'Mentoring'
  | 'Enterprise'
  | 'Apprenticeships'
  | 'Community development'
  | 'Inclusive growth'
  | 'Social mobility'
  | 'Family support'
  | 'Financial wellbeing'
  | 'Digital inclusion'
  | 'Volunteering'
  | 'Employer engagement'
  | 'Social value'
  | 'Mental wellbeing';

export type LookingForType = 'Funding' | 'Referrals' | 'Employer Partners';

export interface Organization {
  id: string;
  name: string;
  location: string; // city/region
  address: string; // full address
  keyContact: string; // person name & role
  currentProjectsCount: number; // number of projects active
  impact: string; // description of impact
  lookingForDetail: string; // detailed need/request
  latitude: number;
  longitude: number;
  assignedTab: FrictionPoint;
  sector: SectorType | string;
  strategicRole?: StrategicRoleType;
  thematicAreas?: (ThematicAreaType | string)[];
  partnerships?: string;
  notes?: string;
  lookingFor: LookingForType;
  capacityStatus: string; // e.g., "Accepting Referrals", "Seeking Partners", "Active Cohorts Open"
  currentProject: string; // brief sentence describing initiative
  solutions: string[]; // what they are actively doing to solve friction
  description: string; // short general description
  journeyStages: string[];
  contactEmail?: string;
  website?: string;
  workingWithOaha?: boolean;
}

export interface TabInfo {
  id: FrictionPoint;
  label: string;
  subLabel: string;
  description: string;
  colorClass: string;
  badgeColor: string;
}

export type SubmissionType = 'Gap' | 'Offer' | 'Request' | 'Collaboration' | 'Evidence';

export interface GapOfferRequest {
  id: string;
  type: SubmissionType;
  title: string;
  submittedBy: string;
  organization: string;
  contactEmail: string;
  content: string;
  assignedTab: FrictionPoint;
  region?: 'north' | 'mid' | 'southwest' | 'southeast';
  category?: 'resource' | 'job' | 'funding' | 'others';
  urgency?: 'urgent' | 'not urgent';
  thematicArea?: ThematicAreaType | string;
  strategicRole?: StrategicRoleType | string;
  workingWithOaha?: boolean;
  createdAt?: string;
}

export interface Commitment {
  id: string;
  title: string;
  partnerName: string;
  owner: string;
  timescale: string;
  progress: 'Drafting' | 'Active Pilot' | 'Completed';
  nextSteps: string;
  dependencies: string;
  assignedTab: FrictionPoint;
  region?: 'north' | 'mid' | 'southwest' | 'southeast';
  createdAt?: string;
}

export interface EvidenceLearning {
  id: string;
  title: string;
  logType: 'Community Feedback' | 'Outcome Metric' | 'Barrier Encountered' | 'Key Decision' | 'Delivery Learning';
  assignedTab: FrictionPoint;
  description: string;
  whatChanged: string;
  region?: 'north' | 'mid' | 'southwest' | 'southeast';
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  type: 'organisation' | 'individual' | 'business';
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  region?: 'north' | 'mid' | 'southwest' | 'southeast';
  description?: string;
  sector?: SectorType | 'Other' | string;
  savedItems?: string[]; // IDs of saved Gaps/Offers
}

