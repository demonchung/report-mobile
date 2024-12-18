// interface TaskQueue{
//   max: number,
//   min: number,
//   taskList: Array<{task: Function,id: string}>
//   resMapping: { [key: string]: {
//     resolve?: any,
//     reject?: any
//   }}
// }
class TaskQueue {
  max: number = 0;
  min: number = 0;
  taskList: Array<{task: Function,id: string}>
  resMapping: { [key: string]: {
    resolve?: any,
    reject?: any
  }};
  status: string = "init";
  constructor(max: number) {
    this.max = max; // 并发数
    this.min = 0;
    this.taskList = []; // 全部任务
    this.resMapping = {}; // 结果映射
    // 等同步代码(addTask)全部执行完成，再执行run
    this.startTask() 
  }
  // 开始任务
  startTask() {
    this.status = "init";
    Promise.resolve().then(() => 
      setTimeout(()=> {
        this.status = "pedding";
        this.run();
      },0)
    ) 
  }

  // 增加任务
  addTask(task: Function,id: string) {
    this.taskList.push({task,id});
    // console.log(id,'新增任务');
  }
  
  // 执行任务
  async run() {
    // console.log('执行任务',this.taskList.length);
    if (!this.taskList.length) {
      this.status = 'stop';
      return; 
    }
    const AsyncTasks: any = [];
    // 当传入的并发数大于任务数，取任务数， 反之取并发数
    this.min = Math.min(this.max, this.taskList.length) 
    // 根据并发数分组
    for(let i = 0; i < this.min; i++) {
       AsyncTasks.push(this.taskList.shift());
    }
    await this.handleTask(AsyncTasks);
    this.run();
  }
  
  async handleTask(tasks) {
    // 返回promise处理异步任务组
    return new Promise(resolve => {
      tasks.forEach(async (item, index) => {
        await item && item.task().then(res => {
          // console.log(res,'请求结果');
          this.resMapping[item.id] = {'resolve': res};
        }).catch((err) => {
          // console.log(err);
          this.resMapping[item.id] = {'reject': err};
        }).finally(() => {
          // 最后一个任务resolve()，promise完成
          index + 1 === this.min && resolve(null) 
        })
      })
    })
  }
  // 轮询结果
  checkRes(id) {
    return new Promise((resolve,reject)=>{
      let timer = setInterval(()=> {
        if(this.resMapping && this.resMapping[id]) {
          window.clearInterval(timer);
          this.resMapping[id].resolve &&  resolve(this.resMapping[id].resolve);
          this.resMapping[id].reject &&  reject(this.resMapping[id].reject);
        }
      },150)
    })
  }
}
export default TaskQueue;
