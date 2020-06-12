import React from "react";
import logo from "./logo.svg";
import { Select } from "antd";
import "./App.css";

function App() {
  var sss = [
    { key: 1, title: "ddd" },
    { key: 2, title: "xxx" },
    { key: 3, title: "sss" },
    { key: 4, title: "tttt" },
  ];
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Please select"
          options={sss}
        ></Select>
        ,
      </header>
    </div>
  );
}

export default App;
