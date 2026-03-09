import {
	IBreadcrumbArray,
	IBreadcrumbs,
	IBreadcrumbLiterals,
	IBreadcrumbWithPosition,
	IBreadcrumbsWithPosition,
	IBreadcrumbLevel
} from '../models/breadcrumbs.model';
import { Component, h, Prop, EventEmitter, Event, State, Watch, ComponentInterface, Host, Listen, Element } from '@stencil/core';
import { parseProp } from '../../../../utils/helpers/common';
import { CommonSizeTypes } from '../../../../components';
import { GlobalPortalService } from '../../../../utils/helpers/portal-body.service';

/**
 * Component description: Breadcrumb component with infinite nesting
 * This component follows accessibility guidelines
 */
@Component({
	tag: 'scib-atoms-breadcrumbs',
	styleUrl: 'breadcrumbs.scss',
	shadow: true
})
export class AtomsBreadcrumb implements ComponentInterface {
	// Constants
	private readonly WIDTH_THRESHOLD = 475;
	private readonly MAX_VISIBLE_ITEMS = 3;
	private readonly ELLIPSIS_TEXT = '...';

	/**
	 * Hide arrow button
	 */
	@Prop({ mutable: true }) hideButton: boolean = false;

	/**
	 * Visual style level of the breadcrumb
	 */
	@Prop({ mutable: true }) level: IBreadcrumbLevel = IBreadcrumbLevel.DEFAULT;
	@State() $level: IBreadcrumbLevel;
	@Watch('level')
	handleLevel(newValue: IBreadcrumbLevel) {
		this.$level = newValue;
		this.checkTruncate();
	}

	/**
	 * Size of the breadcrumbs component
	 */
	@Prop({ reflect: true }) size: CommonSizeTypes = 's';
	@State() $size: CommonSizeTypes;
	@Watch('size') handleSize(newValue: CommonSizeTypes) {
		this.$size = newValue;
	}

	/**
	 * Breadcrumb content
	 */
	@Prop({ mutable: true }) breadcrumb: string | IBreadcrumbs;
	@State() breadcrumbArray: IBreadcrumbsWithPosition = [];
	@Watch('breadcrumb')
	assignToArray(newValue: string | IBreadcrumbs) {
		const _breadcrumbs: IBreadcrumbs = parseProp(newValue, []);
		this.breadcrumbArray = _breadcrumbs.map((item, index) => ({
			...item,
			position: index + 1,
			active: index === _breadcrumbs.length - 1
		}));
		this.checkTruncate();
	}

	/**
	 * Literales personalizables para el componente
	 */
	@Prop({ mutable: true }) literals: string | IBreadcrumbLiterals;
	@State() $literals: IBreadcrumbLiterals = {};
	@Watch('literals')
	handleLiterals(newValue: string | IBreadcrumbLiterals) {
		this.$literals = parseProp(newValue, {});
	}

	/**
	 * Accessibility label for the breadcrumb navigation
	 */
	@Prop() ariaLabel: string = 'Navegación de migas de pan';

	/**
	 * Accessibility label for the back button/home icon
	 */
	@Prop() backButtonAriaLabel: string = 'Volver';

	/**
	 * Current page label for screen readers
	 */
	@Prop() currentPageLabel: string = 'Página actual';

	/**
	 * State to track if breadcrumbs should be truncated
	 */
	@State() shouldTruncate: boolean = false;

	/**
	 * State to track displayed breadcrumb items (truncated or full list)
	 */
	@State() displayedBreadcrumbs: IBreadcrumbsWithPosition = [];

	/**
	 * Reference to the ellipsis element for positioning the menu
	 */
	private ellipsisRef: HTMLElement;

	/**
	 * Reference to host element for accessing the shadow DOM
	 */
	@Element() el!: HTMLElement;

	/**
	 * State to control menu visibility
	 */
	@State() isMenuOpen: boolean = false;

	/**
	 * Listen to window resize events to check if truncation is needed
	 */
	@Listen('resize', { target: 'window' })
	handleResize() {
		this.checkTruncate();
	}

	/**
	 * Listen to keyboard events for accessibility navigation
	 */
	@Listen('keydown')
	handleKeyDown(event: KeyboardEvent) {
		if (!this.displayedBreadcrumbs?.length) return;

		// Only process arrow keys
		if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

		// Get all clickable elements in the breadcrumb
		const breadcrumbLinks = Array.from(this.el.shadowRoot.querySelectorAll('.atoms-breadcrumb__link')) as HTMLElement[];

		event.preventDefault();

		const currentFocusedIndex = breadcrumbLinks.findIndex((link) => document.activeElement === link);

		let nextIndex = currentFocusedIndex;
		if (event.key === 'ArrowRight') {
			nextIndex = Math.min(currentFocusedIndex + 1, breadcrumbLinks.length - 1);
		} else {
			nextIndex = Math.max(currentFocusedIndex - 1, 0);
		}

		if (breadcrumbLinks[nextIndex]) {
			breadcrumbLinks[nextIndex].focus();
		}
	}

	/**
	 * Breadcrumb navigation events
	 */
	@Event() navigatorEvents: EventEmitter<IBreadcrumbArray>;

	/**
	 * Lifecycle when component has been loaded
	 */
	componentWillLoad() {
		this.assignToArray(this.breadcrumb);
		this.handleLevel(this.level);
		this.handleSize(this.size);
		this.handleLiterals(this.literals);
	}

	/**
	 * Checks if breadcrumbs should be truncated based on window width
	 * Using fixed width threshold and always showing only MAX_VISIBLE_ITEMS
	 * Only applies for primary level
	 */
	checkTruncate() {
		// Only apply truncation logic when level is primary
		if (this.$level !== IBreadcrumbLevel.PRIMARY) {
			this.shouldTruncate = false;
			this.displayedBreadcrumbs = this.breadcrumbArray;
			return;
		}

		// Use component width instead of window width
		const componentWidth = this.el.getBoundingClientRect().width;
		this.shouldTruncate = componentWidth < this.WIDTH_THRESHOLD && this.breadcrumbArray?.length > this.MAX_VISIBLE_ITEMS;
		this.updateDisplayedBreadcrumbs();
	}

	/**
	 * Updates the displayed breadcrumbs based on truncation state
	 */
	updateDisplayedBreadcrumbs() {
		if (this.$level !== IBreadcrumbLevel.PRIMARY) {
			this.displayedBreadcrumbs = this.breadcrumbArray;
			return;
		}

		if (this.shouldTruncate && this.breadcrumbArray?.length > this.MAX_VISIBLE_ITEMS) {
			const lastItems = this.breadcrumbArray.slice(-this.MAX_VISIBLE_ITEMS);
			const ellipsisItem: IBreadcrumbWithPosition = {
				name: this.ELLIPSIS_TEXT,
				tooltip: this.$literals.ellipsisTooltip || 'Más navegación',
				position: 1,
				active: false
			};

			this.displayedBreadcrumbs = [ellipsisItem, ...lastItems];
		} else {
			this.displayedBreadcrumbs = this.breadcrumbArray;
		}
	}

	/**
	 * Navigate back when clicking on the back arrow or home icon
	 */
	backInRoute() {
		if (!this.breadcrumbArray?.length) return;

		let newArrayBreadcrumb;

		// Si estamos en el primer nivel, mantenemos al menos este elemento
		if (this.breadcrumbArray.length <= 1) {
			newArrayBreadcrumb = [...this.breadcrumbArray];
			newArrayBreadcrumb[0].active = true;
			this.breadcrumbArray = newArrayBreadcrumb;
			this.emitNavigationEvent();
			this.checkTruncate();
			return;
		}

		// If it's a home icon or chevron, go to the first element directly
		if (this.$level === IBreadcrumbLevel.PRIMARY) {
			newArrayBreadcrumb = [{ ...this.breadcrumbArray[0], active: true }];
		} else {
			// Normal behavior: go one level back
			const activeIndex = this.breadcrumbArray.findIndex((item) => item.active);
			if (activeIndex <= 0) return; // If we're already at the first item, do nothing

			// Remove all items after the previous one and make the new last item active
			newArrayBreadcrumb = this.breadcrumbArray.slice(0, activeIndex);
			newArrayBreadcrumb[newArrayBreadcrumb.length - 1].active = true;
		}

		// Update breadcrumb array and emit event
		this.breadcrumbArray = newArrayBreadcrumb;
		this.emitNavigationEvent();
		// Garantizamos que displayedBreadcrumbs tenga al menos un elemento antes de actualizar
		if (!this.breadcrumbArray.length) {
			this.breadcrumbArray = [
				{
					name: this.$literals.defaultHomeName || 'Home',
					tooltip: this.$literals.defaultHomeTooltip || 'Go to Home',
					position: 1,
					active: true
				}
			];
			this.emitNavigationEvent();
		}
		this.checkTruncate();
	}

	/**
	 * Emits navigation event with current breadcrumb state
	 */
	private emitNavigationEvent() {
		this.navigatorEvents.emit({ breadcrumbArray: this.breadcrumbArray });
	}

	/**
	 * Sets the selected breadcrumb item as active and removes subsequent items
	 * @param item The breadcrumb item to navigate to
	 */
	goToBreadcrumb(item: IBreadcrumbWithPosition) {
		if (item.name === this.ELLIPSIS_TEXT || item.active) return;

		// Keep only items up to the clicked position and make the clicked item active
		const newArrayBreadcrumb = this.breadcrumbArray.slice(0, item.position);
		newArrayBreadcrumb[newArrayBreadcrumb.length - 1].active = true;

		// Update breadcrumb array
		this.breadcrumbArray = newArrayBreadcrumb;
		this.emitNavigationEvent();
		this.checkTruncate();
	}

	/**
	 * Determines if an item is the ellipsis item
	 * @param item Breadcrumb item to check
	 * @returns true if the item is the ellipsis item
	 */
	private isEllipsisItem(item: IBreadcrumbWithPosition): boolean {
		return item.name === this.ELLIPSIS_TEXT;
	}

	/**
	 * Handles click on the ellipsis to show hidden breadcrumbs in a menu
	 * @param event The click event
	 */
	private handleEllipsisClick(event?: MouseEvent) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (!this.shouldTruncate || !this.breadcrumbArray || this.breadcrumbArray.length <= this.MAX_VISIBLE_ITEMS) {
			return;
		}

		// Get the hidden items (all except the last MAX_VISIBLE_ITEMS)
		const hiddenItems = this.breadcrumbArray.filter((item) => !this.displayedBreadcrumbs.includes(item));

		// Convert breadcrumb items to menu items
		const menuItems = hiddenItems.map((item) => ({
			label: item.name,
			icon: '',
			disabled: false,
			data: { item } // Pass the original item as data
		}));

		this.isMenuOpen = true;
		this.createMenuPanel(menuItems);
	}

	/**
	 * Creates and positions the menu panel for hidden breadcrumbs
	 * @param menuItems Items to display in the menu
	 */
	private createMenuPanel(menuItems: any[]) {
		if (!this.ellipsisRef) return;

		// Create the menu panel component
		const menuPanel = document.createElement('scib-ui-v2-menu-panel');
		menuPanel.setAttribute('open', 'true');
		menuPanel.setAttribute('item-list', JSON.stringify(menuItems));

		// Add event listeners
		menuPanel.addEventListener('selectedOption', (event: Event) => {
			this.handleMenuSelection(event as CustomEvent);
		});

		menuPanel.addEventListener('menuPanelClosed', () => {
			this.isMenuOpen = false;
		});

		// Specific styles for the menu in the body
		const styles = `
			.breadcrumbs-menu-container {
				--mdc-theme-surface: var(--color-surface-default, #ffffff);
				--mdc-theme-on-surface: var(--color-text-default, #121212);
				min-width: 150px;
				box-shadow: 0 2px 10px rgba(0,0,0,0.1);
			}
		`;

		// Use GlobalPortalService to position the component at the body level
		GlobalPortalService.createElement({
			triggerElement: this.ellipsisRef,
			content: menuPanel,
			styles,
			position: 'below',
			offset: { x: -40, y: 2 },
			onClose: () => {
				this.isMenuOpen = false;
			},
			className: 'breadcrumbs-menu-container',
			zIndex: 10000
		});
	}

	/**
	 * Handler for menu item selection
	 * @param event The menu item selection event
	 */
	private handleMenuSelection(event: CustomEvent) {
		const selectedItem = event.detail?.data?.item;
		if (selectedItem) {
			this.goToBreadcrumb(selectedItem);
		}
		this.isMenuOpen = false;
	}

	/**
	 * Renders the appropriate icon for the breadcrumb item
	 * @returns JSX Element with the icon if applicable
	 */
	private renderIcon() {
		if (this.hideButton) return;
		const isIconGoBack = [IBreadcrumbLevel.SECONDARY, IBreadcrumbLevel.DEFAULT].includes(this.$level);
		const iconTitle = isIconGoBack ? this.$literals.homeIconTitle || 'Ir al inicio' : this.$literals.backIconTitle || 'Volver';

		return (
			<div class="atoms-breadcrumb__icon-container">
				<i
					class={`icon ${isIconGoBack ? 'breadcrumb-goback-arrow' : 'home-icon'}`}
					onClick={() => this.backInRoute()}
					title={iconTitle}
					role="button"
					aria-label={this.$literals.backButtonAriaLabel || this.backButtonAriaLabel || iconTitle}
					tabindex="0"
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							this.backInRoute();
						}
					}}
				/>
				{this.$literals.backButtonText && this.$level === IBreadcrumbLevel.SECONDARY && (
					<span
						class="atoms-breadcrumb__icon-text"
						onClick={() => this.backInRoute()}
						role="button"
						tabindex="0"
						title={this.$literals.backButtonText}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								this.backInRoute();
							}
						}}
					>
						{this.$literals.backButtonText}
					</span>
				)}
			</div>
		);
	}

	/**
	 * Renders a single breadcrumb item based on its state
	 * @param item The breadcrumb item to render
	 * @param index The item's index in the array
	 * @returns JSX Element for the breadcrumb item
	 */
	private renderBreadcrumbItem(item: IBreadcrumbWithPosition, index: number) {
		const isEllipsis = this.isEllipsisItem(item);
		const isPrimary = this.$level === IBreadcrumbLevel.PRIMARY;

		if (item.active) {
			return (
				<span
					class="atoms-breadcrumb__txt"
					aria-current="page"
					aria-label={`${item.name}, ${this.$literals.currentPageLabel || this.currentPageLabel}`}
				>
					{item.name}
				</span>
			);
		}

		return (
			<div class="atoms-breadcrumb__item">
				<a
					id={`link${index}`}
					class={{
						'atoms-breadcrumb__link': true,
						'atoms-breadcrumb__link--ellipsis': isEllipsis
					}}
					title={item.tooltip}
					onClick={(e) => (isEllipsis ? this.handleEllipsisClick(e) : this.goToBreadcrumb(item))}
					role="link"
					tabindex="0"
					aria-label={isEllipsis ? this.$literals.ellipsisLabel || 'Más navegación' : item.name}
					ref={(el) => {
						if (isEllipsis) this.ellipsisRef = el as HTMLElement;
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							isEllipsis ? this.handleEllipsisClick() : this.goToBreadcrumb(item);
						}
					}}
				>
					{isEllipsis ? <span></span> : item.name}
				</a>
				{isPrimary ? (
					<span class="breadcrumb-primary-separator" aria-hidden="true">
						/
					</span>
				) : (
					<i class="icon breadcrumb-separator" aria-hidden="true" />
				)}
			</div>
		);
	}

	private renderBreadcrumbs() {
		if (this.$level === IBreadcrumbLevel.SECONDARY) return;

		return this.displayedBreadcrumbs?.map((item, index) => (
			<li class="atoms-breadcrumb__item" role="listitem">
				{this.renderBreadcrumbItem(item, index)}
			</li>
		));
	}

	render() {
		return (
			<Host level={this.$level} size={this.$size}>
				<nav
					aria-label={this.$literals.ariaLabel || this.ariaLabel}
					class={`atoms-breadcrumb atoms-breadcrumb--${this.$level} atoms-breadcrumb--${this.$size}`}
				>
					<ol class="atoms-breadcrumb__list" role="list">
						{this.renderIcon()}
						{this.renderBreadcrumbs()}
					</ol>
				</nav>
			</Host>
		);
	}
}
