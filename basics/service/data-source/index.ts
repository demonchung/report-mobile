import API from "../apis/api";
import dataSourceTips from "./error-tips";
import { DataSourceApis } from "./api-type";
import Language from "@h3/report-mobile/basics/components/language";

class DataSourceApi extends API {
  constructor() {
    super({
      errorTips: dataSourceTips
    });
  }
  /**
   * 获取数据源列表
   */
  [DataSourceApis.GETDATASOURCENODES](
    lang: string
  ): Promise<H3.DataSourceAPI.DataSourceNode[] | boolean> {
    const url = "data-source/v1/advanced/v2/getDataSourceNodes";
    const request = this.fetch<H3.DataSourceAPI.DataSourceNode[]>({
      url,
      method: "post",
      data: {},
      lang
    });
    return request.promise;
  }
  /**
   * 移动分组节点
   * @param groupObjectIds
   * @param nodeObjectIds
   * @param parentObjectId
   */
  [DataSourceApis.MOVEDATASOURCENODE](
    { groupObjectIds, nodeObjectIds, parentObjectId },
    lang: string
  ): Promise<boolean> {
    const url = "data-source/v1/advanced/v2/moveDataSourceNode";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        groupObjectIds,
        nodeObjectIds,
        parentObjectId
      },
      lang
    });
    return request.promise;
  }
  /**
   * 排序
   * @param sortModels
   */
  [DataSourceApis.UPDATEDATASOURCENODESORT](sortModels, lang: string): Promise<boolean> {
    const url = "data-source/v1/advanced/v2/updateDataSourceNodeSort";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        sortModels
      },
      lang
    });
    return request.promise;
  }
  /**
   * 删除分组节点
   * @param groupObjectIds
   * @param nodeObjectIds
   */
  [DataSourceApis.REMOVEDATASOURCENODE](
    { groupObjectIds, nodeObjectIds },
    lang: string
  ): Promise<boolean> {
    const url = "data-source/v1/advanced/v2/removeDataSourceNode";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        groupObjectIds,
        nodeObjectIds
      },
      lang
    });
    return request.promise;
  }
  /**
   * 更新高级数据源节点名称
   * @param name
   * @param objectId
   * @param type
   */
  [DataSourceApis.UPDATEDATASOURCENAME]({ name, objectId, type }, lang: string): Promise<boolean> {
    const url = "data-source/v1/advanced/v2/updateDataSourceNode";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        name,
        objectId,
        type
      },
      lang
    });
    return request.promise;
  }
  /**
   * 添加高级数据源组节点
   * @param dataSourceGroup
   */
  [DataSourceApis.ADDDATASOURCEGROUP](
    dataSourceGroup: H3.DataSource.DataSourceGroup,
    lang: string
  ): Promise<boolean> {
    dataSourceGroup.corpId = this.config.corpId as string;
    const url = "data-source/v1/advanced/v2/addDataSourceGroup";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        dataSourceGroup
      },
      lang
    });
    return request.promise;
  }
  /**
   * 预览高级数据源数据
   * @param objectId
   */
  [DataSourceApis.PREVIEWADVANCEDDATA](
    objectId: string,
    lang: string
  ): Promise<H3.DataSourceAPI.Preview | boolean> {
    const url = "data-source/v1/advanced/previewAdvancedData";
    const request = this.fetch<H3.DataSourceAPI.Preview>({
      url,
      method: "post",
      data: {
        objectId
      },
      lang
    });
    return request.promise;
  }

  /**
   * 复制高级数据源数据
   * @param objectId
   */
  [DataSourceApis.COPYADVANCED](
    objectId: string,
    lang: string
  ): Promise<H3.DataSourceAPI.Preview | boolean> {
    const url = "data-source/v1/advanced/copydatasource";
    const request = this.fetch<H3.DataSourceAPI.Preview>({
      url,
      method: "post",
      data: {
        objectId
      },
      lang
    });
    return request.promise;
  }
  /**
   * 复制高级数据源数据
   * @param objectId
   */
  [DataSourceApis.COPYDCUSTOMSQL](
    objectId: string,
    lang: string
  ): Promise<H3.DataSourceAPI.Preview | boolean> {
    const url = "data-source/v1/customsql/copydatasource";
    const request = this.fetch<H3.DataSourceAPI.Preview>({
      url,
      method: "post",
      data: {
        objectId
      },
      lang
    });
    return request.promise;
  }
  /**
   * 预览高级数据源数据
   * @param setting
   */
  [DataSourceApis.PREVIEWSOURCEDATA](
    setting: any,
    lang: string
  ): Promise<H3.DataSourceAPI.Preview | boolean> {
    const url = "data-source/v1/advanced/previewSourceData";
    const request = this.fetch<H3.DataSourceAPI.Preview>({
      url,
      method: "post",
      data: {
        setting
      },
      lang
    });
    return request.promise;
  }
  /**
   * 高级数据源获取模型列表
   */
  [DataSourceApis.GETMODELLIST](
    lang: string
  ): Promise<H3.DataSourceAPI.DataSourceNode[] | boolean> {
    const url = "data-source/v1/advanced/getModelList";
    const request = this.fetch<H3.DataSourceAPI.DataSourceNode[] | boolean>({
      url,
      method: "post",
      data: {},
      lang
    });
    return request.promise;
  }
  /**
   * 高级数据源获取模型以及子模型的属性信息
   */
  [DataSourceApis.GETMODELINFO](
    schemaCode,
    lang: string
  ): Promise<H3.DataSourceAPI.Model | boolean> {
    const url = "data-source/v1/advanced/getModelInfo";
    const request = this.fetch<H3.DataSourceAPI.Model>({
      url,
      method: "post",
      data: {
        schemaCode
      },
      lang
    });
    return request.promise;
  }
  /**
   * 获取高级数据源节点信息
   */
  [DataSourceApis.GETDATASOURCENODEINFO](objectId: string, lang: string): Promise<any | boolean> {
    const url = "data-source/v1/advanced/getDataSourceNodeInfo";
    const request = this.fetch<any | boolean>({
      url,
      method: "post",
      data: {
        objectId
      },
      lang
    });
    return request.promise;
  }
  /**
   * 查询自定义sql
   */
  [DataSourceApis.PREVIEWSQL](params: any, lang: string, ): Promise<any | boolean> {
    const url = "data-source/v1/customsql/previewSql";
    const request = this.fetch<any | boolean>({
      url,
      method: "post",
      data: {
        ...params
      },
      lang
    });
    return request.promise;
  }
  /**
   * 获取自定义sql
   */
  [DataSourceApis.GETCUSTOMSQL](objectId: string, lang: string): Promise<any | boolean> {
    const url = "data-source/v1/customsql/custom_sql_model";
    const request = this.fetch<any | boolean>({
      url,
      method: "post",
      data: {
        objectId
      },
      lang
    });
    return request.promise;
  }
  /**
   * 保存自定义sql
   */
  [DataSourceApis.SAVECUSTOMSQL](params: any, lang: string): Promise<any | boolean> {
    const url = "data-source/v1/customsql/saveCustomSql";
    const request = this.fetch<any | boolean>({
      url,
      method: "post",
      data: {
        ...params
      },
      lang
    });
    return request.promise;
  }

  /**
   * 高级数据源获取模型以及子模型的属性信息
   */
  [DataSourceApis.SAVEDATASOURCESETTING](
    setting: H3.FallsAPI.DataSource,
    lang: string
  ): Promise<boolean> {
    const url = "data-source/v1/advanced/v2/saveDataSourceSetting";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        setting
      },
      lang
    });
    return request.promise;
  }
  /**
   * 高级数据源获取不同阶段的节点对应的模型属性
   */
  [DataSourceApis.GETSTAGEMODELINFO](
    setting: H3.FallsAPI.DataSource,
    lang: string
  ): Promise<H3.DataSourceAPI.Model | boolean> {
    const url = "data-source/v1/advanced/getStageModelInfo";
    const request = this.fetch<H3.DataSourceAPI.Model | boolean>({
      url,
      method: "post",
      data: {
        setting
      },
      lang
    });
    return request.promise;
  }
  /**
   * 高级数据源获取字段模型
   */
  [DataSourceApis.GETFIELDMODEL](
    models: Array<H3.Falls.Model>,
    lang: string
  ): Promise<H3.DataSourceAPI.Model | boolean> {
    const url = "data-source/v1/advanced/v2/getStageModelInfo";
    const request = this.fetch<H3.DataSourceAPI.Model | boolean>({
      url,
      method: "post",
      data: {
        models
      },
      lang
    });
    return request.promise;
  }
  /**
   * 校验公式
   */
  [DataSourceApis.CHECKCOMPUTE](compute: H3.DataSourceAPI.Compute, lang: string): Promise<boolean> {
    const url = "data-source/v1/formula/validateAndAnalyse";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        expression: compute.expression,
        fieldPrefix: compute.fieldPrefix,
        fields: compute.fields
      },
      lang
    });
    return request.promise;
  }

  /**
   * 获取高级数据源权限列表/v1/accesscontrol/getDataSourceAccesses
   */
  [DataSourceApis.GETDATASOURCEACCESS](dataSourceId: String, lang: string): Promise<boolean> {
    const url = "data-source/v1/accesscontrol/getDataSourceAccesses";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        dataSourceId
      },
      lang
    });
    return request.promise;
  }

  /**
   * 新增高级数据源权限列表/v1/accesscontrol/getDataSourceAccesses
   */
  [DataSourceApis.ADDDATASOURCEACCESS](
    dataSourceId: String,
    userIds: String[],
    lang: string
  ): Promise<boolean> {
    const url = "data-source/v1/accesscontrol/addDataSourceAccesses";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        dataSourceId,
        userIds
      },
      lang
    });
    return request.promise;
  }
  /**
   * 删除高级数据源权限列表
   */
  [DataSourceApis.REMOVEDATASOURCEACCESS](
    dataSourceId: String,
    userIds: String[],
    lang: string
  ): Promise<boolean> {
    const url = "data-source/v1/accesscontrol/removeDataSourceAccesses";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        dataSourceId,
        userIds
      },
      lang
    });
    return request.promise;
  }

  /**
   * 导出数据
   */
  [DataSourceApis.EXPORTEXCEL](
    corpId: String | undefined,
    objectId: String,
    lang: string
  ): Promise<boolean> {
    const url = "data-source/v1/export/dataExport";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        corpId,
        objectId
      },
      responseType: "blob",
      lang
    });
    return request.promise;
  }

  /**
   * 获取高级数据源配置限制信息
   */
   [DataSourceApis.GETADVANCEDLIMIT](lang: string): Promise<any | boolean> {
    const url = "data-source/config/v1/advanced/limit";
    const request = this.fetch<any | boolean>({
      url,
      method: "post",
      data: {},
      lang
    });
    return request.promise;
  }

}

const dataSourceApi = new DataSourceApi();

export { dataSourceApi };
export default {
  dataSourceApi
};
