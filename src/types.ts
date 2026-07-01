export type FrictionPoint =
  | 'Visibility'
  | 'Family Awareness'
  | 'Transitions'
  | 'Navigation'
  | 'Translation'
  | 'Progression';

export type SectorType = 'Tech/Digital' | 'Green Economy' | 'Creative' | 'Foundational';

export type LookingForType = 'Funding' | 'Referrals' | 'Employer Partners';

export interface Organization {
  id: string;
  name: string;
  location: string; // city/region (Cardiff, Swansea, Newport, Wrexham, Bangor, Valleys)
  address: string; // full address
  keyContact: string; // person name & role
  currentProjectsCount: number; // number of projects active at the moment
  impact: string; // description of their impact so far
  lookingForDetail: string; // detailed what they are looking for / need help with
  latitude: number;
  longitude: number;
  assignedTab: FrictionPoint;
  sector: SectorType;
  lookingFor: LookingForType;
  capacityStatus: string; // e.g., "Accepting Referrals", "Seeking Partners", "Active Cohorts Open"
  currentProject: string; // brief sentence describing their current Welsh initiative
  solutions: string[]; // what they are actively doing to solve that specific tab's friction point
  description: string; // a short general description of the organization
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
