import vscode from 'vscode';
import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesActionsService } from '../services/git/GitRepositoriesActionsService';
import { FeatureAction } from '../types/feature';

export const push: FeatureAction = async (context) => {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesActionsService>(
      GitRepositoriesActionsService
    );

  const answer = (
    await vscode.window.showQuickPick(['Yes', 'No'], {
      title: 'Push All Commits',
      placeHolder:
        'All of the commits will be pushed to the remote repository. Are you sure?',
    })
  )?.trim();

  if (answer === 'Yes') {
    gitRepositoriesService.push();
  }
};
