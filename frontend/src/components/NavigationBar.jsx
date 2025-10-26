import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw, Home, Star, Clock, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NavigationBar = ({
  activeTab,
  goBack,
  goForward,
  reload,
  goHome,
  navigateToUrl,
  addBookmark,
  setShowBookmarks,
  setShowHistory,
  setShowSettings,
  setShowDownloads
}) => {
  const [urlInput, setUrlInput] = useState(activeTab?.url || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToUrl(urlInput);
  };

  const handleAddBookmark = () => {
    if (activeTab) {
      addBookmark({
        title: activeTab.title,
        url: activeTab.url,
        favicon: activeTab.favicon,
        folder: "General"
      });
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-card border-b" data-testid="navigation-bar">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          data-testid="go-back-btn"
          className="hover:bg-orange-500/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goForward}
          data-testid="go-forward-btn"
          className="hover:bg-orange-500/10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={reload}
          data-testid="reload-btn"
          className="hover:bg-orange-500/10"
        >
          <RotateCw className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goHome}
          data-testid="go-home-btn"
          className="hover:bg-orange-500/10"
        >
          <Home className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
        <Input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Search or enter URL..."
          data-testid="url-input"
          className="flex-1 bg-background border-orange-200 dark:border-orange-900 focus:border-orange-500 focus:ring-orange-500"
        />
      </form>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddBookmark}
          data-testid="add-bookmark-btn"
          className="hover:bg-orange-500/10"
          title="Add Bookmark"
        >
          <Star className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowBookmarks(prev => !prev)}
          data-testid="show-bookmarks-btn"
          className="hover:bg-orange-500/10"
          title="Bookmarks"
        >
          <Star className="w-5 h-5 fill-orange-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHistory(prev => !prev)}
          data-testid="show-history-btn"
          className="hover:bg-orange-500/10"
          title="History"
        >
          <Clock className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDownloads(prev => !prev)}
          data-testid="show-downloads-btn"
          className="hover:bg-orange-500/10"
          title="Downloads"
        >
          <Download className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(prev => !prev)}
          data-testid="show-settings-btn"
          className="hover:bg-orange-500/10"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default NavigationBar;