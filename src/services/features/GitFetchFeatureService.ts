import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';

@injectable(() => [GitRepositoriesService])
export class GitFetchFeatureService extends CommandService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.fetch = this.fetch.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand('git-workspace-helper.fetch', this.fetch);
  }

  async fetch() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      repo.fetch({
        all: true,
      });
    }
  }
}
