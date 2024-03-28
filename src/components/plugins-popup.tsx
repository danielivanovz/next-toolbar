import { cn } from "@/lib/utils";
import { PluginsForm } from "./plugins-form";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToolbar } from "../context/toolbar-context";
import { ActivePlugins } from "@/types/context";

type PluginsPopupProps = {
  isToolbarOpen: boolean;
  isPopoverOpen: boolean;
  setPopoverOpen: (value: boolean) => void;
};

export const PluginsPopup: React.FC<PluginsPopupProps> = ({
  isPopoverOpen,
  isToolbarOpen,
  setPopoverOpen,
}) => {
  const { activePlugins, setActivePlugins } = useToolbar();

  const handlePluginActivation = (values: ActivePlugins) => {
    setActivePlugins(values);
    setPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "h-full rounded-none rounded-r-sm transition-all duration-300 text-xs font-sans",
            isToolbarOpen && "transition-all duration-300 opacity-100"
          )}
          variant="ghost"
          onClick={() => setPopoverOpen(!isPopoverOpen)}
        >
          plugins&apos;{" "}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-inspectable="false"
        className="w-full ml-1 bg-transparent/80 backdrop-blur-xl border-neutral-400/70"
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-white">Plugins</h4>
            <p className="text-xs text-neutral-400">
              Manage the plugins in the toolbar
            </p>
          </div>
          <div className="grid gap-2">
            <PluginsForm
              handlePluginActivation={handlePluginActivation}
              defaultValues={activePlugins}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
