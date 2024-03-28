const withToolbar = (toolbarConfig) => {
  const isDev = process.env.NODE_ENV !== "production";

  return (nextConfig) => {
    return {
      ...nextConfig,
      webpack: (config, context) => {
        if (context.dev && toolbarConfig.componentMapper) {
          config.module.rules.push({
            test: /\.tsx?$/,
            use: {
              loader: "./loader.js",
            },
          });
        }
        return config;
      },
    };
  };
};

export default withToolbar;
