<template>
  <div :class="prefixCls">
    <sketch-picker 
      v-model="innerColor" 
      :preset-colors="defaultColors"
    >
    </sketch-picker>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Sketch } from 'vue-color';

@Component({
  name: "h3-report-color-picker",
  components: {
    SketchPicker: Sketch
  }
})
export default class colorPicker extends Vue {
  @Prop({ default: "" }) color!: any;

  prefixCls: string = "h3-report-color-picker";

  //默认色板 数量不限
  defaultColors = [
  '#F1A2AB', '#F8B881', '#F5D480', '#FCE75A', 
  '#C1E77E', '#81DFE4', '#81BBF8', '#96A7FD', 
  '#BA9BF2', '#F297CC', '#E4495B', '#F38F39',
  '#EDCE02', '#8CCF17', '#2F8EF4', '#7E45E8'
];

  get innerColor() {
    return this.color;
  }
  set innerColor(val) {
    this.$emit("change", typeof val === 'object' ? val.hex : val);
  }
}
</script>
<style lang="less">
.h3-report-color-picker {
 margin-top: -3px;
 margin-bottom: -4px;
}
</style> 