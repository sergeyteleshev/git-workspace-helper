import { injectable } from '@wroud/di';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { BaseFeatureService } from '../base/BaseFeatureService.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitUnstageChangesFeatureService extends BaseFeatureService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.unstageChanges = this.unstageChanges.bind(this);

    this.setFeature('git-workspace-helper.unstageChanges', this.unstageChanges);
  }

  async unstageChanges() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.unstageChanges(name);
    }
  }
}
