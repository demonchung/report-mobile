import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class FilterMixins extends Vue {
  @Prop({ default: ()=> [] }) value!: Array<string | number | any>;
  @Prop({ default:  ()=> [] }) field!: H3.Report.FieldColumn;
  @Prop({ default: '' }) formula!: string;
  @Prop({ default: "" }) fixedType?: ""; // 固定类型
  @Prop({ default: ()=> {} }) comPrefixCls!: string;

  emitValue(value: string | Array<string | number | { label: string, value: string} > | null) {
   this.$emit('input',value);
  }
}
