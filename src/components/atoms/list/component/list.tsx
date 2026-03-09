import { Component, h, Prop, Element, State } from '@stencil/core';
import { Sortable } from 'sortablejs';
/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-list',
	styleUrl: 'list.scss'
})
export class AtomsList {
	private _itemListsObserver: any;
	private _previousTotalItems: number = 0;

	/**
	 * Sortable instance
	 */
	sortableInstance: Sortable;

	/**
	 * It's the component itself, to reference the DROP zone
	 */
	@Element() _containerDrop: HTMLElement;

	/**
	 * The ID of the DragZone, it uses to define a multiple drag tables
	 */
	@Prop({ reflect: false }) group: string;

	/**
	 * Set the List to be Dragable or not
	 */
	@Prop({ reflect: false }) drag: boolean;

	/**
	 * Number of columns to show
	 */
	@Prop({ reflect: false }) columns: number = 1;

	/**
	 * Show the bottom border on each item always, omitting the columns configuration
	 */
	@Prop({ reflect: false }) forceBorderBottom: boolean = false;

	/**
	 * Disable the bottom border on each item
	 */
	@Prop({ reflect: false }) disableBorderBottom: boolean = false;

	/**
	 * Minimum width of pixels for each item
	 */
	@Prop({ reflect: false }) minWhidth: number = 50;

	/**
	 * Total items in the list
	 */
	@State() totalItems: number = 0;

	/**
	 *
	 */
	componentDidLoad() {
		const container = this._containerDrop.querySelector('.scib-atoms-list-container');
		this._itemListsObserver = new MutationObserver((mutations) => {
			mutations.forEach(({ type }) => {
				if (type === 'childList') {
					this.refreshList();
				}
			});
		});
		this._itemListsObserver.observe(container, {
			childList: true
		});
	}

	/**
	 *
	 */
	componentDidRender() {
		this.refreshList();
	}

	/**
	 *
	 */
	disconnectedCallback() {
		if (this._itemListsObserver) {
			this._itemListsObserver?.disconnect();
		}
	}

	/**
	 * Refresh the list
	 */
	refreshList() {
		const elementsContainer = this._containerDrop.querySelector('.scib-atoms-list-container');
		this.totalItems = (elementsContainer?.children?.length || 1) - 1;
		(Array.from(elementsContainer?.children) || []).forEach((element) => {
			if (!element?.classList.contains('scib-atoms-list-container__drag-and-drop-zone')) {
				element?.classList.add('scib-atoms-list-container__drag-and-drop-zone');
			}
		});
		if (this.drag && this.totalItems !== this._previousTotalItems) {
			this._previousTotalItems = this.totalItems;
			this.sortableInstance = Sortable.create(elementsContainer, {
				animation: 300,
				group: this.group,
				disabled: false,
				easing: 'cubic-bezier(.47,.64,.86,1.05)'
			});
		} else if (!this.drag && this.sortableInstance) {
			this.sortableInstance?.destroy();
			this._previousTotalItems = 0;
		}
	}

	/**
	 *
	 * @returns
	 */
	render() {
		return (
			<div
				class={{
					'scib-atoms-list-container': true,
					'scib-atoms-list-container__draggable': this.drag,
					[`scib-atoms-list-container__columns-${this.columns > 0 ? this.columns : 1}`]: !this.forceBorderBottom,
					'scib-atoms-list-container__disable-border':
						this.disableBorderBottom || (!this.forceBorderBottom && (this.columns || 1) > this.totalItems)
				}}
				style={{
					'grid-template-columns': `repeat(${this.columns}, minmax(${this.minWhidth}px, calc((100% - ${32 * (this.columns - 1)}px) / ${
						this.columns
					})))`
				}}
			>
				<slot />
			</div>
		);
	}
}
