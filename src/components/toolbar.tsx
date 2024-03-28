"use client";
import React, { useRef, useState } from "react";

import { useToolbar } from "../context/toolbar-context";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Icons } from "./icons";
import { PluginsPopup } from "./plugins-popup";
import { ResponsiveIndicator } from "@/plugins/responsive-indicator";
import {
  useIsMounted,
  useIsomorphicLayoutEffect,
  useWindowSize,
} from "usehooks-ts";
import { ClassEditor } from "@/plugins/class-editor";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SNAP_THRESHOLD = 50;
const SAFE_AREA = 1;

const ToolbarComponent: React.FC = () => {
  const [isToolbarOpen, setToolbarOpen] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [isEditorOpen, setEditorOpen] = useState(true);

  const { activePlugins, selectedElement } = useToolbar();

  const isComponentMounted = useIsMounted();

  useIsomorphicLayoutEffect(() => {
    if (selectedElement) {
      setEditorOpen(true);
      setPopoverOpen(false);
    }

    if (isPopoverOpen) {
      setEditorOpen(false);
    }
  }, [selectedElement, isPopoverOpen]);

  return (
    <div
      data-inspectable="false"
      className="flex flex-col items-center justify-evenly relative z-50"
    >
      <div
        className={cn(
          "flex items-center transition-width ease-in-out duration-300 overflow-hidden border-1 border-neutral-400 rounded-sm",
          "toolbar",
          isToolbarOpen ? `w-[200px]` : " w-10"
        )}
      >
        <Button
          className={cn(
            "h-10 w-10 transition-width ease-in-out duration-300",
            isToolbarOpen && "rounded-r-none w-8"
          )}
          onClick={() => setToolbarOpen(!isToolbarOpen)}
          size="icon"
        >
          {isComponentMounted() && activePlugins.responsiveIndicator ? (
            <ResponsiveIndicator
              className={cn(
                "h-8 transition-width duration-300",
                isToolbarOpen ? "w-6" : "w-10"
              )}
            />
          ) : (
            <Icons.arrow
              className={cn(
                "transition-all ease-in-out duration-300 w-10",
                isToolbarOpen && "-rotate-180 w-6"
              )}
            />
          )}
        </Button>
        {isToolbarOpen && (
          <div className="h-10 flex">
            {activePlugins.inspect && (
              <ClassPanelActivator isOpen={isToolbarOpen} />
            )}
            <PluginsPopup
              isPopoverOpen={isPopoverOpen}
              setPopoverOpen={setPopoverOpen}
              isToolbarOpen={isToolbarOpen}
            />
            {selectedElement ? (
              <Popover open={isEditorOpen}>
                <PopoverTrigger></PopoverTrigger>
                <PopoverContent className="z-50 w-full ml-1 bg-transparent/80 backdrop-blur-xl border-neutral-400/70 text-white text-xs tracking-wide font-sans rounded-sm">
                  <ClassEditor setEditorOpen={setEditorOpen} />
                </PopoverContent>
              </Popover>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export const Toolbar: React.FC = () => {
  const [position, setPosition] = useState({ top: "1.20rem", left: "1.20rem" });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const { width, height } = useWindowSize();

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!toolbarRef.current) return;

    dragOffset.current = {
      x: e.clientX - toolbarRef.current.getBoundingClientRect().left,
      y: e.clientY - toolbarRef.current.getBoundingClientRect().top,
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDrag);
  };

  const onMouseMove = (e: MouseEvent) => {
    let newPosition = {
      left: Math.max(
        SAFE_AREA,
        Math.min(
          e.clientX - dragOffset.current.x,
          width - toolbarRef.current!.offsetWidth - SAFE_AREA
        )
      ),
      top: Math.max(
        SAFE_AREA,
        Math.min(
          e.clientY - dragOffset.current.y,
          height - toolbarRef.current!.offsetHeight - SAFE_AREA
        )
      ),
    };

    const magneticPositions = [
      { top: SAFE_AREA, left: SAFE_AREA },
      { top: SAFE_AREA, left: width - SAFE_AREA },
      { top: height - SAFE_AREA, left: SAFE_AREA },
      { top: height - SAFE_AREA, left: width - SAFE_AREA },
    ];

    magneticPositions.forEach((pos) => {
      const magneticLeft = pos.left - toolbarRef.current!.offsetWidth / 2;
      const magneticTop = pos.top - toolbarRef.current!.offsetHeight / 2;

      if (Math.abs(newPosition.left - magneticLeft) < SNAP_THRESHOLD) {
        newPosition.left = Math.max(
          SAFE_AREA,
          Math.min(
            magneticLeft,
            width - toolbarRef.current!.offsetWidth - SAFE_AREA
          )
        );
      }
      if (Math.abs(newPosition.top - magneticTop) < SNAP_THRESHOLD) {
        newPosition.top = Math.max(
          SAFE_AREA,
          Math.min(
            magneticTop,
            height - toolbarRef.current!.offsetHeight - SAFE_AREA
          )
        );
      }
    });

    setPosition({
      left: `${newPosition.left}px`,
      top: `${newPosition.top}px`,
    });
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div
      className="fixed z-50 rounded-md flex items-center justify-center bg-transparent/80 backdrop-blur-md font-sans text-xs text-white border border-neutral-400/70"
      style={{ top: position.top, left: position.left }}
      ref={toolbarRef}
      onMouseDown={startDrag}
    >
      <ToolbarComponent />
    </div>
  );
};

type InspectorButtonProps = {
  isOpen: boolean;
};

export const ClassPanelActivator: React.FC<InspectorButtonProps> = ({
  isOpen,
}) => {
  const { toggleInspector, isInspectorActive } = useToolbar();

  return (
    <Button
      className={cn(
        "h-full rounded-none transition-all duration-300 bg-neural-100 text-xs font-sans space-x-2",
        isOpen && "transition-all duration-300 opacity-100"
      )}
      onClick={toggleInspector}
      variant="ghost"
    >
      inspect
      <span className="relative ml-2 flex h-2 w-2">
        {isInspectorActive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isInspectorActive ? "bg-green-500" : "bg-red-500"
          )}
        ></span>
      </span>
    </Button>
  );
};
