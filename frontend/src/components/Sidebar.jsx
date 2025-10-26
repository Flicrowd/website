import { X, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = ({ bookmarks, onClose, onDelete, onNavigate }) => {
  // Group bookmarks by folder
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const folder = bookmark.folder || "General";
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(bookmark);
    return acc;
  }, {});

  return (
    <div className="w-80 bg-card border-r flex flex-col" data-testid="bookmarks-sidebar">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-500">Bookmarks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="close-bookmarks-btn">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {Object.keys(groupedBookmarks).length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No bookmarks yet
          </div>
        ) : (
          Object.entries(groupedBookmarks).map(([folder, items]) => (
            <div key={folder} className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                <Folder className="w-4 h-4" />
                {folder}
              </div>
              <div className="space-y-1">
                {items.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    data-testid={`bookmark-${bookmark.id}`}
                    className="group flex items-center gap-2 p-2 rounded-lg hover:bg-orange-500/10 cursor-pointer transition-colors"
                  >
                    <div
                      onClick={() => onNavigate(bookmark.url)}
                      className="flex-1 flex items-center gap-2 min-w-0"
                    >
                      {bookmark.favicon && (
                        <img
                          src={bookmark.favicon}
                          alt=""
                          className="w-4 h-4 flex-shrink-0"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{bookmark.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{bookmark.url}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(bookmark.id);
                      }}
                      data-testid={`delete-bookmark-${bookmark.id}`}
                      className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;