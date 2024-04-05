import { useToolbar } from "@/context/toolbar-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { tailwindClasses } from "../../tailwind-hints";
import { Icons } from "@/components/icons";
import { BASE_CLASSES } from "@/lib/base-classes";

interface ClassEditorProps {
  setEditorOpen: (isOpen: boolean) => void;
}

export const ClassEditor: React.FC<ClassEditorProps> = ({ setEditorOpen }) => {
  const [className, setClassName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [classStates, setClassStates] = useState<{
    [className: string]: boolean;
  }>({});

  const { selectedElement } = useToolbar();

  useEffect(() => {
    if (selectedElement) {
      const classes = selectedElement.className?.split(/\s+/) || [];
      const classState = classes.reduce((acc, className) => {
        acc[className] = true;
        return acc;
      }, {} as { [className: string]: boolean });
      setClassStates(classState);
    }
  }, [selectedElement]);

  useEffect(() => {
    if (className) {
      const filteredSuggestions = tailwindClasses.filter((className) => className.startsWith(className));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [className]);

  const toggleClass = (className: string) => {
    const newState = { ...classStates, [className]: !classStates[className] };
    setClassStates(newState);

    if (selectedElement) {
      selectedElement.className = Object.keys(newState)
        .filter((key) => newState[key])
        .join(" ");
    }
  };

  if (!Boolean(Object.keys(classStates).length)) {
    return null;
  }

  return (
    <div data-inspectable="false" className="flex flex-col space-y-5 justify-start items-start">
      <Button
        onClick={() => {
          setClassStates({});
          setEditorOpen(false);
          if (typeof window !== "undefined" && selectedElement) {
            window.location.reload();
          }
        }}
        className="absolute top-0 right-0 m-2 h-8 rounded-sm transition-colors duration-500 ease-out-in"
        variant="ghost"
        size="icon"
      >
        <Icons.close />
      </Button>
      <div className="space-y-0.5 p-1 flex flex-col">
        <Label className="text-sm text-white">Classes</Label>
        <Label className="text-neutral-400 text-xs">Select/deselect classes to apply to the selected element</Label>
      </div>
      <div className="justify-start space-y-1 px-4">
        {Object.entries(classStates)
          .filter(([className, _]) => BASE_CLASSES.indexOf(className) === -1)
          .map(([className, isEnabled]) => (
            <div key={className} className="flex items-center space-x-2">
              <Checkbox
                id={className}
                checked={isEnabled}
                onCheckedChange={() => toggleClass(className)}
                className="data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <label
                htmlFor={className}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {className}
              </label>
            </div>
          ))}
      </div>
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex items-center space-x-2 h-8">
          <Input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Type a class"
            className="peer h-8 w-full bg-neutral-100/90 backdrop-blur-xl border-neutral-400/70 text-black text-xs tracking-wide font-sans rounded-sm"
            list="tailwind-classes"
          />
          <datalist id="tailwind-classes">
            {suggestions.map((className) => (
              <option key={className} value={className} />
            ))}
          </datalist>
          <Button
            onClick={() => {
              selectedElement?.classList.add(className);
              setClassStates({ ...classStates, [className]: true });
              setClassName("");
            }}
            className="peer h-8 bg-neutral-100/90 backdrop-blur-xl border-neutral-400/70 text-neutral-800 font-light text-base tracking-wide font-sans rounded-sm"
            variant="secondary"
          >
            +
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                Object.keys(classStates)
                  .filter((className) => classStates[className])
                  .filter((className) => BASE_CLASSES.indexOf(className) === -1)
                  .join(" ")
              );
            }}
            className="peer h-8 bg-neutral-100/90 backdrop-blur-xl border-neutral-400/70 text-black text-xs tracking-wide font-sans rounded-sm"
            variant="secondary"
            size="icon"
          >
            <Icons.copy className="h-4 w-12" />
          </Button>
        </div>
        {Boolean(Object.keys(classStates).length) && (
          <Button
            variant={"secondary"}
            data-inspectable="false"
            className="h-8 w-full bg-neutral-100/90 backdrop-blur-xl border-neutral-400/70 text-black text-xs tracking-wide font-sans rounded-sm"
            onClick={() => {
              setClassStates({});
              setEditorOpen(false);
              if (typeof window !== "undefined" && selectedElement) {
                window.location.reload();
              }
            }}
          >
            clear
          </Button>
        )}
      </div>
    </div>
  );
};
