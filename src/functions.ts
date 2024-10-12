// this file defines the main functions of the extension
import * as vscode from 'vscode';

const getNumberOfTabs = (group: vscode.TabGroup): number => {
    return group.tabs.length;
};

// reorder the tabs in a tab group based on the currently active tab. The most recently active tabs will be closest to the left 
// a separate copy of tabs is kept to track the order
const reorderTabs = (group: vscode.TabGroup): void => {
    const activeTab = group.tabs.find(tab => tab.isActive);
    const numberOfPinnedTabs = group.tabs.filter(tab => tab.isPinned).length;
    // this occurs if there is no tab
    if(activeTab === undefined){
        return;
    }

    // don't touch pinned tabs
    if(activeTab.isPinned){
        return;
    }
    const index = group.tabs.indexOf(activeTab);

    // check if tab is already in the correct position (this happens when it's called twice sometimes)
    var targetIndex = numberOfPinnedTabs;
    if(targetIndex == index){
        return;
    }

    // move current tab position to the start, but not before pinned tabs
    vscode.commands.executeCommand('moveActiveEditor', { to: 'left', by: 'tab', value: index-numberOfPinnedTabs });
};

// remove least recently used tabs (but only if they aren't dirty and not pinned, we don't want to touch those dirty tabs otherwise we could get a disease right?)
const removeLRUTabs = (group: vscode.TabGroup, maxTabs: number): void => {
    if(group.tabs.length <= maxTabs){
        return;
    }

    const tabsToClose: vscode.Tab[] = [];
    group.tabs.slice(0).reverse().forEach(tab => {
        if(!tab.isDirty && !tab.isPinned && !tab.isPreview && (group.tabs.length - tabsToClose.length) > maxTabs){
            tabsToClose.push(tab);
        }       
    });

    // actually close the tabs here
    tabsToClose.forEach(tab => vscode.window.tabGroups.close(tab));

};

export { reorderTabs, removeLRUTabs };
