//滚动条同步
const asyncScroller = function (nodeList, callback) {
  let nodes = Array.prototype.filter.call(
    nodeList,
    (item) => item instanceof HTMLElement
  );
  let beforeScrollTop = document.body.scrollTop;

  nodes.forEach((ele, index) => {
    ele.addEventListener("scroll", function () {
      // 给每一个节点绑定 scroll 事件
      let top = this.scrollTop;
      let left = this.scrollLeft;
      let afterScrollTop = top;
      let delta = afterScrollTop - beforeScrollTop;

      for (let node of nodes) {
        if (node === this) continue;
        // 同步所有除自己以外节点
        node.scrollTo(left, top);
        if (delta === 0) return false;
        beforeScrollTop = afterScrollTop;
        // console.log(top)
        if (delta > 0) {
          callback("down", top);
        } else {
          callback("up", top);
        }
      }
    });
  });
};
export { asyncScroller };
