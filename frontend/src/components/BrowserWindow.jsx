import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import { toast } from "sonner";
import NavigationBar from "./NavigationBar";
import TabBar from "./TabBar";
import Sidebar from "./Sidebar";
import SettingsModal from "./SettingsModal";
import HistoryPanel from "./HistoryPanel";
import DownloadManager from "./DownloadManager";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BrowserWindow = () => {
  const { theme, setTheme } = useTheme();
  const [tabs, setTabs] = useState([{
    id: 1,
    title: "New Tab",
    url: "https://www.google.com",
    favicon: "https://www.google.com/favicon.ico",
    loading: false
  }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [settings, setSettings] = useState({
    homepage: "https://www.google.com",
    default_search_engine: "google",
    theme: "light"
  });

  // Load data on mount
  useEffect(() => {
    loadBookmarks();
    loadHistory();
    loadDownloads();
    loadSettings();
  }, []);

  // Apply theme from settings
  useEffect(() => {
    if (settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme]);

  const loadBookmarks = async () => {
    try {
      const response = await axios.get(`${API}/bookmarks`);
      setBookmarks(response.data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const loadDownloads = async () => {
    try {
      const response = await axios.get(`${API}/downloads`);
      setDownloads(response.data);
    } catch (error) {
      console.error("Failed to load downloads:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const addBookmark = async (bookmark) => {
    try {
      await axios.post(`${API}/bookmarks`, bookmark);
      loadBookmarks();
      toast.success("Bookmark added!");
    } catch (error) {
      toast.error("Failed to add bookmark");
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await axios.delete(`${API}/bookmarks/${id}`);
      loadBookmarks();
      toast.success("Bookmark deleted");
    } catch (error) {
      toast.error("Failed to delete bookmark");
    }
  };

  const addToHistory = async (item) => {
    try {
      await axios.post(`${API}/history`, item);
      loadHistory();
    } catch (error) {
      console.error("Failed to add to history:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${API}/history`);
      loadHistory();
      toast.success("History cleared");
    } catch (error) {
      toast.error("Failed to clear history");
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await axios.put(`${API}/settings`, newSettings);
      setSettings(response.data);
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const addNewTab = () => {
    const newTab = {
      id: Date.now(),
      title: "New Tab",
      url: settings.homepage,
      favicon: null,
      loading: false
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const updateTab = (tabId, updates) => {
    setTabs(tabs.map(tab => tab.id === tabId ? { ...tab, ...updates } : tab));
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const navigateToUrl = (url) => {
    if (!url) return;
    
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        finalUrl = 'https://' + url;
      } else {
        const searchEngine = settings.default_search_engine || 'google';
        const searchUrls = {
          google: `https://www.google.com/search?q=${encodeURIComponent(url)}`,
          duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(url)}`,
          bing: `https://www.bing.com/search?q=${encodeURIComponent(url)}`
        };
        finalUrl = searchUrls[searchEngine];
      }
    }

    updateTab(activeTabId, { url: finalUrl, loading: true });
    
    // Extract domain for title
    try {
      const urlObj = new URL(finalUrl);
      const domain = urlObj.hostname.replace('www.', '');
      updateTab(activeTabId, { title: domain });
      
      // Add to history
      addToHistory({
        url: finalUrl,
        title: domain,
        favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`
      });
    } catch (e) {
      console.error("Invalid URL:", e);
    }
  };

  const goBack = () => {
    const iframe = document.querySelector(`iframe[data-tab-id="${activeTabId}"]`);
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.history.back();
      } catch (e) {
        toast.error("Cannot navigate: Cross-origin restriction");
      }
    }
  };

  const goForward = () => {
    const iframe = document.querySelector(`iframe[data-tab-id="${activeTabId}"]`);
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.history.forward();
      } catch (e) {
        toast.error("Cannot navigate: Cross-origin restriction");
      }
    }
  };

  const reload = () => {
    const iframe = document.querySelector(`iframe[data-tab-id="${activeTabId}"]`);
    if (iframe) {
      iframe.src = iframe.src;
      updateTab(activeTabId, { loading: true });
    }
  };

  const goHome = () => {
    navigateToUrl(settings.homepage);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  return (
    <div className="flex flex-col h-screen bg-background" data-testid="browser-window">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            OrangeBrowse
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="theme-toggle-btn"
          className="hover:bg-orange-500/10"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        addNewTab={addNewTab}
        closeTab={closeTab}
      />

      {/* Navigation Bar */}
      <NavigationBar
        activeTab={activeTab}
        goBack={goBack}
        goForward={goForward}
        reload={reload}
        goHome={goHome}
        navigateToUrl={navigateToUrl}
        addBookmark={addBookmark}
        setShowBookmarks={setShowBookmarks}
        setShowHistory={setShowHistory}
        setShowSettings={setShowSettings}
        setShowDownloads={setShowDownloads}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Bookmarks Sidebar */}
        {showBookmarks && (
          <Sidebar
            bookmarks={bookmarks}
            onClose={() => setShowBookmarks(false)}
            onDelete={deleteBookmark}
            onNavigate={(url) => {
              navigateToUrl(url);
              setShowBookmarks(false);
            }}
          />
        )}

        {/* History Panel */}
        {showHistory && (
          <HistoryPanel
            history={history}
            onClose={() => setShowHistory(false)}
            onNavigate={(url) => {
              navigateToUrl(url);
              setShowHistory(false);
            }}
            onClear={clearHistory}
          />
        )}

        {/* Downloads Manager */}
        {showDownloads && (
          <DownloadManager
            downloads={downloads}
            onClose={() => setShowDownloads(false)}
          />
        )}

        {/* Browser Content */}
        <div className="flex-1 relative bg-background">
          {tabs.map((tab) => (
            <iframe
              key={tab.id}
              data-tab-id={tab.id}
              data-testid={`browser-iframe-${tab.id}`}
              src={tab.url}
              className={`absolute inset-0 w-full h-full border-0 ${tab.id === activeTabId ? 'block' : 'hidden'}`}
              onLoad={() => updateTab(tab.id, { loading: false })}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              title={tab.title}
            />
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={updateSettings}
        />
      )}
    </div>
  );
};

export default BrowserWindow;