import withToolbar from "./src/plugins/with-toolbar.mjs";
import toolbarConfig from "./toolbar.config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withToolbar(toolbarConfig)(nextConfig);
