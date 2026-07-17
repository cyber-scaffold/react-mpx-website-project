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
    const _HYDRATE_SCRIPT_TAGS_ = await this.$DehydrateInfomationService.generateHydrateScriptTags(params);
    const _HYDRATE_STYLE_TAGS_ = await this.$DehydrateInfomationService.generateHydrateStyleTags(params);
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
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: `
                  ${JSON.stringify(_INJECTABLE_DEHYDRATE_CONTENT_.meta.structured, null, "")}
              ` }}
            />
          ) : null}
          {_HYDRATE_STYLE_TAGS_}
        </head>
        <body>
          {_DEHYDRATE_HTML_CONTENT_}
          {_INJECTABLE_DEHYDRATE_CONTENT_SCRIPT_}
          {_HYDRATE_SCRIPT_TAGS_}
        </body>
      </html>
    );
    return pretty(contentString);
  };

};

IOCContainer.bind(ServerSiderRenderService).toSelf().inRequestScope();