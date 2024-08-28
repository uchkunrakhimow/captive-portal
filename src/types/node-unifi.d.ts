declare module 'node-unifi' {
  class Controller {
    constructor(config: any);
    login(): Promise<void>;
  }
  export default { Controller };
}
