import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/react-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";

import type { Compiler } from "webpack";

export enum CompilerProgressStatus {
  COMPILE = "compile",
  EMIT = "emit",
  DONE = "done"
};

export type CompilerProgressPluginType = {
  type: "hydrate" | "dehydrate",
  materielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager
};

export class CompilerProgressPlugin {

  private params: CompilerProgressPluginType;

  constructor (params: CompilerProgressPluginType) {
    // 接收外部传入的参数
    this.params = params;
  };

  // apply方法是Webpack插件的入口
  public apply(compiler: Compiler) {
    // 在编译开始时触发
    compiler.hooks.compile.tap("CompilerProgressPlugin", async (params) => {
      if (this.params.type === "hydrate") {
        const hydrateCompileDatabase = this.params.materielResourceDatabaseManager.getHydrateCompileDatabase();
        hydrateCompileDatabase.data["status"] = CompilerProgressStatus.COMPILE;
        await hydrateCompileDatabase.write();
      };
      if (this.params.type === "dehydrate") {
        const dehydrateCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrateCompileDatabase();
        dehydrateCompileDatabase.data["status"] = CompilerProgressStatus.COMPILE;
        await dehydrateCompileDatabase.write();
      };
      // console.log(this.params.alias, "compile");
    });

    // 在资源即将输出前触发
    compiler.hooks.emit.tapAsync("CompilerProgressPlugin", async (compilation, callback) => {
      if (this.params.type === "hydrate") {
        const hydrateCompileDatabase = this.params.materielResourceDatabaseManager.getHydrateCompileDatabase();
        hydrateCompileDatabase.data["status"] = CompilerProgressStatus.EMIT;
        await hydrateCompileDatabase.write();
      };
      if (this.params.type === "dehydrate") {
        const dehydrateCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrateCompileDatabase();
        dehydrateCompileDatabase.data["status"] = CompilerProgressStatus.EMIT;
        await dehydrateCompileDatabase.write();
      };
      callback();
      // console.log(this.params.alias, "emit");
    });

    // 在编译完成时触发
    compiler.hooks.done.tap("CompilerProgressPlugin", async (stats) => {
      if (this.params.type === "hydrate") {
        const hydrateCompileDatabase = this.params.materielResourceDatabaseManager.getHydrateCompileDatabase();
        hydrateCompileDatabase.data["status"] = CompilerProgressStatus.DONE;
        // await this.clearHistoryResource(hydrateCompileDatabase.data[this.params.alias]);
        await hydrateCompileDatabase.write();
      };
      if (this.params.type === "dehydrate") {
        const dehydrateCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrateCompileDatabase();
        dehydrateCompileDatabase.data["status"] = CompilerProgressStatus.DONE;
        // await this.clearHistoryResource(dehydrateCompileDatabase.data[this.params.alias]);
        await dehydrateCompileDatabase.write();
      };
      // console.log(this.params.alias, "done");
    });
  };

};