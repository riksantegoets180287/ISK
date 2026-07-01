/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Category, 
  Subcategory, 
  Question, 
  Rule, 
  TextBlock, 
  Analysis, 
  StudentProfile, 
  AppSettings,
  RuleCondition
} from '../types';
import { 
  defaultCategories, 
  defaultSubcategories, 
  defaultQuestions, 
  defaultTextBlocks, 
  defaultRules, 
  defaultSettings,
  defaultAnalyses
} from '../data/defaultData';

interface ProjectState {
  categories: Category[];
  subcategories: Subcategory[];
  questions: Question[];
  rules: Rule[];
  textblocks: TextBlock[];
  settings: AppSettings;
  analyses: Analysis[];

  // Database Management Actions
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  setSubcategories: (subcategories: Subcategory[]) => void;
  addSubcategory: (subcategory: Subcategory) => void;
  updateSubcategory: (subcategory: Subcategory) => void;
  deleteSubcategory: (id: string) => void;

  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;

  setRules: (rules: Rule[]) => void;
  addRule: (rule: Rule) => void;
  updateRule: (rule: Rule) => void;
  deleteRule: (id: string) => void;

  setTextblocks: (textblocks: TextBlock[]) => void;
  addTextblock: (textblock: TextBlock) => void;
  updateTextblock: (textblock: TextBlock) => void;
  deleteTextblock: (id: string) => void;

  updateSettings: (settings: Partial<AppSettings>) => void;
  updatePDFSettings: (pdfSettings: Partial<AppSettings['pdfSettings']>) => void;

  // Analysis & Questionnaire Core Logic
  addAnalysis: (analysis: Analysis) => void;
  deleteAnalysis: (id: string) => void;
  generateReport: (profile: StudentProfile, answers: Record<string, number>, customNotes?: string) => Analysis;

  // Utilities
  resetToDefaults: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      subcategories: defaultSubcategories,
      questions: defaultQuestions,
      rules: defaultRules,
      textblocks: defaultTextBlocks,
      settings: defaultSettings,
      analyses: defaultAnalyses,

      setCategories: (categories) => set({ categories }),
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (updated) => set((state) => ({
        categories: state.categories.map((c) => (c.id === updated.id ? updated : c))
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        subcategories: state.subcategories.filter((s) => s.categoryId !== id),
        questions: state.questions.filter((q) => q.categoryId !== id)
      })),

      setSubcategories: (subcategories) => set({ subcategories }),
      addSubcategory: (sub) => set((state) => ({ subcategories: [...state.subcategories, sub] })),
      updateSubcategory: (updated) => set((state) => ({
        subcategories: state.subcategories.map((s) => (s.id === updated.id ? updated : s))
      })),
      deleteSubcategory: (id) => set((state) => ({
        subcategories: state.subcategories.filter((s) => s.id !== id),
        questions: state.questions.filter((q) => q.subcategoryId !== id)
      })),

      setQuestions: (questions) => set({ questions }),
      addQuestion: (q) => set((state) => ({ questions: [...state.questions, q].sort((a, b) => a.order - b.order) })),
      updateQuestion: (updated) => set((state) => ({
        questions: state.questions.map((q) => (q.id === updated.id ? updated : q)).sort((a, b) => a.order - b.order)
      })),
      deleteQuestion: (id) => set((state) => ({
        questions: state.questions.filter((q) => q.id !== id)
      })),

      setRules: (rules) => set({ rules }),
      addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
      updateRule: (updated) => set((state) => ({
        rules: state.rules.map((r) => (r.id === updated.id ? updated : r))
      })),
      deleteRule: (id) => set((state) => ({
        rules: state.rules.filter((r) => r.id !== id)
      })),

      setTextblocks: (textblocks) => set({ textblocks }),
      addTextblock: (tb) => set((state) => ({ textblocks: [...state.textblocks, tb] })),
      updateTextblock: (updated) => set((state) => ({
        textblocks: state.textblocks.map((tb) => (tb.id === updated.id ? updated : tb))
      })),
      deleteTextblock: (id) => set((state) => ({
        textblocks: state.textblocks.filter((tb) => tb.id !== id),
        // Remove text block references from rules
        rules: state.rules.map((rule) => ({
          ...rule,
          resultTextBlockIds: rule.resultTextBlockIds.filter((tId) => tId !== id)
        }))
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      updatePDFSettings: (newPdfSettings) => set((state) => ({
        settings: {
          ...state.settings,
          pdfSettings: { ...state.settings.pdfSettings, ...newPdfSettings }
        }
      })),

      addAnalysis: (analysis) => set((state) => ({
        analyses: [analysis, ...state.analyses]
      })),

      deleteAnalysis: (id) => set((state) => ({
        analyses: state.analyses.filter((a) => a.id !== id)
      })),

      resetToDefaults: () => set({
        categories: defaultCategories,
        subcategories: defaultSubcategories,
        questions: defaultQuestions,
        rules: defaultRules,
        textblocks: defaultTextBlocks,
        settings: defaultSettings,
        analyses: defaultAnalyses
      }),

      generateReport: (profile, answers, customNotes) => {
        const { categories, questions, rules, textblocks } = get();

        // 1. Calculate category scores
        const categoryScores: Record<string, { rawScore: number; maxPossible: number; percentage: number }> = {};

        categories.forEach((cat) => {
          const catQuestions = questions.filter((q) => q.categoryId === cat.id);
          
          let rawScore = 0;
          let maxPossible = 0;
          let minPossible = 0;

          catQuestions.forEach((q) => {
            const answer = answers[q.id] || 3; // default to neutral if unanswered
            const adjustedAnswer = q.reverseScore 
              ? (q.maxScore + q.minScore) - answer 
              : answer;

            rawScore += adjustedAnswer * q.weight;
            maxPossible += q.maxScore * q.weight;
            minPossible += q.minScore * q.weight;
          });

          const range = maxPossible - minPossible;
          const percentage = range > 0 
            ? Math.round(((rawScore - minPossible) / range) * 100)
            : 50; // default safe value if no questions

          categoryScores[cat.id] = {
            rawScore,
            maxPossible,
            percentage
          };
        });

        // 2. Evaluate Rule Engine
        const reportTextBlocks: Record<'Profielschets' | 'Handelingsadvies' | 'Reflectiestimulering' | 'Advies vervolgstappen', Set<string>> = {
          Profielschets: new Set(),
          Handelingsadvies: new Set(),
          Reflectiestimulering: new Set(),
          'Advies vervolgstappen': new Set()
        };

        const evaluateCondition = (cond: RuleCondition): boolean => {
          let actualValue: number | string | undefined;

          if (cond.type === 'category') {
            actualValue = categoryScores[cond.targetId]?.percentage;
          } else if (cond.type === 'question') {
            actualValue = answers[cond.targetId];
          } else if (cond.type === 'profile') {
            const field = cond.targetId as keyof StudentProfile;
            actualValue = profile[field];
          }

          if (actualValue === undefined) return false;

          // Perform comparison
          const numericActual = Number(actualValue);
          const numericValue = Number(cond.value);

          if (!isNaN(numericActual) && !isNaN(numericValue)) {
            switch (cond.operator) {
              case '>': return numericActual > numericValue;
              case '<': return numericActual < numericValue;
              case '>=': return numericActual >= numericValue;
              case '<=': return numericActual <= numericValue;
              case '==': return numericActual === numericValue;
              default: return false;
            }
          } else {
            // String comparison
            const strActual = String(actualValue).toLowerCase();
            const strValue = String(cond.value).toLowerCase();
            switch (cond.operator) {
              case '==': return strActual === strValue;
              default: return false;
            }
          }
        };

        rules.forEach((rule) => {
          if (!rule.active || rule.conditions.length === 0) return;

          let matched = false;
          if (rule.logicalOperator === 'AND') {
            matched = rule.conditions.every(evaluateCondition);
          } else {
            matched = rule.conditions.some(evaluateCondition);
          }

          if (matched) {
            rule.resultTextBlockIds.forEach((tbId) => {
              // Ensure the text block exists, is active, and matches the rule type
              const tb = textblocks.find((t) => t.id === tbId);
              if (tb && tb.active) {
                reportTextBlocks[tb.type].add(tb.id);
              }
            });
          }
        });

        // Convert sets to sorted arrays
        const generatedReport = {
          Profielschets: Array.from(reportTextBlocks.Profielschets),
          Handelingsadvies: Array.from(reportTextBlocks.Handelingsadvies),
          Reflectiestimulering: Array.from(reportTextBlocks.Reflectiestimulering),
          'Advies vervolgstappen': Array.from(reportTextBlocks['Advies vervolgstappen'])
        };

        const analysis: Analysis = {
          id: `analysis_${Date.now()}`,
          studentName: profile.name,
          profile,
          answers,
          categoryScores,
          generatedReport,
          customNotes,
          createdAt: new Date().toISOString()
        };

        return analysis;
      }
    }),
    {
      name: 'edu-profile-advisor-storage',
      partialize: (state) => ({
        categories: state.categories,
        subcategories: state.subcategories,
        questions: state.questions,
        rules: state.rules,
        textblocks: state.textblocks,
        settings: state.settings,
        analyses: state.analyses
      })
    }
  )
);
