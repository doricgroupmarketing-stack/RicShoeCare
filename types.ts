export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface AnalysisResult {
  shoeType: string;
  material: string;
  condition: string;
  recommendedService: string;
  estimatedCost: string;
  reasoning: string;
  recommendedProducts: string[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  gallery?: string[];
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  sizes?: string[];
  colors?: string[];
}