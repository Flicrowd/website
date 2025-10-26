import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SettingsModal = ({ settings, onClose, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent data-testid="settings-modal" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-orange-600 dark:text-orange-500">Browser Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="homepage">Homepage</Label>
            <Input
              id="homepage"
              data-testid="homepage-input"
              type="url"
              value={localSettings.homepage}
              onChange={(e) => setLocalSettings({ ...localSettings, homepage: e.target.value })}
              placeholder="https://www.google.com"
              className="border-orange-200 dark:border-orange-900 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-engine">Default Search Engine</Label>
            <Select
              value={localSettings.default_search_engine}
              onValueChange={(value) => setLocalSettings({ ...localSettings, default_search_engine: value })}
            >
              <SelectTrigger data-testid="search-engine-select" className="border-orange-200 dark:border-orange-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={localSettings.theme}
              onValueChange={(value) => setLocalSettings({ ...localSettings, theme: value })}
            >
              <SelectTrigger data-testid="theme-select" className="border-orange-200 dark:border-orange-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} data-testid="cancel-settings-btn">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            data-testid="save-settings-btn"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;