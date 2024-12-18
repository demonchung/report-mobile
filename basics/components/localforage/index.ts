import localforage from 'localforage';

const storageOpt: H3.localforage.storageOpt = {
  name: 'name',
  driver: localforage.INDEXEDDB
}

// 过期时间60分钟
const expired = 1000 * 60 * 60;

let localforageInstance: any | null = null;

const _getInstance = () => {
  if (!localforageInstance) {
    localforageInstance = localforage.createInstance(storageOpt);
  }
  if (!localforageInstance.isExpired){
    localforageInstance = _buildInstance(localforageInstance);
  }
  return localforageInstance as H3.localforage.storageInstance;
}

const _buildInstance = (localforageInstance): H3.localforage.storageInstance => {
  const originInstance = localforageInstance;
  const instance: H3.localforage.storageInstance = {

    /**
     * 查询是否过期
     */
    isExpired: (time) => {
      if(time && new Date().getTime() - time >= expired){
        return true;
      }
      return false;
    },
    

    /**
     * 获取存储元素，如过期，则删除
     */
    getItem: async (name) => {
      return new Promise((resolve, reject) => {
        originInstance.getItem(name).then((res) => {
          if(!res){
            resolve(res);
          }else{
            if(res.expired && instance.isExpired(res.expired)){
              originInstance.removeItem(name);
              resolve(null);
            } else { 
                if(res.value){
                  resolve(res.value);
                } 
              }
          }
        }).catch(function(err) {
          reject(err);
        });
      })
    },
    
    /**
     * 写入本地存储，并包装时间戳
     */
    setItem: async (name, value) => {
      return new Promise((resolve, reject) => {
        originInstance.setItem(name, {
          value,
          expired: new Date().getTime()
        }).then((keyName) => {
          resolve(keyName)
        }).catch(function(err) {
          reject(err);
        });
      })
    },
    
    /**
     * 移除，直接删除
     */
    removeItem: originInstance.removeItem
  }

  return instance;
}

export default _getInstance();