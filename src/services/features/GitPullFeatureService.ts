import { inject, injectable } from 'tsyringe';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { BaseFeatureService } from '../base/BaseFeatureService';

@injectable()
export class GitPullFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
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
