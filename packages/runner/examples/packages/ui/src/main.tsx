import { render } from "preact";
import { App } from "./app";
import "./index.css";

const root = document.getElementById("app");
if (root) {
  render(<App />, root);
}
