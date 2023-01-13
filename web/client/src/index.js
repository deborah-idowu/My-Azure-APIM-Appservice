import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppContainer from "./containers/AppContainer";
import reportWebVitals from "./reportWebVitals";
import { HashRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    // removed strict mode to prevent double rendering
    // <React.StrictMode>
    <Router>
        <AppContainer />
    </Router>
    // </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
