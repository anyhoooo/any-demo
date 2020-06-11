import React from "react";

import "./App.css";
import TdUpload from "./components/upload/index";
import TdUploadMulti from "./components/uploadMulti/index";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSingle: true,
    };
  }
  change() {
    let type = !this.state.isSingle;
    this.setState({
      isSingle: type,
    });
  }
  render() {
    return (
      <div className="App">
        <button
          onClick={() => {
            this.change();
          }}
        >
          {this.state.isSingle ? "切换成并发请求" : "切换成顺序请求"}
        </button>
        {this.state.isSingle ? (
          <TdUpload></TdUpload>
        ) : (
          <TdUploadMulti></TdUploadMulti>
        )}
      </div>
    );
  }
}

export default App;
// function App() {
//   let isSingle = true;
//   return (
//     <div className="App">
//       <button
//         onClick={() => {
//           isSingle = !isSingle;
//         }}
//       >
//         {isSingle ? "切换成并发请求" : "切换成顺序请求"}
//       </button>
//       {isSingle ? <TdUpload></TdUpload> : <TdUploadMulti></TdUploadMulti>}
//     </div>
//   );
// }

// export default App;
