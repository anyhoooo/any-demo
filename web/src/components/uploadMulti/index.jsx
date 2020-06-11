import React from "react";
import axios from "axios";
import SparkMD5 from "spark-md5";
import "../index.less";
class TdUploadMulti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //分片总数
      chunkCount: 0,
      chunkIndexList: [],
      uploadList: [],
    };
    this.uploadInput = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.chunkSize = 1 * 1024 * 1024;
  }
  selectedFile() {
    this.uploadInput.current.click();
  }
  async onChange(e) {
    this.fileIndex = 1;
    let file = e.target.files[0];
    const hash = await this.getFileHash(file);
    await this.checkFile(hash);
    this.splitFile(file, hash);
  }
  async checkFile(hash) {
    let result = await axios.post("/api/check", {
      hash,
    });
    if (result.data.data.message.length !== 0) {
      let endList = result.data.data.message.map((i) =>
        Number(i.split("-")[1])
      );
      let reduceList = this.state.chunkIndexList.map((i, j) =>
        endList.includes(j)
          ? { isUpload: true, progress: 100 }
          : { isUpload: false, progress: 0 }
      );
      this.setState({
        chunkIndexList: reduceList,
      });
    }
  }
  //获取文件唯一标识
  getFileHash(file) {
    return new Promise((resolve, reject) => {
      let currentChunk = 0;
      let chunkIndexList = [];
      let _this = this;
      this.setState({
        chunkCount: Math.ceil(file.size / this.chunkSize),
      });
      const spark = new SparkMD5.ArrayBuffer();
      const reader = new FileReader();
      function loadNext() {
        //下标标识分片的index，value表示是否已经上传
        chunkIndexList.push({
          isUpload: false,
          progress: 0,
        });
        const start = currentChunk * _this.chunkSize;
        const end = Math.min(file.size, start + _this.chunkSize);
        reader.readAsArrayBuffer(file.slice(start, end));
      }
      reader.onload = (e) => {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < this.state.chunkCount) {
          loadNext();
        } else {
          console.log("hash create finished");
          const result = spark.end();
          // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
          // 想保留两个文件无法保留。所以把文件名称加上。
          const sparkMd5 = new SparkMD5();
          sparkMd5.append(result);
          sparkMd5.append(file.name);
          const hexHash = sparkMd5.end();
          _this.setState({
            chunkIndexList: chunkIndexList,
          });
          resolve(hexHash);
        }
      };
      loadNext();
    });
  }
  //文件分片
  async splitFile(file, hash) {
    let axiosList = [];
    console.time();
    for (let i = 0, l = this.state.chunkIndexList.length; i < l; i++) {
      if (!this.state.chunkIndexList[i].isUpload) {
        let start = i * this.chunkSize;
        let end = Math.min(file.size, start + this.chunkSize);
        axiosList.push(this.startUpload(file.slice(start, end), file, i, hash));
      }
    }
    axios.all(axiosList).then(() => {
      axios
        .post("/api/merge", {
          size: file.size,
          name: file.name,
          total: this.state.chunkCount,
          hash,
        })
        .then((res) => {
          console.log("上传合并耗时：");
          console.timeEnd();
          let list = this.state.uploadList.concat([
            {
              url: res.data.data.url,
              name: file.name,
            },
          ]);
          this.setState({
            uploadList: list,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  //上传
  startUpload(slice, file, index, hash) {
    const form = new FormData();
    form.append("file", slice);
    form.append("name", file.name);
    form.append("index", index);
    form.append("hash", hash);
    form.append("total", this.state.chunkCount);
    const axiosOptions = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const chunkIndexList = [...this.state.chunkIndexList];
        this.setState({
          chunkIndexList: chunkIndexList.map((item, itemIndex) =>
            itemIndex === index
              ? {
                  isUpload: false,
                  progress:
                    ((progressEvent.loaded / progressEvent.total) * 100) | 0,
                }
              : item
          ),
        });
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post("/api/upload", form, axiosOptions)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  render() {
    return (
      <div className="box">
        <p>并发请求</p>
        <div className="upload-drag">
          <span
            className="upload-btn"
            onClick={() => {
              this.selectedFile();
            }}
          >
            <input
              ref={this.uploadInput}
              type="file"
              accept=""
              multiple="multiple"
              style={{ display: "none" }}
              onChange={this.onChange}
            />
            <div className="upload-drag-container">
              <p className="upload-text">
                Click or drag file to this area to upload
              </p>
            </div>
          </span>
        </div>
        <div>
          {this.state.uploadList.map((i, j) => {
            return <div key={j}>{i.name}</div>;
          })}
        </div>
        <div className="upload-square-Box">
          {this.state.chunkIndexList.map((item, index) => {
            return (
              <div
                key={index}
                className="upload-square"
                style={
                  item.isUpload
                    ? {
                        background: "green",
                      }
                    : {
                        background: `linear-gradient(to top, green ${item.progress}%, white 0%)`,
                      }
                }
              ></div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TdUploadMulti;
