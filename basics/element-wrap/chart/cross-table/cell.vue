<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import Alias from "@h3/report-mobile/basics/components/alias";

@Component({
  name: "h3-table-cell"
})
export default class ReportTableCell extends Vue {
  @Prop({ default: () => "" }) data!: any;
  @Prop({ default: () => null }) field!: H3.Report.FieldColumn;
  @Prop({ default: () => 0 }) row!: any;
  @Prop({ default: () => 0 }) rowIndex!: number;
  @Prop({ default: () => 0 }) index!: number;
  @Prop({ default: () => false }) isTotal!: boolean;
  @Prop({ default: () => null }) formatter!: Function;
  @Prop({ default: () => null }) getAliasByCell!: Function;
  
  // clickCount:number=0; //点击次数
  // timer:any=null; 
  /**
   * 获取单元格数据集
   */
  getCellData(data: any) {
    return { data, field: this.field, row: this.row, rowIndex: this.rowIndex, index: this.index,isTotal: this.isTotal };
  }
  render(h: CreateElement) {
    let data: any = "";
    // 删除数据前后空格
    if (this.data && typeof this.data === "string") {
      data = this.data.trim();
    } else {
      data = this.data;
    }
    if (this.formatter) {
      data = this.formatter(this.getCellData(data));
    }
    return h(
      Alias,
      {
        class: {
          cell: true,
          strong: this.isTotal,
        },
        attrs:{
          
        },
          props: {
          value: data,
          field: this.field
        },
        // domProps: {
        //   innerText: data === null ? '-' : data
        // },
        nativeOn: {
          // click: () => {
          //   this.clickCount++; 
          //   if(this.timer){
          //     clearTimeout(this.timer);
          //     this.timer = null;
          //   }
          //   this.timer = setTimeout(()=>{
          //     if(this.clickCount>1){
          //       this.$emit("dblClickChart", this.getCellData(data));
          //     }else{
          //       this.$emit("click", this.getCellData(data));
          //     }
          //     this.clickCount = 0;
          //   },200)
          // },
          click: ($event)=>{
            const textOverFlow = $event ? $event.target.scrollWidth > $event.target.clientWidth : false;
            //记录点击的绝对位置
            const chartClickposition = {
              x:$event.pageX,
              y:$event.pageY,
            }
            const cellData = this.getCellData(data);
            if( cellData.field && cellData.field.specialType && cellData.field.specialType === "address" ){ return }
            const uids = this.getAliasByCell ? this.getAliasByCell(this.getCellData(this.data.trim())) : null;
            const labels = uids ? [data] : [];
            // 这儿能点击到有field的只能是维度。指标的点击在table.vue文件 metricFilter 中
            this.$emit("click", {
              ...cellData,
              textOverFlow,
              chartClickposition,
              metricFilter: cellData.field ? [{
                formula: "Equal",
                text:uids ? uids : [data],
                field: cellData.field,
                labels: labels
              }] : [],
            });
          }
        }
      },
      [data === null ? "-" : data]
    );
  }
}
</script>
<style lang="less"></style>
