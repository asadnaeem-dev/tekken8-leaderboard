'use client';

import { useEffect, useState } from 'react';

interface AdminTournament {
  id: string;
  name: string;
  short_name: string;
  tier: string;
  liquipedia_url: string;
  last_scraped_at: string | null;
}

interface ScrapeLog {
  id: string;
  source_url: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  records_upserted: number;
  error_message: string | null;
  triggered_at: string;
  completed_at: string;
}

export default function AdminDashboardPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [tournaments, setTournaments] = useState<AdminTournament[]>([]);
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Scraper running states
  const [runningScraper, setRunningScraper] = useState(false);
  const [scraperConsole, setScraperConsole] = useState<string[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);

  // Check local storage for password on load
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_pwd');
    if (savedPassword) {
      setPassword(savedPassword);
      testAuthentication(savedPassword);
    }
  }, []);

  const testAuthentication = async (pwd: string) => {
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`/api/admin/scrape?password=${encodeURIComponent(pwd)}`);
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setTournaments(data.tournaments);
        setLogs(data.logs);
        localStorage.setItem('admin_pwd', pwd);
      } else {
        setLoginError('Invalid Administrator Password');
        setIsAuthenticated(false);
        localStorage.removeItem('admin_pwd');
      }
    } catch (err) {
      setLoginError('Authentication failed due to connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      testAuthentication(password);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_pwd');
    setIsAuthenticated(false);
    setPassword('');
    setTournaments([]);
    setLogs([]);
  };

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/scrape?password=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (data.success) {
        setTournaments(data.tournaments);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const runScrapeCommand = async (url?: string) => {
    setRunningScraper(true);
    setScraperConsole([`[${new Date().toLocaleTimeString()}] Initializing scraper process...`]);
    
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, url })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setScraperConsole(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Scraper executed successfully.`,
          `Stdout:\n${data.stdout}`,
          `Records upserted: ${data.log?.records_upserted || 0}`
        ]);
      } else {
        setScraperConsole(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Scraper failed.`,
          `Error: ${data.error}`,
          `Stderr:\n${data.stderr}`,
          `Stdout:\n${data.stdout}`
        ]);
      }
    } catch (err: any) {
      setScraperConsole(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Connection error triggering scraper: ${err.message}`
      ]);
    } finally {
      setRunningScraper(false);
      fetchDashboardData();
    }
  };

  const handleRunFullScrape = () => {
    runScrapeCommand();
  };

  const handleRunSelectedScrape = () => {
    if (selectedTournaments.length === 0) return;
    // We scrape them sequentially
    runScrapeCommand(selectedTournaments[0]);
  };

  const handleToggleTournament = (url: string) => {
    setSelectedTournaments(prev =>
      prev.includes(url) ? prev.filter(t => t !== url) : [url] // Limit to 1 for precise target run in UI
    );
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 rounded-full border-4 border-red-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-medium">Authorizing secure access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4" id="login-container">
        <div className="tekken-panel rounded-lg p-6 md:p-8 space-y-6 bg-gradient-to-b from-[#151515] to-[#111]">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded bg-[#C8102E] flex items-center justify-center font-bold text-lg tekken-heading mx-auto text-white">
              🔒
            </div>
            <h2 className="text-2xl font-bold tekken-heading text-white tracking-wider">Admin Dashboard</h2>
            <p className="text-xs text-gray-500 font-medium">Provide authorization token to manage scraping engines.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Administrator Password</label>
              <input
                id="admin-password-input"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded focus:border-[#C8102E] focus:outline-none text-white text-sm font-semibold transition-colors"
                required
              />
            </div>

            {loginError && (
              <p className="text-xs text-[#EF4444] font-semibold">{loginError}</p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              className="w-full py-3 bg-[#C8102E] hover:bg-red-700 text-white font-bold tekken-heading rounded tracking-widest uppercase transition-all"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn" id="admin-dashboard">
      {/* Title */}
      <section className="flex flex-col sm:flex-row items-center justify-between border-b border-[#2A2A2A] pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight tekken-heading text-gradient-red">
            Control Panel
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            Manage Liquipedia data syncs, monitor engine status, and inspect execution logs.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 border border-[#2A2A2A] hover:bg-[#C8102E] hover:border-transparent text-xs font-bold tekken-heading rounded tracking-wider transition-all uppercase"
        >
          Sign Out
        </button>
      </section>

      {/* Scraper Control & Console */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sync Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="tekken-panel rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold tekken-heading text-white border-b border-[#2A2A2A] pb-2">
              Sync Controls
            </h2>
            
            <div className="space-y-4">
              <button
                id="btn-run-full-scrape"
                onClick={handleRunFullScrape}
                disabled={runningScraper}
                className="w-full py-3 bg-[#C8102E] hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 font-bold tekken-heading rounded tracking-wider uppercase transition-all glow-red"
              >
                {runningScraper ? 'Running sync...' : 'Run Full Database Sync'}
              </button>

              <div className="border-t border-[#2A2A2A] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Target Single Sync</h3>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => setSelectedTournaments(e.target.value ? [e.target.value] : [])}
                    disabled={runningScraper}
                    className="flex-grow px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-gray-300 font-semibold focus:outline-none"
                  >
                    <option value="">Select tournament...</option>
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.liquipedia_url}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRunSelectedScrape}
                    disabled={runningScraper || selectedTournaments.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 border border-[#2A2A2A] hover:border-[#C8102E] disabled:bg-gray-900 disabled:text-gray-600 disabled:border-transparent font-bold tekken-heading rounded transition-all text-sm text-white uppercase"
                  >
                    Sync
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Console logs */}
        <div className="lg:col-span-2">
          <div className="tekken-panel rounded-lg p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
              <h2 className="text-lg font-bold tekken-heading text-white">
                Scraper Engine stdout
              </h2>
              {runningScraper && (
                <span className="flex items-center gap-1.5 text-xs text-[#C8102E] font-black tekken-heading uppercase animate-pulse">
                  <span className="w-2.5 h-2.5 bg-[#C8102E] rounded-full" />
                  Active
                </span>
              )}
            </div>

            {/* Console Screen */}
            <div className="flex-grow bg-[#050505] border border-[#2A2A2A] rounded p-4 font-mono text-xs text-green-400 overflow-y-auto min-h-[200px] max-h-[300px] space-y-2 whitespace-pre-wrap">
              {scraperConsole.length === 0 ? (
                <div className="text-gray-600 italic">Console idle. Trigger a sync to view outputs.</div>
              ) : (
                scraperConsole.map((line, idx) => <div key={idx}>{line}</div>)
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sync Status per Tournament */}
      <section className="tekken-panel rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <h2 className="text-lg font-bold tekken-heading text-white">
            Tournament Registries Status
          </h2>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="text-xs text-[#C8102E] hover:underline font-bold uppercase tracking-wider disabled:text-gray-500"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Registry'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="registries-list">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 rounded bg-[#161616] border border-[#232323] hover:border-gray-800 transition-colors"
            >
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{t.name}</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{t.tier.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                {t.last_scraped_at ? (
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-[#22C55E] font-extrabold uppercase">Synced ✔</span>
                    <span className="text-[9px] text-gray-500">
                      {new Date(t.last_scraped_at).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-600 font-extrabold uppercase">Out of sync ✖</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scrape Logs History */}
      <section className="tekken-panel rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold tekken-heading text-white border-b border-[#2A2A2A] pb-3">
          System Run History (Last 20 Runs)
        </h2>

        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No scrape log reports registered.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse" id="scrape-logs-table">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-gray-500 font-bold uppercase tracking-wider text-xs">
                  <th className="py-3 pr-4">Timestamp</th>
                  <th className="py-3 px-4">Target Source</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Records Upserted</th>
                  <th className="py-3 pl-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A] font-medium text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3.5 pr-4 text-gray-400">
                      {new Date(log.triggered_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white truncate max-w-[150px]">
                      {log.source_url}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        log.status === 'SUCCESS' 
                          ? 'bg-[#22C55E] bg-opacity-20 text-[#22C55E]' 
                          : 'bg-[#EF4444] bg-opacity-20 text-[#EF4444]'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-white font-bold">
                      {log.records_upserted}
                    </td>
                    <td className="py-3.5 pl-4 text-gray-500 italic truncate max-w-[200px]">
                      {log.error_message || 'No errors reported.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
