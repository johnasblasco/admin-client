// Core Types for Health Monitoring System

export type UserRole = 'student' | 'admin';

export type SeverityLevel = 'mild' | 'moderate' | 'severe';

export interface Symptom {
    key: any;
    id: string;
    name: string;
    category: 'respiratory' | 'digestive' | 'general' | 'other';
    icon: string;
}


export type CreateHealthReport = Omit<
    HealthReport,
    'id' | 'userId' | 'studentHashedId' | 'timestamp' | 'status'
>;


export interface HealthReport {
    studentHashedId: any
    id: string;
    userId: string;
    userGradeLevel: string;
    symptoms: string[];
    severity: SeverityLevel;
    dateOfOnset: string;
    confirmedDisease: boolean;
    diseaseName?: string;
    location: {
        building: string;
        room: string;
        seatNumber: string;
    };
    timestamp: string;
    status: any;
}

export interface Location {
    building: string;
    rooms: string[];
}

export interface HotspotData {
    building: string;
    room: string;
    reportCount: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    lastUpdated: string;
}

export interface PredictionData {
    date: string;
    confirmed: number;
    predicted: number;
    lowerBound: number;
    upperBound: number;
}

export interface BayesianParameter {
    priorProbability: number;
    likelihoodRatio: number;
    posteriorProbability: number;
    confidenceInterval: [number, number];
}

export interface RiskScore {
    building: string;
    room: string;
    score: number; // 0-100
    trend: 'increasing' | 'stable' | 'decreasing';
    predictedCases: number;
}

export interface SuggestedAction {
    id: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    type: 'disinfection' | 'notification' | 'monitoring' | 'closure';
    title: string;
    description: string;
    affectedLocations: string[];
    timestamp: string;
    status: 'pending' | 'in-progress' | 'completed';
}

export interface DashboardStats {
    totalReportsToday: number;
    confirmedCases: number;
    suspectedCases: number;
    activeHotspots: number;
    weeklyGrowthRate: number;
}
