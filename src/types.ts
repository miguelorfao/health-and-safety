export interface User {
  id: string;
  username: string;
  password: string;
  restaurantId: string;
  role: 'manager' | 'staff' | 'admin';
}

export interface Action {
  id: string;
  restaurantId: string;
  issueType: 'temperature' | 'hs_check' | 'checklist' | 'other';
  issueId: string;
  description: string;
  actionTaken: string;
  timestamp: Date;
  user: string;
}

export interface TemperatureReading {
  id: string;
  restaurantId: string;
  type: 'cold' | 'hot' | 'frozen' | 'fridge';
  foodItem: string;
  temperature: number;
  unit: 'C' | 'F';
  timestamp: Date;
  user: string;
}

export interface HSCheck {
  id: string;
  restaurantId: string;
  checkType: string;
  passed: boolean;
  notes: string;
  timestamp: Date;
  user: string;
}

export interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
  notes?: string;
}

export interface Checklist {
  id: string;
  restaurantId: string;
  type: 'opening' | 'closing';
  items: ChecklistItem[];
  timestamp: Date;
  user: string;
}

export interface Restaurant {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  restaurantId: string;
  name: string;
  type: 'license' | 'hs_document' | 'training_record';
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  uploadedBy: string;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'pending_review';
}