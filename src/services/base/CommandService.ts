import { Service } from '@wroud/di';

export abstract class CommandService extends Service {
  abstract activate(): Promise<void>;
}
