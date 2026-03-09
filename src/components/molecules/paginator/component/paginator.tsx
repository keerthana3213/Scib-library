import { Component, Host, h, Element, Prop, EventEmitter, Watch, State, Event, Method } from '@stencil/core';
import { PaginationEvent, PaginationLanguages, PaginatorVariants } from '../models/paginator.model';
import { parseProp } from '../../../../utils/helpers/common';
import Pagination from 'tui-pagination';
import { first, get, sortBy } from 'lodash';
import 'numeral/locales/en-gb';
import numeral from 'numeral';
import 'numeral/locales/es';

/**
 * Component description
 *
 * @status stable
 */
@Component({
	tag: 'scib-molecules-paginator',
	styleUrl: 'paginator.scss',
	shadow: true
})
export class MoleculesPaginator {
	private _paginatorInstance: any;
	@State() $itemHeight: number = 40;
	@State() $selectedSize: number;

	@State() $openSizeSelectorPanel: boolean = false;

	/**
	 *
	 */
	@Prop() tableUuid: string;

	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@State() $totalItemsByLanguage: numeral = numeral();

	/**
	 * Total items text
	 */
	@Prop({ mutable: true }) totalItemsText: string = 'Total:';
	/**
	 * Items per page text
	 */
	@Prop() itemsPerPageText: string = 'Items-page';
	/**
	 *Position for the dropdown paginator
	 */

	@Prop() dropdownPosition: string = 'down';
	/**
	 *
	 */
	@Prop({ mutable: true }) totalItems: number;
	@State() $totalItems: number;

	@Watch('totalItems') _totalItemsHandler(newValue: number) {
		this.$totalItems = newValue || 0;
		if (this._paginatorInstance) {
			this._paginatorInstance.setTotalItems(this.$totalItems);
			this._paginatorInstance.reset(this.$totalItems);
		}
		this.$totalItemsByLanguage.set(Number(this.$totalItems));
		this._updateNumeralLocale();
	}

	/**
	 *
	 */
	@Prop() paginationSizeSelector: string | number[];
	@State() $paginationSizeSelector: number[];
	@Watch('paginationSizeSelector') _paginationSizeSelectorHandler(newValue: string | number[]) {
		this.$paginationSizeSelector = parseProp<number[]>(newValue, [10, 20, 30]);
		this._paginationSizeHandler();
	}

	/**
	 *
	 */
	@Prop() paginationSize: number;
	@State() $paginationSize: number;
	@Watch('paginationSize') _paginationSizeHandler(newValue?: number) {
		if (newValue) {
			const existOption = this.$paginationSizeSelector.findIndex((value) => value === newValue) > -1;
			if (!existOption) {
				const options = [...this.$paginationSizeSelector, newValue];
				this.$paginationSizeSelector = sortBy(options);
			}
		}
		this.$paginationSize = newValue || first(this.$paginationSizeSelector);
		this.$activePageSize = this.$paginationSize;
		this._updatePaginatorConfig();
	}

	/**
	 *
	 */
	@Prop({ mutable: true }) paginationInitialPage: number;
	@State() $paginationInitialPage: number;
	@Watch('paginationInitialPage') _paginationInitialPageHandler(newValue?: number) {
		this.$paginationInitialPage = newValue || 1;
		if (this._paginatorInstance && this.$paginationInitialPage > 0) {
			this._paginatorInstance.movePageTo(this.$paginationInitialPage);
		}
	}

	/**
	 *
	 */
	@Prop() hideTotal: boolean = false;
	@State() $hideTotal: boolean;
	@Watch('hideTotal') _hideTotalHandler(newValue: boolean) {
		this.$hideTotal = !!newValue;
	}

	/**
	 *
	 */
	@Prop() hidePages: boolean = false;
	@State() $hidePages: boolean;
	@Watch('hidePages') _hidePagesHandler(newValue: boolean) {
		this.$hidePages = !!newValue;
	}

	/**
	 *
	 */
	@Prop() infinitePaginator: boolean;
	@State() $infinitePaginator: boolean;
	@Watch('infinitePaginator') _infinitePaginatorHandler(newValue: boolean) {
		this.$disableNext = false;
		this.$actualPage = this.paginationInitialPage || 1;
		this.$infinitePaginator = !!newValue;
	}

	/**
	 *
	 */
	@State() $disableNext: boolean = false;
	@Method() async disableNext() {
		this.$disableNext = true;
	}
	@Method() async enableNext() {
		this.$disableNext = false;
	}

	/**
	 *
	 */
	@Prop() paginationButtonCount: number;
	@State() $paginationButtonCount: number;
	@Watch('paginationButtonCount') _paginationButtonCountHandler(newValue: number) {
		this.$paginationButtonCount = newValue || 3;
		this._updatePaginatorConfig();
	}

	/**
	 *
	 */
	@State() $actualPage: number;
	private _actualPageHandler(newValue: number) {
		this.$actualPage = newValue;
	}

	/**
	 *	Choose the language that this component will render the dates.
	 */
	@Prop() language: PaginationLanguages = 'en';
	@State() $language: PaginationLanguages;
	@Watch('language') _languageHandler(newValue: PaginationLanguages) {
		this.$language = newValue || 'en';
		this._updateNumeralLocale();
	}

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: PaginatorVariants = 'standard';

	/**
	 *
	 */
	@State() $activePageSize: number;

	/**
	 *
	 */
	@Event() paginationChange: EventEmitter<PaginationEvent>;

	/**
	 *
	 */
	@Method() async moveToPage(page: number, emitEvent = true) {
		if (page < this.$actualPage) {
			this.$disableNext = false;
		}
		this._actualPageHandler(page);
		emitEvent && this._emitEvent();
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._languageHandler(this.language);
		this._hideTotalHandler(this.hideTotal);
		this._hidePagesHandler(this.hidePages);
		this._infinitePaginatorHandler(this.infinitePaginator);
		this._totalItemsHandler(this.totalItems);
		this._paginationSizeSelectorHandler(this.paginationSizeSelector);
		this._paginationSizeHandler(this.paginationSize);
		this._paginationButtonCountHandler(this.paginationButtonCount);
		this._paginationInitialPageHandler(this.paginationInitialPage);
		this._actualPageHandler(this.paginationInitialPage ?? 1);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		if (!this.$infinitePaginator) {
			this.initTui();
		}
	}

	/**
	 *
	 */
	initTui() {
		const container = this._hostRef.shadowRoot.querySelector('.paginator__pages__container');
		this._paginatorInstance = new Pagination(container, {
			totalItems: this.$totalItems,
			itemsPerPage: this.$activePageSize,
			visiblePages: this.$paginationButtonCount,
			centerAlign: true,
			template: {
				moveButton: '<span class="tui-page-btn tui-{{type}}"><i class="icon" /></span>',
				disabledMoveButton: '<span class="tui-page-btn tui-is-disabled tui-{{type}}"><i class="icon" /></span>'
			}
		});
		if (this.$paginationInitialPage > 0) {
			this._paginatorInstance.movePageTo(this.$paginationInitialPage);
		}
		this._paginatorInstance.on('afterMove', () => this._emitEvent());
	}

	/**
	 *
	 */
	componentDidRender() {
		this._positionHandler();
	}
	/**
	 *
	 * @param open
	 */
	private _toggleMenu(open: boolean) {
		this.$openSizeSelectorPanel = open;
	}

	/**
	 *
	 */
	private _positionHandler() {
		if (this.$openSizeSelectorPanel) {
			const dropdown = this._hostRef.shadowRoot.querySelector('.dropdown');

			switch (this.dropdownPosition) {
				case 'down':
					dropdown?.classList.add('down-direction');
					if (dropdown?.classList.contains('up-direction')) dropdown?.classList.remove('up-direction');
					break;
				case 'up':
					dropdown?.classList.add('up-direction');
					if (dropdown?.classList.contains('down-direction')) dropdown?.classList.remove('down-direction');
					break;

				default:
					break;
			}
		}
	}

	/**
	 *
	 */
	private _updateNumeralLocale() {
		const languages = {
			es: 'es',
			en: 'en-gb'
		};
		numeral.locale(get(languages, this.$language, 'en-gb'));
	}

	/**
	 *
	 * @param size
	 */
	private _updatePaginatorConfig(size?: number, emit?: boolean) {
		this.$activePageSize = size || this.$paginationSize;
		if (this._paginatorInstance) {
			this._paginatorInstance.setItemsPerPage(this.$activePageSize);
			this._paginatorInstance.reset();
		}
		if (emit) {
			this._emitEvent();
		}
	}

	/**
	 *
	 */
	private _emitEvent() {
		if (this._paginatorInstance || this.$infinitePaginator) {
			const event = {
				currentPage: this.$infinitePaginator ? this.$actualPage : this._paginatorInstance.getCurrentPage(),
				itemsPerPage: this.$activePageSize,
				tableUuid: this.tableUuid
			};
			this.paginationChange.emit(event);
		}
	}

	private _setIcon() {
		const icon: string = this.$openSizeSelectorPanel ? 'chevron-up' : 'chevron-down';
		return `var(--theme-scib-icon-${icon})`;
	}

	render() {
		return (
			<Host>
				<div class={{ paginator: true, 'paginator--advanced': this.variant === 'advanced' }}>
					{!this.$hideTotal && this.$totalItems >= 0 && !this.$infinitePaginator && (
						<div class="paginator__total">
							<span class="paginator__total__label">{this.totalItemsText}</span>
							<span class="paginator__total__value">{this.$totalItemsByLanguage.format('0,0')}</span>
						</div>
					)}
					{this.variant === 'advanced' && <slot name="custom-paginator-content" />}
					<div class="paginator__options">
						{this.variant !== 'advanced' ? (
							<ul class="items">
								{this.$paginationSizeSelector.map((item) => (
									<li class="items__item">
										<button
											onClick={() => this._updatePaginatorConfig(item, true)}
											class={{
												items__item__button: true,
												'items__item__button--active': this.$activePageSize === item
											}}
										>
											{item}
										</button>
									</li>
								))}
							</ul>
						) : (
							<div class="advanced-paginator">
								<div class={'advanced-paginator text-items'}>{this.itemsPerPageText}</div>
								<div class="view-selector" onClick={() => this._toggleMenu(!this.$openSizeSelectorPanel)}>
									{this.$activePageSize.toString()}
									<span
										style={{
											'--icon-content': this._setIcon()
										}}
									>
										<i class="icon view-selector-icon" />
									</span>
								</div>

								<div>
									{this.$openSizeSelectorPanel && (
										<scib-ui-v2-card class="dropdown" type="elevated">
											<scib-ui-v2-scroll-container>
												<ul
													class={{
														'mdc-list': true,
														'scroll-changes': true,
														'scroll-changes-activated': this.$paginationSizeSelector.length > 3 ? true : false
													}}
													role="menu"
													aria-hidden="true"
													aria-orientation="vertical"
												>
													{this.$paginationSizeSelector.map((item, index) => (
														<li
															class="mdc-list-item"
															role="menuitem"
															key={index}
															onClick={() => (
																this._updatePaginatorConfig(item, true),
																this._toggleMenu(!this.$openSizeSelectorPanel)
															)}
														>
															<span
																class="mdc-list-item__item-container"
																style={{
																	'--icon-content': `var(--theme-scib-icon-checkmark-bold)`
																}}
															>
																{item === this.$activePageSize && <i class="icon mdc-list-item__icon" />}
															</span>

															<span class="mdc-list-item__text">{item}</span>
														</li>
													))}
												</ul>
											</scib-ui-v2-scroll-container>
										</scib-ui-v2-card>
									)}
								</div>
							</div>
						)}
					</div>
					{!this.hidePages && (
						<span>
							{this.$totalItems >= 0 && !this.$infinitePaginator ? (
								<div class={{ paginator__pages: true, 'disable-next': this.$disableNext }}>
									<div class="paginator__pages__container tui-pagination"></div>
								</div>
							) : (
								<div class="paginator__pages__container tui-pagination paginator-padding">
									<span
										class={{ 'tui-page-btn': true, 'tui-first': true, 'no-selectable': this.$actualPage <= 1 }}
										onClick={() => this.$actualPage > 1 && this.moveToPage(1)}
									>
										<i class="icon"></i>
									</span>
									<span
										class={{ 'tui-page-btn': true, 'tui-prev': true, 'no-selectable': this.$actualPage <= 1 }}
										onClick={() => this.$actualPage > 1 && this.moveToPage(this.$actualPage - 1)}
									>
										<i class="icon"></i>
									</span>
									<strong class="tui-page-btn tui-is-selected no-selectable tui-first-child tui-last-child">
										{this.$actualPage}
									</strong>
									<span
										class={{ 'tui-page-btn': true, 'tui-next': true, 'no-selectable': this.$disableNext }}
										onClick={() => !this.$disableNext && this.moveToPage(this.$actualPage + 1)}
									>
										<i class="icon"></i>
									</span>
								</div>
							)}
						</span>
					)}
				</div>
			</Host>
		);
	}
}
