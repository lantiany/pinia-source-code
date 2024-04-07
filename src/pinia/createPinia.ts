import { piniaSymbol } from "./piniaSymbol";
import { App } from "./types";

export function createPinia(){
  const piniaStore = {
    state: {},
    // 存放所有 store
    _stores: new Map(),
    // 提供给 vue 注册
    install(app: App){
      app.provide(piniaSymbol, piniaStore);
      app.config.globalProperties.$pinia = piniaStore;

      console.log('pinia 安装完成');
    }
  };

  return piniaStore;
}