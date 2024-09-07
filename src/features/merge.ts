import vscode from 'vscode';
import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';

export async function merge() {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesService>(
      GitRepositoriesService
    );

  const branchName = await vscode.window.showInputBox({
    title: 'Merge to current branch',
    placeHolder: 'Enter branch name you want to merge to current branch',
  });

  if (!branchName) {
    return;
  }

  gitRepositoriesService.merge(branchName);
}
