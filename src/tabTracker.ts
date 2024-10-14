import * as vscode from "vscode";

/**
 * TabTracker class to manage timestamps for VSCode tabs
 */
class TabTracker {
    /**
     * Map to store timestamps for each tab
     * @private
     */
    private tabTimestamps: Map<string, number> = new Map();

    /**
     * Constructor for TabTracker
     * Initializes timestamps for existing tabs when the extension is activated
     */
    constructor() {
        this.initializeExistingTabs();
    }

    /**
     * Initializes timestamps for existing tabs
     * @private
     */
    private initializeExistingTabs() {
        vscode.window.tabGroups.all.forEach((group) => {
            group.tabs.forEach((tab, index: number) => {
                const tabId = this.getTabId(tab);
                // Set timestamps for existing tabs, giving a slight preference to tabs on the left
                this.tabTimestamps.set(tabId, Date.now() - index);
            });
        });
    }

    /**
     * Updates the timestamp for a given tab
     * @param {vscode.Tab} tab - The tab to update
     */
    updateTimestamp(tab: vscode.Tab) {
        const tabId = this.getTabId(tab);
        this.tabTimestamps.set(tabId, Date.now());
    }

    /**
     * Gets the timestamp for a given tab
     * @param {vscode.Tab} tab - The tab to get the timestamp for
     * @returns {number} The timestamp of the tab, or 0 if not found
     */
    getTimestamp(tab: vscode.Tab): number {
        const tabId = this.getTabId(tab);
        return this.tabTimestamps.get(tabId) || 0;
    }

    /**
     * Gets a unique identifier for a tab
     * @param {vscode.Tab} tab - The tab to get the ID for
     * @returns {string} The unique identifier for the tab
     * @private
     */
    private getTabId(tab: vscode.Tab): string {
        return tab.input instanceof vscode.TabInputText
            ? tab.input.uri.toString()
            : "";
    }
}

/**
 * Exported instance of TabTracker
 */
export const tabTracker = new TabTracker();
