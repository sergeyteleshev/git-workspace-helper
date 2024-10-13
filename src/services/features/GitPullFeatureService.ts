import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { BaseFeatureService } from '../base/BaseFeatureService.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitPullFeatureService extends BaseFeatureService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.pull = this.pull.bind(this);
    this.setFeature('git-workspace-helper.pull', this.pull);
  }

  async pull() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.pull(name);
    }
  }
}
