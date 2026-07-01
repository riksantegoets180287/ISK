/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { 
  ArrowLeft, 
  Settings, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown,
  Wrench,
  Sparkles,
  Info,
  Layers,
  Sliders,
  Type,
  FileText,
  RefreshCw,
  FolderTree,
  BookOpen,
  Shield
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AdminGuidePdfDocument } from './AdminGuidePdf';
import { Question, Category, Subcategory, Rule, TextBlock, RuleCondition, RuleType } from '../types';

interface AdminViewProps {
  onNavigate: (page: string, params?: any) => void;
}

type AdminTab = 'dashboard' | 'questions' | 'categories' | 'subcategories' | 'rules' | 'textblocks' | 'pdf_styling' | 'test_mode' | 'handleiding';

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const store = useProjectStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // --- QUESTION CRUD STATE ---
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qText, setQText] = useState('');
  const [qCategory, setQCategory] = useState('gedrag');
  const [qSubcategory, setQSubcategory] = useState('werkhouding');
  const [qWeight, setQWeight] = useState(1.0);
  const [qReverse, setQReverse] = useState(false);
  const [qTags, setQTags] = useState('');

  // --- CATEGORY CRUD STATE ---
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catIdInput, setCatIdInput] = useState('');
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // --- SUBCATEGORY CRUD STATE ---
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [subIdInput, setSubIdInput] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('gedrag');
  const [subName, setSubName] = useState('');

  // --- TEXTBLOCK CRUD STATE ---
  const [editingTextBlockId, setEditingTextBlockId] = useState<string | null>(null);
  const [tbIdInput, setTbIdInput] = useState('');
  const [tbTitle, setTbTitle] = useState('');
  const [tbCategory, setTbCategory] = useState('gedrag');
  const [tbType, setTbType] = useState<RuleType>('Profielschets');
  const [tbContent, setTbContent] = useState('');
  const [tbActive, setTbActive] = useState(true);

  // --- RULE CRUD STATE ---
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('Profielschets');
  const [ruleLogical, setRuleLogical] = useState<'AND' | 'OR'>('AND');
  const [ruleConditions, setRuleConditions] = useState<RuleCondition[]>([]);
  const [ruleTextBlockIds, setRuleTextBlockIds] = useState<string[]>([]);
  const [ruleActive, setRuleActive] = useState(true);

  // --- TEST MODUS STATE ---
  const [testGedrag, setTestGedrag] = useState(50);
  const [testTaal, setTestTaal] = useState(50);
  const [testSocem, setTestSocem] = useState(50);
  const [testBesch, setTestBesch] = useState(50);
  const [testAge, setTestAge] = useState(16);
  const [testTimeInNL, setTestTimeInNL] = useState('1-3 jaar');

  // --- UTILITY HANDLERS ---
  const handleSaveQuestion = (id: string | null) => {
    if (!qText.trim()) return;

    const tagsArr = qTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (id) {
      // Update
      const oldQ = store.questions.find((q) => q.id === id);
      if (oldQ) {
        store.updateQuestion({
          ...oldQ,
          text: qText,
          categoryId: qCategory,
          subcategoryId: qSubcategory,
          weight: qWeight,
          reverseScore: qReverse,
          tags: tagsArr
        });
      }
    } else {
      // Add
      const newId = `q_${Date.now()}`;
      store.addQuestion({
        id: newId,
        text: qText,
        categoryId: qCategory,
        subcategoryId: qSubcategory,
        minScore: 1,
        maxScore: 5,
        weight: qWeight,
        reverseScore: qReverse,
        tags: tagsArr,
        order: store.questions.length + 1
      });
    }

    // Reset Form
    setEditingQuestionId(null);
    setQText('');
    setQWeight(1.0);
    setQReverse(false);
    setQTags('');
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const list = [...store.questions];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    
    // Re-assign order fields
    const updated = list.map((q, idx) => ({ ...q, order: idx + 1 }));
    store.setQuestions(updated);
  };

  const handleSaveCategory = (id: string | null) => {
    if (!catIdInput.trim() || !catName.trim()) return;

    if (id) {
      store.updateCategory({ id, name: catName, description: catDesc });
    } else {
      store.addCategory({ id: catIdInput.trim().toLowerCase(), name: catName, description: catDesc });
    }

    setEditingCategoryId(null);
    setCatIdInput('');
    setCatName('');
    setCatDesc('');
  };

  const handleSaveSubcategory = (id: string | null) => {
    if (!subIdInput.trim() || !subName.trim()) return;

    if (id) {
      store.updateSubcategory({ id, categoryId: subCategoryId, name: subName });
    } else {
      store.addSubcategory({ id: subIdInput.trim().toLowerCase(), categoryId: subCategoryId, name: subName });
    }

    setEditingSubcategoryId(null);
    setSubIdInput('');
    setSubName('');
  };

  const handleSaveTextBlock = (id: string | null) => {
    if (!tbTitle.trim() || !tbContent.trim()) return;

    if (id) {
      store.updateTextblock({
        id,
        title: tbTitle,
        categoryId: tbCategory,
        type: tbType,
        content: tbContent,
        active: tbActive
      });
    } else {
      const newId = `tb_${Date.now()}`;
      store.addTextblock({
        id: newId,
        title: tbTitle,
        categoryId: tbCategory,
        type: tbType,
        content: tbContent,
        active: tbActive
      });
    }

    setEditingTextBlockId(null);
    setTbTitle('');
    setTbContent('');
    setTbActive(true);
  };

  // --- RULE MANAGER LOGIC ---
  const handleAddCondition = () => {
    const newCond: RuleCondition = {
      id: `cond_${Date.now()}`,
      type: 'category',
      targetId: 'gedrag',
      operator: '<',
      value: 50
    };
    setRuleConditions([...ruleConditions, newCond]);
  };

  const handleUpdateCondition = (condId: string, fields: Partial<RuleCondition>) => {
    setRuleConditions(
      ruleConditions.map((cond) => (cond.id === condId ? { ...cond, ...fields } : cond))
    );
  };

  const handleRemoveCondition = (condId: string) => {
    setRuleConditions(ruleConditions.filter((cond) => cond.id !== condId));
  };

  const handleToggleRuleTextBlock = (tbId: string) => {
    if (ruleTextBlockIds.includes(tbId)) {
      setRuleTextBlockIds(ruleTextBlockIds.filter((id) => id !== tbId));
    } else {
      setRuleTextBlockIds([...ruleTextBlockIds, tbId]);
    }
  };

  const handleSaveRule = (id: string | null) => {
    if (!ruleName.trim() || ruleConditions.length === 0) {
      alert('Vul een regelnaam in en voeg ten minste één voorwaarde toe.');
      return;
    }

    const ruleData: Rule = {
      id: id || `rule_${Date.now()}`,
      name: ruleName,
      type: ruleType,
      logicalOperator: ruleLogical,
      conditions: ruleConditions,
      resultTextBlockIds: ruleTextBlockIds,
      active: ruleActive
    };

    if (id) {
      store.updateRule(ruleData);
    } else {
      store.addRule(ruleData);
    }

    // Reset Form
    setEditingRuleId(null);
    setRuleName('');
    setRuleConditions([]);
    setRuleTextBlockIds([]);
    setRuleActive(true);
  };

  // --- TEST MODUS LOGIC ---
  const getTestActiveRulesAndBlocks = () => {
    const activeRules: Rule[] = [];
    const activeBlocks: TextBlock[] = [];

    const scores = {
      gedrag: { rawScore: 0, maxPossible: 0, percentage: testGedrag },
      taal_communicatie: { rawScore: 0, maxPossible: 0, percentage: testTaal },
      sociaal_emotioneel: { rawScore: 0, maxPossible: 0, percentage: testSocem },
      beschermende_factoren: { rawScore: 0, maxPossible: 0, percentage: testBesch }
    };

    const profile = {
      name: 'Test Student',
      age: testAge,
      timeInNL: testTimeInNL,
      timeInEducation: '1-2 jaar',
      homeSituation: 'Woont bij ouders',
      schoolHistory: 'Voortgezet onderwijs'
    };

    const evaluateCondition = (cond: RuleCondition): boolean => {
      let val: any;
      if (cond.type === 'category') {
        val = scores[cond.targetId as keyof typeof scores]?.percentage;
      } else if (cond.type === 'profile') {
        val = profile[cond.targetId as keyof typeof profile];
      }

      if (val === undefined) return false;

      const actNum = Number(val);
      const valNum = Number(cond.value);

      if (!isNaN(actNum) && !isNaN(valNum)) {
        switch (cond.operator) {
          case '>': return actNum > valNum;
          case '<': return actNum < valNum;
          case '>=': return actNum >= valNum;
          case '<=': return actNum <= valNum;
          case '==': return actNum === valNum;
          default: return false;
        }
      } else {
        switch (cond.operator) {
          case '==': return String(val).toLowerCase() === String(cond.value).toLowerCase();
          default: return false;
        }
      }
    };

    store.rules.forEach((rule) => {
      if (!rule.active || rule.conditions.length === 0) return;

      let matched = false;
      if (rule.logicalOperator === 'AND') {
        matched = rule.conditions.every(evaluateCondition);
      } else {
        matched = rule.conditions.some(evaluateCondition);
      }

      if (matched) {
        activeRules.push(rule);
        rule.resultTextBlockIds.forEach((tbId) => {
          const tb = store.textblocks.find((t) => t.id === tbId);
          if (tb && tb.active && !activeBlocks.some((b) => b.id === tbId)) {
            activeBlocks.push(tb);
          }
        });
      }
    });

    return { activeRules, activeBlocks };
  };

  const { activeRules: testActiveRules, activeBlocks: testActiveBlocks } = getTestActiveRulesAndBlocks();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back to dashboard and Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Beheeromgeving</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configureer vragen, scores, beslisregels en adviesteksten</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-1.5 h-fit">
          <h3 className="px-3.5 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Navigatie</h3>
          {[
            { id: 'dashboard', name: 'Dashboard', icon: Layers },
            { id: 'questions', name: 'Vragen beheren', icon: HelpCircle },
            { id: 'categories', name: 'Categorieën', icon: FolderTree },
            { id: 'subcategories', name: 'Subcategorieën', icon: FolderTree },
            { id: 'rules', name: 'Regels beheren', icon: Sliders },
            { id: 'textblocks', name: 'Tekstblokken', icon: Type },
            { id: 'pdf_styling', name: 'PDF-opmaak', icon: FileText },
            { id: 'test_mode', name: 'Simulatie Testmodus', icon: Sparkles },
            { id: 'handleiding', name: 'Beheerdershandleiding', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as AdminTab);
                  setEditingQuestionId(null);
                  setEditingRuleId(null);
                  setEditingTextBlockId(null);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* 1. DASHBOARD STATS */}
          {activeTab === 'dashboard' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800">Systeem Overzicht</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-50">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Aantal Vragen</h4>
                  <p className="text-3xl font-extrabold text-indigo-950 mt-2">{store.questions.length}</p>
                </div>
                <div className="p-5 bg-teal-50/50 rounded-xl border border-teal-50">
                  <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Beslisregels</h4>
                  <p className="text-3xl font-extrabold text-teal-950 mt-2">{store.rules.length}</p>
                </div>
                <div className="p-5 bg-purple-50/50 rounded-xl border border-purple-50">
                  <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider">Rapport Tekstblokken</h4>
                  <p className="text-3xl font-extrabold text-purple-950 mt-2">{store.textblocks.length}</p>
                </div>
                <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-50">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Categorieën</h4>
                  <p className="text-3xl font-extrabold text-amber-950 mt-2">{store.categories.length}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-100 p-5 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Wrench className="w-4.5 h-4.5 text-slate-500" />
                  Volledig datagedreven architectuur
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Deze applicatie maakt gebruik van een flexibele beslismotor. Door vragen te wijzigen of nieuwe wegingen en regels aan te maken, past de profileerder zich onmiddellijk aan. Alle gegevens worden lokaal in uw browser opgeslagen.
                </p>
              </div>
            </div>
          )}

          {/* 2. QUESTIONS CRUD */}
          {activeTab === 'questions' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Vragenlijst configureren</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Pas Likert-vragen, wegingen en omgekeerde scores aan.</p>
                </div>
                {editingQuestionId === null && (
                  <button
                    onClick={() => {
                      setEditingQuestionId('new');
                      setQText('');
                      setQCategory(store.categories[0]?.id || 'gedrag');
                      setQSubcategory(store.subcategories[0]?.id || 'werkhouding');
                      setQWeight(1.0);
                      setQReverse(false);
                      setQTags('');
                    }}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Vraag toevoegen
                  </button>
                )}
              </div>

              {/* Editing question form overlay */}
              {editingQuestionId !== null && (
                <div className="p-5 border border-indigo-100 rounded-2xl bg-indigo-50/10 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {editingQuestionId === 'new' ? 'Nieuwe vraag toevoegen' : 'Vraag bewerken'}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Stelling tekst *</label>
                      <input
                        type="text"
                        value={qText}
                        onChange={(e) => setQText(e.target.value)}
                        placeholder="Bijv. Is erg faalangstig..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Hoofdcategorie</label>
                        <select
                          value={qCategory}
                          onChange={(e) => setQCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          {store.categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Subcategorie</label>
                        <select
                          value={qSubcategory}
                          onChange={(e) => setQSubcategory(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          {store.subcategories
                            .filter((s) => s.categoryId === qCategory)
                            .map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Wegingsfactor (getal)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={qWeight}
                          onChange={(e) => setQWeight(parseFloat(e.target.value) || 1.0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-5">
                        <input
                          id="reverse-ch"
                          type="checkbox"
                          checked={qReverse}
                          onChange={(e) => setQReverse(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="reverse-ch" className="text-xs font-medium text-slate-600">Omgekeerd scoren</label>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Tags (gescheiden door komma)</label>
                        <input
                          type="text"
                          value={qTags}
                          onChange={(e) => setQTags(e.target.value)}
                          placeholder="impulsief, gedrag"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setEditingQuestionId(null)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Annuleer
                    </button>
                    <button
                      onClick={() => handleSaveQuestion(editingQuestionId === 'new' ? null : editingQuestionId)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      Vraag Opslaan
                    </button>
                  </div>
                </div>
              )}

              {/* Questions table list */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                      <th className="px-4 py-3 w-12">Pos</th>
                      <th className="px-4 py-3">Stelling / Tekst</th>
                      <th className="px-4 py-3">Categorie</th>
                      <th className="px-4 py-3">Weging / Rev</th>
                      <th className="px-4 py-3 text-right">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {store.questions.map((q, idx) => (
                      <tr key={q.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-400">
                          <div className="flex flex-col">
                            <button 
                              onClick={() => handleMoveQuestion(idx, 'up')} 
                              disabled={idx === 0}
                              className="hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <span className="text-center">{q.order}</span>
                            <button 
                              onClick={() => handleMoveQuestion(idx, 'down')} 
                              disabled={idx === store.questions.length - 1}
                              className="hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {q.text}
                          <div className="flex gap-1 mt-1">
                            {q.tags.map((t) => (
                              <span key={t} className="px-1.5 py-0.2 bg-slate-100 text-slate-400 rounded text-[9px]">#{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="capitalize text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                            {q.categoryId.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>W: {q.weight}x</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{q.reverseScore ? '🔄 Omgekeerd' : '➡️ Direct'}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => {
                                setEditingQuestionId(q.id);
                                setQText(q.text);
                                setQCategory(q.categoryId);
                                setQSubcategory(q.subcategoryId);
                                setQWeight(q.weight);
                                setQReverse(q.reverseScore);
                                setQTags(q.tags.join(', '));
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Weet u zeker dat u deze vraag wilt verwijderen?')) {
                                  store.deleteQuestion(q.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CATEGORIES CRUD */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Hoofdcategorieën beheren</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Voeg categorieën toe voor de vragenlijst en analysescores.</p>
                </div>
                {editingCategoryId === null && (
                  <button
                    onClick={() => {
                      setEditingCategoryId('new');
                      setCatIdInput('');
                      setCatName('');
                      setCatDesc('');
                    }}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Categorie toevoegen
                  </button>
                )}
              </div>

              {editingCategoryId !== null && (
                <div className="p-4 border border-indigo-50 rounded-xl bg-indigo-50/10 space-y-3">
                  <h3 className="font-bold text-xs text-slate-800">
                    {editingCategoryId === 'new' ? 'Nieuwe categorie' : 'Categorie bewerken'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Unieke code ID</label>
                      <input
                        type="text"
                        placeholder="bijv. executieve_functies"
                        disabled={editingCategoryId !== 'new'}
                        value={catIdInput}
                        onChange={(e) => setCatIdInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Weergavenaam</label>
                      <input
                        type="text"
                        placeholder="bijv. Executieve Functies"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Beschrijving</label>
                      <input
                        type="text"
                        placeholder="Korte beschrijving voor toelichting..."
                        value={catDesc}
                        onChange={(e) => setCatDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setEditingCategoryId(null)} className="px-3 py-1.5 border rounded-lg text-xs cursor-pointer">Annuleer</button>
                    <button onClick={() => handleSaveCategory(editingCategoryId === 'new' ? null : editingCategoryId)} className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Opslaan</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {store.categories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{cat.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{cat.description || 'Geen beschrijving'}</p>
                      <span className="inline-block mt-2 font-mono text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">ID: {cat.id}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setCatIdInput(cat.id);
                          setCatName(cat.name);
                          setCatDesc(cat.description || '');
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Weet u zeker dat u deze categorie wilt verwijderen? Let op: alle gekoppelde subcategorieën en vragen worden ook verwijderd.')) {
                            store.deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SUBCATEGORIES CRUD */}
          {activeTab === 'subcategories' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Subcategorieën beheren</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Organiseer vragen binnen specifieke thematische onderdelen.</p>
                </div>
                {editingSubcategoryId === null && (
                  <button
                    onClick={() => {
                      setEditingSubcategoryId('new');
                      setSubIdInput('');
                      setSubCategoryId(store.categories[0]?.id || 'gedrag');
                      setSubName('');
                    }}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Subcategorie toevoegen
                  </button>
                )}
              </div>

              {editingSubcategoryId !== null && (
                <div className="p-4 border border-indigo-50 rounded-xl bg-indigo-50/10 space-y-3">
                  <h3 className="font-bold text-xs text-slate-800">
                    {editingSubcategoryId === 'new' ? 'Nieuwe subcategorie' : 'Subcategorie bewerken'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Unieke Code ID</label>
                      <input
                        type="text"
                        placeholder="bijv. impulsbeheersing"
                        disabled={editingSubcategoryId !== 'new'}
                        value={subIdInput}
                        onChange={(e) => setSubIdInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Koppel aan Hoofdcategorie</label>
                      <select
                        value={subCategoryId}
                        onChange={(e) => setSubCategoryId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        {store.categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Naam Subcategorie</label>
                      <input
                        type="text"
                        placeholder="bijv. Impulsbeheersing & Concentratie"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setEditingSubcategoryId(null)} className="px-3 py-1.5 border rounded-lg text-xs cursor-pointer">Annuleer</button>
                    <button onClick={() => handleSaveSubcategory(editingSubcategoryId === 'new' ? null : editingSubcategoryId)} className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Opslaan</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {store.subcategories.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{sub.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-semibold uppercase">
                          Bovenliggend: {store.categories.find((c) => c.id === sub.categoryId)?.name || sub.categoryId}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">ID: {sub.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingSubcategoryId(sub.id);
                          setSubIdInput(sub.id);
                          setSubCategoryId(sub.categoryId);
                          setSubName(sub.name);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Weet u zeker dat u deze subcategorie wilt verwijderen?')) {
                            store.deleteSubcategory(sub.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. VISUAL RULE EDITOR */}
          {activeTab === 'rules' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Visual Rule Engine</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Maak logische beslissingsregels aan om automatisch adviesteksten te triggeren.</p>
                </div>
                {editingRuleId === null && (
                  <button
                    onClick={() => {
                      setEditingRuleId('new');
                      setRuleName('');
                      setRuleType('Profielschets');
                      setRuleLogical('AND');
                      setRuleConditions([{
                        id: `cond_${Date.now()}`,
                        type: 'category',
                        targetId: 'gedrag',
                        operator: '<',
                        value: 50
                      }]);
                      setRuleTextBlockIds([]);
                      setRuleActive(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Regel toevoegen
                  </button>
                )}
              </div>

              {editingRuleId !== null && (
                <div className="p-6 border border-indigo-100 bg-indigo-50/10 rounded-2xl space-y-6">
                  <h3 className="font-bold text-sm text-indigo-950">
                    {editingRuleId === 'new' ? 'Nieuwe beslisregel bouwen' : 'Regel wijzigen'}
                  </h3>

                  <div className="space-y-4">
                    {/* General Rule Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Regelnaam *</label>
                        <input
                          type="text"
                          placeholder="bijv. Lage Taalvaardigheid - Advies"
                          value={ruleName}
                          onChange={(e) => setRuleName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Rapport Type</label>
                        <select
                          value={ruleType}
                          onChange={(e) => setRuleType(e.target.value as RuleType)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          <option value="Profielschets">Profielschets</option>
                          <option value="Handelingsadvies">Handelingsadvies</option>
                          <option value="Reflectiestimulering">Reflectiestimulering</option>
                          <option value="Advies vervolgstappen">Advies vervolgstappen</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Logische Operator</label>
                        <select
                          value={ruleLogical}
                          onChange={(e) => setRuleLogical(e.target.value as 'AND' | 'OR')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          <option value="AND">EN (Voldoe aan álle voorwaarden)</option>
                          <option value="OR">OF (Voldoe aan ten minste één)</option>
                        </select>
                      </div>
                    </div>

                    {/* Conditions Builder */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Voorwaarden (Triggers)</label>
                        <button
                          type="button"
                          onClick={handleAddCondition}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Trigger toevoegen
                        </button>
                      </div>

                      {ruleConditions.map((cond, idx) => (
                        <div key={cond.id} className="flex flex-wrap items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                          <span className="text-[10px] text-slate-400 font-bold">ALS</span>
                          
                          <select
                            value={cond.type}
                            onChange={(e) => handleUpdateCondition(cond.id, { 
                              type: e.target.value as 'category' | 'question' | 'profile',
                              targetId: e.target.value === 'category' 
                                ? 'gedrag' 
                                : e.target.value === 'question' 
                                  ? store.questions[0]?.id 
                                  : 'age'
                            })}
                            className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                          >
                            <option value="category">Categoriepercentage</option>
                            <option value="profile">Studentprofiel Veld</option>
                          </select>

                          {cond.type === 'category' ? (
                            <select
                              value={cond.targetId}
                              onChange={(e) => handleUpdateCondition(cond.id, { targetId: e.target.value })}
                              className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                            >
                              {store.categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={cond.targetId}
                              onChange={(e) => handleUpdateCondition(cond.id, { targetId: e.target.value })}
                              className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                            >
                              <option value="age">Leeftijd</option>
                              <option value="timeInNL">Tijd in Nederland</option>
                              <option value="schoolHistory">Schoolverleden</option>
                            </select>
                          )}

                          <select
                            value={cond.operator}
                            onChange={(e) => handleUpdateCondition(cond.id, { operator: e.target.value as any })}
                            className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                          >
                            <option value="<">kleiner dan (&lt;)</option>
                            <option value=">">groter dan (&gt;)</option>
                            <option value=">=">groter of gelijk (&gt;=)</option>
                            <option value="<=">kleiner of gelijk (&lt;=)</option>
                            <option value="==">is gelijk aan (==)</option>
                          </select>

                          <input
                            type="text"
                            placeholder="waarde"
                            value={cond.value}
                            onChange={(e) => handleUpdateCondition(cond.id, { value: e.target.value })}
                            className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs w-24 text-center bg-white"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(cond.id)}
                            disabled={ruleConditions.length === 1}
                            className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Resulting Text Blocks picker */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Koppel de gewenste tekstblokken (DAN deel)</label>
                      <p className="text-xs text-slate-500">Kies welke tekstblokken van het type <strong className="text-indigo-600">{ruleType}</strong> moeten worden ingevoegd:</p>
                      
                      <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-white">
                        {store.textblocks
                          .filter((tb) => tb.type === ruleType)
                          .map((tb) => {
                            const isSelected = ruleTextBlockIds.includes(tb.id);
                            return (
                              <label key={tb.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-lg text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleRuleTextBlock(tb.id)}
                                  className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 rounded"
                                />
                                <div>
                                  <span className="font-bold text-slate-700">{tb.title}</span>
                                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tb.content}</p>
                                </div>
                              </label>
                            );
                          })}
                        {store.textblocks.filter((tb) => tb.type === ruleType).length === 0 && (
                          <p className="text-xs text-slate-400 italic p-4 text-center">Maak eerst tekstblokken aan van het type '{ruleType}' in het Tekstblokken paneel.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ruleActive}
                        onChange={(e) => setRuleActive(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span>Regel actief</span>
                    </label>

                    <div className="flex space-x-2">
                      <button onClick={() => setEditingRuleId(null)} className="px-3 py-1.5 border rounded-lg text-xs cursor-pointer">Annuleer</button>
                      <button onClick={() => handleSaveRule(editingRuleId === 'new' ? null : editingRuleId)} className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Regel Opslaan</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rules List table */}
              <div className="space-y-4">
                {store.rules.map((rule) => (
                  <div 
                    key={rule.id} 
                    className={`p-5 rounded-xl border transition-all ${
                      rule.active ? 'border-slate-100 bg-white shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">{rule.name}</h4>
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">{rule.type}</span>
                          {!rule.active && <span className="text-[10px] text-red-500 font-bold uppercase">Inactief</span>}
                        </div>
                        
                        {/* Triggers list description */}
                        <div className="mt-3 text-xs text-slate-600 space-y-1">
                          <span className="font-semibold text-slate-400 text-[10px] uppercase">ALS ({rule.logicalOperator})</span>
                          {rule.conditions.map((cond, cIdx) => (
                            <div key={cond.id} className="flex items-center gap-1 text-slate-600 pl-2">
                              <span className="font-semibold text-indigo-600">•</span>
                              <span className="capitalize font-medium">{cond.type === 'category' ? `Categorie ${cond.targetId}` : `Student ${cond.targetId}`}</span>
                              <span className="font-mono text-indigo-800 font-bold px-1 rounded">{cond.operator}</span>
                              <span className="font-bold text-slate-800">{cond.value}{cond.type === 'category' && '%'}</span>
                            </div>
                          ))}
                        </div>

                        {/* Connected Text Blocks */}
                        <div className="mt-3">
                          <span className="font-semibold text-slate-400 text-[10px] uppercase block">DAN VOEG TOE:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {rule.resultTextBlockIds.map((tbId) => {
                              const tb = store.textblocks.find((t) => t.id === tbId);
                              return (
                                <span key={tbId} className="px-2 py-0.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-600 text-[10px]">
                                  {tb ? tb.title : tbId}
                                </span>
                              );
                            })}
                            {rule.resultTextBlockIds.length === 0 && <span className="text-red-500 italic text-[10px]">Geen tekstblokken gekoppeld</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-1 pl-4">
                        <button
                          onClick={() => {
                            setEditingRuleId(rule.id);
                            setRuleName(rule.name);
                            setRuleType(rule.type);
                            setRuleLogical(rule.logicalOperator);
                            setRuleConditions(rule.conditions);
                            setRuleTextBlockIds(rule.resultTextBlockIds);
                            setRuleActive(rule.active);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Weet u zeker dat u deze regel wilt verwijderen?')) {
                              store.deleteRule(rule.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TEXTBLOCKS CRUD */}
          {activeTab === 'textblocks' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Tekstblokken beheren</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Definieer de adviesteksten die door de regel-engine in de rapportage worden samengevoegd.</p>
                </div>
                {editingTextBlockId === null && (
                  <button
                    onClick={() => {
                      setEditingTextBlockId('new');
                      setTbTitle('');
                      setTbCategory('gedrag');
                      setTbType('Profielschets');
                      setTbContent('');
                      setTbActive(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tekstblok toevoegen
                  </button>
                )}
              </div>

              {editingTextBlockId !== null && (
                <div className="p-5 border border-indigo-100 bg-indigo-50/10 rounded-2xl space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {editingTextBlockId === 'new' ? 'Nieuw tekstblok toevoegen' : 'Tekstblok bewerken'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Titel van het blok *</label>
                      <input
                        type="text"
                        placeholder="bijv. Begeleidingsbehoefte structuur"
                        value={tbTitle}
                        onChange={(e) => setTbTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Rapportonderdeel (Type)</label>
                      <select
                        value={tbType}
                        onChange={(e) => setTbType(e.target.value as RuleType)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Profielschets">Profielschets</option>
                        <option value="Handelingsadvies">Handelingsadvies</option>
                        <option value="Reflectiestimulering">Reflectiestimulering</option>
                        <option value="Advies vervolgstappen">Advies vervolgstappen</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Thema / Categorie</label>
                      <select
                        value={tbCategory}
                        onChange={(e) => setTbCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        {store.categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Inhoud / Advies Tekst *</label>
                    <textarea
                      rows={5}
                      placeholder="Voer hier het uitgebreide pedagogische of handelingsadvies in..."
                      value={tbContent}
                      onChange={(e) => setTbContent(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tbActive}
                        onChange={(e) => setTbActive(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span>Blok actief</span>
                    </label>

                    <div className="flex space-x-2">
                      <button onClick={() => setEditingTextBlockId(null)} className="px-3 py-1.5 border rounded-lg text-xs cursor-pointer">Annuleer</button>
                      <button onClick={() => handleSaveTextBlock(editingTextBlockId === 'new' ? null : editingTextBlockId)} className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Blok Opslaan</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {store.textblocks.map((tb) => (
                  <div key={tb.id} className="p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{tb.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">{tb.type}</span>
                          <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-bold capitalize">{tb.categoryId}</span>
                          {!tb.active && <span className="text-[10px] text-red-500 font-bold uppercase">Inactief</span>}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingTextBlockId(tb.id);
                            setTbTitle(tb.title);
                            setTbCategory(tb.categoryId);
                            setTbType(tb.type);
                            setTbContent(tb.content);
                            setTbActive(tb.active);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Weet u zeker dat u dit tekstblok wilt verwijderen?')) {
                              store.deleteTextblock(tb.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">{tb.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PDF LAYOUT SETTINGS */}
          {activeTab === 'pdf_styling' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800">PDF-opmaak & Styling</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Rapport Header Titel</label>
                  <input
                    type="text"
                    value={store.settings.pdfSettings.headerTitle}
                    onChange={(e) => store.updatePDFSettings({ headerTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">School Naam / Instelling</label>
                  <input
                    type="text"
                    value={store.settings.pdfSettings.schoolName}
                    onChange={(e) => store.updatePDFSettings({ schoolName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                
                {/* Visual Colors Styling */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Primaire Huisstijlkleur</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={store.settings.pdfSettings.primaryColor}
                      onChange={(e) => store.updatePDFSettings({ primaryColor: e.target.value })}
                      className="w-10 h-10 border-0 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-sm text-slate-500">{store.settings.pdfSettings.primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Secundaire Huisstijlkleur</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={store.settings.pdfSettings.secondaryColor}
                      onChange={(e) => store.updatePDFSettings({ secondaryColor: e.target.value })}
                      className="w-10 h-10 border-0 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-sm text-slate-500">{store.settings.pdfSettings.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  De hier gekozen instellingen worden onmiddellijk toegepast op het eindrapport en de gegenereerde PDF.
                </p>
              </div>
            </div>
          )}

          {/* 8. SIMULATOR TEST MODUS */}
          {activeTab === 'test_mode' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Interactieve Testmodus (Regels Simulator)
                </h2>
                <p className="text-xs text-slate-500">Pas de schuifregelaars aan om direct te valideren welke regels afgaan en welke adviesrapportage ontstaat.</p>
              </div>

              {/* Sliders Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Gedrag</span>
                    <span className="font-bold text-indigo-600">{testGedrag}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={testGedrag}
                    onChange={(e) => setTestGedrag(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Taal & Communicatie</span>
                    <span className="font-bold text-indigo-600">{testTaal}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={testTaal}
                    onChange={(e) => setTestTaal(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Sociaal-emotioneel</span>
                    <span className="font-bold text-indigo-600">{testSocem}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={testSocem}
                    onChange={(e) => setTestSocem(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Beschermende factoren</span>
                    <span className="font-bold text-indigo-600">{testBesch}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={testBesch}
                    onChange={(e) => setTestBesch(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Profile criteria simulation */}
                <div className="col-span-2 grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/60">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Leeftijd student</label>
                    <input
                      type="number"
                      value={testAge}
                      onChange={(e) => setTestAge(parseInt(e.target.value) || 16)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tijd in Nederland</label>
                    <select
                      value={testTimeInNL}
                      onChange={(e) => setTestTimeInNL(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="Minder dan 1 jaar">Minder dan 1 jaar</option>
                      <option value="1-3 jaar">1-3 jaar</option>
                      <option value="Meer dan 3 jaar">Meer dan 3 jaar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Simulation Output Result list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Active Rules Card */}
                <div className="p-5 border border-indigo-100 rounded-2xl bg-indigo-50/5 space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Info className="w-4.5 h-4.5 text-indigo-500" />
                    Geactiveerde regels ({testActiveRules.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {testActiveRules.map((rule) => (
                      <div key={rule.id} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <span className="font-bold text-slate-700 text-xs">{rule.name}</span>
                        <div className="flex gap-1.5 mt-1">
                          <span className="px-1.5 py-0.1 rounded bg-indigo-50 text-indigo-600 text-[8px] font-bold">{rule.type}</span>
                          <span className="text-[8px] text-slate-400">ID: {rule.id}</span>
                        </div>
                      </div>
                    ))}
                    {testActiveRules.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-6">Geen regels voldoen aan de schuifregelaars.</p>
                    )}
                  </div>
                </div>

                {/* Compiled report preview */}
                <div className="p-5 border border-slate-150 rounded-2xl bg-slate-50/20 space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Type className="w-4.5 h-4.5 text-slate-500" />
                    Ingevoegde tekstblokken ({testActiveBlocks.length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {testActiveBlocks.map((block) => (
                      <div key={block.id} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm space-y-1">
                        <span className="font-bold text-slate-800 text-xs">{block.title}</span>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{block.content}</p>
                        <span className="inline-block px-1.5 py-0.1 bg-slate-50 text-slate-400 rounded text-[8px] font-medium">{block.type}</span>
                      </div>
                    ))}
                    {testActiveBlocks.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-6">Geen tekstblokken geactiveerd.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. BEHEERDERSHANDLEIDING */}
          {activeTab === 'handleiding' && (
            <div className="space-y-6 animate-fade-in">
              {/* PDF Download Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                    <FileText className="w-3.5 h-3.5" />
                    Officiële handleiding
                  </div>
                  <h2 className="text-lg font-bold text-slate-100">Download de PDF Handleiding</h2>
                  <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                    Een compacte, begrijpelijke handleiding in eenvoudige taal over hoe alles koppelt, hoe de weging werkt en hoe de privacy gewaarborgd blijft. Ideaal om te printen of te delen met collega-beheerders.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <PDFDownloadLink
                    document={<AdminGuidePdfDocument />}
                    fileName="Beheerdershandleiding_Profiel_Advies_ISK.pdf"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    {({ loading }) => (
                      <>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? 'PDF voorbereiden...' : 'Handleiding PDF downloaden'}</span>
                      </>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>

              {/* On-Screen Guide Content */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Snelgids: Koppelingen & Wegingen</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Hieronder leest u in eenvoudige taal hoe het systeem achter de schermen werkt.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Rule Engine */}
                  <div className="p-5 border border-slate-100 rounded-xl space-y-3">
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                      1
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Hoe koppelen de regels en teksten?</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Dit systeem berekent geen statische rapporten. Het bouwt rapporten dynamisch op door losse <strong>Tekstblokken</strong> aan elkaar te plakken. Dit gebeurt met behulp van <strong>Beslisregels</strong>.
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-500 space-y-1.5 border border-slate-100">
                      <p><strong>De logica werkt als volgt:</strong></p>
                      <p className="pl-2 border-l-2 border-indigo-400"><strong>ALS:</strong> Categorie <em>Taal & Communicatie</em> scoort lager dan 50%...</p>
                      <p className="pl-2 border-l-2 border-teal-400"><strong>DAN:</strong> Plak automatisch de adviestekst <em>"Begeleiding bij lage taalvaardigheid"</em> in de eindrapportage.</p>
                    </div>
                  </div>

                  {/* Card 2: Weights */}
                  <div className="p-5 border border-slate-100 rounded-xl space-y-3">
                    <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
                      2
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Hoe werkt de weging (Wegingsfactor)?</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Niet elke vraag is even belangrijk. Daarom heeft elke vraag een <strong>weging</strong>. Dit is een vermenigvuldigingsfactor die bepaalt hoe zwaar de vraag meetelt in het eindpercentage van de categorie.
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-500 space-y-1.5 border border-slate-100">
                      <p><strong>Voorbeeld wegingen:</strong></p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Weging 1.0:</strong> Telt normaal mee.</li>
                        <li><strong>Weging 1.5 of 2.0:</strong> Zeer belangrijk signaalgedrag. Lage scores op deze stellingen laten het categoriepercentage veel sneller zakken.</li>
                        <li><strong>Weging 0.8:</strong> Minder belangrijk detail. Beïnvloedt de score slechts minimaal.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step by step action plan */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">Stappenplan: Een nieuw advies toevoegen</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Stap 1</span>
                      <h4 className="font-bold text-slate-800 text-xs">Schrijf het Advies</h4>
                      <p className="text-[11px] text-slate-500">Ga naar <strong>Tekstblokken</strong> en schrijf een heldere, pedagogische adviestekst.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Stap 2</span>
                      <h4 className="font-bold text-slate-800 text-xs">Maak een Beslisregel</h4>
                      <p className="text-[11px] text-slate-500">Ga naar <strong>Regels beheren</strong> en stel in wanneer het advies getoond moet worden.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Stap 3</span>
                      <h4 className="font-bold text-slate-800 text-xs">Koppel ze Samen</h4>
                      <p className="text-[11px] text-slate-500">Koppel in de regelinstellingen de adviestekst aan de trigger of categoriepercentage.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Stap 4</span>
                      <h4 className="font-bold text-slate-800 text-xs">Test de Werking</h4>
                      <p className="text-[11px] text-slate-500">Gebruik de tab <strong>Simulatie Testmodus</strong> om met schuifregelaars de logica direct te controleren.</p>
                    </div>
                  </div>
                </div>

                {/* AVG Warning */}
                <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-xl flex items-start space-x-3 text-slate-700">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-900">AVG Privacyrichtlijn voor Beheerders</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Om de studentprivacy maximaal te waarborgen, registreert de app geen namen van leerlingen. Studenten worden uitsluitend gecodeerd als <strong>Casus 1</strong>, <strong>Casus 2</strong>, etc. Wijzig de vragen- of regelteksten nooit zo dat ze herleidbaar zijn naar individuele personen.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
