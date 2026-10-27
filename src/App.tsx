import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./pages/Dashboard";
import { SafetyAnalysis } from "./pages/SafetyAnalysis";
import { CrackDetection } from "./pages/CrackDetection";
import { ProjectPlanning } from "./pages/ProjectPlanning";
import { RealEstateValuation } from "./pages/RealEstateValuation";
import { DailyAssistant } from "./pages/DailyAssistant";
import { WeatherAdvisory } from "./pages/WeatherAdvisory";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { Projects } from "./pages/Projects";
import { ProjectDetails } from "./pages/ProjectDetails";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { api } from "./services/api";
import { Project } from "./types";

export function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState(false);

  const loadData = async () => {
    try {
      const [projList, health] = await Promise.all([
        api.getProjects(),
        api.getHealth(),
      ]);
      setProjects(projList);
      setGeminiActive(health.geminiConfigured);
      if (projList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projList[0].id);
      }
    } catch (err) {
      console.error("Initial load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      await api.resetDemoData();
      await loadData();
    } catch (err) {
      console.error("Failed to reset demo:", err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            geminiActive={geminiActive}
          />
        </div>

        {/* Mobile Sidebar overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 w-72">
              <Sidebar
                collapsed={false}
                onToggleCollapse={() => setMobileMenuOpen(false)}
                geminiActive={geminiActive}
              />
            </div>
          </div>
        )}

        {/* Main Workspace Frame */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? "md:pl-20" : "md:pl-64"
          }`}
        >
          <Header
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onResetDemo={handleResetDemo}
            isResetting={isResetting}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/safety" element={<SafetyAnalysis />} />
              <Route path="/cracks" element={<CrackDetection />} />
              <Route path="/planning" element={<ProjectPlanning />} />
              <Route path="/valuation" element={<RealEstateValuation />} />
              <Route path="/assistant" element={<DailyAssistant />} />
              <Route path="/weather" element={<WeatherAdvisory />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
