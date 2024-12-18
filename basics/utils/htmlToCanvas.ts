import html2canvas from "html2canvas";
/**
 * options：参考htmlcanvas 参数
 * node: 需要截取的元素 element元素
 */
function htmlToCanvas(node, options) {
  return new Promise((resolve, reject) => {
    try {
      html2canvas(node, options).then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export default htmlToCanvas;
