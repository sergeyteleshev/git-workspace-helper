import { container } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';
import { SERVICES_CLASS_REGISTRY } from '../services/servicesClassRegistry';

export class DIContainerService {
  static instance: DIContainerService;

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
      if (!container.isRegistered(Service)) {
        container.register<typeof Service>(Service, {
          useClass: Service as constructor<typeof Service>,
        });
      }
    }
  }

  getByClassName<T>(classObj: constructor<T>): T {
    return container.resolve<T>(classObj);
  }

  run() {
    this.registerServices();
  }

  async dispose() {
    await container.dispose();
    container.clearInstances();
  }
}
