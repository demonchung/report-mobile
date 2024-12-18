import { onLCP, onFCP } from 'web-vitals'

class Task {
  log: any
  opt: any
  constructor(log, opt = {}) {
    this.log = log
    this.opt = opt
  }

  start(){
    const vitalsHandler = (metric) => {
      // console.log(metric,'performance',this.opt);
      if (metric && metric.value) {
        this.log({
          key: this.opt.mainKey,
          data: {
            [`pfm${metric.name.toUpperCase()}`] : metric.value
          }
        })
      }
    }
    onLCP(vitalsHandler)
    onFCP(vitalsHandler)
  }
}

const performanceTask = (log, opt) => new Task(log, opt);

export default performanceTask
