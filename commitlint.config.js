/** @type {import("@commitlint/types").UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  // Dependabot bodies contain long release-note lines that break body-max-line-length.
  // Its subject format is still controlled via .github/dependabot.yml (commit-message.prefix).
  ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")],
};
