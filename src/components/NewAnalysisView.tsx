/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { ArrowLeft, ArrowRight, UserPlus, FileText, Shield, Info } from 'lucide-react';
import { StudentProfile } from '../types';

interface NewAnalysisViewProps {
  onNavigate: (page: string, params?: any) => void;
  initialProfile?: StudentProfile;
}

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({ onNavigate, initialProfile }) => {
  const analyses = useProjectStore((state) => state.analyses);

  const getNextCasusName = () => {
    let maxNum = 0;
    analyses.forEach((a) => {
      const match = a.studentName.match(/^Casus\s+(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    return `Casus ${maxNum + 1}`;
  };

  const nextCasusName = getNextCasusName();
  const [name, setName] = useState(initialProfile?.name || nextCasusName);
  const [age, setAge] = useState<number>(initialProfile?.age || 16);
  const [timeInNL, setTimeInNL] = useState(initialProfile?.timeInNL || '1-3 jaar');
  const [timeInEducation, setTimeInEducation] = useState(initialProfile?.timeInEducation || '1-2 jaar');
  const [homeSituation, setHomeSituation] = useState(initialProfile?.homeSituation || 'Woont bij ouders');
  const [schoolHistory, setSchoolHistory] = useState(initialProfile?.schoolHistory || 'Voortgezet onderwijs');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Naam van de student is verplicht';
    }
    if (age <= 0 || age > 100) {
      newErrors.age = 'Voer een geldige leeftijd in';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const profile: StudentProfile = {
      name: name.trim(),
      age,
      timeInNL,
      timeInEducation,
      homeSituation,
      schoolHistory
    };

    // Navigate to Chapter 2 questionnaire
    onNavigate('fill-analysis', { profile });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Back button and title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nieuwe analyse starten</h1>
          <p className="text-sm text-slate-500 mt-0.5">Hoofdstuk 1: Studentprofiel en achtergrondgegevens</p>
        </div>
      </div>

      {/* Responsive Visual Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
            <span className="w-6 h-6 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs">1</span>
            <span>Studentprofiel</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className="flex items-center space-x-2 text-slate-400 font-bold text-xs">
            <span className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-xs">2</span>
            <span>Vragenlijst</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className="flex items-center space-x-2 text-slate-400 font-bold text-xs">
            <span className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-xs">3</span>
            <span>Resultaten</span>
          </div>
        </div>
      </div>

      {/* Main form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Student Name */}
          <div className="sm:col-span-2 p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-3">
            <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Studentidentificatie (Geanonimiseerd voor AVG)</span>
              <p className="text-sm font-bold text-indigo-900">{name}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Om te voldoen aan de AVG-wetgeving worden studenten volledig anoniem geregistreerd. De applicatie genereert automatisch een opeenvolgend casusnummer. U hoeft geen echte namen in te voeren.
              </p>
            </div>
          </div>

          {/* Age */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="student-age">
              Leeftijd *
            </label>
            <input
              id="student-age"
              type="number"
              min="4"
              max="100"
              value={age}
              onChange={(e) => {
                setAge(parseInt(e.target.value) || 0);
                if (errors.age) setErrors({ ...errors, age: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.age ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200'
              } transition-all`}
            />
            {errors.age && <p className="text-xs font-medium text-red-500 mt-1">{errors.age}</p>}
          </div>

          {/* Time in NL */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="time-in-nl">
              Tijd in Nederland
            </label>
            <select
              id="time-in-nl"
              value={timeInNL}
              onChange={(e) => setTimeInNL(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
            >
              <option value="Minder dan 1 jaar">Minder dan 1 jaar</option>
              <option value="1-3 jaar">1-3 jaar</option>
              <option value="Meer dan 3 jaar">Meer dan 3 jaar</option>
            </select>
          </div>

          {/* Time in Education */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="time-in-edu">
              Tijd in onderwijs / ISK
            </label>
            <select
              id="time-in-edu"
              value={timeInEducation}
              onChange={(e) => setTimeInEducation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
            >
              <option value="Minder dan 1 jaar">Minder dan 1 jaar</option>
              <option value="1-2 jaar">1-2 jaar</option>
              <option value="Meer dan 2 jaar">Meer dan 2 jaar</option>
            </select>
          </div>

          {/* Home Situation */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="home-situation">
              Thuissituatie
            </label>
            <select
              id="home-situation"
              value={homeSituation}
              onChange={(e) => setHomeSituation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
            >
              <option value="Woont bij ouders">Woont bij ouders</option>
              <option value="Woont bij één ouder">Woont bij één ouder</option>
              <option value="Alleenstaand / AMV">Alleenstaand / AMV (Alleenstaande Minderjarige Vreemdeling)</option>
              <option value="Begeleid wonen / Pleeggezin">Begeleid wonen / Pleeggezin</option>
              <option value="Overig">Overig</option>
            </select>
          </div>

          {/* School History */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="school-history">
              Schoolverleden / Achtergrond
            </label>
            <select
              id="school-history"
              value={schoolHistory}
              onChange={(e) => setSchoolHistory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
            >
              <option value="Geen voorbereidend onderwijs (analfabeet/semianalfabeet)">Geen voorbereidend onderwijs (analfabeet/semianalfabeet)</option>
              <option value="Basisonderwijs in land van herkomst">Basisonderwijs in land van herkomst</option>
              <option value="Voortgezet onderwijs in land van herkomst (kort)">Voortgezet onderwijs in land van herkomst (kort)</option>
              <option value="Voortgezet onderwijs volledig doorlopen">Voortgezet onderwijs volledig doorlopen</option>
              <option value="Wisselend schoolverleden door migratie/vluchtsituatie">Wisselend schoolverleden door migratie/vluchtsituatie</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            Annuleren
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm flex-row cursor-pointer"
          >
            Vragenlijst invullen
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
