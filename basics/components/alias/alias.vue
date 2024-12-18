<template>
  <div :class="prefixCls" :title="$r_isWxwork && type && openValue? '' : openValue">
    <OpenData 
      v-if="$r_isWxwork && type && openValue"
      :type="type"
      :openid="openValue"
    /> 
    <template v-else>
      {{ openValue }} 
    </template>
  </div>
</template>
  <script lang="ts">
  import { Component, Vue, Prop, Watch,Inject } from "vue-property-decorator";
  import { Mutation, Action, State, namespace } from "vuex-class";
  // import { isWxwork  } from "@h3/report-mobile/basics/utils/browser";
  import OpenData from "./ww-open-data.vue";

  
  @Component({
    name: "h3-report-alias",
    components: {
      OpenData
    }
  })
  export default class Alias extends Vue {
    prefixCls = "h3-report-alias";
    @Prop({ default: "" }) value!: string | { value : string , label: string}; //字段别名 或 字段名称
    @Prop({ default: "" }) field!: H3.Report.FieldColumn; //字段
    @Prop({ default: "" }) dataType!: string; //字段
    // isWxwork = isWxwork || false;
    orgList = [261,271];
    userList = [260,270];


    get openValue() {
      return this.value && this.value.label ? this.value.label : this.value;
    }
  
    get type() {
      if (this.dataType) {return this.dataType;}
      else if (this.field) {
        if(this.userList.includes(this.field.dataType)) {
          return "userName"
          }
        if(this.orgList.includes(this.field.dataType)) {
          return "departmentName";
          }
      }
      else {return ""}
    }

    mounted() {
      
	  }
  }
  </script>
  
  <style lang="less">
  .h3-report-alias {

  }
  </style>
  