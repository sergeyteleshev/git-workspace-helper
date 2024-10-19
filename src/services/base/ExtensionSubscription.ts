import { Service } from '@wroud/di';

export abstract class ExtensionSubscription extends Service {
  abstract activate(): Promise<void>;
}
