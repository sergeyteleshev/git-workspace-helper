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
    title: 'Merge',
    placeHolder: 'Enter the branch name you want to merge',
  });

  if (!branchName) {
    return;
  }

  gitRepositoriesService.merge(branchName);
}
