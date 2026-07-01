/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { 
  PlusCircle, 
  Settings, 
  Search, 
  Users, 
  BarChart3, 
  Trash2, 
  Eye, 
  ArrowRight,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import { Analysis } from '../types';

interface DashboardViewProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { analyses, categories, deleteAnalysis, resetToDefaults } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations
  const totalAnalyses = analyses.length;

  const calculateAveragePercentage = () => {
    if (totalAnalyses === 0) return 0;
    let totalPct = 0;
    let count = 0;
    
    analyses.forEach((a) => {
      Object.values(a.categoryScores).forEach((score) => {
        totalPct += score.percentage;
        count++;
      });
    });

    return count > 0 ? Math.round(totalPct / count) : 0;
  };

  const avgScore = calculateAveragePercentage();

  const filteredAnalyses = analyses.filter((a) => 
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.profile.schoolHistory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <GraduationCap className="w-4.5 h-4.5" />
            Onderwijsinnovatie
          </span>
          <h1 className="text-3.5xl font-extrabold tracking-tight sm:text-4xl text-slate-100">
            Student Profielanalyse & Handelingsadvies
          </h1>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
            Breng de behoeften van uw ISK- of reguliere studenten systematisch in kaart. Vul de profileerder in en genereer direct een op maat gemaakt, datagedreven handelingsplan en pedagogisch advies.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('new-analysis')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10 hover:translate-y-[-1px] cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              Nieuwe Analyse Starten
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold px-5 py-3 rounded-xl transition-all border border-slate-700/50 cursor-pointer"
            >
              <Settings className="w-5 h-5" />
              Beheerpaneel Openen
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Totaal Geanalyseerd</p>
            <h3 className="text-xl font-bold text-slate-800">{totalAnalyses} casussen</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gem. Positieve Score</p>
            <h3 className="text-xl font-bold text-slate-800">
              {totalAnalyses > 0 ? `${avgScore}%` : '-'}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingezette Beslisregels</p>
            <h3 className="text-xl font-bold text-slate-800">Dynamisch Actief</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area - Analyses List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recente analyses</h2>
            <p className="text-xs text-slate-500 mt-0.5">Lijst van alle uitgevoerde studentrapportages.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
               type="text"
               placeholder="Zoek op casus of achtergrond..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-60 transition-all bg-white"
            />
          </div>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="p-10 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <div className="mx-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-1">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Geen rapportages gevonden</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {searchTerm 
                  ? 'Er zijn geen analyses die voldoen aan uw zoekterm.' 
                  : 'Er zijn nog geen analyses opgeslagen. Start direct een nieuwe analyse.'}
              </p>
              {!searchTerm && (
                <div className="pt-1">
                  <button
                    onClick={() => onNavigate('new-analysis')}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold text-xs cursor-pointer"
                  >
                    Nieuwe analyse starten
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-5 py-3">Casus</th>
                  <th className="px-5 py-3">Leeftijd / Tijd in NL</th>
                  <th className="px-5 py-3">Scores per categorie</th>
                  <th className="px-5 py-3">Ingevuld op</th>
                  <th className="px-5 py-3 text-right">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-bold text-slate-800">{analysis.studentName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{analysis.profile.schoolHistory}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-slate-700 font-medium">{analysis.profile.age} jaar</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{analysis.profile.timeInNL}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => {
                          const score = analysis.categoryScores[cat.id];
                          if (!score) return null;
                          
                          let badgeBg = 'bg-red-50 text-red-700 border-red-100';
                          if (score.percentage >= 70) badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                          else if (score.percentage >= 50) badgeBg = 'bg-amber-50 text-amber-700 border-amber-100';
 
                          return (
                            <div 
                              key={cat.id} 
                              title={`${cat.name}: ${score.percentage}%`}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeBg}`}
                            >
                              {cat.name.split(' ')[0][0]}: {score.percentage}%
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-medium">
                      {new Date(analysis.createdAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onNavigate('results', { analysisId: analysis.id })}
                          className="p-1 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                          title="Bekijk resultaten"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Weet u zeker dat u de analyse van ${analysis.studentName} wilt verwijderen?`)) {
                              deleteAnalysis(analysis.id);
                            }
                          }}
                          className="p-1 hover:bg-slate-100 text-slate-600 hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Verwijder analyse"
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
        )}
      </div>

      {/* Reset State Option */}
      <div className="pt-4 flex justify-end text-xs text-slate-400">
        <button
          onClick={() => {
            if (confirm('Weet u zeker dat u alle gegevens wilt herstellen naar de fabrieksinstellingen? Uw eigen wijzigingen in vragen en regels worden overschreven.')) {
              resetToDefaults();
              alert('Alle instellingen en analyses zijn succesvol teruggezet naar de standaardwaarden.');
            }
          }}
          className="hover:text-red-500 underline transition-colors cursor-pointer"
        >
          Reset alle applicatiegegevens naar standaardwaarden
        </button>
      </div>
    </div>
  );
};
