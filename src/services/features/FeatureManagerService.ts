import vscode from 'vscode';
import { injectable } from '@wroud/di';
import { VscodeContextService } from '../base/VscodeContextService.js';
import { GitCommitFeatureService } from './GitCommitFeatureService.js';
import { GitPullFeatureService } from './GitPullFeatureService.js';
import { GitDiscardChangesFeaturesService } from './GitDiscardChangesFeaturesService.js';
import { GitMergeFeatureService } from './GitMergeFeatureService.js';
import { GitPushFeatureService } from './GitPushFeatureService.js';
import { ConfigureActiveRepositoriesFeatureService } from './ConfigureActiveRepositoriesFeatureService.js';
import { GitStageChangesFeatureService } from './GitStageChangesFeatureService.js';
import { GitUnstageChangesFeatureService } from './GitUnstageChangesFeatureService.js';
import { GitCheckoutFeatureService } from './GitCheckoutFeatureService.js';
import { GitCreateBranchFeatureService } from './GitCreateBranchFeatureService.js';

@injectable(() => [
  GitCommitFeatureService,
  GitPullFeatureService,
  GitDiscardChangesFeaturesService,
  GitMergeFeatureService,
  GitPushFeatureService,
  ConfigureActiveRepositoriesFeatureService,
  GitStageChangesFeatureService,
  GitUnstageChangesFeatureService,
  GitCheckoutFeatureService,
  GitCreateBranchFeatureService,
])
export class FeatureManagerService {
  constructor(
    private readonly gitCommitFeatureService: GitCommitFeatureService,
    private readonly gitPullFeatureService: GitPullFeatureService,
    private readonly gitDiscardChangesFeaturesService: GitDiscardChangesFeaturesService,
    private readonly gitMergeFeatureService: GitMergeFeatureService,
    private readonly gitPushFeatureService: GitPushFeatureService,
    private readonly configureActiveRepositoriesFeatureService: ConfigureActiveRepositoriesFeatureService,
    private readonly gitStageChangesFeatureService: GitStageChangesFeatureService,
    private readonly gitUnstageChangesFeatureService: GitUnstageChangesFeatureService,
    private readonly gitCheckoutFeatureService: GitCheckoutFeatureService,
    private readonly gitCreateBranchFeatureService: GitCreateBranchFeatureService
  ) {
    this.register = this.register.bind(this);
  }

  register() {
    [
      this.gitCommitFeatureService,
      this.gitPullFeatureService,
      this.gitDiscardChangesFeaturesService,
      this.gitMergeFeatureService,
      this.gitPushFeatureService,
      this.configureActiveRepositoriesFeatureService,
      this.gitStageChangesFeatureService,
      this.gitUnstageChangesFeatureService,
      this.gitCheckoutFeatureService,
      this.gitCreateBranchFeatureService,
    ].forEach((service) => {
      const command = service.getCommand();
      const action = service.getAction();

      if (!command || !action) {
        return;
      }

      VscodeContextService.context.subscriptions.push(
        vscode.commands.registerCommand(command, () =>
          action(VscodeContextService.context)
        )
      );
    });
  }
}
