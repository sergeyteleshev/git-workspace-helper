import vscode from 'vscode';
import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';

export async function commit() {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesService>(
      GitRepositoriesService
    );

  const commitName = (
    await vscode.window.showInputBox({
      title: 'Commit Changes',
      placeHolder: 'Enter the commit name',
    })
  )?.trim();

  if (!commitName) {
    return;
  }

  gitRepositoriesService.commit(commitName);
}
