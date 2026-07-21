import React from "react";
import pretty from "pretty";
import { injectable, inject } from "inversify";
import { renderToString } from "react-dom/server";

import { IOCContainer } from "@/main/server/cores/IOCContainer";
import { DehydrateInfomationService } from "@/main/server/services/render/DehydrateInfomationService";

import type { ServerSiderRenderParamsType } from "@/main/server/services/render/DehydrateInfomationService";

@injectable()
export class ServerSiderRenderService {

  constructor (
    @inject(DehydrateInfomationService) private readonly $DehydrateInfomationService: DehydrateInfomationService
  ) { };

  public async render(params: ServerSiderRenderParamsType): Promise<string> {
    const _INJECTABLE_DEHYDRATE_CONTENT_SCRIPT_ = await this.$DehydrateInfomationService.generateInjectableDehydrateContentScript(params);
    const _INJECTABLE_DEHYDRATE_CONTENT_ = await this.$DehydrateInfomationService.generateInjectableDehydrateContent(params);
    const _DEHYDRATE_HTML_CONTENT_ = await this.$DehydrateInfomationService.generateDehydrateHTMLContent(params);
    const _HYDRATE_SCRIPT_TAGS_ = await this.$DehydrateInfomationService.generateHydrateScriptTagPath(params);
    const _HYDRATE_STYLE_TAGS_ = await this.$DehydrateInfomationService.generateHydrateStyleTagPath(params);
    const contentString = renderToString(
      <html lang="zh-CN">
        <head>
          <meta charSet="UTF-8" />
          <title>{_INJECTABLE_DEHYDRATE_CONTENT_.meta.title}</title>
          <meta name="keywords" content={_INJECTABLE_DEHYDRATE_CONTENT_.meta.keywords} />
          <meta name="description" content={_INJECTABLE_DEHYDRATE_CONTENT_.meta.description} />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
          <meta name="referrer" content="no-referrer-when-downgrade" />
          <link href="/favicon.ico" rel="icon" type="image/x-icon" />
          {/* 结构化数据展示 */}
          {_INJECTABLE_DEHYDRATE_CONTENT_.meta.structured ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(_INJECTABLE_DEHYDRATE_CONTENT_.meta.structured, null, "") }} />
          ) : null}
          {/** 注水样式 **/}
          {(_HYDRATE_STYLE_TAGS_).map((everyHydrateStyleTagPath: string) => {
            return (<link rel="stylesheet" key={everyHydrateStyleTagPath} href={everyHydrateStyleTagPath} />)
          })}
        </head>
        <body>
          {/** 脱水内容 **/}
          <div id="root" dangerouslySetInnerHTML={{ __html: _DEHYDRATE_HTML_CONTENT_ }} />
          {/** 初始化数据 **/}
          <script type="text/javascript" dangerouslySetInnerHTML={{ __html: _INJECTABLE_DEHYDRATE_CONTENT_SCRIPT_ }} />
          {/** 注水脚本 **/}
          {(_HYDRATE_SCRIPT_TAGS_).map((everyHydrateScriptTagPath: string) => {
            return (<script key={everyHydrateScriptTagPath} src={everyHydrateScriptTagPath} />)
          })}
          {/** 注水触发器 **/}
          <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `window.hydrateBootstrap();` }} />
        </body>
      </html>
    );
    return ["<!DOCTYPE html>", pretty(contentString)].join("\n");
  };

};

IOCContainer.bind(ServerSiderRenderService).toSelf().inRequestScope();