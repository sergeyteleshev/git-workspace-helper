import { injectable } from '@wroud/di';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';
import vscode from 'vscode';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitFetchFeatureService extends ExtensionSubscription {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly gitRepositoryService: GitRepositoryService
  ) {
    super();
    this.fetch = this.fetch.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand('git-workspace-helper.fetch', this.fetch);
  }

  async fetch() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const repoName = getRepositoryName(repo);

      if (!repoName) {
        continue;
      }

      this.gitRepositoryService.fetch(repoName);
    }
  }
}
