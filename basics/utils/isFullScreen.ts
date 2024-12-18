function checkFull() {
  let isFull: any =
    document.fullscreenEnabled ||
    (window as any).fullScreen ||
    (document as any).webkitIsFullScreen ||
    (document as any).msFullscreenEnabled;
  //to fix : false || undefined == undefined
  if (isFull === undefined) {
    isFull = false;
  }
  return isFull;
}
export { checkFull };

export default {
  checkFull
};
