import * as React from "react";
import * as ReactDOM from "react-dom";
import * as chroma from "chroma-js";
import { css } from "linaria";

const color = (() => {
  /**
   * Uncomment this to inspect how Chroma was imported.
   */
  //if (typeof chroma !== "function") {
  //throw new Error(
  //`chroma should be a function, instead imported as ${chroma}`
  //);
  //}
  return chroma("red").darken(0.3).css();
})();

let appStyle = "dummy-class-if-comment-out-linaria";

/**
 * Comment or uncomment this block to toggle the issue.
 */
appStyle = css`
  min-width: 500px;
  min-height: 500px;
  background: ${color};
`;

function App() {
  return (
    <div className={appStyle}>
      React app mounted. The value of color is "{color}"
    </div>
  );
}

const root = document.querySelector("#react-app");
ReactDOM.render(<App />, root);
