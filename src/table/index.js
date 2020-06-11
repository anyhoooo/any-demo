import React from "react";
import throttle from "lodash/throttle";
import "./index.less";
import InlineTable from "./inline-table";
import { asyncScroller } from "./async-scroller";

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //每行的最大高度集合
      colMaxHeightList: [],
      //可视的数据
      activedData: props.dataSource.slice(0, 20),
      //激活的第一个元素的下标
      startActivedIndex: 0,
    };

    //用于收集每行的最大高度
    this.colHeightMap = new Map();
    //index 对应top值的map
    this.allDataLocationMap = new Map();
    //top值对应的index的map
    this.allDataLocationMapR = new Map();

    this.top = 0;
  }
  componentDidUpdate() {
    let list = Array.from(this.colHeightMap).map((i) => i[1]);
    list.reduce((num, res, index) => {
      num += res;
      if (!this.allDataLocationMap.get(num)) {
        this.allDataLocationMap.set(num, index + 1);
      }
      if (!this.allDataLocationMapR.get(index + 1)) {
        this.allDataLocationMapR.set(index + 1, num);
      }
      return num;
    }, 0);
    this.allDataLocationMapR.set(0, 0);
  }
  componentDidMount() {
    let list = Array.from(this.colHeightMap).map((i) => i[1]);
    //设置每行的最大高度，保证每行高度不要错乱
    this.setState({
      colMaxHeightList: list,
    });
    this.allDataLocationMapR.set(0, 0);
    list.reduce((num, res, index) => {
      num += res;
      if (!this.allDataLocationMapR.get(index + 1)) {
        this.allDataLocationMapR.set(index + 1, num);
      }
      return num;
    }, 0);
    //同步y轴滚动条
    asyncScroller(
      [this.mainTable, this.leftTable, this.rightTable],
      throttle((type, top) => {
        //滚动条回调，需要根据情况更新节点的数据
        let count = 0;
        let moveIndex = 0;
        let lastPop = 0;
        for (let [key, value] of this.allDataLocationMap) {
          //   if (count == 3) {
          //     moveIndex = value;
          //     break;
          //   }
          //向下滚动时 && 滚动位置大于该行的top值
          if (type === "down" && top > key) {
            //该行的index大于激活的第一个的index，说明该行应该被滚到上面隐藏了
            if (value > this.state.startActivedIndex) {
              moveIndex = value;
              count++;
              break;
            }
          }
          //向下滚动 && 缓存量，避免向上滚到头计算出现负值
          if (type === "up" && top > 20 && top <= key) {
            //还有10px就要到达上一行的top值时
            if (lastPop + 20 > top) {
              if (value - 1 === this.state.startActivedIndex) {
                moveIndex = this.state.startActivedIndex - 1;
                count++;
                break;
              }
            }
          }
          lastPop = key;
        }
        if (count) {
          this.setState({
            activedData: this.props.dataSource.slice(moveIndex, moveIndex + 20),
            startActivedIndex: moveIndex,
          });
        }
      }, 50)
    );
  }

  getHeight(dataIndex) {
    //子组件调用获取比较后的最大高度
    return this.state.colMaxHeightList[dataIndex];
  }
  getTopHeight(dataIndex) {
    let list = Array.from(this.allDataLocationMapR).map((i) => i[1]);
    return list[dataIndex];
  }
  setHeight(list) {
    //收集每个表格的行高度
    list.forEach((num, index) => {
      this.colHeightMap.get(index + this.state.startActivedIndex)
        ? num > this.colHeightMap.get(index + this.state.startActivedIndex) &&
          this.colHeightMap.set(index + this.state.startActivedIndex, num)
        : this.colHeightMap.set(index + this.state.startActivedIndex, num);
    });
  }
  render() {
    const { columns, dataSource, scroll } = this.props;
    let maxScrollHeight = dataSource.length * 41;
    //左边浮动的
    let leftList = columns.filter(
      (item) => item.fixed && item.fixed === "left"
    );
    //右边浮动的
    let rightList = columns.filter(
      (item) => item.fixed && item.fixed === "right"
    );
    //按照左中右顺序排下
    let allList = leftList
      .concat(columns.filter((item) => !item.fixed))
      .concat(rightList);

    return (
      <div className={"table-container"}>
        <div
          className={"table-scroll"}
          style={{
            overflowX: "scroll",
          }}
        >
          <div style={scroll && scroll.x && { width: scroll.x + "px" }}>
            <InlineTable
              getMaxHeight={(dataIndex) => this.getHeight(dataIndex)}
              getTopHeight={(dataIndex) => this.getTopHeight(dataIndex)}
              setMaxHeight={(list) => this.setHeight(list)}
              scrollRef={(ref) => (this.mainTable = ref)}
              columns={allList}
              dataSource={this.state.activedData}
              height={scroll && scroll.y}
              hideScroll={rightList.length}
              maxScrollHight={maxScrollHeight}
              startActivedIndex={this.state.startActivedIndex}
            ></InlineTable>
          </div>
        </div>
        <div className={"left-fixed"}>
          <InlineTable
            getMaxHeight={(dataIndex) => this.getHeight(dataIndex)}
            getTopHeight={(dataIndex) => this.getTopHeight(dataIndex)}
            setMaxHeight={(list) => this.setHeight(list)}
            scrollRef={(ref) => (this.leftTable = ref)}
            columns={leftList}
            dataSource={this.state.activedData}
            height={scroll && scroll.y}
            hideScroll={true}
            maxScrollHight={maxScrollHeight}
            startActivedIndex={this.state.startActivedIndex}
          ></InlineTable>
        </div>
        <div className={"right-fixed"}>
          <InlineTable
            getMaxHeight={(dataIndex) => this.getHeight(dataIndex)}
            getTopHeight={(dataIndex) => this.getTopHeight(dataIndex)}
            setMaxHeight={(list) => this.setHeight(list)}
            scrollRef={(ref) => (this.rightTable = ref)}
            columns={rightList}
            dataSource={this.state.activedData}
            height={scroll && scroll.y}
            hideScroll={!rightList.length}
            maxScrollHight={maxScrollHeight}
            startActivedIndex={this.state.startActivedIndex}
          ></InlineTable>
        </div>
      </div>
    );
  }
}

export default Table;
