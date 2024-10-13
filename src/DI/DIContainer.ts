import { SingleServiceType } from '@wroud/di/types';
import { SERVICES_CLASS_REGISTRY } from '../services/servicesClassRegistry.js';
import { IServiceProvider, ServiceContainerBuilder } from '@wroud/di';

type TDIContainerService = {
  run: () => void;
  getByClassName: <T>(classObj: SingleServiceType<T>) => T;
  dispose: () => Promise<void>;
  container: ServiceContainerBuilder;
  provider: IServiceProvider;
};

export class DIContainerService implements TDIContainerService {
  static instance: DIContainerService;
  readonly container: ServiceContainerBuilder = new ServiceContainerBuilder();
  readonly provider: IServiceProvider = this.container.build();

  constructor() {
    if (DIContainerService.instance) {
      return DIContainerService.instance;
    }

    DIContainerService.instance = this;

    this.run = this.run.bind(this);
    this.getByClassName = this.getByClassName.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  private registerServices() {
    for (const Service of SERVICES_CLASS_REGISTRY) {
      // TODO test this first if this works fine
      // if (this.provider.getService(Service)) {
      //   continue;
      // }

      this.container.addSingleton(Service);
    }
  }

  getByClassName<T>(classObj: SingleServiceType<T>): T {
    return this.provider.getService(classObj);
  }

  run() {
    this.registerServices();
  }

  // TODO implement dispose
  async dispose() {}
}
