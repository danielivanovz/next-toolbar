import { cn } from "@/lib/utils";

type TWClassShowerProps = {
  content: string;
  position: { x: number; y: number };
};

export const ClassTooltip: React.FC<TWClassShowerProps> = ({
  content,
  position,
}) => {
  if (!content) return null;

  let isCSR = Boolean(content) && Boolean(content.includes("csr-component"));

  return (
    <div
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: "translate(0, -100%)",
        zIndex: 9999,
      }}
      className={cn(
        "p-2 bg-neutral-800 text-white text-xs rounded-md shadow-md z-50 fixed",
        "transition-all duration-300 ease-in-out"
      )}
    >
      {isCSR ? (
        <div className="text-xs text-emerald-500">
          This component is rendered on the client-side.
        </div>
      ) : (
        <div className="text-xs text-red-500">
          This component is rendered on the server-side.
        </div>
      )}
      {content}
    </div>
  );
};
