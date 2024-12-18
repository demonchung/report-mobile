declare namespace H3 {
  namespace FormulaEditor {
    export interface Options {
      assignRegex?: RegExp // 分配规则
      puncRegex?: RegExp // 标点符号规则
      fieldRegex: RegExp // 字段规则
      keywords?: Array<string> //关键字
      formulas?: Array<string> //公式关键字
      fields?: Array<Field> //匹配字段
      change?: Function // 改变事件
      blur?: Function // 焦点离开事件
    }
    export interface Field {
      title: string
      type: string
      key: string
    }
    export interface MarkField{
      form: any   
      to: any
      field: Field, // 字段
      invalid: boolean // 是否是有效字段
    }
    export interface ErrorMessage {
      code: string // 错误code
      message: string //错误消息
    }
  }
}
