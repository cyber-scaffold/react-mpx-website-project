import { injectable } from "inversify";

import { getResourcePathInfo } from "@/frameworks/react-ssr-tool-box/runtime";
import { IOCContainer } from "@/main/server/cores/IOCContainer";


@injectable()
export class ApplicationConfigManager {

  private server = {
    port: 8190
  };

  private redis = {
    port: 6379,
    host: "0.0.0.0",
  };

  private mysql = {
    port: 3306,
    host: "0.0.0.0",
    username: "root",
    password: "gaea0571",
    database: "gmecamp_config"
  };

  private mongodb = {
    host: "0.0.0.0",
    port: 27017,
    username: "root",
    password: "gaea0571",
    database: "test_data"
  };

  private rabbitmq = {
    host: "0.0.0.0",
    port: 5672,
    username: "root",
    password: "gaea0571"
  };

  /** 初始化并加载配置到运行时 **/
  public async initialize() {

  };

  /** 获取最终组合之后的运行时配置 **/
  public async getRuntimeConfig() {
    const resourcePathInfo = await getResourcePathInfo();
    return {
      server: this.server,
      redis: this.redis,
      mysql: this.mysql,
      mongodb: this.mongodb,
      rabbitmq: this.rabbitmq,
      assetsDirectoryName: resourcePathInfo.assetsDirectoryName,
      extractResourceDirectory: resourcePathInfo.extractResourceDirectory,
      custmerStaticResourceDirectory: resourcePathInfo.custmerStaticResourceDirectory,
      projectStaticResourceDirectory: resourcePathInfo.projectStaticResourceDirectory,
      swaggerResourceDirectory: resourcePathInfo.swaggerResourceDirectory,
      publicResourceDirectory: resourcePathInfo.publicResourceDirectory
    };
  };

};

IOCContainer.bind(ApplicationConfigManager).toSelf().inSingletonScope();