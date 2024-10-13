import { inject, injectable } from 'tsyringe';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { BaseFeatureService } from '../base/BaseFeatureService';

@injectable()
export class GitUnstageChangesFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
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
