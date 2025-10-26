import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const HistoryPanel = ({ history, onClose, onNavigate, onClear }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="w-80 bg-card border-r flex flex-col" data-testid="history-panel">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-500">History</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            data-testid="clear-history-btn"
            className="text-xs hover:bg-orange-500/10"
          >
            Clear All
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="close-history-btn">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No browsing history
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((item) => (
              <div
                key={item.id}
                data-testid={`history-item-${item.id}`}
                onClick={() => onNavigate(item.url)}
                className="group p-3 rounded-lg hover:bg-orange-500/10 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-2">
                  {item.favicon && (
                    <img
                      src={item.favicon}
                      alt=""
                      className="w-4 h-4 flex-shrink-0 mt-1"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.url}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(item.visited_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;