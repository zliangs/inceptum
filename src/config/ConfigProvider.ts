/* tslint:disable:prefer-function-over-method */
import * as config from 'config';

export interface ConfigAdapater {
  hasConfig(key: string): boolean,
  getConfig(key: string, defaultValue?: any): any,
}

export default class Config implements ConfigAdapater {
  hasConfig(key: string): boolean {
    return config.has(key);
  }

  getConfig(key: string, defaultValue?: any): any {
    if (!config.has(key) && defaultValue !== undefined) {
      return defaultValue;
    }
    return config.get(key);
  }
}
