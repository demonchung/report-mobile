<script lang='ts'>
import 'moment/locale/zh-cn';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import { Mutation, Action, State, namespace } from 'vuex-class';
import { Select, Input, DatePicker, Modal, LocaleProvider } from '@h3/antd-vue';
import zh_CN from '@h3/antd-vue/lib/locale-provider/zh_CN';
import moment, { Moment } from 'moment';
import options from '@h3/report-mobile/dist/options';
import Regexp from '@h3/report-mobile/basics/utils/regexp';
import getFilterTypes, { dateFilterType, DateType, dateFilterTypeList } from '@h3/report-mobile/basics/enum/filter-type';
import H3MultiInput from '@h3/report-mobile/basics/components/multi-input/multi-input.vue';
import { addWheelListener } from '@h3/report-mobile/basics/utils/global';
import { closest } from '@h3/report-mobile/basics/utils/dom';

moment.locale('zh-cn');
  @Component({
    name: 'h3-report-filter-modal',
    components: {
      ASelect: Select,
      ASelectOptGroup: Select.OptGroup,
      ASelectOption: Select.Option,
      AInput: Input,
      ADatePicker: DatePicker,
      ARangePicker: DatePicker.RangePicker,
      H3MultiInput
    }
  })
export default class SetFilter extends Vue {
    prefixCls = 'h3-report-filter-element';
    @Prop({ default: {} }) filter!: H3.Report.FilterFieldColumn;
    @Prop({ default: '' }) format!: string; // 筛选方式
    @Prop({ default: null }) chartSize?: {h: number, w: number} | null; // grid宽高
    @Prop({ default: '' }) status?: 'design' | 'report' | 'preview'; // 图表状态
    // 自定义日期列表
    dateFilterType:Array<{label:string, value:string}> = dateFilterType;
    // 字段类型
    fieldType!:string;
    zh_CN:any=zh_CN;
    // 数据类型
    dataType!:number | string;
    // 过滤逻辑枚举集合
    formulaOptions: Array<string> = [];
    // 自定义时间展示值
    agileTimeLabel: string = '';
    // 日期的展示值 moment
    dateValue: Moment | Array<Moment | null> | null | any = null;
    // 是否展示显示时间
    showTimeFlag:boolean = false;
    // 自定义日期实际值-默认Today
    agileTimeValue!:string;
    startValue: Moment | Moment[] | null= null;
    endValue: Moment | Moment[] | null = null;
    // 日期按钮是否能对日历做操作
    isOpenDate:boolean = false;
    // 日期组件是否常显示 h>13
    isTilingDateComponent:boolean = false;
    // 排列组件是否换行
    isNewFeed:boolean = false;
    // 单范围日历的切换 true/false 左边/右边
    toggleOpen:boolean = true;
    // 是否展示单日历
    isAloneDate: boolean = false;
    // 拷贝
    tmpFilter = JSON.parse(JSON.stringify(this.filter));
    
    // 监听筛选器宽高
    @Watch('chartSize', { deep: true })
    changeChartSize(chartSize: {h?: number, w?: number}) {
      if (chartSize && chartSize.h && chartSize.w) {
        this.isTilingDateComponent = !!(this.status && chartSize.h >= 11);
        this.isAloneDate = !!(this.isTilingDateComponent && chartSize.w <= 12);
        this.isNewFeed = !!(this.status && chartSize.h >= 7);
      }
    }
    // 监听筛选方式
    @Watch('format')
    changeFormat(value) {
      this.tmpFilter = Object.assign(this.tmpFilter, this.filter);
      if (this.tmpFilter.field.type === 'date' && !this.status) {
        this.showTimeFlag = value === 'Time';
        this.dateValue = null;
        this.tmpFilter.text = [''];
        this.$emit('change-value', this.tmpFilter.text);
      }
    }
    // 监听日期值，对单日历范围和范围的数据做转换
    @Watch('dateValue', { immediate: true })
    changeDateValue(value) {
      this.startValue = value && value[0] ? value[0] : null;
      this.endValue = value && value[1] ? value[1] : null;
    }
    // 监听筛选变化
    @Watch('filter', { immediate: true, deep: true })
    changeField(filter:H3.Report.FilterFieldColumn) {
      this.tmpFilter = Object.assign(this.tmpFilter, filter);
      this.fieldType = this.tmpFilter.field.type;
      this.dataType = this.tmpFilter.field.dataType;
      if (this.fieldType === 'date') {
        this.showTimeFlag = this.format === 'Time';
        const tmpTimeValue: {label:string, value:string} | undefined = this.dateFilterType.find((item:any) => item.value === filter.text[0]);
        if (tmpTimeValue) {
          this.agileTimeValue = tmpTimeValue.value;
        } else {
          this.agileTimeValue = 'Custom';
          if (filter.text[0] || filter.text[1]) {
            if (this.showTimeFlag) {
              this.dateValue = filter.formula === 'Range' ? [(filter.text[0] ? moment(filter.text[0], 'YYYY-MM-DD HH:mm') : null), (filter.text[1] ? moment(filter.text[1], 'YYYY-MM-DD HH:mm') : null)] : moment(filter.text[0], 'YYYY-MM-DD HH:mm');
            } else {
              this.dateValue = filter.formula === 'Range' ? [(filter.text[0] ? moment(filter.text[0], 'YYYY-MM-DD') : null), (filter.text[1] ? moment(filter.text[1], 'YYYY-MM-DD') : null)] : moment(filter.text[0], 'YYYY-MM-DD');
            }
          } else {
            this.dateValue = null;
          }
        }
        this.agileTimeLabel = dateFilterTypeList[this.agileTimeValue];
      }
    }
    // 监听字段类型
    @Watch('fieldType')
    changeFilterType(value:string) {
      this.formulaOptions = getFilterTypes(this.tmpFilter.field)[value];
    }
    // 监听自定义日期实际值，得到展示值
    @Watch('agileTimeValue')
    changeAgileTimeLabel(value:string) {
      this.agileTimeLabel = dateFilterTypeList[value];
    }
    /**
     *  自定义日期改变
     * @param value
     */
    agileTimeChange(value:string) {
      this.dateValue = null;
      this.agileTimeValue = value;
      this.tmpFilter.text.splice(0);
      if (value !== 'Custom') {
        this.tmpFilter.text.push(value);
      }
      this.$emit('change-value', this.tmpFilter.text);
    }
    /**
     *  第三方组件--值改变
     * @param value
     */
    extendValueChange(value:any) {
      if (value === '' || value === null) {
        this.tmpFilter.text = [];
      } else if (value instanceof Array) {
        this.tmpFilter.text = value;
      } else {
        this.tmpFilter.text[0] = value;
      }
      this.$emit('change-value', this.tmpFilter.text);
    }
    // 弹窗组件当前挂载节点
    getCurrentNode() {
      return this.isTilingDateComponent ? this.$el : document.body;
    }
    // 清除时间
    clearDate(){
      if(this.tmpFilter.formula === 'Range' && !(this.isAloneDate)) {
        this.valueChange([]);
      } else if (this.tmpFilter.formula === 'Range' && this.isAloneDate) {
        this.valueChange(null, this.toggleOpen ? 0 : 1);
      } else {
        this.valueChange(null)
      }
    }
    // 处理日期展开关闭
    handleOpenDateChange(open: boolean) {
      this.isOpenDate = open;
    }
    // 自定义日期页脚，清除功能
    dateExtraFooter(h,props) {
      return h('a', {
        class: `${this.prefixCls}__clear`,
        domProps: {
          innerHTML: '清除'
        },
        on: {
          click: this.clearDate
        },
      })
    }
    /**
     *  日历组件
     *  根据不同条件，返回不同日期组件
     */
    generateDateComponent(h:CreateElement) {
      if (this.tmpFilter.formula !== 'Range' && this.agileTimeValue === 'Custom') {
        // 日期组件
        return h(DatePicker, {
          props: {
            format: this.showTimeFlag ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD',
            value: this.dateValue,
            showToday: false,
            getCalendarContainer: this.getCurrentNode,
            dropdownClassName: `${this.prefixCls}__date-picker`,
            open: this.isTilingDateComponent ? true : this.isOpenDate,
            showTime: this.showTimeFlag ? {
              format: 'HH:mm',
              defaultValue: moment('00:00', 'HH:mm'),
            } : false
          },
          class: `${this.prefixCls}__date-input ${this.prefixCls}__date-input-br`,
          on: {
            change: ($event) => {
              this.valueChange($event);
            },
            openChange: this.handleOpenDateChange
          },
          scopedSlots:{
            renderExtraFooter: props => {
              return this.dateExtraFooter(h,props);
            },
          }
        });
      } else { 
        if (this.tmpFilter.formula === 'Range') {
        // 单日历范围组件
        if (this.isAloneDate) {
          return [h(DatePicker, {
            props: {
              format: this.showTimeFlag ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD',
              value: this.startValue,
              showToday: false,
              getCalendarContainer: this.getCurrentNode,
              dropdownClassName: `${this.prefixCls}__date-picker-${(this.toggleOpen ? 'active' : 'hide')}`,
              showTime: this.showTimeFlag ? {
                format: 'HH:mm',
                defaultValue: moment('00:00', 'HH:mm'),
                disabledHours: this.disabledHours,
                disabledMinutes: this.disabledMinutes
              } : false,
              disabledDate: this.disabledStartDate,
              placeholder: '起始日期',
              open: this.isTilingDateComponent,
            },
            class: {
              'h3-report-filter-element__range-date': true,
              active: this.toggleOpen
            },
            on: {
              change: ($event) => {
                this.valueChange($event, 0);
              },
            },
            nativeOn: {
              click: () => {
                this.toggleOpen = true;
              }
            },
          scopedSlots:{
            renderExtraFooter: props => {
              return this.dateExtraFooter(h,props);
            },
          }
          }), h('span', {
            class: `${this.prefixCls}__wavy-line`,
            domProps: {
              innerHTML: '~'
            },
          }), h(DatePicker, {
            props: {
              format: this.showTimeFlag ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD',
              value: this.endValue,
              showToday: false,
              getCalendarContainer: this.getCurrentNode,
              dropdownClassName: `${this.prefixCls}__date-picker-${(this.toggleOpen ? 'hide' : 'active')}`,
              showTime: this.showTimeFlag ? {
                format: 'HH:mm',
                defaultValue: moment('23:59', 'HH:mm'),
                disabledHours: this.disabledHours,
                disabledMinutes: this.disabledMinutes
              } : false,
              disabledDate: this.disabledEndDate,
              placeholder: '结束日期',
              open: this.isTilingDateComponent
            },
            class: {
              'h3-report-filter-element__range-date': true,
              active: !this.toggleOpen
            },
            on: {
              change: ($event) => {
                this.valueChange($event, 1);
              },
            },
            nativeOn: {
              click: () => {
                this.toggleOpen = false;
              }
            },
            scopedSlots:{
              renderExtraFooter: props => {
                return this.dateExtraFooter(h,props);
              },
            }
          })];
        }
        //范围日历组件
        return h(DatePicker.RangePicker, {
          class: `${this.prefixCls}__date-input`,
          props: {
            format: this.showTimeFlag ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD',
            getCalendarContainer: this.getCurrentNode,
            dropdownClassName: `${this.prefixCls}__date-picker`,
            value: this.dateValue,
            open: this.isTilingDateComponent ? true : this.isOpenDate,
            showTime: this.showTimeFlag ? {
              format: 'HH:mm',
              defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
            } : false,
          },
          scopedSlots:{
            renderExtraFooter: props => {
              return this.dateExtraFooter(h,props);
            },
          },
          on: {
            change: ($event) => {
              this.valueChange($event);
            },
            openChange: this.handleOpenDateChange
          }
        });
      }
    }
    }
    /**
     *  改变文本框及日期的值处理
     * @param value
     * @param index
     */
    valueChange(value:any, index?:number) {
      switch (this.fieldType) {
        case 'string':
          if (['In', 'NotIn'].includes(this.tmpFilter.formula)) {
            this.tmpFilter.text = value;
          } else {
            this.$set(this.tmpFilter.text, 0, value.target.value);
          }
          break;
        case 'number':
          if (!Regexp('NUMBER', value.target.value, true)) {return;}
          if (this.tmpFilter.formula === 'Range' && (index === 0 || index)) {
            this.$set(this.tmpFilter.text, index, value.target.value);
          } else {
            this.$set(this.tmpFilter.text, 0, value.target.value);
          }
          break;
        case 'date':
          // 日期清空时，范围日历返回 [], 单日历返回null
          if ((value instanceof Array && !value.length) || !value) {
            if ((index || index === 0) && this.dateValue) {
              this.$set(this.dateValue, index, value);
              this.$set(this.tmpFilter.text, index, '');
            } else {
              this.dateValue = value;
              this.tmpFilter.text = [''];
            }
            break;
          }
          if (this.tmpFilter.formula === 'Range') {
            this.dateValue = [];
            // 选择日期范围
            if (value instanceof Array) {
              value.forEach((date: Moment, i: number) => {
                this.$set(this.tmpFilter.text, i, this.showTimeFlag ? date.format('YYYY-MM-DD HH:mm') : date.format('YYYY-MM-DD'));
                this.$set(this.dateValue, i, date);
              });
              // 单日历选择范围
            } else if (index || index === 0) {
              this.$set(this.tmpFilter.text, index, this.showTimeFlag ? (value as Moment).format('YYYY-MM-DD HH:mm') : (value as Moment).format('YYYY-MM-DD'));
              this.$set(this.dateValue, index, value);
            }
            // 单日历单选日期
          } else {
            this.$set(this.tmpFilter.text, 0, this.showTimeFlag ? (value as Moment).format('YYYY-MM-DD HH:mm') : (value as Moment).format('YYYY-MM-DD'));
            this.dateValue = value;
          }
          break;
        default:
          break;
      }
      this.$emit('change-value', this.tmpFilter.text);
    }
    // 禁用开始日期
    disabledStartDate(startValue: Moment | null) {
      const { endValue } = this;
      if (!startValue || !endValue) {
        return false;
      }
      return  this.showTimeFlag ? (endValue as Moment).isBefore(startValue,'day') : (endValue as Moment).isSameOrBefore(startValue,'day')
    }
    // 禁用结束日期
    disabledEndDate(endValue: Moment | null) {
      const { startValue } = this;
      if (!endValue || !startValue) {
        return false;
      }
      return  this.showTimeFlag ? (startValue as Moment).isAfter(endValue,'day') : (startValue as Moment).isSameOrAfter(endValue,'day')
    }
    // 禁用部分小时
    disabledHours () {
      const { startValue } = this;
      const { endValue } = this;
      const hours: Array<any>= [];
      if (startValue && endValue && (startValue as Moment).isSame((endValue as Moment),'day')) {
        const endHour = parseInt((endValue as Moment).format('HH'));
        const startHour = parseInt((startValue as Moment).format('HH'));
        if(this.toggleOpen) {
          for (let i = endHour < 23 ? (endHour+1) : endHour; i < 24; i++) {
            hours.push(i)
          }
        } else {
          for (let i = 0; i < startHour; i++) {
            hours.push(i)
          }
        }
      }
      return hours
    }
    // 禁用部分分钟
    disabledMinutes (selectedHour: number) {
      const { startValue } = this;
      const { endValue } = this;
      const minutes: Array<any>= [];
      if (startValue && endValue && (startValue as Moment).isSame((endValue as Moment),'day')) {
        const endHour = parseInt((endValue as Moment).format('HH'));
        const startHour = parseInt((startValue as Moment).format('HH'));
        const endMinute = parseInt((endValue as Moment).format('mm'));
        const startMinute = parseInt((startValue as Moment).format('mm'));
        if(this.toggleOpen) {
          if (selectedHour === endHour) {
            for (let i = endMinute ; i < 60; i++) {
              minutes.push(i)
            }
          }
        } else {
          if (selectedHour === startHour) {
            for (let i = 0; i <= startMinute; i++) {
              minutes.push(i)
            }
          }
        }
      }
      return minutes
    }
    
    mounted() {
      addWheelListener(document.body, (e: Event) =>  {
        if(closest(e.target as HTMLDivElement, '.ant-calendar-time-picker-select')) {
          e.stopPropagation();
        }
      }, true);
    }
    
    render(h: CreateElement) {
      const tmpInputArray = [0, 1];
      // 输入框
      const InputGroup = tmpInputArray.map(item => h(Input, {
        class: `${this.prefixCls}__input-wrap-item`,
        style: {
          display: item === 0 || this.tmpFilter.formula === 'Range' ? 'block' : 'none'
        },
        props: {
          options: this.formulaOptions,
          value: this.tmpFilter.text[item],
          placeholder: this.tmpFilter.formula === 'Range' ?  (item === 0 ? '最小值' : '最大值') : '请输入'
        },
        on: {
          input: ($event) => {
            this.valueChange($event, item);
          }
        }
      }));
      if(this.tmpFilter.formula === 'Range') {
        InputGroup.splice(1,0, h('i', { class: 'iconfont straightline'}))
      }
      const InputGroupWrap = h('div', {
        class: `${this.prefixCls}__input-wrap`,
      }, [...InputGroup]);
      // 多选框
      const MultiInput = h('div', {
        class: `${this.prefixCls}__multi-input`,
      }, [
        h(H3MultiInput, {
          props: {
            items: this.tmpFilter.text
          },
          on: {
            'multi-input': this.valueChange
          }
        })
      ]);
      // 日期组件
      const DateComponentWrap = h('div', {
        class: `${this.prefixCls}__date-wrap`,
      }, [
        h(Select, {
          style: {
            display: (this.tmpFilter.formula === 'Equal') ? 'block' : 'none'
          },
          class: {
            "h3-report-filter-element__time-select": true,
            "h3-report-filter-element__time-custom" : this.agileTimeValue === 'Custom'
          },
          props: {
            options: this.dateFilterType,
            value: this.agileTimeLabel,
            placeholder: '自定义',
          },
          on: {
            change: this.agileTimeChange
          }
        }),
        this.generateDateComponent(h)
      ]);
      const ValueComponent = () => {
        let tmpComponent;
        if (typeof options.integrateComponents === 'function' && options.integrateComponents(this.tmpFilter.field, this.tmpFilter.formula)) {
          tmpComponent = h(options.integrateComponents(this.tmpFilter.field), {
            props: {
              field: this.tmpFilter.field,
              formula: this.tmpFilter.formula,
              value: this.tmpFilter.text[0] ? this.tmpFilter.text : []
            },
            on: {
              input: (value) => {
                this.extendValueChange(value);
              },
            }
          });
        } else if (this.fieldType === 'date') {
          tmpComponent = h(LocaleProvider, {
            props: {
              locale: this.zh_CN
            }
          }, [
            DateComponentWrap
          ]);
        } else if (!['In', 'NotIn'].includes(this.tmpFilter.formula)) {
          tmpComponent = InputGroupWrap;
        } else {
          tmpComponent = MultiInput;
        }
        if (!['None', 'NotNone'].includes(this.tmpFilter.formula)) {
          return h('div', {
            class: {
              'h3-report-filter-element': true,
              'tiling-date-component': this.isTilingDateComponent,
              'new-line': this.isNewFeed,
            },
          }, [
            tmpComponent
          ]);
        }
        return null;
      };
      return ValueComponent();
    }
}
</script>
<style lang="less">
  .h3-report-filter-element {
    width: 100%;
    padding-top: 10px;
    &__input-wrap {
      display: flex;
      align-items: center;
      &-item + &-item {
        margin-left: 10px;
      }
    }
    .straightline {
      padding: 0 4px;
      color: #999;
    }
    &__date-picker-active {
      display: block;
    }
    &__date-picker-hide {
      display: none;
    }
    &__wavy-line {
      line-height: 32px;
      color: #D4D7E0;
      padding: 0 3px;
    }
    .ant-calendar-disabled-cell.ant-calendar-today .ant-calendar-date:before {
      content: none;
    }
    &__time-select {
      min-width: 90px;
      flex:1;
    } 
    &__time-select&__time-custom {
      margin-right: 10px;
    }
    &__clear{
      display: block;
      color: #107FFF;
      height: 100%;
    }
    &__date-wrap{
      display: flex;
      padding-bottom: 2px;
      .ant-calendar-picker{
        flex: 3;
      }
    }
    &__range-date.active {
      .ant-input {
        border-color: #389cff;
        outline: 0;
        -webkit-box-shadow: 0 0 0 2px rgba(16, 127, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(16, 127, 255, 0.2);
        border-right-width: 1px !important;
      }
    }
    &__range-date + &__range-date {
      margin-left: 10px;
    }
  }
  .h3-report-filter-element.alone-range-date{}
  /* 换行 */
  .h3-report-filter-element.new-line {
    .h3-report-filter-element__input-wrap{
      flex-wrap: wrap;
    }
    .h3-report-filter-element__input-wrap-item + .h3-report-filter-element__input-wrap-item {
      margin:10px 0 0;
    }
  }
  .ant-calendar-footer-extra {
    display: none;
  }
  /* 日期组件平铺 */
  .h3-report-filter-element.tiling-date-component{
    position: absolute;
    top: 0;
    left: 0;
    padding: 16px;
    .ant-calendar-input-wrap {
      display: none;
    }
    .h3-report-filter-element__date-wrap ~ div {
      position: static !important;
    }
    .ant-calendar-range.ant-calendar-time .ant-calendar-time-picker-inner {
      padding-top: 0;
    }
    .ant-calendar-date-panel {
      overflow: hidden;
    }
    .ant-calendar-range.ant-calendar-time .ant-calendar-time-picker-panel{
      height: 237px;
    }
    .ant-calendar-picker-container {
      position: static !important;
      .ant-calendar-ok-btn {
        display: none;
      }
      .ant-calendar-picker-container-content {
        width: 100%;
        box-shadow: none;
        -webkit-box-shadow:none;
      }
    }
    .ant-calendar-range-right {
      .ant-calendar-date-input-wrap {
        margin-left: 0;
      }
    }
    .ant-calendar-range-middle{
      margin-left: -10px;
    }
    .ant-calendar-footer{
      .ant-calendar-footer-extra {
        display: block;
      }
      .ant-calendar-footer-btn {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
      }
    }
  }
</style>
