window.TMComponents = window.TMComponents || {};

window.TMComponents.layout = function layout() {
  return [
    window.TMComponents.nav || "",
    window.TMComponents.tabs || "",
    window.TMComponents.simulator || "",
    window.TMComponents.comparison || ""
  ].join("\n");
};

