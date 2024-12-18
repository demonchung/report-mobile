
// 数据项的逻辑类型
export enum BizDataType
{
  // 空值
  Unspecified = -1,
  // 逻辑型
  Bool = 1,
  // 日期型
  DateTime = 5,
  // 双精度数值型
  Double = 7,
  // 整数
  Int = 9,
  // 长整数
  Long = 11,
  // 长文本
  String = 13,
  // 短文本
  ShortString = 14,
  // 二进制流
  ByteArray = 20,
  // 图片类型
  Image = 23,
  // 未指定类型的附件
  File = 24,
  // 时间段型
  TimeSpan = 25,
  // 参与者（单人）
  Unit = 26,
  // 参与者（多人）
  UnitArray = 27,
  // 参与者（单部门）
  Department = 28,
  // 参与者（多部门）
  MultiDepartment = 29,
  // Html
  Html = 30,
  // Xml
  Xml = 32,
  // 业务对象
  BizObject = 40,
  // 业务对象数组
  BizObjectArray = 41,
  // 业务结构
  BizStructure = 42,
  // 业务结构数组
  BizStructureArray = 43,
  // 关联到其他的对象，这种字段在表单上通常是以开窗查询的形式出现
  Association = 50,
  // 关联对象数组
  AssociationArray = 51,
  // 地图类型,存json格式：{Address:"",Point:{lat:32323.43,lng:323.232}}
  Map = 55,
  // 地址类型,存json格式:{"Province":"福建省","City":"泉州市","Town":"惠安县","Detail":"32323"}
  Address = 56,
  // 公式型控件
  Formula = 57,
  Select = 130,
  // 预留 单选
  SingleSelect = 131,
  // 预留 多选
  MultiSelect = 132
}
