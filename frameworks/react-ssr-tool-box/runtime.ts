/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { renderDehydratedResourceWithSandbox } from "@/frameworks/react-ssr-tool-box/runtime/renderDehydratedResourceWithSandbox";
export { setAndInitializeRuntimeConfig } from "@/frameworks/react-ssr-tool-box/runtime/setAndInitializeRuntimeConfig";
export { getRuntimeConfiguration } from "@/frameworks/react-ssr-tool-box/runtime/getRuntimeConfiguration";
export { getDehydratedResource } from "@/frameworks/react-ssr-tool-box/runtime/getDehydratedResource";
export { getHydrationResource } from "@/frameworks/react-ssr-tool-box/runtime/getHydrationResource";
export { getResourcePathInfo } from "@/frameworks/react-ssr-tool-box/runtime/getResourcePathInfo";
export { getResourceSummary } from "@/frameworks/react-ssr-tool-box/runtime/getResourceSummary";

export { saveProjectDirectoryAbsolutePath } from "@/frameworks/react-ssr-tool-box/runtime/globalSingletonStorage";
export { readProjectDirectoryAbsolutePath } from "@/frameworks/react-ssr-tool-box/runtime/globalSingletonStorage";

export { saveProjectEntryFileAbsolutePath } from "@/frameworks/react-ssr-tool-box/runtime/globalSingletonStorage";
export { readProjectEntryFileAbsolutePath } from "@/frameworks/react-ssr-tool-box/runtime/globalSingletonStorage";

export type { CompileAssetsDictionaryType } from "@/frameworks/react-ssr-tool-box/public/ResourceManager.d";
export type { RuntimeConfigReturnType } from "@/frameworks/react-ssr-tool-box/runtime/commons/RuntimeConfigManager";