/**
 * 氚云过滤条件
 */
declare namespace H3 {
  namespace Yun {
    /**
     * 筛选条件配置
     */
    export interface Filter {
      schemaCode: string;
      field: string;
      formula: string;
      value: Array<any>;
      ands?: Array<Filter>;
      ors?: Array<Filter>;
    }
  }
}
