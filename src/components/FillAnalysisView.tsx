/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { StudentProfile } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Info,
  PenTool,
  Bookmark
} from 'lucide-react';

interface FillAnalysisViewProps {
  onNavigate: (page: string, params?: any) => void;
  profile: StudentProfile;
}

export const FillAnalysisView: React.FC<FillAnalysisViewProps> = ({ onNavigate, profile }) => {
  const { categories, questions, generateReport, addAnalysis } = useProjectStore();
  
  // Track active category tab index
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeCategory = categories[activeTabIdx];

  // Store answer state: questionId -> score (1-5)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [customNotes, setCustomNotes] = useState('');
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Group questions by category
  const getCatQuestions = (catId: string) => questions.filter((q) => q.categoryId === catId);
  const activeQuestions = activeCategory ? getCatQuestions(activeCategory.id) : [];

  // Progression metrics
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectAnswer = (questionId: string, rating: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: rating }));
  };

  const isCategoryComplete = (catId: string) => {
    const catQs = getCatQuestions(catId);
    return catQs.every((q) => answers[q.id] !== undefined);
  };

  const getUnansweredQuestionsForCategory = (catId: string) => {
    const catQs = getCatQuestions(catId);
    return catQs.filter((q) => answers[q.id] === undefined);
  };

  const handleNext = () => {
    if (activeTabIdx < categories.length - 1) {
      setActiveTabIdx(activeTabIdx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (activeTabIdx > 0) {
      setActiveTabIdx(activeTabIdx - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Go back to profile screen
      onNavigate('new-analysis', { profile });
    }
  };

  const handleSaveAndGenerate = () => {
    // Validate if ALL questions across ALL categories are answered
    const unanswered = questions.filter((q) => answers[q.id] === undefined);

    if (unanswered.length > 0) {
      setShowValidationErrors(true);
      // Find the first category with unanswered questions and switch to it
      for (let i = 0; i < categories.length; i++) {
        const catUnanswered = getUnansweredQuestionsForCategory(categories[i].id);
        if (catUnanswered.length > 0) {
          setActiveTabIdx(i);
          break;
        }
      }
      return;
    }

    // Process using our core rule-engine logic in Zustand
    const completedAnalysis = generateReport(profile, answers, customNotes);
    addAnalysis(completedAnalysis);

    // Redirect to results
    onNavigate('results', { analysisId: completedAnalysis.id });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header and profile info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Vragenlijst invullen</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyse voor: <strong className="text-slate-700 font-bold">{profile.name}</strong> ({profile.age} jaar)
            </p>
          </div>
        </div>

        {/* Progress indicator pill */}
        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-2.5 self-start sm:self-center shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Voortgang</div>
          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-800">{answeredCount}/{totalQuestions}</span>
        </div>
      </div>

      {/* Stepper Wizard for Categories */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 overflow-x-auto">
        <div className="flex items-center min-w-[640px] justify-between gap-2">
          {categories.map((cat, idx) => {
            const isActive = idx === activeTabIdx;
            const isDone = isCategoryComplete(cat.id);
            return (
              <React.Fragment key={cat.id}>
                <button
                  type="button"
                  onClick={() => setActiveTabIdx(idx)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                      : isDone
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-100'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isActive 
                      ? 'bg-white text-indigo-600' 
                      : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isDone && !isActive ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                  </span>
                  <span className="text-xs whitespace-nowrap">{cat.name}</span>
                </button>
                {idx < categories.length - 1 && (
                  <div className={`h-0.5 w-6 flex-1 mx-1 ${isCategoryComplete(cat.id) ? 'bg-emerald-200' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Validation Warning Alert */}
      {showValidationErrors && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 flex items-start space-x-3 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <h4 className="font-bold">Onvolledige vragenlijst</h4>
            <p className="mt-0.5">
              Er zijn nog {totalQuestions - answeredCount} onbeantwoorde vragen. Om de analyse af te ronden en het adviesrapport te genereren, moeten alle Likert-vragen beantwoord zijn. We hebben u naar de eerste openstaande categorie verwezen.
            </p>
          </div>
        </div>
      )}

      {/* Likert Scale Legend Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <Info className="w-4.5 h-4.5 text-indigo-500 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-800">Scoringsrichtlijn</span>
            <p className="text-slate-500 text-[11px] mt-0.5">Beoordeel de stellingen op basis van uw observaties van de afgelopen periode.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-600">
          <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded">1 = Nooit / Zeer zwak</span>
          <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded">3 = Soms / Matig</span>
          <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded">5 = Altijd / Zeer sterk</span>
        </div>
      </div>

      {/* Questions Form container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-800">{activeCategory?.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{activeCategory?.description}</p>
        </div>

        <div className="divide-y divide-slate-200">
          {activeQuestions.map((q, idx) => {
            const currentAnswer = answers[q.id];
            const hasError = showValidationErrors && currentAnswer === undefined;

            return (
              <div 
                key={q.id} 
                className={`p-4 sm:p-5 transition-colors ${
                  hasError ? 'bg-red-50/30' : 'hover:bg-slate-50/10'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Question description */}
                  <div className="max-w-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stelling {idx + 1} van {activeQuestions.length}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{q.text}</h3>
                    {q.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {q.tags.map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">
                            #{tag}
                          </span>
                        ))}
                        {q.weight !== 1.0 && (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-bold">
                            Weging: {q.weight}x
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Likert 1-5 Selection Grid */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2 self-center md:self-start">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = currentAnswer === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, val)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold'
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{val}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Observations Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <PenTool className="w-4.5 h-4.5 text-indigo-600" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-800">Extra observaties & context (optioneel)</h3>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Voeg eventuele specifieke gedragssignalen, drempels of unieke context van de leerling toe die u wilt opnemen in de eindrapportage.
        </p>
        <textarea
          rows={3}
          placeholder="Bijv. student laat wisselende motivatie zien, reageert goed op een glimlach maar trekt zich snel terug bij drukte..."
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
        />
      </div>

      {/* Bottom Wizards Navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Vorige
        </button>

        <div className="flex items-center space-x-2">
          {activeTabIdx < categories.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCategoryComplete(activeCategory.id)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
            >
              Volgende
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-all shadow-sm cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Analyse Afronden
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
