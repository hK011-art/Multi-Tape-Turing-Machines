(() => {
  const app = document.getElementById("app");
  if (!app || !window.TMComponents || typeof window.TMComponents.layout !== "function") {
    return;
  }
  app.innerHTML = window.TMComponents.layout();
})();

