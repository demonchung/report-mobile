<template>
  <div :class="prefixCls" ref="toolbar">
    <div 
      v-for="(group, idx) in outToolbarList" 
      :key="idx" 
      :class="`${prefixCls}__group`"
    >
      <div
        :key="index"
        v-for="(item, index) in group"
        :class="[`${prefixCls}__group-item`, index === group.length - 1 ? 'last-child' : '']"
        @click="click(item, $event)"
      >
        <template v-if="$slots[item.value]">
          <slot :name="item.value"></slot>
        </template>
        <template v-else>
          <AIcon
            :class="`${prefixCls}__icon-wrap`"
            :option="item"
            :isTile="item.tileLabel"
            :getContainer="getTooltipContainer"
          >
          </AIcon>
        </template>
      </div>
      <div v-if="idx !== outToolbarList.length - 1" class="vertical-line"></div>
    </div>
    <h3-dropdown
      v-if="moreToolbarList.length"
      :getParentContainer="getDropdownContainer"
      placement="bottom-end"
      :autoHide="false" 
      overlayCls="toolbar-dropdown"
    >
      <template>
        <div :class="`${prefixCls}__more`">
          <h3-svg name="more-stroke" :class="`${prefixCls}__more-icon`"></h3-svg>
        </div>
      </template>
      <template slot="content">
        <div v-for="(item, index) in moreToolbarList" :key="index" :class="`${prefixCls}__more-box`"> 
          <div
            :class="`${prefixCls}__more-item`"
            :key="index"
            @click="click(item, $event)"
          >
            <template v-if="$slots[item.value]">
              <slot :name="item.value"></slot>
            </template>
            <template v-else>
              <AIcon
                :class="`${prefixCls}__tile`"
                :option="item"
                :getContainer="getTooltipContainer"
                :isTile="true"
                color="#707481"
              >
              </AIcon>
            </template>
          </div>
        </div>
      </template>
    </h3-dropdown>
    <slot name="extra"> </slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ToolsBarType } from "@h3/report-mobile/basics/enum/element-tools";
import H3Dropdown from "@h3/report-mobile/basics/components/simple-dropdown/index.vue";
import { Tooltip, Popconfirm, Popover } from "@h3/antd-vue";
import Icon from "./icon.vue";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

@Component({
  name: "h3-dashboard-toolbar",
  components: {
    ATooltip: Tooltip,
    APopconfirm: Popconfirm,
    APopover: Popover,
    AIcon: Icon,
    H3Dropdown,
    H3Svg: Svg
  }
})
export default class H3ToolBar extends Vue {
  // 工具栏配置
  @Prop({ default: () => [] }) options!: Array<H3.Toolbar.Options | string>;
  // 提供禁用的功能（隐藏）
  @Prop({ default: () => [] }) disableList!: Array<string>;
  @Prop({ default: () => "default" }) mode!: string; //default 默认有更多

  // 挂载容器
  @Prop({ default: null }) getTooltipContainer!: () => HTMLDivElement;
  @Prop({ default: null }) getDropdownContainer!: () => HTMLDivElement;
  //图表工具栏默认配置
  @Prop({ default: () => {} }) toolBarMaps!: any;


  prefixCls: string = "h3-dashboard-toolbar";

  /**
   * 实际的工具栏数据
   */
  get toolbarArray() {
    const toolbar: Array<H3.Toolbar.Options> = [];
    this.options.forEach((item: H3.Toolbar.Options | string) => {
      const isDisabled = !!this.disableList.find((disItem) => {
        if (typeof item === "string") {
          return disItem === item;
        }
      });
      if (!isDisabled) {
        if (typeof item === "string") {
          this.toolBarMaps[item] && toolbar.push(this.toolBarMaps[item]);
        } else {
          // 如果是对象的话
          const tool = item.value && this.toolBarMaps[item.value] ? this.toolBarMaps[item.value] : item;
          const newTool = Object.assign({}, tool, item);
          toolbar.push(newTool as H3.Toolbar.Options);
        }
      }
    });
    return toolbar;
  }

  get outToolbarList() {
    const filterToolbar = this.toolbarArray.filter(item => !item.isMore || this.mode === "noMore");
    // 将需要平铺显示说明文案的区分渲染
    const groupedArray: any = filterToolbar.reduce((result, item) => {
      if (!item.tileLabel) {
        result[0].push(item);
      } else {
        result[1].push(item);
      }
      return result;
    }, [[], []]);
    return groupedArray;
  }
  get moreToolbarList() {
    return this.toolbarArray.filter(item => item.isMore && this.mode !== "noMore");
  }
  /**
   * 触发点击事件
   */
  click(item: H3.Toolbar.Options, e?: Event) {
    this.$emit("click", item, e);
  }
  /**
   * 触发按钮下压事件
   */
  mousedown(item: H3.Toolbar.Options, e?: Event) {
    this.$emit("mousedown", item, e);
  }
  created() {}
}
</script>

<style lang="less">
@import "./index.less";
</style>
