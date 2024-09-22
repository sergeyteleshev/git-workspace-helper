import vscode from 'vscode';
import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesActionsService } from '../services/git/GitRepositoriesActionsService';
import { FeatureAction } from '../types/feature';
import { GitRepositoriesBranchService } from '../services/git/GitRepositoriesBranchService';

export const merge: FeatureAction = async (context) => {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService = diContainerService.getByClassName(
    GitRepositoriesActionsService
  );
  const gitRepositoriesBranchService = diContainerService.getByClassName(
    GitRepositoriesBranchService
  );

  const branchesNames = await gitRepositoriesBranchService.getBranchesNames();

  const branchName = await vscode.window.showQuickPick(branchesNames, {
    placeHolder: 'Select a branch to merge into the current branch',
    title: 'Merge branch',
  });

  if (!branchName) {
    return;
  }

  gitRepositoriesService.merge(branchName);
};
