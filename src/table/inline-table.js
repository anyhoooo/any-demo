import React from "react";
import "./index.less";

class InlineTable extends React.Component {
  constructor(props) {
    super(props);
    //每一行的ref
    this.trRefsArray = [];
  }

  componentDidMount() {
    this.noticeParentCollectData();
  }
  componentDidUpdate() {
    this.noticeParentCollectData();
  }
  noticeParentCollectData() {
    //render和更新节点结束后告诉父级每一行的高度
    this.props.setMaxHeight(
      this.trRefsArray
        .map((i) => i.current && i.current.offsetHeight)
        .filter((i) => i)
    );
    this.trRefsArray = [];
  }
  render() {
    const {
      columns,
      dataSource,
      scrollRef,
      hideScroll,
      height,
      maxScrollHight,
      startActivedIndex,
    } = this.props;

    return (
      <div>
        <div>
          <table>
            <colgroup>
              {columns.map((item, index) => {
                return item.width ? (
                  <col
                    key={index}
                    style={{ width: item.width, minWidth: item.width }}
                  ></col>
                ) : (
                  <col key={index}></col>
                );
              })}
            </colgroup>
            <thead>
              <tr>
                {columns.map((item, index) => {
                  return (
                    <th key={index}>
                      <span>{item.title}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
          </table>
        </div>
        <div
          style={{
            overflowY: "scroll",
            height: height,
          }}
          //没有righttable就把滚动条显示在maintable上
          className={hideScroll ? "hideScroll" : ""}
          ref={scrollRef ? scrollRef : null}
        >
          <div
            style={{
              position: "relative",
              height: maxScrollHight,
            }}
          >
            <table>
              <colgroup>
                {columns.map((item, index) => {
                  return item.width ? (
                    <col
                      key={index}
                      style={{ width: item.width, minWidth: item.width }}
                    ></col>
                  ) : (
                    <col key={index}></col>
                  );
                })}
              </colgroup>
              <tbody>
                {dataSource.map((dataItem, dataIndex) => {
                  const ref = React.createRef();
                  this.trRefsArray.push(ref);
                  //在父级那里获取行高
                  let height = this.props.getMaxHeight(
                    dataIndex + startActivedIndex
                  );
                  return (
                    <tr
                      key={dataIndex}
                      ref={ref}
                      style={{
                        height: height + "px",
                        position: "absolute",
                        display: "inline-table",
                        background: "#fff",
                        top:
                          this.props.getTopHeight(
                            dataIndex + startActivedIndex
                          ) + "px",
                      }}
                    >
                      {columns.map((columnItem, columnIndex) => {
                        return (
                          <td
                            style={{
                              width: columnItem.width && columnItem.width - 20,
                              height: this.height + "px",
                            }}
                            key={columnIndex}
                          >
                            {dataItem[columnItem.key]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default InlineTable;
