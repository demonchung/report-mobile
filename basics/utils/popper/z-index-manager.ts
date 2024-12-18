let hasInitZIndex = false;
let zIndex: number;

const zIndexManager = {
  getZIndex () {
    return this.zIndex++;
  },
  restoreZIndex () {
    this.zIndex--;
  },
};
Object.defineProperty(zIndexManager, 'zIndex', {
  configurable: true,
  get () {
    if (!hasInitZIndex) {
      zIndex = zIndex || 1500;
      hasInitZIndex = true;
    }
    return zIndex;
  },
  set (value) {
    zIndex = value;
  },
});

export default zIndexManager;
