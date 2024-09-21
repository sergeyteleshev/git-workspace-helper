import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesActionsService } from '../services/git/GitRepositoriesActionsService';
import vscode from 'vscode';
import { FeatureAction } from '../types/feature';

export const discardChanges: FeatureAction = async (context) => {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesActionsService>(
      GitRepositoriesActionsService
    );

  const shouldDelete = await vscode.window.showQuickPick(['Yes', 'No'], {
    title: 'Discard changes',
    placeHolder: 'All of the changes will be removed. Are you sure?',
  });

  if (shouldDelete === 'Yes') {
    gitRepositoriesService.discardChanges();
  }
};
