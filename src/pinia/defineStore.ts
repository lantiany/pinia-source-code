import { computed, getCurrentInstance, inject, reactive } from "vue";
import { piniaSymbol } from "./piniaSymbol";

export function defineStore(idOrOptions: any, optionsOrSetup: any){
  let id: string;
  let options: any;

  // 参数归一化，支持 defineStore 的三种参数传递方式
  /**
   * 1. id + options
   * 2. id + setup
   * 3. options
   */
  if (typeof idOrOptions === 'string'){
    id = idOrOptions;
    options = optionsOrSetup;
  } else {
    options = optionsOrSetup;
    id = options.id;
  }

  // 定义 defineStore 返回的函数 useStore
  function useStore(){
    // 获取当前组件实例
    const instance = getCurrentInstance();
    // 如果在组件实例中，通过 inject 方法，将 store 拿出来
    const piniaStore: any = instance && inject(piniaSymbol);

    if(!piniaStore._stores.has(id)){
      // id 不存在，写入 state、getters、actions
      if (typeof optionsOrSetup === 'function'){
        createSetupStore(id, optionsOrSetup, piniaStore);
      } else {
        createOptionsStore(id, options, piniaStore);
      }
    }

    return piniaStore._stores.get(id);
  }

  // 将 useStore 返回
  return useStore;
}

/**
 * defineStore 传入配置对象的情况
 * @param id storeId
 * @param options 配置
 * @param piniaStore 整个 piniaStore
 */
function createOptionsStore(id: string, options: any, piniaStore: any) {
  const { state, getters, actions } = options;
  // piniaStore._stores.set(id, setup());
  createSetupStore(id, setup, piniaStore);

  function setup(){
    piniaStore.state[id] = state ? state() : {};
    const localState =  piniaStore.state[id];

    return Object.assign(localState, actions, Object.keys(getters).reduce((computedGetters: any, name) => {
      computedGetters[name] = computed(() => {
        const store = piniaStore._stores.get(id);
        return getters[name].call(store, store);
      })
      return computedGetters;
    }, {}));
  }
}

/**
 * defineStore 传入setup函数的情况
 * @param id storeId
 * @param setup setup函数
 * @param piniaStore 整个 piniaStore
 */
function createSetupStore(id: string, setup: Function, piniaStore: any){
  const store = reactive({});
  const setupStore = setup();

  // 遍历 setup 返回的对象，处理内部的函数
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (typeof setupStore[key] === 'function') {
      const actionValue = wrapAction(key, prop);
      setupStore[key] = actionValue;
    }
  }

  Object.assign(store, setupStore);

  piniaStore._stores.set(id, store);

  /**
   * 改变 action 中的 this, 让它指向 store
   * @param name 
   * @param action 
   * @returns 
   */
  function wrapAction(name: string, action: Function){
    return function(){
      const args = Array.from(arguments);
      let ret: unknown;
      try{
        ret = action.apply(store, args);
      } catch(error) {
        throw error
      }

      if (ret instanceof Promise){
        return ret.then(value => value).catch((error) => {
          Promise.reject(error);
        })
      }

      return ret;
    }
  }
}