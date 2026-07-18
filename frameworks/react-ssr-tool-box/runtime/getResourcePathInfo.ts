import path from "path";
import { getRuntimeConfiguration } from "@/frameworks/react-ssr-tool-box/runtime";

export type ResourcePathInfoType = {
  assetsDirectoryName: string
  assetsDirectoryPath: string
  publicResourceDirectory: string
  swaggerResourceDirectory: string
  extractResourceDirectory: string
  projectStaticResourceDirectory: string
};

export async function getResourcePathInfo(): Promise<ResourcePathInfoType> {
  const assetsDirectoryName = "dist";
  const { projectDirectoryPath } = await getRuntimeConfiguration();
  const assetsDirectoryPath = path.resolve(projectDirectoryPath, assetsDirectoryName);
  /**
   * 公共资源所在的目录比如要向前端浏览器提供的dll动态链接库文件
   * 框架层的基准目录是根据 项目根目录的绝对路径 计算得到的
   * **/
  const extractResourceDirectory = path.join(assetsDirectoryPath, "extract");
  /**
   * 公共资源所在的目录比如要向前端浏览器提供的dll动态链接库文件
   * 框架层的基准目录是根据 项目根目录的绝对路径 计算得到的
   * **/
  const publicResourceDirectory = path.join(assetsDirectoryPath, "public");
  /**
   * 项目中的静态资源指向的目录
   * 框架层的基准目录是根据 项目根目录的绝对路径 计算得到的
   * **/
  const projectStaticResourceDirectory = path.join(assetsDirectoryPath, "statics");
  /**
   * Swagger静态资源所在的目录
   * **/
  const swaggerResourceDirectory = path.join(assetsDirectoryPath, "swagger");
  return {
    assetsDirectoryName,
    assetsDirectoryPath,
    publicResourceDirectory,
    swaggerResourceDirectory,
    extractResourceDirectory,
    projectStaticResourceDirectory
  };
};