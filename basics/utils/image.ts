import options from '@h3/report-mobile/dist/options';
 /**
 * 读取文件
 */
export const getBase64 = (img, callback)=> {
   const reader = new FileReader();
   reader.addEventListener('load', () => callback(reader.result));
   reader.readAsDataURL(img);
};
 /**
  * 计算预测数据
  */
 export const checkImage = (file)=> {
  let fileTypeList = options.imageComponentConfig.imageType.map(item => `image/${item}`);
  let fileTypeString = options.imageComponentConfig.imageType.join(',');
   let message = '';
   let check: boolean = true;
   // 校验图片类型
   if (!fileTypeList.includes(file.type)) {
      check = false;
     message = "$r_language.el.image.tip_ImageType$" + fileTypeString + '!';
   }
   const rightSize = file.size / 1024 / 1024 < options.imageComponentConfig.limitSize;
   // 校验图片大小
   if (!rightSize) {
     check = false;
     message = "$r_language.el.image.tip_ImageSize$" + options.imageComponentConfig.limitSize + 'MB!';
   }
   return {
     check,
     message
    };
 };
 
export default {
  getBase64,
  checkImage
};
