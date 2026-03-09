import { Component, Host, h, Element, Prop, Watch, State, EventEmitter, Event, Method } from '@stencil/core';
import { MenuPanelItem, MenuPanelItems } from '../models/ui-v2-menu-panel.model';
import { DefaultFocusState, MDCMenu } from '@material/menu';
import { parseProp } from '../../../../utils/helpers/common';
import { get, isEmpty } from 'lodash';

@Component({
	tag: 'scib-ui-v2-menu-panel',
	styleUrl: 'ui-v2-menu-panel.scss',
	shadow: true
})
export class UI_V2MenuPanel {
	private _menuPanel: MDCMenu;

	@Element() _hostRef: HTMLElement;
	@State() $topPosition: number;
	@State() $itemHeight: number = 40;

	/**
	 *
	 */
	@Prop() open: boolean;
	@Watch('open') _openHandler(newValue: boolean) {
		this._toggleMenu(!!newValue);
	}

	/**
	 *
	 */
	@Prop() itemList: string | MenuPanelItems;
	@State() $itemList: MenuPanelItems;
	@Watch('itemList') _itemListHandler(newValue: string | MenuPanelItems) {
		this.$itemList = parseProp<MenuPanelItems>(newValue || []);
		this.$topPosition = 0;
		const row = get(this.$itemList[0], 'data.row', {});
		if (row.topPosition === false) {
			this.$topPosition = -this.$itemList.length * this.$itemHeight - this.$itemHeight;
		}
	}
	@State() $invalidSelection: boolean = false;

	/**
	 *
	 */
	@Event() selectedOption: EventEmitter<MenuPanelItem>;

	/**
	 *
	 */
	@Event() menuPanelClosed: EventEmitter<void>;

	/**
	 *
	 */
	@Event() menuPanelOpened: EventEmitter<void>;

	/**
	 *
	 */
	@Method() async openMenu() {
		this._toggleMenu(true);
	}

	/**
	 *
	 */
	@Method() async closeMenu() {
		this._toggleMenu(false);
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._itemListHandler(this.itemList);
		this._openHandler(this.open);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		this._menuPanel = MDCMenu.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-menu'));
		this._menuPanel.setDefaultFocusState(DefaultFocusState.NONE);
		this._menuPanel.listen('MDCMenuSurface:closed', () => {
			this._hostRef.removeAttribute('open');
			this.menuPanelClosed.emit();
		});
		this._menuPanel.listen('MDCMenu:selected', (event: CustomEvent) => {
			const { index } = event.detail;
			const element = get(this.$itemList, index);
			if (element && !element.disabled) {
				this.selectedOption.emit(element);
			}
			this.$invalidSelection = element.disabled;
		});

		this._toggleMenu(this.open);
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._menuPanel) && this._menuPanel.destroy) {
			this._menuPanel.unlisten('MDCMenu:selected', () => {});
			this._menuPanel.unlisten('MDCMenuSurface:closed', () => {});
			this._menuPanel.destroy();
		}
	}

	/**
	 *
	 * @param status
	 */
	private _toggleMenu(status: boolean) {
		if (this._menuPanel && (this.$itemList || []).length > 0) {
			this._menuPanel.open = !!status;
			if (!!status) {
				this.menuPanelOpened.emit();
			}
		}
	}

	render() {
		return (
			<Host>
				<div class="mdc-menu mdc-menu-surface" style={{ transform: `translateY(${this.$topPosition}px)` }}>
					<ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical">
						{this.$itemList.map((item, index) => (
							<li
								class={`mdc-list-item ${item.disabled && 'item-list--disabled'} `}
								role="menuitem"
								key={item.label + index}
								onClick={(e) => e.preventDefault()}
							>
								{item.icon && (
									<span class="mdc-list-item__item-container" style={{ '--icon-content': `var(--theme-scib-icon-${item.icon})` }}>
										<i class="icon mdc-list-item__icon" />
									</span>
								)}
								<span class="mdc-list-item__text">{item.label}</span>
							</li>
						))}
					</ul>
				</div>
			</Host>
		);
	}
}
