/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  User, 
  TrendingUp, 
  FileText, 
  HelpCircle, 
  Compass, 
  Clipboard,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { PdfDownloadButton } from './PdfReport';

interface ResultsViewProps {
  onNavigate: (page: string, params?: any) => void;
  analysisId: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ onNavigate, analysisId }) => {
  const { analyses, categories, textblocks, settings } = useProjectStore();

  const analysis = analyses.find((a) => a.id === analysisId);

  if (!analysis) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Analyse niet gevonden</h2>
        <p className="text-sm text-slate-500">De opgevraagde rapportage kon niet worden geladen. Keer terug naar het dashboard.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar Dashboard
        </button>
      </div>
    );
  }

  // Get matching text block details
  const getTextBlockDetails = (id: string) => {
    return textblocks.find((tb) => tb.id === id);
  };

  // Prepare chart data
  const chartData = categories.map((cat) => {
    const score = analysis.categoryScores[cat.id];
    return {
      category: cat.name,
      percentage: score ? score.percentage : 0,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in print:p-0 text-slate-900">
      {/* Top action bar (hidden during browser print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Analyseresultaten</h1>
            <p className="text-xs text-slate-500 mt-0.5">Automatisch samengesteld adviesrapport</p>
          </div>
        </div>

        {/* Report Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Printen via Browser
          </button>

          {/* Real PDF generation button! */}
          <PdfDownloadButton
            analysis={analysis}
            categories={categories}
            textblocks={textblocks}
            settings={settings}
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Scores (LHS) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Profile details card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{analysis.studentName}</h3>
                <div className="flex items-center text-[10px] text-slate-400 font-semibold mt-0.5 gap-1">
                  <Calendar className="w-3 h-3" />
                  Ingevuld op {new Date(analysis.createdAt).toLocaleDateString('nl-NL')}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Leeftijd</span>
                <span className="font-bold text-slate-800">{analysis.profile.age} jaar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tijd in Nederland</span>
                <span className="font-bold text-slate-800">{analysis.profile.timeInNL}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tijd in onderwijs / ISK</span>
                <span className="font-bold text-slate-800">{analysis.profile.timeInEducation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Thuissituatie</span>
                <span className="font-bold text-slate-800">{analysis.profile.homeSituation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Schoolverleden</span>
                <span className="font-bold text-slate-800 text-right max-w-[180px] truncate" title={analysis.profile.schoolHistory}>
                  {analysis.profile.schoolHistory}
                </span>
              </div>
            </div>
          </div>

          {/* Scorecards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 text-xs uppercase tracking-wider text-slate-400">Scorekaarten per categorie</h4>
            <div className="space-y-3">
              {categories.map((cat) => {
                const score = analysis.categoryScores[cat.id];
                if (!score) return null;

                let progressColor = 'bg-red-500';
                let textColor = 'text-red-700';
                let bgLight = 'bg-red-50';
                let label = 'Hoge begeleidingsbehoefte';

                if (score.percentage >= 70) {
                  progressColor = 'bg-emerald-500';
                  textColor = 'text-emerald-700';
                  bgLight = 'bg-emerald-50';
                  label = 'Lage begeleidingsbehoefte';
                } else if (score.percentage >= 50) {
                  progressColor = 'bg-amber-500';
                  textColor = 'text-amber-700';
                  bgLight = 'bg-amber-50';
                  label = 'Matige begeleidingsbehoefte';
                }

                return (
                  <div key={cat.id} className="space-y-1 p-2.5 rounded border border-slate-200">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{cat.name}</span>
                      <span className={textColor}>{score.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${progressColor} transition-all`} style={{ width: `${score.percentage}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-semibold uppercase">
                      <span>Zwakker</span>
                      <span className={`px-1 rounded ${bgLight} ${textColor} font-bold`}>{label}</span>
                      <span>Sterker</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Graphics & Charts (RHS/Top) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">Visualisatie scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bar Chart */}
              <div className="h-56 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">Staafdiagram (Positief index)</p>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 8 }} stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} stroke="#94a3b8" />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Score']}
                      contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="percentage" fill="#6366f1" radius={[2, 2, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className="h-56 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">Multidimensionaal Profiel (Radar)</p>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 8, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7 }} />
                    <Radar name="Student" dataKey="percentage" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.15} />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report Sections */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-base font-bold text-slate-800">Gegenereerd Adviesrapport</h2>
          <p className="text-xs text-slate-500 mt-0.5">Samenstelling van tekstblokken op basis van de regel-engine.</p>
        </div>

        {/* 1. Profielschets */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-indigo-950 border-b border-indigo-100 pb-1.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900">1. Profielschets</h3>
          </div>
          {analysis.generatedReport.Profielschets.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Geen specifieke profielschetsen geactiveerd voor dit profiel.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.generatedReport.Profielschets.map((tbId) => {
                const tb = getTextBlockDetails(tbId);
                if (!tb) return null;
                return (
                  <div key={tbId} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                    <h4 className="font-bold text-slate-800 text-xs italic">"{tb.title}"</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{tb.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Handelingsadvies */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-emerald-950 border-b border-emerald-100 pb-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">2. Handelingsadvies</h3>
          </div>
          {analysis.generatedReport.Handelingsadvies.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Geen specifieke handelingsadviezen geactiveerd voor dit profiel.</p>
          ) : (
            <div className="space-y-3">
              {analysis.generatedReport.Handelingsadvies.map((tbId) => {
                const tb = getTextBlockDetails(tbId);
                if (!tb) return null;
                return (
                  <div key={tbId} className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg space-y-1.5">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Adviesrichtlijn / Beschermende Factor</div>
                    <h4 className="font-bold text-emerald-950 text-xs">{tb.title}</h4>
                    <p className="text-xs text-emerald-800 font-medium leading-relaxed whitespace-pre-line">{tb.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Reflectiestimulering */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-indigo-950 border-b border-indigo-100 pb-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900">3. Reflectiestimulering (voor de docent)</h3>
          </div>
          {analysis.generatedReport.Reflectiestimulering.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Geen reflectievragen geactiveerd voor dit profiel.</p>
          ) : (
            <div className="space-y-3">
              {analysis.generatedReport.Reflectiestimulering.map((tbId) => {
                const tb = getTextBlockDetails(tbId);
                if (!tb) return null;
                return (
                  <div key={tbId} className="p-4 border border-indigo-100 rounded-lg bg-indigo-50/50 space-y-1.5">
                    <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Reflectie Vraagstuk</div>
                    <h4 className="font-bold text-indigo-950 text-xs">{tb.title}</h4>
                    <p className="text-xs text-indigo-800 font-medium leading-relaxed whitespace-pre-line">{tb.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Advies vervolgstappen */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-amber-950 border-b border-amber-100 pb-1.5">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900">4. Advies vervolgstappen</h3>
          </div>
          {analysis.generatedReport['Advies vervolgstappen'].length === 0 ? (
            <p className="text-xs text-slate-500 italic">Geen vervolgstappen geactiveerd voor dit profiel.</p>
          ) : (
            <div className="space-y-3">
              {analysis.generatedReport['Advies vervolgstappen'].map((tbId) => {
                const tb = getTextBlockDetails(tbId);
                if (!tb) return null;
                return (
                  <div key={tbId} className="p-4 bg-amber-50 border border-amber-100 rounded-lg space-y-1.5">
                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Vervolgactie / Aandachtspunt</div>
                    <h4 className="font-bold text-amber-950 text-xs">{tb.title}</h4>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed whitespace-pre-line">{tb.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Observaties/Opmerkingen (Custom Notes) */}
        {analysis.customNotes && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-200 pb-1.5">
              <Clipboard className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Ingevulde Docentobservaties</h3>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{analysis.customNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between items-center print:hidden">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-semibold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar Dashboard
        </button>
      </div>
    </div>
  );
};
