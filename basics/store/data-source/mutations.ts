import { MutationTree } from "vuex";
import { ReportDataSourceState } from ".";
import { ReportMutation } from "./types";
import { dataSourceApi } from "../../service/data-source";
import { changeDataSourceFilter } from '@h3/report-mobile/basics/store/utils/help';
const mutations: MutationTree<ReportDataSourceState> = {
   /**
   * 初始化报表数据 todo 暂时写一个环境，后续多种环境再变更
   * @param state
   */
   [ReportMutation.SETENV](state,env) {
    state.isWxwork = env
  },
  /**
   * 重置报表
   */
  [ReportMutation.UPDATECANVAS](state, payload) {
    state.originalNodes = payload.originalNodes;
    state.originalEdges = payload.originalEdges;
    state.nodes = payload.nodes;
    state.edges = payload.edges;
  },
  /**
   * 更新整体配置
   */
  [ReportMutation.UPDATESTAGE](state, payload) {
    state.models = payload.models;
    state.relations = payload.relations;
    state.merges = payload.merges;
    state.computes = payload.computes;
    state.groups = payload.groups;
    state.output = payload.output;
    state.filters = changeDataSourceFilter(payload.filters);
    state.isEdit = !payload.notDif;
  },
  /**
   * 更新整体配置
   */
  [ReportMutation.UPDATEOPTIONS](state, height) {
    console.log("UPDATEOPTIONS", height);
    state.options.height = height;
  },
  /**
   * 缓存预览数据
   */
  [ReportMutation.SETCACHEPREVIEWLIST](state, {key,info}) {
    console.log("SETCACHEPREVIEWLIST", key,info,state.cachePreviewList);
    if(info) {
      state.cachePreviewList[key] = info;
    } else {
      delete state.cachePreviewList[key];
    }
  },
  /**
   * 更新/删除某个配置
   */
  [ReportMutation.UPDATESETTING](state, { stage, stageType, isDelete = false }) {
   
    if (stageType === "output") {

      if(isDelete) { 
        state[stageType] = null;
      } else {
        state[stageType] = state[stageType] ? stage :  {
          id: stage.id
        }
      }
      return;
    }
    const tmpIndex = state[stageType].findIndex((item: H3.Falls.Stage | any) => {
      return item.id === stage.id;
    });
    if (tmpIndex > -1) {
      if (isDelete) {
        state[stageType].splice(tmpIndex, 1);
      } else {
        state[stageType].splice(tmpIndex, 1, stage);
      }
    } else {
      const initStage: any = {
        id: stage.id
      };
      if (stageType === "merges") {
        initStage.groups = [];
      }
      if (stageType === "relations") {
        initStage.join = "left"; // 默认左连接
        initStage.groups = [];
      }
      state[stageType].push(initStage);
    }
  },
  /**
   * 更新配置
   */
  [ReportMutation.SETDATASOURCEOPTIONS](
    state,
    { corpId, config, groupId, dataSourceId, integrateComponents }
  ) {
    if (corpId) {
      state.corpId = corpId;
    }
    if (config) {
      state.config = config;
    }
    if (groupId) {
      state.groupId = groupId;
    }
    if (dataSourceId) {
      state.dataSourceId = dataSourceId;
    }
    if (integrateComponents) {
      state.integrateComponents = integrateComponents;
    }
    dataSourceApi.setConfig({ corpId, config });
  },
  /**
   * 设置标题
   * @param state
   * @param title
   */
  [ReportMutation.SETDATASOURCETITLE](state, title: string) {
    state.title = title;
  },
  [ReportMutation.SETLANGTYPE](state, type: string) {
    state.langType = type;
  },
  /**
   * 设置标题
   * @param state
   * @param id
   */
  [ReportMutation.SETDATASOURCEID](state, id: string) {
    state.dataSourceId = id;
  },
  /**
   * 设置标题
   * @param state
   * @param status
   */
  [ReportMutation.CHANGEEDITSTATUS](state, status: boolean) {
    state.isEdit = status;
  },
  /**
   * 设置字段映射
   * @param state
   * @param res
   */
  [ReportMutation.SETFIELDSMAPPING](state, res: Array<H3.DataSourceAPI.Model>) {
    const mappings = {};
    res.forEach(item => {
      if (item.main && item.main.fields && item.main.fields.length) {
        item.main.fields.forEach(field => {
          mappings[`${field.name}#${field.schemaCode}`] = field;
        });
      }
      // if(item.subs && item.subs.fields && item.subs.fields.length) {
      //   item.main.fields.forEach(field=>{
      //     mappings[`${field.name}#${field.schemaCode}`] = field;
      //   })
      // }
    });
  },
  /**
   * 保存corpId、config
   */
  [ReportMutation.STOREAXIOSDATA](state, { corpId, config }) {
    state.corpId = corpId;
    state.config = config;
  },
  /**
   * 初始化高级数据源
   */
  [ReportMutation.INITDATESOURCE](state) {
    Object.assign(state, new ReportDataSourceState());
  }
};

export default mutations;
