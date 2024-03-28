interface ResponsiveIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ResponsiveIndicator: React.FC<ResponsiveIndicatorProps> = ({ className }) => {
  // if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="z-50 flex items-center justify-center rounded-sm p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">sm</div>
      <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
      <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
};
