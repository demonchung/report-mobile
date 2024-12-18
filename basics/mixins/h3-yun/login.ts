import fetch from './fetch';

const account: any = {
  'infrastructure': {
    dingId: '$:LWCP_v1:$cPisamX63jMBXKooTYz3oA==',
    engineCode: 'l22smty7f9kco78qhc66rmrh5',
  },
  'master': {
    dingId: '$:LWCP_v1:$cPisamX63jMBXKooTYz3oA==',
    engineCode: 'l22smty7f9kco78qhc66rmrh5',
  },
};



function loginAccount(local: string) {
  const dingid = account[local].dingId;
  const engineCode = account[local].engineCode;
  
  window.localStorage.setItem('H3_DEV_GROUP', local);
  const paramData = {
    mobile: '',
    dingid,
    engineCode,
    clusterTokenId: 1
  };
  return new Promise((resolve, reject)=> {
    fetch('/login/LoginByMobile', paramData, 'POST', true,    `/${local}Apis`)
      .then((data: any) => {
        if (!data.Result) {
          console.log('登录失败', data);
        }
        resolve();
      });
  });
  
}

export {
  loginAccount
}

export default {
  loginAccount
};
