// 病院情報の型定義
export interface Hospital {
  id: string;
  name: string;
  departments: string[];
  availableBeds: number;
  totalBeds: number;
  hasOnCallDoctor: boolean;
  acceptsEmergency: boolean;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  specialties: string[];
  pastPerformance: {
    totalCases: number;
    successRate: number;
  };
}

// 患者情報の型定義
export interface PatientInfo {
  age: number;
  symptoms: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  preferredConditions: string;
  distance?: number;
}

// AI推薦結果の型定義
export interface AIRecommendation {
  hospital: Hospital;
  score: number;
  reasoning: {
    distance: string;
    availability: string;
    specialty: string;
    performance: string;
  };
}

// 搬送記録の型定義
export interface TransportRecord {
  id: string;
  patientInfo: PatientInfo;
  selectedHospital: Hospital;
  accepted: boolean;
  transportTime: number; // 分単位
  notes: string;
  timestamp: Date;
}

// 紹介状の型定義
export interface ReferralLetter {
  patientAge: number;
  symptoms: string;
  severity: string;
  referringDoctor: string;
  targetHospital: string;
  content: string;
}
