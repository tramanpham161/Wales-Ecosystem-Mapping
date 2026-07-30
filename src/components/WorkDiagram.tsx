import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  Handshake, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Users, 
  Layers, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface WorkDiagramProps {
  placeName: 'Wales' | 'Yorkshire';
}

export const WorkDiagram: React.FC<WorkDiagramProps> = ({ placeName }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const isWales = placeName.toLowerCase() === 'wales';

  const steps = [
    {
      id: 1,
      title: '1. Diagnostic Mapping',
      shortTitle: 'Diagnostic',
      icon: Compass,
      color: 'bg-teal-50 text-[#176e73] border-[#29B6BD]',
      accentColor: '#176e73',
      headline: isWales ? 'Mapping Wales National Journey' : 'Regional Census & Need Mapping',
      description: isWales 
        ? 'Aggregating ONS census data, local authority NEET statistics, and Welsh language priorities across 22 local authority areas.'
        : 'Analyzing household deprivation in 1+ dimensions, youth unemployment hotspots, and skills deficits across South & West Yorkshire.',
      keyOutputs: isWales 
        ? ['142+ organisations mapped', '6 systemic friction points', 'Bilingual service access audit']
        : ['88+ regional initiatives', 'Deprivation choropleth layers', 'Logistics & Green skills gaps'],
      activePartners: isWales 
        ? 'Welsh Government, ColegauCymru, Cwmpas, Local Youth Services' 
        : 'South Yorkshire Mayoral Authority, West Yorkshire Combined Authority, SYMCA, Local Councils'
    },
    {
      id: 2,
      title: '2. Gap & Offer Matching',
      shortTitle: 'Gap Matching',
      icon: Target,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-500',
      accentColor: '#3EB049',
      headline: 'Connecting Unmet Needs with Local Capacity',
      description: isWales 
        ? 'Highlighting where transport barriers in the Valleys, broadband gaps in Gwynedd, or mentor shortages hinder young people.'
        : 'Identifying specific gaps in Sheffield manufacturing apprenticeships, Rotherham youth transport, and Bradford digital bootcamps.',
      keyOutputs: isWales 
        ? ['144 active gaps & offers', 'Real-time friction heatmap', 'Cross-agency request board']
        : ['88 mapped gaps & offers', 'Industry demand alignment', 'Targeted resource allocation'],
      activePartners: isWales 
        ? 'Local VCFS Groups, Employers, Colleges, Housing Associations' 
        : 'Yorkshire VCFS Network, Advanced Manufacturing Research Centre, Local Colleges'
    },
    {
      id: 3,
      title: '3. Multi-Partner Commitments',
      shortTitle: 'Commitments',
      icon: Handshake,
      color: 'bg-amber-50 text-amber-800 border-amber-500',
      accentColor: '#F89E1B',
      headline: 'Structuring Formal Cross-Sector Pledges',
      description: isWales 
        ? 'Facilitating joint commitments between green energy builders, colleges, and local authorities to guarantee youth progression.'
        : 'Mobilizing regional employers, combined authorities, and anchor institutions to co-fund work placements and retention support.',
      keyOutputs: isWales 
        ? ['10 signed commitments', 'Green Pathways pilot', 'Valleys Transport Guarantee']
        : ['6 active pledges', 'South Yorkshire Green Retrofit Alliance', 'Bradford Tech Diversity Charter'],
      activePartners: isWales 
        ? 'UN Global Compact, Welsh Anchor Employers, Colleges' 
        : 'Sheffield Hallam University, AMRC, Yorkshire Housing, Regional Chambers'
    },
    {
      id: 4,
      title: '4. Evidence & Scaling',
      shortTitle: 'Evidence & Scale',
      icon: BarChart3,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-500',
      accentColor: '#6366F1',
      headline: 'Measuring Outcomes & Iterating the Environment',
      description: isWales 
        ? 'Capturing qualitative delivery learnings, youth feedback, and quantitative retention metrics to refine place-based policy.'
        : 'Building transparent learning logs on what interventions effectively reduce 1-dimension household deprivation across Yorkshire.',
      keyOutputs: isWales 
        ? ['4 active learning logs', 'Systemic barrier reports', 'Policy recommendations']
        : ['3 regional evidence logs', 'Employer retention framework', 'Replicable place playbook'],
      activePartners: isWales 
        ? 'Cardiff University Policy Lab, OAHA Analytics, Community Panel' 
        : 'University of Leeds Policy Hub, SYMCA Evaluation Team, Community Forums'
    }
  ];

  const currentStepObj = steps[activeStep];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#e1e1db] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e1e1db] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#176e73]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#176e73]">
              Place Delivery Architecture
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1a2521] tracking-tight mt-1">
            How our work operates in {placeName}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#51615a] bg-slate-50 px-3 py-1.5 rounded-lg border border-[#e1e1db]">
          <MapPin className="w-3.5 h-3.5 text-[#176e73]" />
          <span>Active Operating Environment: <strong className="text-[#1a2521] capitalize">{placeName}</strong></span>
        </div>
      </div>

      <p className="text-sm text-[#51615a] leading-relaxed max-w-4xl">
        The Community Impact Accelerator uses a 4-stage continuous loop to convert fragmented local activity into structured, measurable place-based action in {placeName}. Click any stage below to inspect the work flow:
      </p>

      {/* Process Step Pipeline / Diagram Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                isActive 
                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-[#29B6BD] shadow-md scale-[1.02]' 
                  : 'bg-[#F4F4F0]/60 hover:bg-[#F4F4F0] border-[#e1e1db] text-[#1a2521]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10 text-teal-300' : 'bg-white text-[#176e73] shadow-2xs'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-teal-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                  Step 0{step.id}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-extrabold tracking-tight leading-snug">{step.shortTitle}</h4>
                <p className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-slate-300' : 'text-[#51615a]'}`}>
                  {step.headline}
                </p>
              </div>

              {/* Connecting line indicator */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Stage Detail Panel */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-4 shadow-sm animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-500/30">
              <currentStepObj.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Stage {currentStepObj.id} Detail • {placeName}
              </span>
              <h4 className="text-lg font-bold text-white tracking-tight">{currentStepObj.headline}</h4>
            </div>
          </div>
          <span className="px-3 py-1 bg-teal-400/20 text-teal-300 border border-teal-400/30 rounded-full font-bold text-xs self-start sm:self-auto">
            Live in {placeName}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {currentStepObj.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Deliverables & Outputs</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {currentStepObj.keyOutputs.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Collaborating Partners</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentStepObj.activePartners}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
