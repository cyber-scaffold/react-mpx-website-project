import fs from "fs";
import path from "path";
import { promisify } from "util";

import { MaterielPairsType, PresetPairsType } from "@/frameworks/react-ssr-tool-box/compilation";
import { computedPublicPathWithRuntime } from "@/frameworks/preset-mpx-basic/utils/computedPublicPathWithRuntime";

export async function dehydrationEntryFilePreset(materielPairs: MaterielPairsType): Promise<PresetPairsType> {
  const hydrationTemplateFileContent = await promisify(fs.readFile)(path.resolve(__dirname, "../templates/dehydration.entry.template"), "utf-8");
  /** 基于alias生成新的入口文件内容 **/
  const virtualFileVolumePairs: PresetPairsType = await Promise.all(materielPairs.map(async ([alias, materielDetailInfo]) => {
    const virtualEntryModuleName: string = `./${alias}.entry.tsx`;
    const virtualEntryModuleContent: string = hydrationTemplateFileContent
      .replace("$$sourceCodeFilePath$$", materielDetailInfo.source)
      .replace("$$webpackPublicPathWithRuntime$$", computedPublicPathWithRuntime(materielDetailInfo));
    return [virtualEntryModuleName, virtualEntryModuleContent];
  }));
  return virtualFileVolumePairs;
};