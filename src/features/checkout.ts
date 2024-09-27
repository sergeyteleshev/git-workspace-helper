import vscode from 'vscode';
import { GitRepositoryCheckoutService } from '../services/git/GitRepositoryCheckoutService';
import { DIContainerService } from '../DI/DIContainer';
import { isSha } from '../helpers/isSha';
import { GitRepositoriesBranchService } from '../services/git/GitRepositoriesBranchService';
import { FeatureAction } from '../types/feature';

enum CheckoutType {
  BranchName = 'By branch name',
  CommitSha = 'By commit SHA',
  DefaultBranch = 'To default branch',
}

const CHECKOUT_OPTIONS: CheckoutType[] = [
  CheckoutType.BranchName,
  CheckoutType.CommitSha,
  CheckoutType.DefaultBranch,
];

async function checkoutByBranchName() {
  const dIContainerService = new DIContainerService();
  const gitRepositoryCheckoutService = dIContainerService.getByClassName(
    GitRepositoryCheckoutService
  );
  const gitRepositoriesBranchService = dIContainerService.getByClassName(
    GitRepositoriesBranchService
  );
  const branchesNames = await gitRepositoriesBranchService.getBranchesNames();

  const branchNameCandidate = await vscode.window.showQuickPick(branchesNames, {
    placeHolder: 'Enter branch name',
    title: 'Branch name',
  });

  if (!branchNameCandidate) {
    return;
  }

  gitRepositoryCheckoutService.checkoutByBranchName(branchNameCandidate);
}

async function checkoutBySha() {
  const dIContainerService = new DIContainerService();
  const gitRepositoryCheckoutService = dIContainerService.getByClassName(
    GitRepositoryCheckoutService
  );

  const shaCandidate = (
    await vscode.window.showInputBox({
      placeHolder: 'Enter commit SHA',
      title: 'Commit SHA',
    })
  )?.trim();

  if (!shaCandidate) {
    return;
  }

  if (!isSha(shaCandidate)) {
    vscode.window.showErrorMessage('Invalid commit SHA');
    return;
  }

  gitRepositoryCheckoutService.checkoutBySha(shaCandidate);
}

export async function checkoutToDefaultBranch() {
  const dIContainerService = new DIContainerService();
  const gitRepositoryCheckoutService = dIContainerService.getByClassName(
    GitRepositoryCheckoutService
  );

  gitRepositoryCheckoutService.checkoutToDefaultBranch();
}

export const checkout: FeatureAction = async (context) => {
  const result = await vscode.window.showQuickPick(CHECKOUT_OPTIONS);

  if (!result) {
    return;
  }

  if (result === CheckoutType.BranchName) {
    checkoutByBranchName();
    return;
  }

  if (result === CheckoutType.CommitSha) {
    checkoutBySha();
    return;
  }

  if (result === CheckoutType.DefaultBranch) {
    checkoutToDefaultBranch();
    return;
  }
};
