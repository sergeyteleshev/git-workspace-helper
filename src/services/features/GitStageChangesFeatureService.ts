import { inject, injectable } from 'tsyringe';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { BaseFeatureService } from '../base/BaseFeatureService';

@injectable()
export class GitStageChangesFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.stageChanges = this.stageChanges.bind(this);

    this.setFeature('git-workspace-helper.stageChanges', this.stageChanges);
  }

  async stageChanges() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.stageChanges(name);
    }
  }
}
