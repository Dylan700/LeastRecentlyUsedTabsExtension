import * as vscode from 'vscode';
import { removeLRUTabs, reorderTabs } from './functions';

export function activate(context: vscode.ExtensionContext) {

    // when a tab is changed or deselected
    let listener = vscode.window.onDidChangeActiveTextEditor(() => {
		const configuration = vscode.workspace.getConfiguration();
		if(configuration.lrutabs.reorderTabs === true){
			reorderTabs(vscode.window.tabGroups.activeTabGroup);
		}
		if(configuration.lrutabs.closeTabs === true){
		 	removeLRUTabs(vscode.window.tabGroups.activeTabGroup, configuration.lrutabs.maxTabs || 7);
		}
	});
	context.subscriptions.push(listener);
}

export function deactivate() {}
