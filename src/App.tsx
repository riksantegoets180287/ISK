/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProjectStore } from './store/projectStore';
import { DashboardView } from './components/DashboardView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { FillAnalysisView } from './components/FillAnalysisView';
import { ResultsView } from './components/ResultsView';
import { AdminView } from './components/AdminView';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Settings, 
  HelpCircle,
  Users
} from 'lucide-react';

type Page = 'dashboard' | 'new-analysis' | 'fill-analysis' | 'results' | 'admin';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [navigationParams, setNavigationParams] = useState<any>(null);

  const handleNavigate = (page: string, params?: any) => {
    setActivePage(page as Page);
    setNavigationParams(params || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center space-x-3 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center shadow-md shadow-indigo-600/10 group-hover:bg-indigo-700 transition-all">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2.5">
              <div>
                <span className="font-bold text-slate-800 tracking-tight text-sm sm:text-base block leading-none">Profiel & Advies</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ISK Onderwijs</span>
              </div>
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider hidden sm:inline-block">v2.4.0</span>
            </div>
          </button>

          {/* Quick Header Nav Links */}
          <nav className="flex items-center space-x-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              Beheerder Modus Actief
            </div>

            <button
              onClick={() => handleNavigate('dashboard')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePage === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigate('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePage === 'admin' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Beheer</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render Active Page View component */}
        {activePage === 'dashboard' && (
          <DashboardView onNavigate={handleNavigate} />
        )}

        {activePage === 'new-analysis' && (
          <NewAnalysisView 
            onNavigate={handleNavigate} 
            initialProfile={navigationParams?.profile} 
          />
        )}

        {activePage === 'fill-analysis' && (
          <FillAnalysisView 
            onNavigate={handleNavigate} 
            profile={navigationParams?.profile} 
          />
        )}

        {activePage === 'results' && (
          <ResultsView 
            onNavigate={handleNavigate} 
            analysisId={navigationParams?.analysisId} 
          />
        )}

        {activePage === 'admin' && (
          <AdminView onNavigate={handleNavigate} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Profiel & Advies. Alle rechten voorbehouden.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Datagedreven Rule Engine Actief
            </span>
            <span className="text-slate-400">Offline-first local-storage database</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
