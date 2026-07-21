import fs from "fs";
import path from "path";
import memfs from "memfs";
import slash from "slash";
import { ufs } from "unionfs";
import { v4 as uuid } from "uuid";
import { fromPairs } from "lodash";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/react-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/react-ssr-tool-box/compilation/commons/CompilationConfigManager";

import type { MaterielCompilationInfoType } from "@/frameworks/react-ssr-tool-box/compilation/commons/CompilationConfigManager";
import type { Compiler, EntryObject } from "webpack";
import type { IUnionFs, IFS } from "unionfs";


/**
 * 改造注水资源的入口文件,可以在这个模块中添加架构特性
 * 实现细节如下:
 * 基于虚拟文件系统和原生文件系统拼接而成的联合文件系统
 * 用于替换webpack的文件系统接口,为了兼容架构需求,满足临时文件的 生成 修改 与 注入 在编译阶段实现临时文件的无痕管理
 * 详情请参考webpack官方的API文档(官方的叫法是 自定义文件系统(Custom File Systems))
 * @docs https://webpack.docschina.org/api/node#custom-file-systems
 * **/
@injectable()
export class ConvertHydrateEntryFile {

  private virtualDirectoryPath = slash(path.resolve(process.cwd(), `./${uuid()}/__virtual__/hydrate/`));

  private custmerFileSystem: IUnionFs = ufs.use((memfs.fs as unknown as IFS)).use(fs);

  private webpackEntryPoints: EntryObject = {};

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  /**
   * 初始化阶段
   * 在虚拟文件系统中对每个原始文件进行架构包装生成新的入口文件
   * 并生成webpack可以识别的entry-points对象
   * **/
  public async initialize(materielPairs: [alias: string, detail: MaterielCompilationInfoType][]) {
    const { hydratePreset } = this.$CompilationConfigManager.getRuntimeConfig();
    const virtualFileVolumePairs = await hydratePreset(materielPairs);
    /** 在内存中写入这些新入口文件的内容 **/
    memfs.vol.fromJSON(fromPairs(virtualFileVolumePairs), this.virtualDirectoryPath);
    /** 生成详细的webpackEntryPoints **/
    this.webpackEntryPoints = fromPairs(materielPairs.map(([alias]) => {
      return [alias, [path.join(this.getVirtualDirectoryPath(), `./${alias}.entry.tsx`)]];
    }));
  };

  /** 挂载到webpack的文件系统上 **/
  public mountWithWebpackCompiler(webpackCompiler: Compiler) {
    /** 改变webpack编译对象上使用的 文件系统 接口为 联合文件系统 **/
    webpackCompiler.inputFileSystem = this.custmerFileSystem;
  };

  public getVirtualDirectoryPath(): string {
    return this.virtualDirectoryPath;
  };

  public getWebpackEntryPoints(): EntryObject {
    return this.webpackEntryPoints;
  };

};


IOCContainer.bind(ConvertHydrateEntryFile).toSelf().inRequestScope()