import * as vscode from "vscode";
import { removeLRUTabs, reorderTabs } from "./functions";
import { tabTracker } from "./tabTracker";

/**
 * Activates the extension
 * @param {vscode.ExtensionContext} context - The context in which the extension runs
 */
export function activate(context: vscode.ExtensionContext) {
    // Initialize tabTracker (this will set timestamps for existing tabs)
    tabTracker;

    /**
     * Event listener for changes in the active text editor
     * @type {vscode.Disposable}
     */
    let listener: vscode.Disposable = vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            const configuration = vscode.workspace.getConfiguration();

            if (editor) {
                const activeTab =
                    vscode.window.tabGroups.activeTabGroup.activeTab;
                if (activeTab) {
                    // Update the timestamp for the newly active tab
                    tabTracker.updateTimestamp(activeTab);
                }
            }

            // Reorder tabs if the configuration option is enabled
            if (configuration.lrutabs.reorderTabs === true) {
                reorderTabs(vscode.window.tabGroups.activeTabGroup);
            }

            // Close least recently used tabs if the configuration option is enabled
            if (configuration.lrutabs.closeTabs === true) {
                removeLRUTabs(
                    vscode.window.tabGroups.activeTabGroup,
                    configuration.lrutabs.maxTabs || 7
                );
            }
        }
    );

    // Add the listener to the extension's subscriptions
    context.subscriptions.push(listener);
}

/**
 * Deactivates the extension
 * This function is empty as there's no cleanup required
 */
export function deactivate() {}
