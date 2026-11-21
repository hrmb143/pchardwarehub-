import React, { useState, useMemo, useEffect } from 'react';
import { RETAILERS, PARTS_DB, SLOT_LABELS, COMPLETED_BUILDS } from './partsData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const formatINR = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

const getLowestPriceInfo = (part) => {
  const entries = Object.entries(part.prices);
  return entries.reduce((min, curr) => (curr[1] < min[1] ? curr : min), entries[0]);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [build, setBuild] = useState({
    cpu: PARTS_DB.cpu[17],
    cooler: PARTS_DB.cooler[12],
    motherboard: PARTS_DB.motherboard[10],
    ram: PARTS_DB.ram[2],
    gpu: PARTS_DB.gpu[13],
    storage: PARTS_DB.storage[5],
    psu: PARTS_DB.psu[6],
    case: PARTS_DB.case[2]
  });

  // MongoDB Backend States
  const [apiOnline, setApiOnline] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [buildTitle, setBuildTitle] = useState('');
  const [buildAuthor, setBuildAuthor] = useState('Harish_Raghav');
  const [buildNotes, setBuildNotes] = useState('');
  const [saveToast, setSaveToast] = useState('');
  const [lastAuditId, setLastAuditId] = useState(null);

  const [pickerSlot, setPickerSlot] = useState(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [showBomModal, setShowBomModal] = useState(false);

  const [catFilter, setCatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('tier');

  const [benchCat, setBenchCat] = useState('cpu');
  const [compAId, setCompAId] = useState('cpu-5');
  const [compBId, setCompBId] = useState('cpu-18');
  const [usageScenario, setUsageScenario] = useState('balanced');
  const [gameRes, setGameRes] = useState('1440p');
  const [customPriceA, setCustomPriceA] = useState(46200);
  const [customPriceB, setCustomPriceB] = useState(18600);

  const fetchBackendData = async () => {
    try {
      const healthRes = await fetch(`${API_BASE}/health`);
      if (healthRes.ok) {
        setApiOnline(true);
        const buildsRes = await fetch(`${API_BASE}/builds`);
        if (buildsRes.ok) {
          const data = await buildsRes.json();
          setSavedBuilds(data);
        }
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const diagnostics = useMemo(() => {
    const issues = [];
    let totalWatts = 0;
    let totalCost = 0;

    Object.values(build).forEach((p) => {
      if (p) {
        totalWatts += p.tdp || 0;
        totalCost += getLowestPriceInfo(p)[1];
      }
    });

    if (build.cpu && build.motherboard && build.cpu.socket !== build.motherboard.socket) {
      issues.push(`Socket Mismatch: ${build.cpu.name} (${build.cpu.socket}) is incompatible with ${build.motherboard.name} (${build.motherboard.socket}).`);
    }
    if (build.motherboard && build.ram && build.motherboard.ramType !== build.ram.ramType) {
      issues.push(`Memory Standard Mismatch: ${build.motherboard.name} requires ${build.motherboard.ramType}, but ${build.ram.ramType} RAM is selected.`);
    }
    if (build.psu) {
      const recommended = Math.ceil(totalWatts * 1.35);
      if (build.psu.wattage < recommended) {
        issues.push(`PSU Headroom Warning: Estimated load is ${totalWatts}W (Recommended ≥ ${recommended}W for transient spikes), selected PSU is ${build.psu.wattage}W.`);
      }
    }

    return { issues, totalWatts, totalCost };
  }, [build]);

  const handleSaveBuildToDb = async (e) => {
    e.preventDefault();
    if (!buildTitle.trim()) return;
    const partIds = {};
    Object.entries(build).forEach(([slot, part]) => {
      if (part) partIds[slot] = part.id;
    });

    try {
      const res = await fetch(`${API_BASE}/builds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: buildTitle.trim(),
          author: buildAuthor.trim() || 'Enterprise_User',
          tag: diagnostics.issues.length === 0 ? 'Verified Compatible' : 'Custom Config',
          total: diagnostics.totalCost,
          watts: diagnostics.totalWatts,
          parts: partIds,
          notes: buildNotes.trim() || `Custom configuration (${diagnostics.totalWatts}W estimated load).`
        })
      });
      if (res.ok) {
        setShowSaveModal(false);
        setBuildTitle('');
        setBuildNotes('');
        setSaveToast('Saved to MongoDB Database!');
        setTimeout(() => setSaveToast(''), 3500);
        fetchBackendData();
      }
    } catch {
      setSaveToast('Backend offline — start server on port 5000');
      setTimeout(() => setSaveToast(''), 3500);
    }
  };

  const handleDeleteSavedBuild = async (id) => {
    try {
      await fetch(`${API_BASE}/builds/${id}`, { method: 'DELETE' });
      fetchBackendData();
    } catch {
      // ignore
    }
  };

  const handleOpenBomAudit = async () => {
    setShowBomModal(true);
    try {
      const summary = `${build.cpu?.name || 'No CPU'} + ${build.gpu?.name || 'No GPU'}`;
      const res = await fetch(`${API_BASE}/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          build_summary: summary,
          total_price: diagnostics.totalCost,
          total_watts: diagnostics.totalWatts,
          status: diagnostics.issues.length === 0 ? 'PASSED' : 'WARNINGS'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLastAuditId(data.auditId);
      }
    } catch {
      setLastAuditId(null);
    }
  };

  const applyPresetFromPartsMap = (partsMap) => {
    const nextBuild = {};
    Object.entries(partsMap).forEach(([slot, id]) => {
      nextBuild[slot] = PARTS_DB[slot]?.find((item) => item.id === id) || null;
    });
    setBuild(nextBuild);
    setActiveTab('builder');
  };

  const benchList = PARTS_DB[benchCat];
  const itemA = benchList.find((i) => i.id === compAId) || benchList[0];
  const itemB = benchList.find((i) => i.id === compBId) || benchList[1];

  const handleBenchCatSwitch = (cat) => {
    setBenchCat(cat);
    const list = PARTS_DB[cat];
    setCompAId(list[0].id);
    setCompBId(list[1].id);
    setCustomPriceA(getLowestPriceInfo(list[0])[1]);
    setCustomPriceB(getLowestPriceInfo(list[1])[1]);
  };

  const handleSelectCompA = (id) => {
    setCompAId(id);
    const found = benchList.find((i) => i.id === id);
    if (found) setCustomPriceA(getLowestPriceInfo(found)[1]);
  };

  const handleSelectCompB = (id) => {
    setCompBId(id);
    const found = benchList.find((i) => i.id === id);
    if (found) setCustomPriceB(getLowestPriceInfo(found)[1]);
  };

  const calcScenarioScore = (item) => {
    if (usageScenario === 'gaming') return Math.round(item.singleScore * 0.65 + item.multiScore * 0.2 + item.effScore * 0.15);
    if (usageScenario === 'workstation') return Math.round(item.multiScore * 0.65 + item.singleScore * 0.2 + item.effScore * 0.15);
    return Math.round(item.singleScore * 0.4 + item.multiScore * 0.4 + item.effScore * 0.2);
  };

  const finalScoreA = calcScenarioScore(itemA);
  const finalScoreB = calcScenarioScore(itemB);
  const valueIndexA = ((finalScoreA / Math.max(1, customPriceA)) * 30000).toFixed(1);
  const valueIndexB = ((finalScoreB / Math.max(1, customPriceB)) * 30000).toFixed(1);

  const perfPerWattA = (itemA.blender / Math.max(1, itemA.tdp)).toFixed(2);
  const perfPerWattB = (itemB.blender / Math.max(1, itemB.tdp)).toFixed(2);

  const allCatalogItems = useMemo(() => {
    let items = [];
    Object.entries(PARTS_DB).forEach(([cat, list]) => {
      if (catFilter === 'all' || catFilter === cat) {
        list.forEach((p) => items.push({ ...p, category: cat }));
      }
    });
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.spec || '').toLowerCase().includes(q));
    }
    const tierOrder = { S: 1, A: 2, B: 3 };
    items.sort((a, b) => {
      if (sortBy === 'price-asc') return getLowestPriceInfo(a)[1] - getLowestPriceInfo(b)[1];
      if (sortBy === 'price-desc') return getLowestPriceInfo(b)[1] - getLowestPriceInfo(a)[1];
      return (tierOrder[a.tier] || 9) - (tierOrder[b.tier] || 9);
    });
    return items;
  }, [catFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans">
      <header className="bg-[#1A1E24] text-white border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setActiveTab('builder')}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 drop-shadow" viewBox="0 0 44 44" fill="none">
                <defs>
                  <linearGradient id="hexGrad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                <polygon points="22,2 40,12 40,32 22,42 4,32 4,12" fill="#0F172A" stroke="url(#hexGrad)" strokeWidth="2.5" />
                <polygon points="22,9 33,15.5 33,28.5 22,35 11,28.5 11,15.5" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 2" />
                <circle cx="22" cy="22" r="4.5" fill="#F59E0B" />
                <path d="M22 9v5M22 30v5M11 16l4.5 2.5M28.5 25.5L33 28M33 16l-4.5 2.5M15.5 25.5L11 28" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tight text-lg text-white">PC HARDWARE</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs tracking-wider">HUB</span>
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-sky-400 font-semibold mt-0.5">
                Enterprise Hardware &amp; Benchmark Analytics
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 h-full">
            {[
              { id: 'builder', label: 'Builder' },
              { id: 'products', label: 'Products' },
              { id: 'benchmarks', label: 'Benchmarks' },
              { id: 'builds', label: 'Completed Builds' },
              { id: 'trends', label: 'Price Trends' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 h-full text-sm font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-400 bg-white/5'
                    : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs">
            <span
              onClick={fetchBackendData}
              title="Click to re-check MongoDB API status"
              className={`cursor-pointer px-2.5 py-1 rounded border font-semibold flex items-center gap-1.5 ${
                apiOnline
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {apiOnline ? 'MongoDB: ONLINE' : 'MongoDB: OFFLINE'}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-800 border border-slate-600 text-sky-300 font-semibold">
              IN • INR (₹)
            </span>
          </div>
        </div>
      </header>

      <div className="bg-[#2E3A4D] text-white border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {activeTab === 'builder' && 'System Builder — Custom PC Configurator'}
              {activeTab === 'products' && 'Master Hardware Index & Indian Retailer Pricing'}
              {activeTab === 'benchmarks' && 'Head-to-Head Hardware Benchmark & FPS Telemetry'}
              {activeTab === 'builds' && 'Verified Completed Builds & MongoDB Configurations'}
              {activeTab === 'trends' && 'Indian Street Price Trends & Value Index'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Real-time compatibility validation, Cinebench / Geekbench / Blender Perf-per-Watt, and MongoDB persistence
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-300 mr-1">Quick Presets:</span>
            <button onClick={() => applyPresetFromPartsMap(COMPLETED_BUILDS[0].parts)} className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 border border-slate-500">
              1440p Value
            </button>
            <button onClick={() => applyPresetFromPartsMap(COMPLETED_BUILDS[1].parts)} className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 border border-slate-500">
              4K Flagship
            </button>
            <button onClick={() => applyPresetFromPartsMap(COMPLETED_BUILDS[2].parts)} className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 border border-slate-500">
              Budget Esports
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="p-3 rounded bg-emerald-600 text-white text-xs font-bold shadow">✓ {saveToast}</div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'builder' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3.5 rounded border flex items-center justify-between ${diagnostics.issues.length === 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}`}>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">Compatibility Check</div>
                  <div className="text-sm font-bold mt-0.5">
                    {diagnostics.issues.length === 0 ? '✓ Pass: No issues or incompatibilities found' : `⚠ ${diagnostics.issues.length} Compatibility Warning(s)`}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded bg-white border border-slate-300 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Estimated Wattage</div>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-0.5">{diagnostics.totalWatts}W</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                  Rec. PSU: {Math.ceil(diagnostics.totalWatts * 1.35)}W+
                </span>
              </div>

              <div className="p-3.5 rounded bg-white border border-slate-300 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Best Street Total</div>
                  <div className="text-lg font-mono font-bold text-blue-700 mt-0.5">{formatINR(diagnostics.totalCost)}</div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setShowSaveModal(true)} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
                    Save Build
                  </button>
                  <button onClick={handleOpenBomAudit} className="px-3 py-1.5 rounded bg-[#2E3A4D] hover:bg-slate-800 text-white text-xs font-semibold">
                    Audit BOM
                  </button>
                </div>
              </div>
            </div>

            {diagnostics.issues.length > 0 && (
              <div className="p-3.5 rounded bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-1">
                {diagnostics.issues.map((msg, i) => (
                  <div key={i} className="font-semibold">• {msg}</div>
                ))}
              </div>
            )}

            <div className="bg-white rounded border border-slate-300 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold uppercase text-slate-600">
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Selection</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Best Retailer</th>
                    <th className="py-3 px-4 text-right">Lowest Price</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {SLOT_LABELS.map(({ key, label }) => {
                    const part = build[key];
                    const lowest = part ? getLowestPriceInfo(part) : null;
                    return (
                      <tr key={key} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-700 whitespace-nowrap">{label}</td>
                        <td className="py-3.5 px-4">
                          {part ? (
                            <div>
                              <div className="font-semibold text-blue-700">{part.name}</div>
                              <div className="text-xs text-slate-500">{part.spec || `${part.cores || part.vram || ''} • ${part.tdp}W TDP`}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No component selected</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {part && (
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${part.tier === 'S' ? 'bg-amber-100 text-amber-800 border border-amber-300' : part.tier === 'A' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                              {part.tier}-Tier
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">{lowest ? lowest[0] : '—'}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">{lowest ? formatINR(lowest[1]) : '—'}</td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                          <button onClick={() => { setPickerSearch(''); setPickerSlot(key); }} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                            {part ? 'Change' : '+ Choose'}
                          </button>
                          {part && (
                            <button onClick={() => setBuild({ ...build, [key]: null })} className="px-2 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs">
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded border border-slate-300 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Indian Retailer Full-Build Price Comparison</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {RETAILERS.map((ret) => {
                  const sum = Object.values(build).reduce((acc, p) => acc + (p ? p.prices[ret] || 0 : 0), 0);
                  return (
                    <div key={ret} className="p-3 rounded border border-slate-200 bg-slate-50">
                      <div className="text-xs font-semibold text-slate-500">{ret}</div>
                      <div className="text-base font-mono font-bold text-slate-900 mt-1">{formatINR(sum)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => handleBenchCatSwitch('cpu')} className={`px-4 py-1.5 rounded text-xs font-bold ${benchCat === 'cpu' ? 'bg-[#2E3A4D] text-white' : 'bg-slate-100 text-slate-700'}`}>
                  CPU Comparison
                </button>
                <button onClick={() => handleBenchCatSwitch('gpu')} className={`px-4 py-1.5 rounded text-xs font-bold ${benchCat === 'gpu' ? 'bg-[#2E3A4D] text-white' : 'bg-slate-100 text-slate-700'}`}>
                  GPU Comparison
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select value={compAId} onChange={(e) => handleSelectCompA(e.target.value)} className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white">
                  {benchList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-black">VS</span>
                <select value={compBId} onChange={(e) => handleSelectCompB(e.target.value)} className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white">
                  {benchList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-slate-300 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{itemA.name} vs {itemB.name} — Performance Review</h2>
                  <p className="text-xs text-slate-500">Normalized synthetic & real-world workload indices (0–100 scale)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Usage Scenario:</span>
                  <select value={usageScenario} onChange={(e) => setUsageScenario(e.target.value)} className="px-2.5 py-1 rounded border border-slate-300 text-xs font-semibold">
                    <option value="balanced">Balanced (40/40/20)</option>
                    <option value="gaming">Gaming & Esports (65% Single/Raster)</option>
                    <option value="workstation">3D Render & AI Compute (65% Multi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: benchCat === 'cpu' ? 'Single-Core Performance' : 'Rasterization Performance', a: itemA.singleScore, b: itemB.singleScore },
                  { title: benchCat === 'cpu' ? 'Multi-Core Performance' : 'Ray Tracing & Compute', a: itemA.multiScore, b: itemB.multiScore },
                  { title: 'Power Efficiency Score', a: itemA.effScore, b: itemB.effScore },
                  { title: 'Final Weighted Scenario Score', a: finalScoreA, b: finalScoreB }
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-xs font-bold text-slate-700">{metric.title}</div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800">{itemA.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono font-bold">{metric.a}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${metric.a}%` }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-600">{itemB.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-500 text-white font-mono font-bold">{metric.b}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded overflow-hidden"><div className="h-full bg-slate-500" style={{ width: `${metric.b}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-slate-300 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">Cinebench 2024, Geekbench 6 & Blender Render (Performance per Watt)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600">{benchCat === 'cpu' ? 'Cinebench 2024 (Single / Multi)' : '3DMark Time Spy Graphics'}</div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-blue-700"><span>{itemA.name.split(' ').slice(-2).join(' ')}</span><span className="font-mono">{benchCat === 'cpu' ? `${itemA.cb24Single} / ${itemA.cb24Multi}` : itemA.cb24Multi.toLocaleString()}</span></div>
                    <div className="flex justify-between text-slate-600"><span>{itemB.name.split(' ').slice(-2).join(' ')}</span><span className="font-mono">{benchCat === 'cpu' ? `${itemB.cb24Single} / ${itemB.cb24Multi}` : itemB.cb24Multi.toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600">{benchCat === 'cpu' ? 'Geekbench 6 (Single / Multi)' : 'Geekbench 6 OpenCL / Compute'}</div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-blue-700"><span>{itemA.name.split(' ').slice(-2).join(' ')}</span><span className="font-mono">{benchCat === 'cpu' ? `${itemA.gb6Single} / ${itemA.gb6Multi}` : itemA.gb6Multi.toLocaleString()}</span></div>
                    <div className="flex justify-between text-slate-600"><span>{itemB.name.split(' ').slice(-2).join(' ')}</span><span className="font-mono">{benchCat === 'cpu' ? `${itemB.gb6Single} / ${itemB.gb6Multi}` : itemB.gb6Multi.toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600">Blender 4.2 (Samples / min)</div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-blue-700"><span>{itemA.name.split(' ').slice(-2).join(' ')}</span><span className="font-mono">{itemA.blender} smp/m</span></div>
                    <div className="flex justify-between text-slate-600"><span>{itemB.name.split(' ').slice(-2).join(' ')}</span><span className="font-mono">{itemB.blender} smp/m</span></div>
                  </div>
                </div>
                <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900">Blender Perf per Watt</div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-emerald-800"><span>{itemA.name.split(' ').slice(-2).join(' ')} ({itemA.tdp}W)</span><span className="font-mono">{perfPerWattA} smp/W</span></div>
                    <div className="flex justify-between text-emerald-700"><span>{itemB.name.split(' ').slice(-2).join(' ')} ({itemB.tdp}W)</span><span className="font-mono">{perfPerWattB} smp/W</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-slate-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Popular AAA Games Average FPS</h3>
                  <p className="text-xs text-slate-500">{benchCat === 'gpu' ? `Direct GPU benchmark comparison at ${gameRes.toUpperCase()} Ultra preset` : `Paired with reference RTX 4070 SUPER at ${gameRes.toUpperCase()} High preset`}</p>
                </div>
                <div className="flex gap-1.5">
                  {['1080p', '1440p', '4k'].map((res) => (
                    <button key={res} onClick={() => setGameRes(res)} className={`px-3 py-1 rounded text-xs font-bold uppercase ${gameRes === res ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'cp2077', title: 'Cyberpunk 2077 (Ultra)' },
                  { key: 'wukong', title: 'Black Myth: Wukong (High)' },
                  { key: 'rdr2', title: 'Red Dead Redemption 2' },
                  { key: 'alanwake', title: 'Alan Wake 2 (RT Medium)' },
                  { key: 'fh5', title: 'Forza Horizon 5 (Extreme)' },
                  { key: 'cs2', title: 'Counter-Strike 2 (Competitive)' }
                ].map((game) => {
                  const resKey = gameRes === '1080p' ? 'fps1080' : gameRes === '1440p' ? 'fps1440' : 'fps4k';
                  const baseGpuA = benchCat === 'gpu' ? itemA : PARTS_DB.gpu[13];
                  const baseGpuB = benchCat === 'gpu' ? itemB : PARTS_DB.gpu[13];
                  const multA = benchCat === 'cpu' ? itemA.singleScore / 79 : 1;
                  const multB = benchCat === 'cpu' ? itemB.singleScore / 79 : 1;
                  const fpsA = Math.round(baseGpuA[resKey][game.key] * multA);
                  const fpsB = Math.round(baseGpuB[resKey][game.key] * multB);
                  const maxFps = Math.max(fpsA, fpsB, 100);

                  return (
                    <div key={game.key} className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2">
                      <div className="text-xs font-bold text-slate-800">{game.title}</div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="truncate pr-2 text-slate-700">{itemA.name}</span><span className="font-mono font-bold text-blue-700">{fpsA} FPS</span></div>
                        <div className="w-full h-1.5 bg-slate-200 rounded"><div className="h-full bg-blue-600 rounded" style={{ width: `${(fpsA / maxFps) * 100}%` }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="truncate pr-2 text-slate-500">{itemB.name}</span><span className="font-mono font-bold text-slate-700">{fpsB} FPS</span></div>
                        <div className="w-full h-1.5 bg-slate-200 rounded"><div className="h-full bg-slate-500 rounded" style={{ width: `${(fpsB / maxFps) * 100}%` }} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded border border-slate-300 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Value for Money Index (INR ₹)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{itemA.name} Price (₹)</label>
                    <input type="number" value={customPriceA} onChange={(e) => setCustomPriceA(Number(e.target.value))} className="w-full px-3 py-1.5 rounded border border-slate-300 font-mono text-sm" />
                    <div className="mt-2 text-xs">Value Index: <span className="font-mono font-bold text-emerald-700">{valueIndexA} pts</span></div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{itemB.name} Price (₹)</label>
                    <input type="number" value={customPriceB} onChange={(e) => setCustomPriceB(Number(e.target.value))} className="w-full px-3 py-1.5 rounded border border-slate-300 font-mono text-sm" />
                    <div className="mt-2 text-xs">Value Index: <span className="font-mono font-bold text-blue-700">{valueIndexB} pts</span></div>
                  </div>
                </div>
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                  Verdict: {Number(valueIndexA) >= Number(valueIndexB) ? `${itemA.name} delivers superior performance-per-rupee (${valueIndexA} vs ${valueIndexB}).` : `${itemB.name} offers better budget value-for-money (${valueIndexB} vs ${valueIndexA}).`}
                </div>
              </div>

              <div className="bg-white p-5 rounded border border-slate-300 space-y-3">
                <h3 className="text-base font-bold text-slate-900">Key Architectural Highlights</h3>
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-blue-700">{itemA.name}:</div>
                  {itemA.advantages.map((adv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700"><span className="text-emerald-600 font-bold">+</span><span>{adv}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border border-slate-300 flex flex-col md:flex-row gap-3 justify-between">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'cpu', label: 'CPU' },
                  { id: 'gpu', label: 'GPU' },
                  { id: 'motherboard', label: 'Motherboard' },
                  { id: 'ram', label: 'RAM' },
                  { id: 'storage', label: 'SSD' },
                  { id: 'cooler', label: 'Cooler' },
                  { id: 'psu', label: 'PSU' },
                  { id: 'case', label: 'Case' }
                ].map((c) => (
                  <button key={c.id} onClick={() => setCatFilter(c.id)} className={`px-3 py-1 rounded text-xs font-bold ${catFilter === c.id ? 'bg-[#2E3A4D] text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Search parts or brands..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-3 py-1.5 rounded border border-slate-300 text-xs" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold">
                  <option value="tier">Sort: Performance Tier</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded border border-slate-300 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold uppercase text-slate-600">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Component Name</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4 text-right">Amazon.in</th>
                    <th className="py-3 px-4 text-right">MDComputers</th>
                    <th className="py-3 px-4 text-right">Vedant</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allCatalogItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-xs font-bold uppercase text-slate-500">{item.category}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.spec || `${item.cores || item.vram || ''} • ${item.tdp}W`}</div>
                      </td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-xs font-bold">{item.tier}-Tier</span></td>
                      <td className="py-3 px-4 text-right font-mono text-xs">{formatINR(item.prices['Amazon.in'])}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs">{formatINR(item.prices['MDComputers'])}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs font-bold text-emerald-700">{formatINR(item.prices['Vedant'])}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => { setBuild({ ...build, [item.category]: item }); setActiveTab('builder'); }} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                          + Add to Build
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'builds' && (
          <div className="space-y-6">
            {savedBuilds.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">Saved in MongoDB Database</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {savedBuilds.map((b) => (
                    <div key={b.id} className="bg-white rounded border-2 border-emerald-400 p-5 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-bold">{b.tag}</span>
                          <button onClick={() => handleDeleteSavedBuild(b.id)} className="text-xs text-rose-600 hover:underline font-semibold">Delete</button>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-2">{b.title}</h3>
                        <div className="text-xs text-slate-500 mt-0.5">Saved by @{b.author} • {b.watts}W</div>
                        <p className="text-xs text-slate-600 mt-3 leading-relaxed">{b.notes}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-700 text-base">{formatINR(b.total)}</span>
                        <button onClick={() => applyPresetFromPartsMap(b.parts)} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
                          Load Build
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Reference Enterprise Builds</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {COMPLETED_BUILDS.map((b, idx) => (
                  <div key={idx} className="bg-white rounded border border-slate-300 p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-bold">{b.tag}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{b.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">Verified by @{b.author}</div>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">{b.notes}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-700 text-base">{formatINR(b.total)}</span>
                      <button onClick={() => applyPresetFromPartsMap(b.parts)} className="px-3 py-1.5 rounded bg-[#2E3A4D] hover:bg-slate-800 text-white text-xs font-semibold">
                        Load into Builder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="bg-white rounded border border-slate-300 p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Indian PC Component Street Price Index (November 2026)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded bg-rose-50 border border-rose-200">
                <div className="text-xs font-bold text-rose-800 uppercase">DDR5 6000MHz CL30 Kits</div>
                <div className="text-xl font-mono font-bold text-rose-950 mt-1">₹14,100 – ₹16,899</div>
                <p className="text-xs text-rose-800 mt-1">32GB DDR5 street pricing updated for late-2026 Indian retail inventory.</p>
              </div>
              <div className="p-4 rounded bg-blue-50 border border-blue-200">
                <div className="text-xs font-bold text-blue-800 uppercase">PCIe 4.0 NVMe 1TB SSDs</div>
                <div className="text-xl font-mono font-bold text-blue-950 mt-1">₹5,150 – ₹9,200</div>
                <p className="text-xs text-blue-800 mt-1">DRAM-equipped flagship drives (990 PRO / SN850X) offer best sustained speeds.</p>
              </div>
              <div className="p-4 rounded bg-amber-50 border border-amber-200">
                <div className="text-xs font-bold text-amber-800 uppercase">1440p GPU Sweet Spot</div>
                <div className="text-xl font-mono font-bold text-amber-950 mt-1">₹39,999 – ₹57,800</div>
                <p className="text-xs text-amber-800 mt-1">RX 9060 XT 16GB, RX 7800 XT, and RTX 4070 SUPER lead Indian price-per-frame metrics.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveBuildToDb} className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">Save Configuration to MongoDB</h3>
              <button type="button" onClick={() => setShowSaveModal(false)} className="text-slate-500 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Build Title *</label>
                <input type="text" required placeholder="e.g., My RTX 5070 Gaming Workstation" value={buildTitle} onChange={(e) => setBuildTitle(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Builder Name</label>
                <input type="text" value={buildAuthor} onChange={(e) => setBuildAuthor(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <textarea rows="2" placeholder="Optional hardware notes..." value={buildNotes} onChange={(e) => setBuildNotes(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowSaveModal(false)} className="px-4 py-1.5 rounded border border-slate-300 text-xs font-semibold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">Save to MongoDB</button>
            </div>
          </form>
        </div>
      )}

      {pickerSlot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[82vh] flex flex-col border border-slate-300 shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 uppercase text-sm">Select {pickerSlot}</h3>
              <input type="text" placeholder={`Filter ${pickerSlot}...`} value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} className="px-3 py-1 rounded border border-slate-300 text-xs flex-1 max-w-xs" />
              <button onClick={() => setPickerSlot(null)} className="text-slate-500 hover:text-slate-800 font-bold">✕</button>
            </div>
            <div className="p-4 overflow-y-auto divide-y divide-slate-200">
              {PARTS_DB[pickerSlot]
                .filter((opt) => opt.name.toLowerCase().includes(pickerSearch.toLowerCase()) || (opt.spec || '').toLowerCase().includes(pickerSearch.toLowerCase()))
                .map((option) => {
                  const [ret, price] = getLowestPriceInfo(option);
                  return (
                    <div key={option.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{option.name}</div>
                        <div className="text-xs text-slate-500">{option.spec || `${option.cores || option.vram || ''} • ${option.tdp}W TDP`} • Best at {ret}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm">{formatINR(price)}</span>
                        <button onClick={() => { setBuild({ ...build, [pickerSlot]: option }); setPickerSlot(null); }} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {showBomModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 border border-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">PC Hardware Hub — Technical Bill of Materials (BOM)</h3>
                <p className="text-xs text-slate-500">
                  Compatibility Audit: {diagnostics.issues.length === 0 ? 'PASSED' : 'WARNINGS PRESENT'}
                  {lastAuditId ? ` • MongoDB Audit ID: #AUD-${lastAuditId}` : ''}
                </p>
              </div>
              <button onClick={() => setShowBomModal(false)} className="text-slate-500 font-bold">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              {SLOT_LABELS.map(({ key, label }) => {
                const p = build[key];
                const low = p ? getLowestPriceInfo(p) : null;
                return (
                  <div key={key} className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="font-bold text-slate-600">{label}</span>
                    <span className="text-slate-900 font-medium">{p ? p.name : 'Not Selected'}</span>
                    <span className="font-mono font-bold">{low ? formatINR(low[1]) : '₹0'}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-600">Estimated Load: <strong className="font-mono">{diagnostics.totalWatts}W</strong></div>
              <div className="text-base font-mono font-bold text-blue-700">Total: {formatINR(diagnostics.totalCost)}</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => window.print()} className="px-4 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold">Print / Save PDF</button>
              <button onClick={() => setShowBomModal(false)} className="px-4 py-1.5 rounded border border-slate-300 text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}