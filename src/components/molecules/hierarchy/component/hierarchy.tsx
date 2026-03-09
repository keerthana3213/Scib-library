import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { parseProp } from '../../../../utils/helpers/common';
import { HierarchyConfig, MenuPanelOptions } from '../model/hierarchy.model';

@Component({
	tag: 'scib-molecules-hierarchy',
	styleUrl: 'hierarchy.scss',
	shadow: true
})
export class MoleculesHierarchy {
	@Element() host: HTMLElement;
	/**
	 *
	 */
	@Prop() literals: any | string;
	@State() $literals: any;
	@Watch('literals') _literalsHandler(newValue: any | string) {
		this.$literals = parseProp(newValue, {});
	}
	/**
	 * Config object to show or hide elements
	 */
	@Prop() config: HierarchyConfig | string;
	@State() $config: HierarchyConfig;
	@Watch('config') _configHandler(newValue: HierarchyConfig | string) {
		this.$config = parseProp(newValue, {});
	}
	@Prop() menuList: MenuPanelOptions[] | string = [];
	@State() $menuList: MenuPanelOptions[];
	@Watch('menuList') _menuListHandler(newValue: MenuPanelOptions[] | string) {
		this.$menuList = parseProp(newValue, []);
		this.$menuList.forEach((element) => {
			if (element?.key_label) {
				element.label = this.$literals[element.key_label] || element.key_label;
			}
		});
	}
	/**
	 * Array copy of data for html render
	 */
	dataCopy = [];
	/**
	 * Array of objects to render the hierarchy
	 */
	@Prop({ mutable: true, reflect: true }) data: any[] | string;
	@State() $data: any[];
	@Watch('data') _dataListHandler(newValue: any[] | string) {
		this.$data = parseProp(newValue, []);
	}
	/**
	 * Property to disable click in all line of hierarchy, when active we can expand only with arrow button
	 */
	@Prop() disableFullHandler: boolean;
	@State() $openMenuPanel: boolean = false;
	@State() $opendMenuId: string;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */

	componentWillLoad() {
		this._literalsHandler(this.literals);
		this._configHandler(this.config);
		this._dataListHandler(this.data);
		this._menuListHandler(this.menuList);
	}
	componentWillRender() {
		this.dataCopy = [];
		this.transformDataToOneLevel(this.$data, 0);
	}

	getTitlesWidth() {
		return 100;
	}

	transformDataToOneLevel(data, parentElement?) {
		data.forEach((element) => {
			element.row_id = element.row_id || uuidv4();
			element.row_level = parentElement?.row_level + 1 || 0;
			let dataWithNoChild = { ...element };
			dataWithNoChild.parent_id = parentElement?.row_id;
			delete dataWithNoChild.subsection;
			this.dataCopy.push(dataWithNoChild);
			if (element?.subsection) {
				this.transformDataToOneLevel(element.subsection, element);
			}
		});
	}
	changeOpenState(data, item, allChildClosed?) {
		data.forEach((element) => {
			if (element.row_id == item.row_id) {
				let htmlElement = this.host.shadowRoot.querySelector(`.content-${item.row_id}`);
				element.opened = !element.opened;
				if (!element.opened) {
					htmlElement.innerHTML = '';
					this.$openMenuPanel = false;
				}
				this.elementOpened.emit({ data: { ...element }, htmlElement });
			} else if (element.row_id !== item.row_id && allChildClosed) {
				element.opened = false;
			}
			allChildClosed = !element.opened;
			if (element?.subsection) {
				this.changeOpenState(element.subsection, item, allChildClosed);
			}
		});
	}
	@Method() async openOrCloseAll(openStatus: boolean, data) {
		data.forEach((element) => {
			element.opened = openStatus;
			if (element?.subsection) {
				this.openOrCloseAll(openStatus, element.subsection);
			}
		});
	}
	searchItem(data, itemForSearch, event) {
		data.forEach((element) => {
			if (element.row_id == itemForSearch.row_id) {
				this.menuOptionSelected.emit({ data: { ...element }, option: event });
			} else if (element?.subsection) {
				this.searchItem(element?.subsection, itemForSearch, event);
			}
		});
	}

	@Event() elementOpened: EventEmitter;
	@Event() menuOptionSelected: EventEmitter;

	updateDataState(itemForSearch) {
		this.dataCopy = [];
		this.changeOpenState(this.$data, itemForSearch);
		this.$data = [...this.$data];
	}
	render() {
		return (
			<Host>
				<div class="header">
					<div class="header__titles column-title">
						<span class="header__titles__text">{this.$literals['component_name']}</span>
						<div class="header__titles__columns">
							{this.$config?.columnOptions.map((column) => (
								<span
									style={{ width: `${column?.width || this.getTitlesWidth()}px` }} //When the function is fixed for get columns title width, the OR should be AUTO
									class="header__titles__columns__text header__titles__columns--controls"
								>
									{this.$literals[column.key_title]}
								</span>
							))}
						</div>
					</div>
					<div class="header__options">
						<span class="header__options__white-space"></span>
						{this.$config?.activeMenu && <span class="header__options__white-space"></span>}
					</div>
				</div>
				{(this.dataCopy || []).map((item) => (
					<div>
						{((item.row_level > 0 && this.dataCopy.find((element) => element.row_id == item.parent_id)?.opened) ||
							item.row_level == 0) && (
							<div>
								<hr
									style={{ 'margin-left': `${20 * item.row_level}px`, width: `calc(100% - ${20 * item.row_level})` }}
									class="divider"
								/>

								<section
									class={{ accordion: true }}
									style={{ 'padding-left': `${20 * item.row_level}px`, width: `calc(100% - ${20 * item.row_level})` }}
								>
									<div class={{ hierarchy__header: true }}>
										{item.row_level > 0 && <i class="icon u-icon hierarchy__header__container__icon-son"></i>}
										<div
											class={{
												hierarchy__header__container: true,
												hierarchy__header__cursor: !this.disableFullHandler
											}}
											onClick={() => (this.disableFullHandler ? {} : this.updateDataState(item))}
										>
											<span
												class={`hierarchy__header__container__title ${
													item.thinTitle ? 'hierarchy__header__container__title--thin' : ''
												}`}
											>
												{this.$literals[item.key_title] || item.key_title}
											</span>
											<div class="hierarchy__header__container__columns">
												{this.$config.columnOptions?.map((column) =>
													column?.tagParams?.type ? (
														<scib-atoms-tag
															type={column.tagParams.type}
															class="hierarchy__header__container__columns__tag information"
															style={{ width: `${column?.width || this.getTitlesWidth()}px` }}
															text={
																!isNil(item[column.idField]) && item[column.idField] != ''
																	? item[column.idField]
																	: '-'
															}
														></scib-atoms-tag>
													) : (
														<span
															class="hierarchy__header__container__columns__text information"
															style={{ width: `${column?.width || this.getTitlesWidth()}px` }}
														>
															{!isNil(item[column.idField]) && item[column.idField] != '' ? item[column.idField] : '-'}
														</span>
													)
												)}
											</div>
										</div>
										<div class="hierarchy__buttons">
											<button
												onClick={() => this.updateDataState(item)}
												class={{
													'hierarchy__buttons__btn--open': item.opened,
													hierarchy__buttons__btn: true,
													'hierarchy__buttons__btn--toggle': true
												}}
												tabindex="0"
											>
												<i class="icon u-icon icon-chevron" />
											</button>
											{this.$openMenuPanel && item?.row_id == this.$opendMenuId && (
												<scib-ui-v2-menu-panel
													open={this.$openMenuPanel && item?.row_id == this.$opendMenuId}
													itemList={this.$menuList}
													onSelectedOption={(event) => {
														this.searchItem(this.$data, item, event.detail);
													}}
												></scib-ui-v2-menu-panel>
											)}
											{this.$config?.activeMenu && !item?.deactivateMenu ? (
												<button
													class="hierarchy__buttons__btn hierarchy__buttons__btn--menu"
													onClick={() => {
														this.$openMenuPanel = true;
														this.$opendMenuId = item.row_id;
													}}
												>
													<i class="icon u-icon" />
												</button>
											) : (
												<div class={'white-space'}></div>
											)}
										</div>
									</div>

									<div
										class={`content-${item.row_id} hierarchy__content ${!item.opened ? 'hierarchy__content--hidden' : ''}`}
									></div>
								</section>
							</div>
						)}
					</div>
				))}
				<hr class="divider" />
			</Host>
		);
	}
}
