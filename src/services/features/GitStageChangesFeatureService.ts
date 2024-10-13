import { injectable } from '@wroud/di';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { BaseFeatureService } from '../base/BaseFeatureService.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitStageChangesFeatureService extends BaseFeatureService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
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
