import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TabBar = ({ tabs, activeTabId, setActiveTabId, addNewTab, closeTab }) => {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-muted/30 border-b overflow-x-auto" data-testid="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTabId(tab.id)}
          data-testid={`tab-${tab.id}`}
          className={`group flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer min-w-[180px] max-w-[220px] transition-colors ${
            activeTabId === tab.id
              ? 'bg-background border-t-2 border-orange-500'
              : 'bg-muted/50 hover:bg-muted'
          }`}
        >
          {tab.favicon && (
            <img src={tab.favicon} alt="" className="w-4 h-4" onError={(e) => e.target.style.display = 'none'} />
          )}
          <span className="flex-1 truncate text-sm">{tab.title}</span>
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              data-testid={`close-tab-${tab.id}`}
              className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-1 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
      <Button
        variant="ghost"
        size="icon"
        onClick={addNewTab}
        data-testid="add-new-tab-btn"
        className="hover:bg-orange-500/10 ml-2"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TabBar;