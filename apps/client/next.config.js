const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  output: "standalone",
  images: { domains: ["api.dicebear.com"] },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};
