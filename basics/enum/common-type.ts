export enum PositionType {
  Top = 'top', // 顶部
  Bottom = 'bottom', // 底部
  Left = 'left', // 左边
  Right = 'right', // 右边
}
export enum  DirectionType {
  Crosswise = 'crosswise', // 横向
  Endwise = 'endwise', // 纵向
  LeftBank = 'leftBank', //  左倾斜
  RightBank = 'rightBank', // 右倾斜
}
export enum  RelationType {
  Left = 'left', // 左连接
  Right = 'right', // 右链接
  Inner = 'inner', //  内连接
}

export const CompareList = [
  { label: '占上一层百分比', value: 'next' },
  { label: '占第一层百分比', value: 'all' },
 
];
export const PositionList = [
  { label: "$r_language.modules.Legend.posType_Bottom$", value: PositionType.Bottom },
  { label: "$r_language.modules.Legend.posType_Top$", value: PositionType.Top },
  { label: "$r_language.modules.Legend.posType_Left$", value: PositionType.Left },
  { label: "$r_language.modules.Legend.posType_Right$", value: PositionType.Right },
];
export const PositionListAnalysis = [
  { label: "$r_language.Analysis.config.LegendOption.posType_Bottom$", value: PositionType.Bottom },
  { label: "$r_language.Analysis.config.LegendOption.posType_Top", value: PositionType.Top },
  { label: "$r_language.Analysis.config.LegendOption.posType_Left", value: PositionType.Left },
  { label: "$r_language.Analysis.config.LegendOption.posType_Right", value: PositionType.Right },
];
export const DirectionList = [
  { label: "$r_language.modules.AxisYSet.DType_Crosswise$", value: DirectionType.Crosswise },
  { label: "$r_language.modules.AxisYSet.DType_Endwise$", value: DirectionType.Endwise },
  { label: "$r_language.modules.AxisYSet.DType_LeftBank$", value: DirectionType.LeftBank },
  { label: "$r_language.modules.AxisYSet.DType_RightBank$", value: DirectionType.RightBank },
];
export const DirectionListAnalysis = [
  { label: "$r_language.Analysis.config.directOption.DType_Crosswise$", value: DirectionType.Crosswise },
  { label: "$r_language.Analysis.config.directOption.DType_Endwise$", value: DirectionType.Endwise },
  { label: "$r_language.Analysis.config.directOption.DType_LeftBank$", value: DirectionType.LeftBank },
  { label: "$r_language.Analysis.config.directOption.DType_RightBank$", value: DirectionType.RightBank },
];
export const RelationTypeList = [
  { label: "$r_language.Ddesign.stage_relate.joinType_left$", value: RelationType.Left },
  { label: "$r_language.Ddesign.stage_relate.joinType_right$", value: RelationType.Right },
  { label: "$r_language.Ddesign.stage_relate.joinType_inner$", value: RelationType.Inner },
];

