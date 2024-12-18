<template>
  <div :class="prefixCls">
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { FormulaEditorInstance } from './instance';
import { options } from './options';
@Component({
  name: 'h3-formula-editor'
})
export default class FormulaEditor extends Vue {
  @Prop({ 
    default: ()=> ({})
  }) options: H3.FormulaEditor.Options;
  
  prefixCls: string = 'h3-formula-editor';
  editor : FormulaEditorInstance;
  
  @Watch('options', { immediate: true, deep: true })
  watchOptions() {
    Object.assign(options, this.options);
  }

  /**
   * 插入字段
   * @param field
   */
  insertField(field: H3.FormulaEditor.Field) {
    this.editor.insertField(field);
  }

  /**
   * 插入公式
   * @param formula
   */
  insertFormula(formula: string) {
    this.editor.insertFormula(formula);
  }

  /**
   * 设置公式值
   * @param formula
   */
  setValue(formula: string) {
    this.editor.setValue(formula);
  }
  /**
   * 获取公式值
   */
  getValue(){
    return this.editor.getValue();
  }
  /**
   * 公式检验
   */
  checkValidate() {
    return this.editor.checkValidate();
  }

  /**
   * 获取焦点
   */
  focus() {
    return this.editor.focus();
  }
  mounted() {
    this.editor = new FormulaEditorInstance(this.$el as HTMLElement);
  }
}
</script>
