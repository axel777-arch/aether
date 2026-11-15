/**
 * Types for Aether alerts, recovery tracking, priority ranking, and data quality
 */

export type AlertClassification =
  | 'critical_stress'
  | 'subsurface_drying'
  | 'vegetation_deterioration'
  | 'false_recovery'
  | 'persistent_deficit';

export type AlertReviewStatus =
  | 'sample'
  | 'draft'
  | 'awaiting_review'
  | 'approved_for_future_dispatch'
  | 'simulated'
  | 'cancelled';

export interface EnvironmentalAlert {
  id: string;
  referenceNumber: string; // e.g. "DEMO-001"
  regionId: string;
  regionName: string;
  regionNameAm: string;
  woredaName?: string;
  observationDate: string; // "2024-11"
  observationPeriod: string; // "October 2024 – November 2024"
  classification: AlertClassification;
  classificationTitle: string;
  classificationTitleAm: string;
  severity: 'severe' | 'high' | 'moderate' | 'watch';
  reviewStatus: AlertReviewStatus;
  indicatorsInvolved: {
    rainfallZ: number;
    soilZ: number;
    vegZ: number;
  };
  triggerCondition: string;
  triggerConditionAm: string;
  supportingMeasurements: string[];
  dataQuality: 'good' | 'partial' | 'limited' | 'insufficient';
  dataQualityNote: string;
  explanation: string;
  explanationAm: string;
  recommendations: string[];
  isSampleOnly: boolean;
}

export type ContactVerificationStatus =
  | 'placeholder'
  | 'awaiting_verification'
  | 'verified_official_contact'
  | 'inactive';

export interface AuthorityContact {
  id: string;
  organizationName: string;
  organizationCategory:
    | 'National Disaster Risk Management'
    | 'Regional Disaster Risk Management'
    | 'Agricultural & Pastoral Development'
    | 'Local Government Administration'
    | 'Environmental Monitoring Agency';
  officialRole: string;
  region: string;
  placeholderPhone: string; // e.g. "+251 9XX XXX 101 [DEMO]"
  contactSource: string;
  verificationDate: string;
  verificationStatus: ContactVerificationStatus;
  preferredLanguage: 'English' | 'Amharic' | 'Afaan Oromo';
}

export type RecoveryStatus =
  | 'recovery_across_indicators'
  | 'partial_recovery'
  | 'incomplete_recovery'
  | 'persistent_stress'
  | 'insufficient_data';

export interface RecoveryTimelinePoint {
  date: string;
  rainfallStatus: 'recovered' | 'normal' | 'stressed';
  soilStatus: 'recovered' | 'normal' | 'stressed';
  vegetationStatus: 'recovered' | 'normal' | 'stressed';
  rainfallZ: number;
  soilZ: number;
  vegZ: number;
  overallStatus: RecoveryStatus;
  notes: string;
}

export interface RegionalInvestigationPriority {
  rank: number;
  regionId: string;
  regionName: string;
  regionNameAm: string;
  stressIndicatorsCount: number;
  indicatorsSummary: string[];
  rainfallAnomalyZ: number;
  soilAnomalyZ: number;
  vegAnomalyZ: number;
  compositeScore: number;
  persistenceMonths: number;
  trendDirection: 'deteriorating' | 'improving' | 'stable';
  observationPeriod: string;
  dataAvailability: 'good' | 'partial' | 'limited';
  priorityLevel: 'high_priority' | 'medium_priority' | 'routine_monitoring';
  reasonForRanking: string;
  reasonForRankingAm: string;
}

export interface DatasetQualityMetadata {
  datasetId: string;
  datasetName: string;
  sensorSource: string;
  variableMeasured: string;
  spatialResolution: string;
  temporalCadence: string;
  availablePeriod: string;
  coverageStatus: 'Good data coverage' | 'Partial data coverage' | 'Limited data' | 'Insufficient data';
  missingObservationsPct: number;
  qualityFlags: string[];
  processingStatus: 'Operational Baseline' | 'Experimental Pipeline' | 'Planned Integration';
  knownLimitations: string;
  lastUpdated: string;
}
