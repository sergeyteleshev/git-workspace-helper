import vscode from 'vscode';
import { inject, injectable } from 'tsyringe';
import { VscodeContextService } from '../base/VscodeContextService';
import { GitCommitFeatureService } from './GitCommitFeatureService';
import { GitPullFeatureService } from './GitPullFeatureService';
import { GitDiscardChangesFeaturesService } from './GitDiscardChangesFeaturesService';
import { GitMergeFeatureService } from './GitMergeFeatureService';
import { GitPushFeatureService } from './GitPushFeatureService';
import { ConfigureActiveRepositoriesFeatureService } from './ConfigureActiveRepositoriesFeatureService';
import { GitStageChangesFeatureService } from './GitStageChangesFeatureService';
import { GitUnstageChangesFeatureService } from './GitUnstageChangesFeatureService';
import { GitCheckoutFeatureService } from './GitCheckoutFeatureService';
import { GitCreateBranchFeatureService } from './GitCreateBranchFeatureService';

@injectable()
export class FeatureManagerService {
  constructor(
    @inject(GitCommitFeatureService)
    private readonly gitCommitFeatureService: GitCommitFeatureService,
    @inject(GitPullFeatureService)
    private readonly gitPullFeatureService: GitPullFeatureService,
    @inject(GitDiscardChangesFeaturesService)
    private readonly gitDiscardChangesFeaturesService: GitDiscardChangesFeaturesService,
    @inject(GitMergeFeatureService)
    private readonly gitMergeFeatureService: GitMergeFeatureService,
    @inject(GitPushFeatureService)
    private readonly gitPushFeatureService: GitPushFeatureService,
    @inject(ConfigureActiveRepositoriesFeatureService)
    private readonly configureActiveRepositoriesFeatureService: ConfigureActiveRepositoriesFeatureService,
    @inject(GitStageChangesFeatureService)
    private readonly gitStageChangesFeatureService: GitStageChangesFeatureService,
    @inject(GitUnstageChangesFeatureService)
    private readonly gitUnstageChangesFeatureService: GitUnstageChangesFeatureService,
    @inject(GitCheckoutFeatureService)
    private readonly gitCheckoutFeatureService: GitCheckoutFeatureService,
    @inject(GitCreateBranchFeatureService)
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
