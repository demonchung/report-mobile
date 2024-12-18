import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard";
import { getPerformance } from "./performance";
import localforage from 'localforage';
import tasklog from './log-tasks/index';
import { analysisApi } from "@h3/report-mobile/basics/service/analysis";




export default class ByLogger {

  initialized: boolean = true;
  maxSize: number = 50;
  reportInterval: any  = 50000;
  dbName = 'report_dashboard';
  idb:any;
  task: any;
  addLog: any = null;
  mainKey: string = '';
  checkTimer:any = null;
  checktime: number = 2000; // 多少秒检查一次indexDB数量 只在对indexDB新增时触发
  isAnalysisLog: boolean = false;
  constructor(opt){
    if (opt) {
      Object.keys(opt).forEach(i => {
        this[i] = opt[i];
      });
    }
    this.initialized = false;
  }
  // 初始化埋点
  init(){
      this.idb= localforage.createInstance({
        name: this.dbName
      });

      // this.task = tasklog(this.log.bind(this),this);
      if(this.mainKey && this.addLog) {
        this.task = tasklog(this.addLog.bind(this),this);
        this.task.start();
      }
      if (!(window as any)._reportLogTimer) {
        (window as any)._reportLogTimer = setInterval(this.consume.bind(this), this.reportInterval)
      }
      
      this.initialized = true
  }
  // 重新设置一条indexDb的数据
  resetLog({key,data}) {
    return new Promise((resolve, reject) => {
      this.getItem(key).then((item) => {
        if (item) {
          const v: any = item;
          Object.assign(v.data, data);
          this.setItem(key, v);
          resolve(key);
        }  else {
          resolve(null);
        }
      })
    });
    
  }
  // 初始化indexDb
  initDb() {
   this.idb = localforage.createInstance({
      name: this.dbName
    });
  }
  
  // 定时回调
  consume(){
    if (!this.initialized) {return Promise.resolve();}
   
    this.idb.length().then((n)=> {
        if(n) {
          console.log(n,this.maxSize,'定时上报');
          this.reportLogs().then(()=> {
            this.idb.clear();
          })
        }
    }).catch(function(err) {
        console.log(err);
    });
  }
  
  getItem(key) {
    return new Promise((resolve, reject) => {
      this.idb.getItem(key).then((res) => {
        resolve(res);
      }).catch(function(err) {
        reject(err);
      });
    })
  }
  setItem(key,value) {
    this.idb.setItem(key, value).then((res)=> {
    });
    this.activeReportLogs();
  }
  //更新
  updateItem(key,prop, value) {
    //更新某记录中的某个属性
    this.idb.getItem(key).then((res) => {
      if (res) {
        const v: any = res;
        v[prop] = value;
        this.setItem(key, v);
      }
    })
  }
  // 主动上报logs
  activeReportLogs() {
    if(this.checkTimer)  {clearTimeout(this.checkTimer);}
    this.checkTimer = setTimeout(()=> {
      this.idb.length().then((n)=> {
        console.log(n,this.maxSize,'主动上报');
        if(n > this.maxSize) {
          this.reportLogs().then(()=> {
            this.idb.clear();
          })
        }
    })
    },this.checktime);
  }
  // 上报logs
  async reportLogs(){
    const logs: any = [];
    const p = getPerformance();
    await this.resetLog({ key: this.mainKey, data: p });
    return new Promise((resolve, reject) => {
      this.idb.iterate((value)=> {
        logs.push(value);
      }).then(()=> {
        if(logs.length) {
          if (this.isAnalysisLog) {
            analysisApi.aigcTraceLog(logs);
          } else {
            dashboardApi.logTrace(logs);
          }
        }
        resolve(logs)
      }).catch((res)=> {
        reject(res);
      })
     })
    
  }
}
