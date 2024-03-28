import { ActivePlugins } from "@/types/context";

import { useIsomorphicLayoutEffect } from "usehooks-ts";

interface UseInspectorProps {
  isActive: boolean;
  showTooltip: (content: string, x: number, y: number) => void;
  hideTooltip: () => void;
  onSelectElement?: (element: Element) => void;
  selectedElement: Element | null;
  setSelectedElement: (element: Element) => void;
  activePlugins: ActivePlugins;
}

export const useInspector = ({
  isActive,
  showTooltip,
  hideTooltip,
  onSelectElement,
  selectedElement,
  setSelectedElement,
  activePlugins,
}: UseInspectorProps) => {
  useIsomorphicLayoutEffect(() => {
    if (!isActive) return;

    const handleMouseEnter = (e: MouseEvent) => {
      let currentElement: Element | null = e.target! as Element;
      let isInspectable = true;
      while (currentElement) {
        if (currentElement.getAttribute("data-inspectable") === "false") {
          isInspectable = false;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (!isInspectable) return;
      if (e.target instanceof Element) {
        e.target.classList.add("class-inspector");
        showTooltip(e.target.classList.toString(), e.clientX, e.clientY);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.target instanceof Element) {
        e.target.classList.remove("class-inspector");
      }
      hideTooltip();
    };

    const handleClick = (e: MouseEvent) => {
      if (
        !isActive ||
        !(e.target instanceof Element) ||
        !activePlugins.classEditor
      )
        return;

      let currentElement: Element | null = e.target;
      let isInspectable = true;
      while (currentElement) {
        if (currentElement.getAttribute("data-inspectable") === "false") {
          isInspectable = false;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (!isInspectable) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.target !== selectedElement) {
        selectedElement?.classList.remove("class-editor");
        setSelectedElement(e.target);
        e.target.classList.add("class-editor");
        onSelectElement?.(e.target);
      }
    };

    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("click", handleClick);
    };
  }, [isActive, showTooltip, hideTooltip, onSelectElement, selectedElement]);
};
