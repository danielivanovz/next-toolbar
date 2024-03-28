export interface InspectorToolbarProps {
  tooltipContent: string;
  showTooltip: (content: string, x: number, y: number) => void;
  hideTooltip: () => void;
  isInspectorActive: boolean;
  toggleInspector: () => void;
  selectedElement: Element | null;
}

export interface ActivePlugins {
  inspect: boolean;
  responsiveIndicator: boolean;
  classEditor: boolean;
}

export interface ToolbarContextType extends InspectorToolbarProps {
  activePlugins: ActivePlugins;
  setActivePlugins: (activePlugins: ActivePlugins) => void;
}
