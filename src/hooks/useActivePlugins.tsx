import { ActivePlugins } from "@/types/context";
import { useLocalStorage } from "usehooks-ts";

export const useActivePlugins = (): [
  ActivePlugins,
  (activePlugins: ActivePlugins) => void
] => {
  const [activePlugins, setActivePlugins] = useLocalStorage<ActivePlugins>(
    "next/dev-toolbar",
    { inspect: true, responsiveIndicator: true, classEditor: true }
  );

  return [activePlugins, setActivePlugins];
};
