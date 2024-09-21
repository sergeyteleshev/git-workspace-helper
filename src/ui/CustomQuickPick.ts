import vscode from 'vscode';

export class CustomQuickPick {
  private readonly quickPick: vscode.QuickPick<vscode.QuickPickItem>;

  constructor() {
    this.quickPick = vscode.window.createQuickPick();

    this.show = this.show.bind(this);
    this.setItems = this.setItems.bind(this);
    this.selectMany = this.selectMany.bind(this);
    this.setSelectedItems = this.setSelectedItems.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  dispose() {
    this.quickPick.dispose();
  }

  async show(): Promise<string[] | null> {
    return new Promise((resolve) => {
      this.quickPick.show();

      this.quickPick.onDidAccept(() => {
        this.hide();
        resolve(this.quickPick.selectedItems.map((item) => item.label));
      });

      this.quickPick.onDidHide(() => {
        this.hide();
        resolve(null);
      });
    });
  }

  hide() {
    this.quickPick.hide();

    return this;
  }

  setItems(items: vscode.QuickPickItem[]) {
    this.quickPick.items = items;

    return this;
  }

  selectMany() {
    this.quickPick.canSelectMany = true;

    return this;
  }

  setSelectedItems(selectedLabels: string[]) {
    const selected = new Set(selectedLabels);
    this.quickPick.selectedItems = this.quickPick.items.filter((item) =>
      selected.has(item.label)
    );

    return this;
  }
}
