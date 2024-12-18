import { stat } from "fs";
import { ActionTree } from "vuex";
import { ReportDataSourceState } from ".";
import { dataSourceApi } from "../../service/data-source";
import { ReportAction, ReportMutation } from "./types";
const actions: ActionTree<ReportDataSourceState, ReportDataSourceState> = {
  /**
   * 获取高级数据源列表
   * @param state
   * @param dispatch
   * @param corpId
   */
  [ReportAction.GETMODELLIST]({ dispatch, state }) {
    return dataSourceApi.getModelList(state.langType);
  },
  /**
   * 获取数据源
   * @param state
   * @param dispatch
   * @param schemaCode
   */
  async [ReportAction.GETMODELINFO]({ dispatch, state }, schemaCode: string) {
    const res: any = await dataSourceApi.getModelInfo(schemaCode, state.langType);

    if (res) {
      const { main, subs } = res as any;
      if (main && main.fields && main.fields.length > 0) {
        main.fields = main.fields.filter(item => {
          return item.visible;
        });
      }
      if (subs && subs.length > 0) {
        for (let i = 0; i < subs.length; i++) {
          let sub = subs[i];
          if (sub && sub.fields && sub.fields.length > 0) {
            sub.fields = sub.fields.filter(item => {
              return item.visible;
            });
          }
        }
      }

      return {
        main,
        subs,
        relationFields: res.relationFields
      };
    } else {
      return null;
    }
  },
  /**
   * .获取不同阶段对应模型信息
   * @param state
   * @param dispatch
   * @param nodeId
   * @param source
   */
  [ReportAction.GETSTAGEMODELINFO]({ dispatch, state }, { nodeId, source }) {
    const nodeType: any = ["computes","models","groups","merges","filters","relations","output"];
    nodeType.forEach(type => {
      if (source[type] && source[type].length && source.nodes && source.nodes.length) {
        source[type].forEach((data ,index)=>{
          const node = source.nodes.find(item => item.id === data.id);
          if (!node) {
            source[type].splice(index, 1);
          }
        })
      }
    });
    const setting: H3.FallsAPI.DataSource = Object.assign(
      {},
      {
        nodeId: nodeId,
        objectId: state.dataSourceId,
        groupObjectId: state.groupId
      },
      source
    );
    return dataSourceApi.getStageModelInfo(setting, state.langType);
  },
  /**
   * .获取字段模型信息
   * @param state
   * @param dispatch
   * @param model
   */
  [ReportAction.GETFIELDMODEL]({ dispatch, state }, model) {
    return dataSourceApi.getFieldModel(model, state.langType);
  },
  /**
   * 获取高级数据源节点信息
   * @param commit
   * @param state
   */
  async [ReportAction.GETDATASOURCENODEINFO]({ commit, state }) {
    if (state.dataSourceId) {
      await dataSourceApi.getDataSourceNodeInfo(state.dataSourceId, state.langType).then(res => {
        if (res) {
          state.title = res.title;
          if (res.options) {
            state.options = res.options;
          }
          commit(ReportMutation.UPDATECANVAS, {
            originalNodes: [],
            originalEdges: [],
            nodes: res.nodes || [],
            edges: res.edges || []
          });
          const output = res.nodes && res.nodes.find((item) => item.type === "output");
          commit(ReportMutation.UPDATESTAGE, {
            models: res.models || [],
            merges: res.merges || [],
            relations: res.relations || [],
            computes: res.computes || [],
            groups: res.groups || [],
            filters: res.filters || [],
            output: res.output || (output ? { id: output.id } : null),
            notDif: true
          });
        }
      });
    } else {
      state.dataSourceId = "";
      state.title = "未命名的数据源";
    }
  },
  /**
   * 保存高级数据源配置信息
   * @param state
   * @param dispatch
   * @param nodeId
   */
  async [ReportAction.SAVEDATASOURCESETTING]({ dispatch, state }, { nodeId, groupId }) {
    const source: H3.FallsAPI.DataSource = {
      nodeId: nodeId,
      title: state.title,
      objectId: state.dataSourceId,
      groupObjectId: groupId,
      edges: state.edges,
      nodes: state.nodes,
      models: state.models,
      groups: state.groups,
      merges: state.merges,
      output: state.output,
      relations: state.relations,
      computes: state.computes,
      filters: state.filters,
      options: state.options
    };
    return dataSourceApi.saveDataSourceSetting(source, state.langType);
  },
  /**
   * 预览高级数据源数据
   * @param state
   * @param dispatch
   * @param node
   * @param source
   */
  async [ReportAction.PREVIEWSOURCEDATA]({ dispatch, state }, { node, source }) {
    let params = {
      nodeId: node.id,
      objectId: state.dataSourceId,
      groupObjectId: state.groupId
    };
    Object.assign(params, source);
    return dataSourceApi.previewSourceData(params, state.langType);
  },
  /**
   * 自定义SQL查询
   * @param state
   * @param dispatch
   * @param node
   * @param sql
   */
  async [ReportAction.PREVIEWSQL]({ dispatch, state }, sql) {
    return dataSourceApi.previewSql({sql: sql}, state.langType);
  },
  /**
   * 自定义SQL查询
   * @param state
   * @param dispatch
   * @param node
   * @param id
   */
  async [ReportAction.GETCUSTOMSQL]({ dispatch, state }, id) {
    return dataSourceApi.getCustomSql(id, state.langType);
  },
  /**
   * 自定义SQL查询
   * @param state
   * @param dispatch
   * @param node
   * @param source
   */
  async [ReportAction.SAVECUSTOMSQL]({ dispatch, state }, { sql }) {
    return dataSourceApi.saveCustomSql(sql, state.langType);
  },
  /**
   * 校验计算字段
   * @param state
   * @param dispatch
   * @param formula
   * @param fields
   */
  async [ReportAction.CHECKCOMPUTE]({ dispatch, state }, { formula, fields }) {
    const compute: H3.DataSourceAPI.Compute = {
      expression: formula,
      fieldPrefix: "@@",
      fields: fields
    };
    return dataSourceApi.checkCompute(compute, state.langType);
  },
  /**
   * 获取高级数据源权限
   * @param param0
   * @param dataSourceId 数据源Id
   */
  async [ReportAction.GETDATASOURCEACCESS]({ dispatch, state }, dataSourceId) {
    return dataSourceApi.getDatsourceAccess(dataSourceId, state.langType);
  },
  /**
   * 新增数据源权限
   * @param dataSourceId
   * @param userIds
   */
  async [ReportAction.ADDDATASOURCEACCESS]({ dispatch, state }, { dataSourceId, userIds }) {
    return dataSourceApi.addDatsourceAccess(dataSourceId, userIds, state.langType);
  },
  /**
   * 删除数据源权限
   * @param dataSourceId
   * @param userIds
   */
  async [ReportAction.REMOVEDATASOURCEACCESS]({ dispatch, state }, { dataSourceId, userIds }) {
    return dataSourceApi.removeDatsourceAccess(dataSourceId, userIds, state.langType);
  },

  /**
   * 获取高级数据源限制信息
   * @returns 
   */
   [ReportAction.GETADVANCEDLIMIT]({ dispatch, state }) {
    return new Promise((resolve, reject) => {
      // todo
      dataSourceApi.getAdvancedLimit(state.langType)
        .then(res => {
          const {cartesian, inputNum, joinNum, tier } = res;
          state.performanceLimit = {
            cartesian: cartesian, // 高级数据源笛卡尔积因子
            inputNum: inputNum, // 高级数据源线输入节点限制
            joinNum: joinNum, // 高级数据源连接节点限制
            tier: tier // 高级数据源层级限制, 后端返回不含输入节点
          };
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
};
export default actions;
