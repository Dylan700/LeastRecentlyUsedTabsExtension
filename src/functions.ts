import * as vscode from "vscode";
import { tabTracker } from "./tabTracker";

/**
 * Reorders the tabs in a tab group based on the currently active tab.
 * The most recently active tabs will be closest to the left.
 *
 * @param {vscode.TabGroup} group - The tab group to reorder
 */
const reorderTabs = (group: vscode.TabGroup): void => {
    const activeTab = group.tabs.find((tab) => tab.isActive);
    const numberOfPinnedTabs = group.tabs.filter((tab) => tab.isPinned).length;

    // This occurs if there is no active tab
    if (activeTab === undefined) {
        return;
    }

    // Don't move pinned tabs
    if (activeTab.isPinned) {
        return;
    }
    const index = group.tabs.indexOf(activeTab);

    // Check if tab is already in the correct position (this happens when it's called twice sometimes)
    if (numberOfPinnedTabs === index) {
        return;
    }
    // Move current tab position to the start, not before pinned tabs
    vscode.commands.executeCommand("moveActiveEditor", {
        to: "left",
        by: "tab",
        value: index - numberOfPinnedTabs,
    });

    vscode.commands.executeCommand("workbench.action.unpinEditor");
};

/**
 * Removes least recently used tabs, but only if they aren't dirty and not pinned.
 * We don't want to touch those dirty tabs otherwise we could get a disease, right?
 *
 * @param {vscode.TabGroup} group - The tab group to remove tabs from
 * @param {number} maxTabs - The maximum number of tabs to keep open
 */
const removeLRUTabs = (group: vscode.TabGroup, maxTabs: number): void => {
    const tabsToClose: vscode.Tab[] = [];

    if (group.tabs.length <= maxTabs) {
        return;
    }

    // Sort tabs based on their last active timestamp
    const sortedTabs = group.tabs.slice().sort((a, b) => {
        return tabTracker.getTimestamp(a) - tabTracker.getTimestamp(b);
    });

    sortedTabs.forEach((tab) => {
        // Don't close the active tab, dirty tabs, pinned tabs, or preview tabs
        if (
            !tab.isActive &&
            !tab.isDirty &&
            !tab.isPinned &&
            !tab.isPreview &&
            group.tabs.length - tabsToClose.length > maxTabs
        ) {
            tabsToClose.push(tab);
        }
    });

    // Actually close the tabs here
    tabsToClose.forEach((tab) => vscode.window.tabGroups.close(tab));
};

export { reorderTabs, removeLRUTabs };
