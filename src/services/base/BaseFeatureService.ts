import { FeatureAction } from '../../types/feature';

type TCommand = string | null;

export class BaseFeatureService {
  private command: TCommand = null;
  private action: FeatureAction | null = null;

  constructor() {}

  setFeature(command: TCommand, action: FeatureAction) {
    this.command = command;
    this.action = action;
  }

  getCommand() {
    return this.command;
  }

  getAction() {
    return this.action;
  }
}
