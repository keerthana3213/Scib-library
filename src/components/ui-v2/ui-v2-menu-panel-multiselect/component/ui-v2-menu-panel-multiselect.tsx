import { Component, Host, h, Element, Prop, Watch, State, EventEmitter, Event, Listen } from '@stencil/core';
import {
	DataOnClickDTO,
	MenuPanelMultiselectItems,
	OpenSubmenuOnType,
	PrivateMenuPanelMultiselectItems,
	SelectedOptionsDTO,
	SubmenuItem
} from '../models/ui-v2-menu-panel-multiselect.model';
import { DefaultFocusState, MDCMenu } from '@material/menu';
import { parseProp } from '../../../../utils/helpers/common';
import { isEmpty } from 'lodash';

@Component({
	tag: 'scib-ui-v2-menu-panel-multiselect',
	styleUrl: 'ui-v2-menu-panel-multiselect.scss',
	shadow: true
})
export class UI_V2MenuPanelMultiselect {
	private _menuPanel: MDCMenu;
	private _itemsListByLevels: PrivateMenuPanelMultiselectItems[] = [];
	private _isDesktop: boolean = window.screen.width > 767;
	private itemsSelected: SubmenuItem[] = [];

	@Element() _hostRef: HTMLElement;
	@State() $cardItemsList: PrivateMenuPanelMultiselectItems[] = [];

	/**
	 *
	 */
	@Prop() open: boolean;
	@State() _open: boolean;
	@Watch('open') _openHandler(newValue: boolean) {
		this._open = newValue;
	}

	/**
	 *
	 */
	@Prop() expandAllOnOpen: boolean;
	@State() _expandAllOnOpen: boolean;
	@Watch('expandAllOnOpen') _expandAllOnOpenHandler(newValue: boolean) {
		this._expandAllOnOpen = newValue;
	}

	/**
	 *
	 */
	@Prop() cleanAllSelection: boolean = false;
	@State() _cleanAllSelection: boolean;
	@Watch('cleanAllSelection') _cleanAllSelectionHandler(newValue: boolean) {
		this._cleanAllSelection = newValue;
		if (this._cleanAllSelection) {
			this.uncheckAll(0);
			this._cleanSelections();
		}
	}

	/**
	 *
	 */
	@Prop() subtitle: string;
	@State() _subtitle: string;
	@Watch('subtitle') _subtitleHandler(newValue: string) {
		this._subtitle = newValue;
	}

	/**
	 *
	 */
	@Prop() checkIcon: string;
	@State() _checkIcon: string;
	@Watch('checkIcon') _checkIconHandler(newValue: string) {
		this._checkIcon = newValue;
	}

	/**
	 *
	 */
	@Prop() submenuIcon: string = 'chevron-right-small-thin';
	@State() _submenuIcon: string;
	@Watch('submenuIcon') _submenuIconHandler(newValue: string) {
		this._submenuIcon = newValue;
	}

	/**
	 *
	 */
	@Prop() submenuPosition: string = 'right';
	@State() _submenuPosition: string;
	@Watch('submenuPosition') _submenuPositionHandler(newValue: string) {
		this._submenuPosition = newValue;
	}

	/**
	 *
	 */
	@Prop() itemList: string | MenuPanelMultiselectItems;
	@State() $itemList: MenuPanelMultiselectItems;
	@Watch('itemList') _itemListHandler(newValue: string | MenuPanelMultiselectItems) {
		this.$itemList = parseProp<MenuPanelMultiselectItems>(newValue || []);
		this._generateIds();
	}

	@Prop() openSubmenuOn: OpenSubmenuOnType = 'click';
	@State() $openSubmenuOn: string;
	@Watch('openSubmenuOn') _openSubmenuOnHandler(newValue: string) {
		this.$openSubmenuOn = newValue;
	}

	/**
	 *
	 */
	@Prop() changeDirectionOnLevelsList: string | string[];
	@State() $changeDirectionOnLevelsList: string[];
	@Watch('changeDirectionOnLevelsList') _changeDirectionOnLevelsListtHandler(newValue) {
		this.$changeDirectionOnLevelsList = parseProp<string[]>(newValue || []);
	}

	/**
	 *
	 */
	@Event() sendSelectedOptions: EventEmitter<SelectedOptionsDTO>;

	/**
	 *
	 */
	@Event() sendOpenedSubmenuLabel: EventEmitter<string>;

	/**
	 *
	 */
	@Event() sendClickOnElement: EventEmitter<DataOnClickDTO>;

	/**
	 *
	 */
	@Listen('click', { target: 'window' }) _handleOnSelect(event: Event) {
		if (this._open) {
			this.sendClickOnElement.emit({ element: event.target['localName'], accessKey: event.target['accessKey'] });
		}
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._itemListHandler(this.itemList);
		this._openHandler(this.open);
		this._checkIconHandler(this.checkIcon);
		this._submenuIconHandler(this.submenuIcon);
		this._submenuPositionHandler(this.submenuPosition);
		this._subtitleHandler(this.subtitle);
		this._openSubmenuOnHandler(this.openSubmenuOn);
		this._expandAllOnOpenHandler(this.expandAllOnOpen);
		this._changeDirectionOnLevelsListtHandler(this.changeDirectionOnLevelsList);
		this._cleanAllSelectionHandler(this.cleanAllSelection);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		this._menuPanel = MDCMenu.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-menu'));
		this._menuPanel.setDefaultFocusState(DefaultFocusState.NONE);
		this.getPositionPanels();
	}

	/**
	 * Cuando se modifica el render se reposicionan las cards
	 */
	componentDidUpdate() {
		this.getPositionPanels();
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._menuPanel) && this._menuPanel.destroy) {
			this.$cardItemsList = null;
			this.$changeDirectionOnLevelsList = null;
			this.$itemList = null;
			this._menuPanel.destroy();
		}
	}

	/**
	 * Si el item no tiene submenú dispara evento
	 */
	private _handleClickSelectionOption(item) {
		if (!item.submenuItems) {
			if (item.checked) {
				if (!this.itemsSelected?.length) {
					this.itemsSelected = [];
				}
				this.itemsSelected.push(this.cleanItemObject(item));
			} else {
				const index = this.itemsSelected.findIndex((itsel) => itsel.label === item.label && itsel.id === item.id);
				if (index !== -1) {
					this.itemsSelected.splice(index, 1);
				}
			}
			item.checked = !item.checked;
			this.$cardItemsList = [...this.$cardItemsList];
			const _item = this.cleanItemObject(item);
			this.sendSelectedOptions.emit({ updatedItemList: this.itemsSelected, lastSelectedItem: _item });
		} else {
			this._handleSelectionOption(item);
		}
	}

	/**
	 * Limpia las propiedades privadas del objeto a emitir
	 */
	private cleanItemObject(_item): SubmenuItem {
		return {
			label: _item.label,
			checked: _item.checked,
			id: _item.id
		};
	}

	/**
	 * Maneja el click sobre un item
	 */
	private _handleSelectionOption(item) {
		if (this.$openSubmenuOn === 'hover') {
			this.uncheckAll(item._level);
			this.uncheckAll(item._level - 1);
		}
		item.checked = !item.checked;

		if (!item.checked) {
			this.$cardItemsList = this.$cardItemsList.slice(0, item._level);
		} else {
			this.addCardToShow(item);
		}
	}

	/**
	 * Añade un nuevo card al array de datos que lo gestiona
	 */
	private addCardToShow(item) {
		this.$cardItemsList = [];
		if (item.submenuItems?.length > 0) {
			const submenuItems = this._itemsListByLevels[item._level].filter((itemLevel) => itemLevel._parentId === item._id);
			this.$cardItemsList.push([...submenuItems]);
			this.sendOpenedSubmenuLabel.emit(item.label);
		}
		let parentId = item._parentId;
		if (parentId) {
			const mySelfCard = this._itemsListByLevels[item._level - 1].filter((itemLevel) => itemLevel._parentId === parentId);
			this.$cardItemsList.push([...mySelfCard]);
			for (let i = item._level - 2; i > -1; i--) {
				const ancestorItem = this._itemsListByLevels[i].find((itemLevel) => itemLevel._id === parentId);
				if (ancestorItem) {
					const ancestorCard = this._itemsListByLevels[i].filter((itemLevel) => itemLevel._parentId === ancestorItem._parentId);
					this.$cardItemsList.push([...ancestorCard]);
					parentId = ancestorItem._parentId;
				} else {
					this.$cardItemsList.push([...this._itemsListByLevels[0]]);
				}
			}
		} else {
			this.$cardItemsList.push([...this._itemsListByLevels[0]]);
		}
		this.getReverseCardItemList();
	}

	/**
	 * Invierte el orden del array de datos de cards
	 */
	private getReverseCardItemList() {
		this.$cardItemsList = this.$cardItemsList.reverse();
	}

	/**
	 * Deselecciona toda una card
	 */
	private uncheckAll(fromLevel) {
		for (let i = fromLevel; i < this.$cardItemsList.length; i++) {
			this.$cardItemsList[i].forEach((element) => (element.checked = false));
		}
	}

	/**
	 * Limpia las selecciones y regenera la primera tarjeta
	 */
	private _cleanSelections() {
		if (this.$cardItemsList?.length > 0) {
			this.$cardItemsList = [];
			this.$cardItemsList.push([...this._itemsListByLevels[0]]);
		}
	}

	/**
	 * Genera los id y parentId como propiedades internas
	 */
	private _generateIds() {
		const itemsListByLevels = [];
		let _id = 1;
		let _parentId = undefined;
		let _element;
		const _generator = function (arr) {
			arr.forEach((element) => {
				_element = { ...element };
				_element._id = _id;
				_parentId = _element.submenuItems ? _element._id : undefined;
				itemsListByLevels.push(_element);
				_id += 1;
				if (_element.submenuItems?.length > 0) {
					_element.submenuItems.forEach((children) => {
						if (_parentId) {
							children._parentId = _parentId;
						}
					});
					_generator(_element.submenuItems);
				}
			});
		};
		_generator([...this.$itemList]);
		this._organizeByLevels(itemsListByLevels);
	}

	/**
	 * Genera el array de datos base por niveles
	 */
	private _organizeByLevels(itemsListByLevels) {
		this._itemsListByLevels = [];
		this.$cardItemsList = [];
		itemsListByLevels.forEach((element) => {
			element._level = element._parentId === undefined ? 1 : itemsListByLevels.find((it) => it._id === element._parentId)._level + 1;
			if (!this._itemsListByLevels[element._level - 1]) {
				this._itemsListByLevels[element._level - 1] = new Array();
			}
			this._itemsListByLevels[element._level - 1].push(element);
		});
		if (this._expandAllOnOpen) {
			this._initSubmenus();
		} else {
			this.$cardItemsList.push([...this._itemsListByLevels[0]]);
		}
		this.manageSelectionsList(this._itemsListByLevels);
	}

	/**
	 * Crea el array que comunica al exterior todos los ítems que no tienen submenús y están seleccionados.
	 */
	private manageSelectionsList(dataArr) {
		this.itemsSelected = [];
		dataArr.forEach((level) => {
			level.forEach((element) => {
				if (element.checked && !element.submenuItems) {
					const _item = this.cleanItemObject(element);
					this.itemsSelected.push(_item);
				}
			});
		});
	}

	/**
	 * Recorre inicialmente la carga de datos, y abre submenús en caso de que alguno esté checked
	 * si prop:expandAllOnOpen es true
	 */
	private _initSubmenus() {
		this._itemsListByLevels.forEach((level) => {
			level.forEach((item) => {
				if (item.checked && item.submenuItems?.length > 0) {
					this.addCardToShow(item);
				}
			});
		});
	}

	/**
	 * Reposiciona las cards
	 */
	private getPositionPanels() {
		if (this._isDesktop) {
			let corrector = this._submenuPosition === 'left' ? -1 : 1;
			const filterOptionsHTMLElements: NodeListOf<Element> = this._hostRef.shadowRoot.querySelectorAll('.mdc-menu-surface__sub-card');

			for (let i = 1; i < filterOptionsHTMLElements.length; i++) {
				const levelPanel = filterOptionsHTMLElements[i].getAttribute('accessKey');
				const option: HTMLElement = filterOptionsHTMLElements[i] as HTMLElement;
				const optionAncestor = filterOptionsHTMLElements[i - 1] as HTMLElement;
				const leftPanelAncestor = optionAncestor.style.left !== '' ? parseInt(optionAncestor.style.left) : 0;
				const parentWidth = filterOptionsHTMLElements[i - 1].clientWidth;
				if (this.$changeDirectionOnLevelsList?.length > 0) {
					corrector =
						this.$changeDirectionOnLevelsList.findIndex((level) => level.toString() === levelPanel) > -1 ? corrector * -1 : corrector;
				}

				option.style.setProperty('left', `${leftPanelAncestor + corrector * parentWidth}px`, 'important');
				option.style.setProperty('z-index', `${i + 100}`);
				option.style.setProperty('top', `${i * 70}px`);
			}
		}
	}

	private renderCardDesktop = (data, indexPanel) => {
		return (
			<div
				class={{
					'mdc-menu': true,
					'mdc-menu-surface': true,
					'mdc-menu-surface__sub-card': true,
					'mdc-menu-surface__right': this._submenuPosition === 'right',
					'mdc-menu-surface__left': this._submenuPosition === 'left'
				}}
				style={{
					position: 'absolute'
				}}
				accessKey={indexPanel + 1}
			>
				{indexPanel === 0 && this._subtitle && (
					<div class="subtitle">
						<span>{this._subtitle}</span>
					</div>
				)}
				<scib-ui-v2-scroll-container class="scroll-container">
					<ul
						class={{
							'mdc-menu': true,
							'mdc-list': true
						}}
						role="menu"
						aria-hidden="true"
						aria-orientation="vertical"
					>
						<div class="mdc-list__container">
							{data.map((item) =>
								item.groupLabel ? (
									<li
										class={{
											'mdc-list-item': false,
											'mdc-list-item__separator_top': item.separator === 'top',
											'mdc-list-item__separator_bottom': item.separator === 'bottom',
											'mdc-list-item__separator_between': item.separator === 'between',
											'mdc-list-item__groupLabel': true
										}}
									>
										<span>{item.groupLabel}</span>
									</li>
								) : (
									<li
										class={{
											'mdc-list-item': true,
											'mdc-list-item__separator_top': item.separator === 'top',
											'mdc-list-item__separator_bottom': item.separator === 'bottom',
											'mdc-list-item__separator_between': item.separator === 'between',
											'mdc-list-item__hover': this.$openSubmenuOn === 'hover' ? true : false,
											'mdc-list-item__click': this.$openSubmenuOn === 'click' ? true : false,
											'mdc-list-item__hover__selected': this.$openSubmenuOn === 'hover' ? item.checked : false,
											'mdc-list-item__click__selected': this.$openSubmenuOn === 'click' ? item.checked : false
										}}
										role="menuitem"
										key={item._id}
										onClick={() => this._handleClickSelectionOption(item)}
										onMouseEnter={() =>
											this.$openSubmenuOn === 'hover' && item.submenuItems ? this._handleSelectionOption(item) : null
										}
									>
										{this.$openSubmenuOn === 'click' && (
											<span
												class="mdc-list-item__item-container check-icon-container"
												style={{
													'--icon-content': `var(--theme-scib-icon-${
														item.checked && this._checkIcon ? this._checkIcon : ' '
													})`
												}}
											>
												<i class="icon mdc-list-item__icon check" />
											</span>
										)}

										{item.icon && (
											<span
												class="mdc-list-item__item-container"
												style={{
													'--icon-content': `var(--theme-scib-${item.icon ? item.icon : ' '})`
												}}
											>
												<i class="icon mdc-list-item__icon custom_icon" />
											</span>
										)}
										<span class="mdc-list-item__text">{item.label}</span>
										{item.submenuItems && item.submenuItems.length > 0 && (
											<span
												class="mdc-list-item__item-container__multiselect"
												style={{
													'--icon-content': `var(--theme-scib-icon-${this._submenuIcon})`
												}}
											>
												<i class="icon mdc-list-item__icon__selector" />
											</span>
										)}
									</li>
								)
							)}
						</div>
					</ul>
				</scib-ui-v2-scroll-container>
			</div>
		);
	};

	private renderCardMobile = (data) => {
		return (
			<div>
				{data.map((item) =>
					item.groupLabel ? (
						<li
							class={{
								'mdc-list-item': false,
								'mdc-list-item__separator_top': item.separator === 'top',
								'mdc-list-item__separator_bottom': item.separator === 'bottom',
								'mdc-list-item__separator_between': item.separator === 'between',
								'mdc-list-item__groupLabel': true
							}}
						>
							<span>{item.groupLabel}</span>
						</li>
					) : !item.submenuItems ? (
						<li
							class={{
								'mdc-list-item': true,
								'mdc-list-item__separator_top': item.separator === 'top',
								'mdc-list-item__separator_bottom': item.separator === 'bottom',
								'mdc-list-item__separator_between': item.separator === 'between',
								'mdc-list-item__selected': this.$openSubmenuOn === 'hover' ? item.checked : false
							}}
							role="menuitem"
							key={item._id}
							onClick={() => this._handleClickSelectionOption(item)}
							onMouseEnter={() => (this.$openSubmenuOn === 'hover' ? this._handleSelectionOption(item) : null)}
						>
							{this.$openSubmenuOn === 'click' && item.checked && (
								<span
									class="mdc-list-item__item-container"
									style={{
										'--icon-content': `var(--theme-scib-icon-${this._checkIcon})`
									}}
								>
									<i class="icon mdc-list-item__icon" />
								</span>
							)}
							<span
								class="mdc-list-item__item-container"
								style={{
									'--icon-content': `var(--theme-scib-${item.icon ? item.icon : ' '})`
								}}
							>
								<i class="icon mdc-list-item__icon" />
							</span>
							<span class="mdc-list-item__text">{item.label}</span>
						</li>
					) : (
						<div class="responsive__submenu">
							<div class="responsive__submenu__header">
								<span class="responsive__submenu__header__title">{item.label}</span>
								<hr class="responsive__submenu__header__separator" role="separator"></hr>
							</div>
							<ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical">
								{item.submenuItems.map((submenuItem) =>
									submenuItem.groupLabel ? (
										<li
											class={{
												'mdc-list-item': false,
												'mdc-list-item__separator_top': item.separator === 'top',
												'mdc-list-item__separator_bottom': item.separator === 'bottom',
												'mdc-list-item__separator_between': item.separator === 'between',
												'mdc-list-item__groupLabel': true
											}}
										>
											<span>{item.groupLabel}</span>
										</li>
									) : (
										<li
											class="mdc-list-item"
											role="menuitem"
											key={submenuItem._id}
											onClick={() => this._handleClickSelectionOption(submenuItem)}
										>
											<span
												class="mdc-list-item__item-container"
												style={{
													'--icon-content': `var(--theme-scib-icon-${submenuItem.checked ? this._checkIcon : ' '})`
												}}
											>
												<i class="icon mdc-list-item__icon" />
											</span>
											<span class="mdc-list-item__text">{submenuItem.label}</span>
										</li>
									)
								)}
							</ul>
						</div>
					)
				)}
			</div>
		);
	};

	private getRender = () => {
		if (this.$cardItemsList.length > 0) {
			return this.$cardItemsList.map((dat, index) => {
				if (this._isDesktop) {
					return this.renderCardDesktop(dat, index);
				} else {
					return this.renderCardMobile(dat);
				}
			});
		} else {
			return null;
		}
	};

	render() {
		return (
			<Host>
				<div class={{ container: true, container__right: this._submenuPosition === 'right', container__closed: !this._open }}>
					{this._isDesktop ? (
						this.getRender()
					) : (
						<scib-ui-v2-dialog class="responsive" dialog-title={this._subtitle} disable-close="false" open={this._open}>
							<span slot="info" class="responsive__header-icon">
								<i class="icon icon-filter" />
							</span>
							<div slot="content" class="responsive__content mdc-menu mdc-menu-surface">
								<hr class="responsive__submenu__header__separator responsive__header-top-separator" role="separator"></hr>
								<ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical">
									<scib-ui-v2-scroll-container>
										<div class="mdc-list__container">{this.getRender()}</div>
									</scib-ui-v2-scroll-container>
								</ul>
							</div>
						</scib-ui-v2-dialog>
					)}
				</div>
			</Host>
		);
	}
}
