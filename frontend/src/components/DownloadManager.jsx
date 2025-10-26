import { X, Download as DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const DownloadManager = ({ downloads, onClose }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-80 bg-card border-r flex flex-col" data-testid="download-manager">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-500">Downloads</h2>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="close-downloads-btn">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {downloads.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <DownloadIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No downloads yet</p>
            <p className="text-xs mt-2">Downloads will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {downloads.map((item) => (
              <div
                key={item.id}
                data-testid={`download-item-${item.id}`}
                className="p-3 rounded-lg bg-muted/50 hover:bg-orange-500/10 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <DownloadIcon className="w-4 h-4 flex-shrink-0 mt-1 text-orange-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.filename}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.url}</div>
                    {item.size && (
                      <div className="text-xs text-muted-foreground mt-1">{item.size}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-700 dark:text-green-400">
                    {item.status}
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

export default DownloadManager;