import path from "path";
import { get } from "dot-prop";
import { injectable } from "inversify";
import { getRuntimeConfiguration, getResourceSummary, getDehydrateResource, getHydrateResource, renderDehydrateResourceWithSandbox } from "@/frameworks/react-ssr-tool-box/runtime";

import { IOCContainer } from "@/main/server/cores/IOCContainer";
import packageJSONContent from "@/package.json";

import type { Request } from "express";

export type PlatformType = "mobile" | "desktop" | "other" | string;

export type ServerSiderRenderParamsType = {
  request: Request
  alias: string
  title?: string
  keywords?: string[]
  description?: string
  content?: any
  platform?: PlatformType
  version?: string
  structured?: any
};

export type MetaInfoType = {
  hostname?: string
  title: string
  keywords: string
  description: string
  platform: PlatformType
  version: string
  structured?: any
};

export type InjectableDehydrateContentType = {
  meta: MetaInfoType
  content: any
};

@injectable()
export class DehydrateInfomationService {

  /** 前端注水渲染脚本 **/
  private _HYDRATE_SCRIPT_TAGS_: string[] = [];

  /** 前端注水渲染样式 **/
  private _HYDRATE_STYLE_SHEET_TAGS_: string[] = [];

  /** 服务端脱水HTML视图 **/
  private _DEHYDRATE_HTML_CONTENT_: string = null;

  /** 渲染时提供的信息 **/
  private _INJECTABLE_DEHYDRATE_CONTENT_: InjectableDehydrateContentType;

  /** 生成脱水视图 **/
  public async generateDehydrateHTMLContent(params: ServerSiderRenderParamsType): Promise<string | null> {
    const dehydrateAssets = await getDehydrateResource(params.alias);
    /** 没有脱水渲染物料时的操作 **/
    if (!dehydrateAssets) {
      const _DEHYDRATE_HTML_CONTENT_ = null;
      this._DEHYDRATE_HTML_CONTENT_ = _DEHYDRATE_HTML_CONTENT_;
      return _DEHYDRATE_HTML_CONTENT_;
    };
    if (!dehydrateAssets.javascript) {
      const _DEHYDRATE_HTML_CONTENT_ = null;
      this._DEHYDRATE_HTML_CONTENT_ = _DEHYDRATE_HTML_CONTENT_;
      return _DEHYDRATE_HTML_CONTENT_;
    };
    if (!dehydrateAssets.javascript[0]) {
      const _DEHYDRATE_HTML_CONTENT_ = null;
      this._DEHYDRATE_HTML_CONTENT_ = _DEHYDRATE_HTML_CONTENT_;
      return _DEHYDRATE_HTML_CONTENT_;
    };
    /** 如果存在脱水渲染脚本的话就需要进行脱水视图的渲染 **/
    const dehydrateHTMLContent = await renderDehydrateResourceWithSandbox(dehydrateAssets.javascript[0], this._INJECTABLE_DEHYDRATE_CONTENT_);
    const _DEHYDRATE_HTML_CONTENT_ = dehydrateHTMLContent;
    this._DEHYDRATE_HTML_CONTENT_ = _DEHYDRATE_HTML_CONTENT_;
    return _DEHYDRATE_HTML_CONTENT_;
  };

  /** 生成样式表标签,要根据物料概览来判断是 优先使用注水样式表 还是 优先使用脱水样式表 **/
  public async generateHydrateStyleTagPath(params: ServerSiderRenderParamsType): Promise<string[] | []> {
    const resourceSummary = await getResourceSummary(params.alias);
    if (!resourceSummary) {
      return [];
    };
    const { assetsDirectoryPath, extractResourceDirectoryPath } = await getRuntimeConfiguration();
    if (resourceSummary.hydrate) {
      const hydrateAssets = await getHydrateResource(params.alias);
      if (!hydrateAssets) {
        return [];
      };
      const _HYDRATE_STYLE_SHEET_TAGS_ = get(hydrateAssets, "stylesheet", []).map((stylesheetResourceRelativePath: string) => (
        path.join(extractResourceDirectoryPath, stylesheetResourceRelativePath).replace(assetsDirectoryPath, "")
      ));
      this._HYDRATE_STYLE_SHEET_TAGS_ = _HYDRATE_STYLE_SHEET_TAGS_;
      return _HYDRATE_STYLE_SHEET_TAGS_;
    };
    if (resourceSummary.dehydrate) {
      const dehydratedAssets = await getDehydrateResource(params.alias);
      if (!dehydratedAssets) {
        return [];
      };
      const _HYDRATE_STYLE_SHEET_TAGS_ = get(dehydratedAssets, "stylesheet", []).map((stylesheetResourceRelativePath: string) => (
        path.join(extractResourceDirectoryPath, stylesheetResourceRelativePath).replace(assetsDirectoryPath, "")
      ));
      this._HYDRATE_STYLE_SHEET_TAGS_ = _HYDRATE_STYLE_SHEET_TAGS_;
      return _HYDRATE_STYLE_SHEET_TAGS_;
    };
  };

  /** 生成前端的注水标签 **/
  public async generateHydrateScriptTagPath(params: ServerSiderRenderParamsType): Promise<string[] | []> {
    const { assetsDirectoryPath, hydrateResourceDirectoryPath } = await getRuntimeConfiguration();
    const hydrateAssets = await getHydrateResource(params.alias);
    if (!hydrateAssets) {
      return [];
    };
    const _HYDRATE_SCRIPT_TAGS_ = get(hydrateAssets, "javascript", []).map((javascriptResourceRelativePath: string) => (
      path.join(hydrateResourceDirectoryPath, javascriptResourceRelativePath).replace(assetsDirectoryPath, "")
    ));
    this._HYDRATE_SCRIPT_TAGS_ = _HYDRATE_SCRIPT_TAGS_;
    return _HYDRATE_SCRIPT_TAGS_;
  };

  /** 整理数据 **/
  public async generateInjectableDehydrateContent(params: ServerSiderRenderParamsType): Promise<InjectableDehydrateContentType> {
    const content = params.content;
    const metaInfo: MetaInfoType = {
      hostname: params.request.hostname,
      /** title信息必须存在 **/
      title: params.title || packageJSONContent.title,
      /** description信息如果不存在的话默认使用标题作为description **/
      description: params.description || packageJSONContent.description,
      /** keyword信息需要进行合成操作 **/
      keywords: [get(params, "keywords", [])].join(","),
      /** 设备信息 **/
      platform: params.platform || "desktop",
      /** 项目版本信息 **/
      version: params.version || packageJSONContent.version,
      /** 结构化数据展示 **/
      structured: params.structured
    };
    const _INJECTABLE_DEHYDRATE_CONTENT_ = { content, meta: metaInfo };
    this._INJECTABLE_DEHYDRATE_CONTENT_ = _INJECTABLE_DEHYDRATE_CONTENT_;
    return _INJECTABLE_DEHYDRATE_CONTENT_;
  };

  public async generateInjectableDehydrateContentScript(params: ServerSiderRenderParamsType): Promise<string> {
    const _INJECTABLE_DEHYDRATE_CONTENT_ = await this.generateInjectableDehydrateContent(params);
    return `
      window._HYDRATE_MOUNT_ELEMENT_="root";
      window._INJECT_RUNTIME_FROM_SERVER_={env:{NODE_ENV:${JSON.stringify(process.env.NODE_ENV)}}};
      window._INJECTABLE_DEHYDRATE_CONTENT_=${JSON.stringify(_INJECTABLE_DEHYDRATE_CONTENT_)};
    `
  };

};


IOCContainer.bind(DehydrateInfomationService).toSelf().inRequestScope();