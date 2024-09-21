import vscode from 'vscode';

export type FeatureAction = (
  context: vscode.ExtensionContext
) => void | Promise<void>;
