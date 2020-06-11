import React from "react";
import Table from "./table/index";
import "./App.css";

function App() {
  const columns = [
    {
      title: "Left Name",
      width: 100,
      key: "name",
      fixed: "left",
    },
    {
      title: "Age",
      width: 100,
      key: "age",
      fixed: "left",
    },
    {
      title: "Column 1",
      key: "address",
      width: 200,
    },
    {
      title: "Column 2",
      key: "address",
    },
    {
      title: "Column 3",
      key: "address",
    },
    {
      title: "Column 4",
      key: "address",
    },
    {
      title: "Column 5",
      key: "address",
    },
    {
      title: "Column 6",
      key: "address",
    },
    {
      title: "Column 7",
      key: "address",
    },
    {
      title: "Column 8",
      key: "address",
    },
    {
      title: "Right Name",
      width: 100,
      key: "rightName",
      fixed: "right",
    },
  ];

  const data = [
    {
      key: 1,
      name: "John John JohnJohn JohnJohn",
      rightName: "snow",
      age: 32,
      address: "New York Park",
    },
    {
      key: 2,
      name: "Jim ",
      rightName: "Park",
      age: 40,
      address: "London Park Park Park Park Park Park Park",
    },
    {
      key: 3,
      name: "Jim ",
      rightName: "Park",
      age: 40,
      address: "London Park",
    },
  ];
  for (let index = 0; index < 10000; index++) {
    data.push({
      key: index + 4,
      name: "test" + index,
      rightName: "snow" + index,
      age: 32 + index,
      address: "New York" + index,
    });
  }
  return (
    <div className="App">
      <h3>当前数据{data.length}条</h3>

      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          x: 1300,
          y: 400,
        }}
      />
    </div>
  );
}

export default App;
