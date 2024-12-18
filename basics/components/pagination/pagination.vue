<template>
  <div :class="[prefixCls]">
    <div :class="`report-list-pagination__totle`" v-if="showTotal">{{ showTotal(total) }}</div>

    <div :class="`${prefixCls}__page`" :style="`fontSize: ${fontSize}px`">
      <span v-if="isLeftRight" @click="changePage($event, 'left')"> 
        <h3-svg 
          name="bevel-left-stroke"
          :class="`left-o ${pageValue === 1 ? 'forbid' : ''}`"
          w="13"
          h="13" 
        ></h3-svg>
      </span>
      <span v-else @click="changePage($event, 'up')"> 
        <h3-svg 
          name="bevel-left-stroke"
          :class="`up-o ${pageValue === 1 ? 'forbid' : ''}`"
          position="right"
          w="13"
          h="13"
        ></h3-svg>
      </span>
      <input
        type="text"
        :class="`${prefixCls}__page-num`"
        v-model="pageValue"
        @change="changePage"
        :style="`fontSize: ${fontSize}px`"
      />
      /
      <span :class="`${prefixCls}__page-total`" :style="`fontSize: ${fontSize}px`">{{
        maxPagesize
      }}</span>
      <span v-if="isLeftRight" @click="changePage($event, 'right')"> 
        <h3-svg 
          name="bevel-left-stroke"
          :class="`right-o ${pageValue === maxPagesize ? 'forbid' : ''}`"
          position="rotatey"
          w="13"
          h="13" 
        ></h3-svg>
      </span>
      <span v-else @click="changePage($event, 'down')"> 
        <h3-svg 
          name="bevel-left-stroke"
          :class="`down-o ${pageValue === maxPagesize ? 'forbid' : ''}`"
          position="left"
          w="13"
          h="13"
        ></h3-svg>
      </span>
    </div>

    <div :class="`${prefixCls}__changer`" v-if="showSizeChanger">
      <div
        tabindex="1"
        :class="`${prefixCls}__changer__input`"
        @touchstart="showPageSizePane = true"
        @focus="showPageSizePane = true"
        @blur="closePageSize"
        :style="`fontSize: ${fontSize}px`"
      >
        <span class="change-input-item">{{ `${currentPageSize} ${npageSizeName}` }}</span> 
      </div>
      <div :class="`${prefixCls}__changer-item`" v-show="showPageSizePane">
        <div> 
          <div 
            :class="[`${prefixCls}__changer-item-li`,item === currentPageSize ? `${prefixCls}__changer-item--selected` : '']"
            v-for="(item, index) in pageSize"
            :key="index"
            @click="selectPageSize(item)"
          >
            {{ `${item} ${npageSizeName}` }}
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
@Component({
  name: "h3-report-list-pagination",
  components: {
    H3Svg: Svg
  }
})
export default class ReportListPagination extends Vue {
  // 共计格式化
  @Prop({ default: () => {} }) showTotal!: Function;
  // 总条数
  @Prop({ default: 0 }) total!: number;
  @Prop({ default: "条/页" }) pageSizeName!: string;
  @Prop({ default: 10 }) size!: number;
  @Prop({ default: 14 }) fontSize!: number;

  // 是否显示页数更改器
  @Prop({ default: true }) showSizeChanger!: boolean;
  @Prop({ default: true }) isLeftRight!: boolean;
  // 页数配置器
  @Prop({ default: () => [10, 20, 30, 50, 100] }) pageSize!: Array<number>;

  prefixCls: string = "report-list-pagination";

  pageValue: number = 1;

  currentPageSize: number = 0;

  showPageSizePane: boolean = false;

  //判断分页描述
  get npageSizeName() {
    if (this.pageSizeName == this.$r_language.view.pag_des.cpage_size) {
      return this.$r_language.view.pag_des.cpage_size;
    } else {
      return this.$r_language.view.pag_des.page_size;
    }
  }
  /**
   * 最大页数
   */
  get maxPagesize() {
    return Math.ceil(this.total / this.currentPageSize) || 1;
  }

  /**
   * 关闭页输选择器面板
   */
  closePageSize() {
    // 定时器原因是先选中条数 再关闭面板
    setTimeout(() => {
      this.showPageSizePane = false;
    }, 400);
  }

  /**
   * 选择页数大小
   */
  selectPageSize(item) {
    this.currentPageSize = item;
    this.pageValue = this.pageValue > this.maxPagesize ? this.maxPagesize : this.pageValue;

    const params: H3.List.pageOptions = {
      pageSize: this.currentPageSize,
      pageIndex: this.pageValue
    };
    this.$emit("change", params);
    this.closePageSize();
  }

  /**
   * 改变当前页数
   */
  changePage(e, type) {
    const target = e.target;
    let page = this.pageValue;
    if ( type=== 'left' || type=== 'up') {
      page -= 1;
    } else if ( type=== 'right' || type=== 'down') {
      page += 1;
    } else {
      page = parseInt(target.value) || 1;
    }

    page = page < 1 ? 1 : page > this.maxPagesize ? this.maxPagesize : page;
    if (page === this.pageValue) {return;}
    this.pageValue = page;

    const params: H3.List.pageOptions = {
      pageSize: this.currentPageSize,
      pageIndex: this.pageValue
    };
    this.$emit("change", params);
  }

  mounted() {
    this.currentPageSize = this.size;
  }
}
</script>

<style lang="less">
.report-list-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &__totle {
    margin-right: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__page {
    color: inherit;
    margin-right: 8px;
    white-space: nowrap;
    &-num {
      margin-left: 8px;
      margin-right: 8px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      outline: none;
      color: inherit;
      padding: 8px;
      width: 40px;
      height: 24px;
      text-align: center;
      transition: border-color 0.3s;
      &:hover {
        border-color: #1890ff;
      }
      &::-webkit-inner-spin-button {
        background-color: transparent;
      }
    }
    &-total {
      margin: 0 8px;
    }
    .report-icon {
      cursor: pointer;
      fill: #707481;
    }
    .left-o {
      // color: #C9CCD8
    }
    .forbid {
      fill: #bbbeca;
      cursor: no-drop;
    }
  }
  &__changer {
    position: relative;
    &__input {
      // width:110px;
      width: auto;
      height: 24px;
      line-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(212, 215, 224, 1);
      text-align: center;
      transition: border-color 0.3s;
      outline: none;
      &:hover {
        border-color: #1890ff;
      }
      .change-input-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-item {
      color: rgba(0, 0, 0, 0.65);
      margin: 0;
      padding: 0;
      list-style: none;
      background-color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      box-sizing: border-box;
      z-index: 1050;
      position: absolute;
      outline: none;
      font-size: 14px;
      bottom: calc(100% + 4px);
      left: -8px;
      &-li {
        position: relative;
        display: block;
        padding: 5px 12px;
        line-height: 22px;
        font-weight: normal;
        color: rgba(0, 0, 0, 0.65);
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: background 0.3s ease;
        &:first-child {
          border-radius: 4px 4px 0 0;
        }
        &:last-child {
          border-radius: 0 0 4px 4px;
        }
        &:hover {
          background-color: #e6f7ff;
        }
      }
      &--selected {
        background-color: #fafafa;
        font-weight: 600 !important;
        color: rgba(0, 0, 0, 0.65) !important;
      }
    }
  }
}
</style>
