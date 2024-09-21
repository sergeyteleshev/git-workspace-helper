import vscode from 'vscode';
import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesActionsService } from '../services/git/GitRepositoriesActionsService';
import { FeatureAction } from '../types/feature';

export const commit: FeatureAction = async () => {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesActionsService>(
      GitRepositoriesActionsService
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
};
