"use client";

import React, { createContext, useContext, useState } from "react";
import { ClassTooltip } from "../plugins/class-tooltip";
import { Toolbar } from "../components/toolbar";
import { useInspector } from "@/hooks/useInspector";
import { useActivePlugins } from "@/hooks/useActivePlugins";
import { useDebounceValue } from "usehooks-ts";
import { ToolbarContextType } from "@/types/context";

const ToolbarContext = createContext<ToolbarContextType>({
  tooltipContent: "",
  showTooltip: () => {},
  hideTooltip: () => {},
  isInspectorActive: false,
  toggleInspector: () => {},
  activePlugins: {
    inspect: true,
    responsiveIndicator: true,
    classEditor: false,
  },
  setActivePlugins: () => {},
  selectedElement: null,
});

export const useToolbar = () => useContext(ToolbarContext);

export const ToolbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tooltipContent, setTooltipContent] = useDebounceValue("", 500);
  const [isInspectorActive, setInspectorActive] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const [activePlugins, setActivePlugins] = useActivePlugins();

  const showTooltip = (content: string, x: number, y: number) => {
    setTooltipContent(content);
    setTooltipPosition({ x, y });
  };

  const hideTooltip = () => setTooltipContent("");

  const toggleInspector = () => {
    setInspectorActive(!isInspectorActive);
    hideTooltip();
  };

  useInspector({
    isActive: isInspectorActive,
    showTooltip,
    hideTooltip,
    selectedElement,
    setSelectedElement,
    activePlugins,
  });

  const contextValue: ToolbarContextType = {
    tooltipContent,
    showTooltip,
    hideTooltip,
    isInspectorActive,
    toggleInspector,
    activePlugins,
    setActivePlugins,
    selectedElement,
  };

  return (
    <ToolbarContext.Provider value={contextValue}>
      {children}
      <Toolbar />
      <ClassTooltip content={tooltipContent} position={tooltipPosition} />
    </ToolbarContext.Provider>
  );
};
