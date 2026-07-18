#!/usr/bin/env node
import { IOCContainer } from "@/frameworks/mpx-website-build-tool/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/mpx-website-build-tool/commons/FrameworkConfigManager";

// import { MakePublicDLLFile } from "@/frameworks/actions/MakePublicDLLFile";
import { MakeMaterielResource } from "@/frameworks/mpx-website-build-tool/actions/MakeMaterielResource";
import { MakeServerApplication } from "@/frameworks/mpx-website-build-tool/actions/MakeServerApplication";
import { CompilerActionService } from "@/frameworks/mpx-website-build-tool/services/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译DLL **/
    // await IOCContainer.get(DLLBuildController).execute();
    /** 编译SSR物料 **/
    await IOCContainer.get(MakeMaterielResource).buildMaterielResourceByProductionNotWatch();
    /** 编译Express主服务应用 **/
    await IOCContainer.get(MakeServerApplication).startBuild();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
