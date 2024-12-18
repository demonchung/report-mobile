<!-- 级联选择器item -->
<template>
  <div v-if="treeNode.isShow" :class="prefixCls">
    <span>{{ treeNode.displayName }}</span>
    <h3-svg v-if="treeNode.children.length" name="bevel-left-stroke" position="rotatey"></h3-svg>
    <h3-svg v-if="treeNode.checked" name="tick-stroke"></h3-svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";

import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import { component } from "vue/types/umd";
@Component({
  name: "h3-report-cascader-item",
  components: {
    H3Svg: Svg
  }
})
export default class CascaderItem extends Vue {
  @Prop({ default: () => ({}) }) treeNode!: any;
  prefixCls = "h3-report-cascader-item";
  
}
</script>

<style lang="less">
.h3-report-cascader-item {
  display: block;
  position: relative;
  color: #000;
  height: 32px;
  line-height: 32px;
  padding: 0 30px 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    color: #000000;
    background: #f4f8fc;
    cursor: pointer;
  }
  em {
    display: inline-block;
    position: absolute;
    right: 10px;
    font-size: 12px;
    color: #c9ccd8;
  }
  .check {
    top: 0;
    color: #107fff;
  }
}
</style>
