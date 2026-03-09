import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Item, Items } from '../models/lateral-menu.model';
import { Types } from '../../../../shared/models';
import { first, isEmpty } from 'lodash';
import {
	DEFAULT_LITERALS,
	LEVEL_DEFAULTS,
	createItemWithChevronInfo,
	hasChildren,
	getItemPadding,
	findItemById,
	isFlatMenu
} from './lateral-menu.utils';

/**
 * Lateral Menu Component - Multi-level hierarchical navigation menu
 *
 * @slot content - Menu title content
 */
@Component({
	tag: 'scib-molecules-lateral-menu',
	styleUrl: 'lateral-menu.scss',
	shadow: true
})
export class MoleculesLateralMenu {
	@Element() private readonly host: HTMLElement;

	@Prop() icon: string;
	@Prop({ mutable: true, reflect: false }) iconSelected: string;

	@Prop({ reflect: false }) collapsible: boolean = false;
	@Prop({ reflect: false }) showChevrons: boolean = true;
	@Prop({ reflect: false }) collapseMode: 'full' | 'icons' = 'full';

	@Prop({ reflect: false }) literals: typeof DEFAULT_LITERALS = DEFAULT_LITERALS;

	@Prop({ reflect: false }) collapsed: boolean = false;
	@State() _collapsed: boolean = false;

	@Watch('collapsed')
	parseCollapsed(newCollapsed: boolean): void {
		this._collapsed = newCollapsed;

		// Remeasure header width when collapse state changes
		setTimeout(() => this.measureHeaderWidth(), 100);
	}

	@Prop({ reflect: false }) items: Items | string;
	@State() _items: Items;

	@Watch('items')
	parseItems(newItems: Items | string): void {
		this._items = _parseProp<Items>(newItems as string);
		this.updateItemsWithChevronInfo();

		if (this.selected) {
			this.parseSelected(this.selected);
		}

		// Re-set default widths when items change
		setTimeout(() => this.setDefaultWidths(), 50);
	}

	@Prop({ reflect: false }) selected: string;
	@Watch('selected')
	parseSelected(newSelected: string): void {
		if (!newSelected || !this._items) return;

		const result = findItemById(this._items, newSelected);
		if (result) {
			this.selectedItem = result.item;
			this.selectedIndex = result.index;
		}
	}

	@State() selectedItem: Item | undefined;
	@State() slotHeight: number = 0;
	@State() selectedIndex: number | undefined;
	@State() fullWidth: number = 0;
	@State() iconsOnlyWidth: number = 0;
	@State() headerWidth: number = 0;

	@Event() itemSelected: EventEmitter<Item>;

	componentWillLoad(): void {
		this.parseItems(this.items);
		this.parseSelected(this.selected);
		this.parseCollapsed(this.collapsed);
		this.iconSelected = this.iconSelected || this.icon;
		this.updateItemsWithChevronInfo();
	}

	/**
	 * Updates items to set hasChevron and isExpanded properties
	 */
	updateItemsWithChevronInfo(): void {
		if (!Array.isArray(this._items)) return;

		this._items = this._items.map((item, index) => createItemWithChevronInfo(item, index, this._items, this.showChevrons));
	}

	componentDidLoad(): void {
		this.calculateSlotHeight();
		this.setDefaultWidths();
		this.measureHeaderWidth();
	}

	disconnectedCallback(): void {
		this.host.removeEventListener('slotchange', () => {});
	}

	/**
	 * Sets default width values for different menu states
	 */
	private setDefaultWidths(): void {
		// With the new approach, we don't need to measure specific widths
		// as the content adapts automatically to the container
		this.fullWidth = 100; // Default expanded width
		this.iconsOnlyWidth = 48; // Default width for icons-only mode
	}

	/**
	 * Calculates and sets the slot height for proper styling
	 */
	private calculateSlotHeight(): void {
		const shadowRoot = this.host.shadowRoot;
		const slot = shadowRoot?.querySelector('slot');
		const slotNode = first(slot?.assignedNodes()) as HTMLElement;

		this.slotHeight = slotNode?.offsetHeight ?? 0;

		slot?.addEventListener('slotchange', () => {
			const updatedSlotNode = first(slot.assignedNodes()) as HTMLElement;
			this.slotHeight = updatedSlotNode?.offsetHeight ?? 0;
			// Also remeasure header width when slot content changes
			setTimeout(() => this.measureHeaderWidth(), 50);
		});
	}

	/**
	 * Measures the header width for collapsed state sizing
	 */
	private measureHeaderWidth(): void {
		const shadowRoot = this.host.shadowRoot;
		const header = shadowRoot?.querySelector('.menu-lateral__collapse-button') as HTMLElement;

		if (header) {
			// Get the actual width including padding and border
			const headerWidth = header.offsetWidth;
			if (headerWidth > 0) {
				this.headerWidth = headerWidth + 5;
			} else {
				// Retry after a short delay if width is 0 (might still be rendering)
				setTimeout(() => this.measureHeaderWidth(), 100);
			}
		}
	}

	/**
	 * Sets the selected item and emits the selection event
	 */
	setSelectedItem(item: Item, index: number): void {
		this.selectedItem = item;
		this.selectedIndex = index;
		this.itemSelected.emit(item);
	}

	/**
	 * Calculate the padding-left based on item level
	 * Level 1: 0px (default)
	 * Level 2: 8px
	 * Level 3: 16px
	 * @param level
	 */
	getItemPadding(level?: number): string {
		return getItemPadding(level);
	}

	/**
	 * Check if an item has children by looking at subsequent items
	 * @param items
	 * @param currentIndex
	 */
	hasChildren(items: Items, currentIndex: number): boolean {
		return hasChildren(items, currentIndex);
	}

	/**
	 * Check if an item should be visible based on its parent's expanded state
	 * @param items
	 * @param currentIndex
	 */
	isItemVisible(items: Items, currentIndex: number): boolean {
		if (!this.showChevrons) return true;

		const currentItem = items[currentIndex];
		const currentLevel = currentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

		// Level 1 items are always visible
		if (currentLevel === LEVEL_DEFAULTS.DEFAULT) return true;

		// For nested items, ALL parents in the hierarchy must be expanded
		return this.areAllParentsExpanded(items, currentIndex);
	}

	/**
	 * Check if all parents in the hierarchy are expanded
	 * @param items
	 * @param itemIndex
	 */
	private areAllParentsExpanded(items: Items, itemIndex: number): boolean {
		const currentItem = items[itemIndex];
		const currentLevel = currentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

		// Find the immediate parent
		for (let i = itemIndex - 1; i >= 0; i--) {
			const potentialParent = items[i];
			const parentLevel = potentialParent?.level ?? LEVEL_DEFAULTS.DEFAULT;

			// Found immediate parent (one level up)
			if (parentLevel === currentLevel - 1) {
				// If parent has children but is not expanded, item is not visible
				if (this.hasChildren(items, i) && !potentialParent.isExpanded) {
					return false;
				}

				// If parent is level 1, we've reached the root - item is visible
				if (parentLevel === LEVEL_DEFAULTS.DEFAULT) {
					return true;
				}

				// Recursively check if parent's parents are also expanded
				return this.areAllParentsExpanded(items, i);
			}
		}

		// No parent found, should not happen in well-formed data
		return false;
	}

	/**
	 * Check if the menu is flat (no sublevels)
	 */
	private isFlatMenu(): boolean {
		return isFlatMenu(this._items);
	}

	/**
	 * Check if the menu should show icons only when collapsed
	 */
	private shouldShowIconsOnly(): boolean {
		return this._collapsed && this.collapseMode === 'icons';
	}

	/**
	 * Check if the menu should be completely collapsed
	 */
	private shouldBeCompletelyCollapsed(): boolean {
		return this._collapsed && this.collapseMode === 'full';
	}

	/**
	 * Toggle collapsed state
	 */
	toggleCollapsed(): void {
		this._collapsed = !this._collapsed;
	}

	/**
	 * Toggle chevron state for an item
	 * @param item
	 * @param index
	 */
	toggleChevron(item: Item, index: number, event: Event): void {
		event.stopPropagation();

		if (!Array.isArray(this._items)) return;

		this._items = this._items.map((currentItem, currentIndex) =>
			currentIndex === index ? { ...currentItem, isExpanded: !currentItem.isExpanded } : currentItem
		);
	}

	/**
	 * Calculate the visible index for the slider position
	 * @returns number - The visible index of the selected item
	 */
	getSliderVisibleIndex(): number {
		if (!this.selectedItem || !Array.isArray(this._items)) {
			return -1;
		}

		let visibleIndex = 0;
		const selectedItemIndex = this.getSelectedItemIndex();

		for (let index = 0; index < this._items.length; index++) {
			const item = this._items[index];

			if (this.isItemVisible(this._items, index)) {
				// If this is the selected item itself (visible), position slider here
				if (item.id === this.selectedItem.id) {
					return visibleIndex;
				}

				// If the selected item is not visible, find the correct active parent
				if (selectedItemIndex !== -1 && !this.isItemVisible(this._items, selectedItemIndex)) {
					// Check if this item is the correct active parent (not just any active parent)
					if (this.isItemActiveInView(item, index) && this.isCorrectActiveParent(index, selectedItemIndex)) {
						return visibleIndex;
					}
				}

				visibleIndex++;
			}
		}

		return -1;
	}

	/**
	 * Check if an item contains the selected item as a descendant
	 * @param items
	 * @param parentIndex
	 */
	containsSelectedItem(items: Items, parentIndex: number): boolean {
		if (!this.selectedItem) return false;

		const parentItem = items[parentIndex];
		const parentLevel = parentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

		// Look through items after this parent
		for (let i = parentIndex + 1; i < items.length; i++) {
			const item = items[i];
			const itemLevel = item.level ?? LEVEL_DEFAULTS.DEFAULT;

			// If we reach same or lower level than parent, we've left parent's scope
			if (itemLevel <= parentLevel) return false;

			// Check if this child is the selected item
			if (item.id === this.selectedItem.id) return true;
		}

		return false;
	}

	/**
	 * Check if an item should be considered active in the current view
	 * This includes the selected item itself or a parent that contains the selected item when collapsed
	 * @param item
	 * @param index
	 */
	isItemActiveInView(item: Item, index: number): boolean {
		if (!this.selectedItem) return false;

		// If this is the selected item itself
		if (item.id === this.selectedItem.id) return true;

		// Only check for active parent if the selected item is not visible
		const selectedItemIndex = this.getSelectedItemIndex();
		if (selectedItemIndex !== -1 && !this.isItemVisible(this._items, selectedItemIndex)) {
			// This item must have children and contain the selected item
			if (this.hasChildren(this._items, index) && this.containsSelectedItem(this._items, index)) {
				// Check if this is the correct active parent
				return this.isCorrectActiveParent(index, selectedItemIndex);
			}
		}

		return false;
	}

	/**
	 * Check if this item should be the active parent based on hierarchy and visibility
	 * @param parentIndex
	 * @param selectedIndex
	 */
	private isCorrectActiveParent(parentIndex: number, selectedIndex: number): boolean {
		const parentItem = this._items[parentIndex];
		const selectedItem = this._items[selectedIndex];
		const parentLevel = parentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;
		const selectedLevel = selectedItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

		if (parentLevel >= selectedLevel) return false;

		// First, verify that this parent actually contains the selected item
		if (!this.containsSelectedItem(this._items, parentIndex)) {
			return false;
		}

		// Find the actual direct parent of the selected item
		let directParentIndex = -1;
		for (let i = selectedIndex - 1; i >= 0; i--) {
			const potentialParent = this._items[i];
			const potentialParentLevel = potentialParent?.level ?? LEVEL_DEFAULTS.DEFAULT;

			// Found the direct parent (one level up)
			if (potentialParentLevel === selectedLevel - 1) {
				directParentIndex = i;
				break;
			}
		}

		// If we found the direct parent, check if it's visible
		if (directParentIndex !== -1) {
			if (this.isItemVisible(this._items, directParentIndex)) {
				// Direct parent is visible, only it should be active
				return parentIndex === directParentIndex;
			} else {
				// Direct parent is not visible, find the closest visible ancestor
				return this.isClosestVisibleAncestor(parentIndex, directParentIndex);
			}
		}

		return false;
	}

	/**
	 * Check if this item is the closest visible ancestor to the target parent
	 * @param ancestorIndex
	 * @param targetParentIndex
	 */
	private isClosestVisibleAncestor(ancestorIndex: number, targetParentIndex: number): boolean {
		const ancestorItem = this._items[ancestorIndex];
		const targetParentItem = this._items[targetParentIndex];
		const ancestorLevel = ancestorItem?.level ?? LEVEL_DEFAULTS.DEFAULT;
		const targetParentLevel = targetParentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

		// Ancestor must be at a higher level (lower number) than target parent
		if (ancestorLevel >= targetParentLevel) return false;

		// Check if there's any visible item between ancestor and target parent
		for (let i = ancestorIndex + 1; i < targetParentIndex; i++) {
			const intermediateItem = this._items[i];
			const intermediateLevel = intermediateItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

			// If there's a visible item between ancestor and target levels that contains the target
			if (
				intermediateLevel > ancestorLevel &&
				intermediateLevel < targetParentLevel &&
				this.isItemVisible(this._items, i) &&
				this.containsItemAtIndex(this._items, i, targetParentIndex)
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Check if an item contains another item at a specific index
	 * @param items
	 * @param parentIndex
	 * @param targetIndex
	 */
	private containsItemAtIndex(items: Items, parentIndex: number, targetIndex: number): boolean {
		const parentLevel = items[parentIndex]?.level ?? LEVEL_DEFAULTS.DEFAULT;
		const targetLevel = items[targetIndex]?.level ?? LEVEL_DEFAULTS.DEFAULT;

		// Target must be at a deeper level
		if (targetLevel <= parentLevel) return false;

		// Check if target is within parent's scope
		for (let i = parentIndex + 1; i < items.length; i++) {
			const currentItem = items[i];
			const currentLevel = currentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

			// If we reach same or higher level than parent, we've left parent's scope
			if (currentLevel <= parentLevel) return false;

			// If we found the target index within parent's scope
			if (i === targetIndex) return true;
		}

		return false;
	}

	/**
	 * Check if this item is the direct parent of the selected item
	 * @param parentIndex
	 * @param selectedIndex
	 */
	private isDirectParentOfSelected(parentIndex: number, selectedIndex: number): boolean {
		const parentItem = this._items[parentIndex];
		const selectedItem = this._items[selectedIndex];
		const parentLevel = parentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;
		const selectedLevel = selectedItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

		// The parent must be exactly one level above the selected item
		if (parentLevel !== selectedLevel - 1) return false;

		// Check if there's any item between parent and selected that could be the actual parent
		for (let i = parentIndex + 1; i < selectedIndex; i++) {
			const intermediateItem = this._items[i];
			const intermediateLevel = intermediateItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

			// If we find an item at the same level as the expected parent, it means
			// this parentIndex is not the direct parent
			if (intermediateLevel === parentLevel) return false;

			// If we find an item at the expected parent level (selectedLevel - 1)
			// between our parent and the selected item, then our parent is not direct
			if (intermediateLevel === selectedLevel - 1) return false;
		}

		return true;
	}

	/**
	 * Check if this item is the closest visible parent to the selected item
	 * @param parentIndex
	 * @param selectedIndex
	 */
	isClosestVisibleParent(parentIndex: number, selectedIndex: number): boolean {
		const parentItem = this._items[parentIndex];
		const selectedItem = this._items[selectedIndex];
		const parentLevel = parentItem?.level ?? LEVEL_DEFAULTS.DEFAULT;
		const selectedLevel = selectedItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

		if (parentLevel >= selectedLevel) return false;

		// Look for any closer visible parent between this parent and the selected item
		for (let i = parentIndex + 1; i < selectedIndex; i++) {
			const intermediateItem = this._items[i];
			const intermediateLevel = intermediateItem?.level ?? LEVEL_DEFAULTS.DEFAULT;

			// If we find a visible item that:
			// 1. Is between the parent and selected levels
			// 2. Is currently visible
			// 3. Contains the selected item
			// Then the current parent is not the closest
			if (
				intermediateLevel > parentLevel &&
				intermediateLevel < selectedLevel &&
				this.isItemVisible(this._items, i) &&
				this.containsSelectedItem(this._items, i)
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get the index of the currently selected item
	 */
	getSelectedItemIndex(): number {
		if (!this.selectedItem || !Array.isArray(this._items)) {
			return -1;
		}

		return this._items.findIndex((item) => item.id === this.selectedItem.id);
	}

	/**
	 * Renders the collapse/expand button for the menu header
	 */
	private renderCollapseButton() {
		return (
			<button
				class="menu-lateral__collapse-button"
				onClick={() => this.toggleCollapsed()}
				title={this._collapsed ? this.literals.showMenu : this.literals.hideMenu}
			>
				<i
					class="icon"
					style={{
						'--icon-content': `var(--theme-scib-${this._collapsed ? 'icon-open-left-menu' : 'icon-collapse-left-menu'})`
					}}
				></i>
				<slot />
			</button>
		);
	}

	/**
	 * Renders the chevron button for expandable items
	 */
	private renderChevron(item: Item, index: number) {
		if (!this.showChevrons || !item.hasChevron) return null;

		const isActive = this.isItemActiveInView(item, index);
		const chevronColor = isActive ? 'var(--color-icon-default)' : 'var(--color-icon-soft)';

		return (
			<button
				class="menu-lateral__item__chevron"
				onClick={(event) => this.toggleChevron(item, index, event)}
				title={item.isExpanded ? this.literals.collapse : this.literals.expand}
			>
				<i
					class="icon"
					style={{
						color: chevronColor,
						'--icon-content': `var(--theme-scib-${item.isExpanded ? 'icon-chevron-up' : 'icon-chevron-down'})`
					}}
				></i>
			</button>
		);
	}

	/**
	 * Gets the appropriate icon for an item based on its state
	 */
	private getItemIcon(item: Item, index: number): string {
		// Only use the active icon if this is the directly selected item
		const isDirectlySelected = this.selectedItem && item.id === this.selectedItem.id;

		if (!isDirectlySelected) {
			return item?.icon || this.icon || 'icon-default';
		}

		return item?.icon ? item?.iconActivate || item?.icon || this.iconSelected : this.iconSelected || 'icon-default';
	}

	/**
	 * Renders the icon for a menu item
	 */
	private renderItemIcon(item: Item, index: number) {
		// Don't render icon if there's no icon at all (neither global nor item-specific)
		if (!this.icon && !item.icon) return null;

		return (
			<i
				class="icon"
				style={{
					'--icon-content': `var(--theme-scib-${this.getItemIcon(item, index)})`
				}}
			></i>
		);
	}

	/**
	 * Renders the tag for a menu item if configured
	 */
	private renderItemTag(item: Item) {
		if (!item.tag) return null;

		return <scib-atoms-tag text={item.tag.text} type={item.tag.type || 'neutral'} customColor={item.tag.customColor || ''}></scib-atoms-tag>;
	}

	/**
	 * Renders the notification dot for a menu item if configured
	 */
	private renderNotificationDot(item: Item) {
		if (!item.notification) return null;

		return <div class="menu-lateral__notification-dot"></div>;
	}

	/**
	 * Renders a single menu item
	 */
	private renderMenuItem = (item: Item, index: number) => {
		const isVisible = this.isItemVisible(this._items, index);
		if (!isVisible) return null;

		const isActive = this.isItemActiveInView(item, index);
		const isTitle = item.isTitle && (item.level === LEVEL_DEFAULTS.DEFAULT || !item.level);
		const showIconsOnly = this.shouldShowIconsOnly();

		// Check if this item is a parent with a selected child (but not directly selected)
		// This should only apply to the closest visible parent, which isItemActiveInView already handles
		const isActiveParent = isActive && this.selectedItem && item.id !== this.selectedItem.id;

		return (
			<div
				class={{
					'menu-lateral__item': true,
					'menu-lateral__item--active': isActive && !isActiveParent,
					'menu-lateral__item--active-parent': isActiveParent,
					'menu-lateral__item--title': isTitle,
					'menu-lateral__item--icons-only': showIconsOnly
				}}
				style={{
					'padding-left': showIconsOnly ? '0' : this.getItemPadding(item.level)
				}}
				onClick={() => this.setSelectedItem(item, index)}
				title={showIconsOnly ? item.text : undefined}
			>
				{/* Reserved space for chevron alignment - only when chevrons are enabled and not in icons-only mode */}
				{!showIconsOnly && this.showChevrons && <div class="menu-lateral__item__chevron-space">{this.renderChevron(item, index)}</div>}
				{this.renderItemIcon(item, index)}
				{!showIconsOnly && (
					<div class="menu-lateral__item__description">
						<span class="item__text">{item.text}</span>
						<div class="menu-lateral__item__end-elements">
							{this.renderItemTag(item)}
							{item.subtext !== undefined && <div class="subtext">{item.subtext}</div>}
							{this.renderNotificationDot(item)}
						</div>
					</div>
				)}
			</div>
		);
	};

	/**
	 * Renders all visible menu items
	 */
	private renderMenuItems() {
		if (!Array.isArray(this._items)) return null;

		return this._items.map(this.renderMenuItem);
	}

	render() {
		const showIconsOnly = this.shouldShowIconsOnly();
		const completelyCollapsed = this.shouldBeCompletelyCollapsed();

		const menuClasses = {
			'menu-lateral': true,
			'menu-lateral--slot': this.slotHeight > 0,
			'menu-lateral--collapsed': this._collapsed,
			'menu-lateral--icons-only': showIconsOnly,
			'menu-lateral--completely-collapsed': completelyCollapsed
		};

		const listClasses = {
			'menu-lateral__list': true,
			'menu-lateral__list--active': !isEmpty(this.selectedItem),
			'menu-lateral__list--collapsed': this._collapsed,
			'menu-lateral__list--icons-only': showIconsOnly
		};

		const sliderTransform = `translateY(calc(var(--lateral-menu-item-height) * ${this.getSliderVisibleIndex()}))`;

		// Calculate scroll container width based on collapse mode
		const getScrollContainerWidth = () => {
			if (completelyCollapsed) {
				return '0px'; // Completely hidden
			} else if (showIconsOnly) {
				return `${this.iconsOnlyWidth || 48}px`; // Use measured or fallback width
			} else {
				return `${this.fullWidth}%`; // Use measured or fallback width
			}
		};

		const scrollContainerWidth = getScrollContainerWidth();

		// Calculate host width based on collapse state
		const hostStyle = {
			'--lateral-menu-slot-height': `${this.slotHeight}px`,
			...(this._collapsed ? { width: `${this.headerWidth}px` } : {})
		};

		return (
			<Host
				style={{
					...(this._collapsed ? { width: `${this.headerWidth}px` } : {})
				}}
			>
				<div style={hostStyle} class={menuClasses}>
					<div class="menu-lateral__header">{this.collapsible ? this.renderCollapseButton() : <slot />}</div>
					<scib-ui-v2-scroll-container
						class={{
							'scroll-container--collapsed': this._collapsed,
							'scroll-container--icons-only': showIconsOnly
						}}
						style={{
							width: scrollContainerWidth,
							transition: 'width 0.3s ease-in-out',
							overflow: 'hidden'
						}}
					>
						<div class={listClasses}>
							<div>
								{!completelyCollapsed && <div style={{ transform: sliderTransform }} class="menu-lateral__list__slider"></div>}
								{this.renderMenuItems()}
							</div>
						</div>
					</scib-ui-v2-scroll-container>
				</div>
			</Host>
		);
	}
}
