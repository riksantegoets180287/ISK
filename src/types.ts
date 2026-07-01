/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Category {
  id: string;
  name: string; // e.g. "Gedrag"
  description?: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string; // e.g. "Werkhouding"
}

export interface Question {
  id: string;
  text: string;
  categoryId: string; // e.g. "gedrag"
  subcategoryId: string; // e.g. "werkhouding"
  minScore: number; // usually 1
  maxScore: number; // usually 5
  weight: number; // wegingsfactor (e.g., 1.0, 1.5, 2.0)
  reverseScore: boolean; // if true: response value is flipped (e.g., 5 becomes 1)
  tags: string[]; // optionele tags
  order: number;
}

export type RuleType = 'Profielschets' | 'Handelingsadvies' | 'Reflectiestimulering' | 'Advies vervolgstappen';

export interface RuleCondition {
  id: string;
  type: 'category' | 'question' | 'profile'; // profile fields like age, timeInNL, etc.
  targetId: string; // categoryId, questionId, or profile field name (e.g. "timeInNL")
  operator: '>' | '<' | '==' | '>=' | '<=';
  value: number | string;
}

export interface Rule {
  id: string;
  name: string;
  type: RuleType;
  logicalOperator: 'AND' | 'OR'; // combine conditions
  conditions: RuleCondition[];
  resultTextBlockIds: string[]; // Text blocks to include when conditions match
  active: boolean;
}

export interface TextBlock {
  id: string;
  title: string;
  categoryId: string; // e.g., "gedrag", "algemeen"
  type: RuleType;
  content: string; // Markdown or plain text
  active: boolean;
}

export interface StudentProfile {
  name: string;
  age: number;
  timeInNL: string; // e.g. "Minder dan 1 jaar", "1-3 jaar", "Meer dan 3 jaar"
  timeInEducation: string; // e.g. "Minder dan 1 jaar", "1-2 jaar", "Meer dan 2 jaar"
  homeSituation: string; // e.g. "Woont bij ouders", "Alleenstaand", "Begeleid wonen"
  schoolHistory: string; // e.g. "Geen onderwijs", "Basisonderwijs in land van herkomst", "Voortgezet onderwijs"
}

export interface Analysis {
  id: string;
  studentName: string;
  profile: StudentProfile;
  answers: Record<string, number>; // questionId -> Likert answer (1-5)
  categoryScores: Record<string, {
    rawScore: number;
    maxPossible: number;
    percentage: number; // 0 - 100 representing positive index
  }>;
  generatedReport: {
    Profielschets: string[]; // text block IDs
    Handelingsadvies: string[]; // text block IDs
    Reflectiestimulering: string[]; // text block IDs
    'Advies vervolgstappen': string[]; // text block IDs
  };
  customNotes?: string;
  createdAt: string; // ISO timestamp
}

export interface PDFLayoutSettings {
  primaryColor: string; // hex
  secondaryColor: string; // hex
  showGraphs: boolean;
  headerTitle: string;
  schoolName: string;
}

export interface AppSettings {
  pdfSettings: PDFLayoutSettings;
  testMode: boolean;
}
