import { Item, Items, MenuItemLevel, MenuItemPadding } from '../models/lateral-menu.model';

// Constants
export const DEFAULT_LITERALS = {
	showMenu: 'Show menu',
	hideMenu: 'Hide menu',
	expand: 'Expand',
	collapse: 'Collapse'
} as const;

export const LEVEL_DEFAULTS = {
	DEFAULT: 1
} as const;

// Pure utility functions
export const createItemWithChevronInfo = (item: Item, index: number, items: Items, showChevrons: boolean): Item => ({
	...item,
	hasChevron: showChevrons && hasChildren(items, index),
	isExpanded: item.isExpanded ?? false
});

export const hasChildren = (items: Items, currentIndex: number): boolean => {
	const currentLevel = items[currentIndex]?.level ?? LEVEL_DEFAULTS.DEFAULT;

	return items.slice(currentIndex + 1).some((item, index, remainingItems) => {
		const itemLevel = item.level ?? LEVEL_DEFAULTS.DEFAULT;
		// Stop at same or lower level
		if (itemLevel <= currentLevel) return false;
		// Found a child with higher level
		return itemLevel > currentLevel;
	});
};

export const getItemPadding = (level?: number): string => {
	const paddingMap = {
		[MenuItemLevel.LEVEL_2]: MenuItemPadding.LEVEL_2,
		[MenuItemLevel.LEVEL_3]: MenuItemPadding.LEVEL_3
	};

	return paddingMap[level] ?? MenuItemPadding.LEVEL_1;
};

export const findItemById = (items: Items, id: string): { item: Item; index: number } | null => {
	const index = items.findIndex((item) => item.id === id);
	return index !== -1 ? { item: items[index], index } : null;
};

export const isFlatMenu = (items: Items): boolean => {
	if (!Array.isArray(items)) return true;

	return items.every((item) => {
		const level = item.level ?? LEVEL_DEFAULTS.DEFAULT;
		return level === LEVEL_DEFAULTS.DEFAULT;
	});
};
