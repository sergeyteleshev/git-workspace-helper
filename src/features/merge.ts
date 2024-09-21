import vscode from 'vscode';
import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesActionsService } from '../services/git/GitRepositoriesActionsService';
import { FeatureAction } from '../types/feature';

export const merge: FeatureAction = async (context) => {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesActionsService>(
      GitRepositoriesActionsService
    );

  const branchName = await vscode.window.showInputBox({
    title: 'Merge to current branch',
    placeHolder: 'Enter branch name you want to merge to current branch',
  });

  if (!branchName) {
    return;
  }

  gitRepositoriesService.merge(branchName);
};
