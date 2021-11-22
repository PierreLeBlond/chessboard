import App from "./App/App"

const app = new App();

var scripts = document.getElementsByTagName("script");
var script = Array.from(scripts).find(script => script.hasAttribute("app-callback"));
(window as any)[script.getAttribute("app-callback")](app);
