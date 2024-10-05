import { DIContainerService } from '../DI/DIContainer';
import { getRepositoryName } from '../helpers/getRepositoryName';
import { isNotNullDefined } from '../helpers/isNotNullDefined';
import { GitRepositoriesBranchService } from '../services/git/GitRepositoriesBranchService';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';
import { CustomQuickPick } from '../ui/CustomQuickPick';
import vscode from 'vscode';

export async function createBranch() {
  const dIContainerService = new DIContainerService();
  const gitRepositoriesBranchService = dIContainerService.getByClassName(
    GitRepositoriesBranchService
  );

  const gitRepositoriesService =
    dIContainerService.getByClassName<GitRepositoriesService>(
      GitRepositoriesService
    );

  const newBranchName = await vscode.window.showInputBox({
    title: 'Create branch',
    placeHolder: 'Enter new branch name',
  });

  if (!newBranchName) {
    return;
  }

  const quickPick = new CustomQuickPick();

  const activeReposNames = gitRepositoriesService.activeRepositories
    .map(getRepositoryName)
    .filter(isNotNullDefined);

  quickPick
    .selectMany()
    .setItems(activeReposNames.map((name) => ({ label: name })));

  const destinationRepos = await quickPick.show();

  if (!isNotNullDefined(destinationRepos)) {
    return;
  }

  gitRepositoriesBranchService.createBranches(newBranchName, destinationRepos);
}
