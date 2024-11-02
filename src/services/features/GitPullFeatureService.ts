import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';

@injectable(() => [GitRepositoriesService])
export class GitPullFeatureService extends CommandService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.pull = this.pull.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand('git-workspace-helper.pull', this.pull);
  }

  async pull() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      repo.pull();
    }
  }
}
