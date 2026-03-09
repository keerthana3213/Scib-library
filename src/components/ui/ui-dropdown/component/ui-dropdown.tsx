import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { IUIDropdownList, IUIDropdownLiterals } from '../models/ecmv-dropdownList.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IECMVMetadataOption } from '../models/ecmv-dropdownOption.model';
import { IECMVMetadataOptionValues, IECMVDocClassValues } from '../../../ecmv/ecmv-modal-files/models/ecmv-modal-files.model';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-dropdown',
	styleUrl: 'ui-dropdown.scss',
	shadow: false,
	scoped: true,
})
export class UIDropdown {
	@Prop() options: string;
	@Prop() multilabel: string = '';
	@Prop() numMultiselect: number = 0;

	/** Step Position for wizard modal form when required */
	@Prop({ reflect: true }) stepPosition?: number;

	/** Required */
	@Prop({ reflect: true }) required: boolean;
	@Prop() boldtext: boolean = false;
	@Watch('required') parseRequired(newRequired: boolean) {
		this._required = _parseProp(newRequired);
		this.eventFormChange.emit({
			name: this.name,
			value: this._selecteditem,
			required: this._required,
			stepPosition: this.stepPosition,
		});
	}
	@State() _required: boolean;

	/** Show asterisk if Required */
	@Prop({ reflect: true }) showAsteriskIfRequired: boolean;
	@Prop({ reflect: true }) metadatavalues: boolean;
	@Prop({ reflect: true }) multipleselector: string;
	@Prop({ mutable: true }) opened: boolean = false;
	@Prop({ mutable: true }) dropdownOptionsListArray: IECMVMetadataOptionValues[] = [];
	@Prop({ mutable: true }) documenclassArray: IECMVDocClassValues[] = [];
	@Prop() optionsSplited;
	/** Selected Item */
	@Prop({ reflect: false }) selecteditem: any;
	@Watch('selecteditem') parseSelecteditem(newSelecteditem: any) {
		this._selecteditem = _parseProp(newSelecteditem);
	}
	/** Selected Item */
	@Prop({ reflect: true, mutable: true }) reset: boolean = false;
	@Watch('reset') resetList(bool: boolean) {
		if (bool) {
			this._selecteditem = null;
			this.reset = false;
		}
		this.eventFormChange.emit({
			name: this.name,
			value: null,
			required: this._required,
			stepPosition: this.stepPosition,
		});
	}
	@State() _selecteditem: any;
	@Prop({ reflect: true }) name: string = 'no-named';
	@Prop({ reflect: true }) label: string;
	@Prop({ reflect: true }) header: string;
	@Prop({ reflect: true, mutable: true }) disabledselector: boolean;
	@Watch('disabledselector') disabledselectorChange(newDisabled: boolean) {
		this._disabledselector = newDisabled;
	}
	@State() _disabledselector: boolean;

	@Prop({ reflect: true }) idselect: string;
	@Prop({ reflect: true }) noborders: boolean;
	@Prop({ reflect: true }) iconheader: string;
	/** Eliminar el min-height del input */
	@Prop({ reflect: true }) noMinHeight: boolean;
	/** Variante "large" */
	@Prop({ reflect: true }) large: boolean;
	/** Variante "medium" */
	@Prop({ reflect: true }) medium: boolean;
	/** Variante "small" */
	@Prop({ reflect: true }) small: boolean;
	/** Añadir tooltip para el label */
	@Prop({ reflect: true }) labelInfo: string;
	/** Tooltip button */
	@Prop({ reflect: true }) tooltipTitle: string;
	/** Break option name by word */
	@Prop({ reflect: true }) wordBreakOpt: boolean = false;

	/** Indica si se pueden añadir elementos a la lista */
	@Prop({ reflect: true }) enableitemaddition: boolean = false;
	/** Valor del error */
	@Prop({ reflect: false }) error: string;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventFormChange: EventEmitter;
	@Event() selectValue: EventEmitter<IUIDropdownList>;
	/** Estado del control (dirty,touched) */
	@Event() statusControl: EventEmitter;
	@State() _status: any = {
		name: '',
		touched: false,
		dirty: false,
	};

	/** Literals */
	@Prop({ reflect: true }) literals: IUIDropdownLiterals | string;
	@Watch('literals') literalsChange(newVal: IUIDropdownLiterals | string) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: IUIDropdownLiterals;

	@Prop({ reflect: true }) isloading: boolean = false;
	@Watch('isloading') isloadingChange(newLoading: boolean) {
		this._isloading = newLoading;
	}
	@State() _isloading: boolean;

	@Listen('focus', { capture: true }) handleFocus() {
		this._status.name = this.name;
		this._status.dirty = true;
		this.statusControl.emit(this._status);
	}
	/** Cierra el dropdown cuando pierde el focus */
	@Listen('blur', { capture: true }) handleBlur(ev: Event) {
		this._status.name = this.name;
		this._status.touched = true;
		this.statusControl.emit(this._status);

		if (!ev['relatedTarget'] || ev['relatedTarget'].className.includes('custom-select__trigger')) {
			document.querySelector('#dr' + this.idselect).classList.remove('open');
			this.opened = false;
		}
	}

	componentWillLoad() {
		this.assignToArray();
		this.disabledselectorChange(this.disabledselector);
		this.literalsChange(this.literals);
		this.isloadingChange(this.isloading);
		this.parseSelecteditem(this.selecteditem);
		this.resetList(this.reset);
		this.parseRequired(this.required);
	}

	componentDidLoad() {
		this.eventFormChange.emit({
			name: this.name,
			value: this._selecteditem,
			required: this._required,
			stepPosition: this.stepPosition,
		});
	}
	@Watch('options')
	assignToArray() {
		this.dropdownOptionsListArray = [];
		if (this.metadatavalues && this.options !== undefined) {
			this.optionsSplited = this.options.split('||');
			if (this.optionsSplited.length >= 1) {
				this.optionsSplited.forEach(elem => {
					const category2: IECMVMetadataOption = {
						label: elem.split('#')[0],
						id: elem.split('#')[1],
						active: false,
						icon: elem.icon,
						image: elem.image,
					};
					if (elem.structureCode || elem.relatedId || elem.whatArea) {
						category2.structureCode = elem.structureCode ? elem.structureCode : '';
						category2.relatedId = elem.relatedId ? elem.relatedId : '';
						category2.whatArea = elem.whatArea ? elem.whatArea : '';
					}
					this.dropdownOptionsListArray = [...this.dropdownOptionsListArray, category2];
				});
			}
		} else {
			if (this.options && this.options != '') {
				this.documenclassArray = JSON.parse(this.options);
				(this.documenclassArray || []).forEach((elem: any) => {
					const category2: IECMVMetadataOption = {
						id: elem.id_doc_class ? elem.id_doc_class : elem.id_doc_type ? elem.id_doc_type : elem.id,
						label: elem.t_name ? elem.t_name : elem.name,
						active: false,
						icon: elem.icon,
						image: elem.image,
					};
					if (elem.structureCode || elem.relatedId || elem.whatArea) {
						category2.structureCode = elem.structureCode ? elem.structureCode : '';
						category2.relatedId = elem.relatedId ? elem.relatedId : '';
						category2.whatArea = elem.whatArea ? elem.whatArea : '';
					}
					this.dropdownOptionsListArray = [...this.dropdownOptionsListArray, category2];
				});
				if (this._selecteditem) {
					const search = this.dropdownOptionsListArray.filter(e => e?.id == this._selecteditem?.id);
					this._selecteditem = search.length > 0 ? search[0] : null;
				}
			}
		}
		this.dropdownOptionsListArray.sort();
	}
	openSelect() {
		if (!this._disabledselector) {
			document.querySelector('#dr' + this.idselect).classList.toggle('open');
			this.opened = !this.opened;
		}
	}

	handleOption(item) {
		if (this.multipleselector == 'single') {
			this.dropdownOptionsListArray.map(elem => {
				elem.active ? (elem.active = false) : null;
			});
			item.active = true;
			this._selecteditem = item;
			this.selectValue.emit(this._selecteditem);
			this.eventFormChange.emit({
				name: this.name,
				value: this._selecteditem,
				required: this._required,
				stepPosition: this.stepPosition,
			});
			this.openSelect();
		} else {
			this.dropdownOptionsListArray.map(elem => {
				if (elem.id == item.id) {
					elem.active ? ((elem.active = false), (item.active = false)) : ((elem.active = true), (item.active = true));
					document.querySelector('span[data-value="' + elem.id + '"]').classList.remove('selected');
				} else {
				}
			});
			if (this.multilabel.indexOf(item.label) != -1) {
				this.multilabel = this.multilabel.replace(item.label, '');
				this.numMultiselect--;
			} else {
				this.multilabel = this.multilabel + item.label;
				this.numMultiselect++;
			}
			this._selecteditem = item;
			this.selectValue.emit(this._selecteditem);
			this.eventFormChange.emit({
				name: this.name,
				value: this._selecteditem,
				required: this._required,
				stepPosition: this.stepPosition,
			});
		}
	}

	@State() _openAddition: boolean = false;
	handleOpenAdditionBox() {
		this._openAddition = true;
		this._disabledselector = true;
	}
	handleCloseAdditionBox() {
		this._openAddition = false;
		this._disabledselector = false;
	}

	render() {
		return (
			<Host>
				<div
					class={{
						'ui-dropdown__button-wrapper': this.enableitemaddition,
						'custom-select-wrapper--itemInput': this.enableitemaddition && this._openAddition,
					}}
				>
					<div
						class={{
							'custom-select-wrapper': true,
							'custom-select-wrapper--noMinHeight': this.noMinHeight,
							'error': !!this.error,
						}}
					>
						{this.label !== undefined && this.label != '' ? (
							<div class="c-label">
								<span>
									{this.label}
									{this.showAsteriskIfRequired && '*'}
								</span>
								{this.label !== undefined && this.label != '' && this.labelInfo !== undefined && this.labelInfo != '' ? (
									<scib-ui-info-tooltip text={this.labelInfo} title={this.tooltipTitle}></scib-ui-info-tooltip>
								) : null}
							</div>
						) : null}

						<div
							id={'dr' + this.idselect}
							class={{
								'custom-select': true,
								'active-selector': !this._disabledselector,
								'disabled-selector': this._disabledselector,
								'custom-select--small': this.small,
								'custom-select--medium': this.medium,
								'custom-select--large': this.large,
								'custom-select-noborder': this.noborders,
							}}
						>
							{this._selecteditem && this._selecteditem.label != '' ? (
								<button
									class={{
										'custom-select__trigger': true,
										'custom-select-noborder': this.noborders,
										'disabled-selector': this._disabledselector,
										'bold-text': this.boldtext,
									}}
									onClick={e => {
										e.preventDefault();
										this.openSelect();
									}}
									aria-expanded="false"
								>
									{this.multipleselector == 'multi' ? (
										<span>
											{this.header} [{this.numMultiselect}]
										</span>
									) : this._selecteditem.icon ? (
										this.opened ? (
											<span class="ui-dropdown__span ui-dropdown__span--select">Select</span>
										) : (
											<span class="ui-dropdown__span ui-dropdown__span--icon">
												<img alt="" src={this._selecteditem.icon}></img>
												<span>{this._selecteditem.label}</span>
											</span>
										)
									) : (
										<span class="ui-dropdown__span">{this._selecteditem.label}</span>
									)}
									{!this.opened ? (
										<span role="img" class="control-select c-tab-icon u-icon icon-chevron-down icon-style"></span>
									) : (
										<span
											role="img"
											class="control-select c-tab-icon u-icon icon-chevron-top icon-style {this.idselect}"
										></span>
									)}{' '}
								</button>
							) : (
								<button
									class={{
										'custom-select__trigger': true,
										'custom-select-noborder': this.noborders,
										'disabled-selector': this._disabledselector,
									}}
									onClick={e => {
										e.preventDefault();
										this.openSelect();
									}}
									aria-expanded="false"
								>
									{this.iconheader != '' && this.iconheader != null ? (
										this.opened ? (
											<span class="ui-dropdown__span ui-dropdown__span--select">Select</span>
										) : (
											<span class="ui-dropdown__span ui-dropdown__span--icon" tabindex="0">
												<img alt="" src={this.iconheader}></img>
												<span>{this.header}</span>
											</span>
										)
									) : (
										<span class={{ 'placeholder-style': true, 'bold-text': this.boldtext }}>{this.header}</span>
									)}{' '}
									{!this.opened ? (
										<i class="control-select c-tab-icon u-icon icon-chevron-down icon-style"></i>
									) : (
										<i class="control-select c-tab-icon u-icon icon-chevron-top icon-style"></i>
									)}{' '}
								</button>
							)}

							<div
								class={{
									'custom-options': !this.noborders,
									'custom-options-noborder': this.noborders,
									'custom-options--loading': this._isloading,
								}}
							>
								{this._isloading ? (
									<scib-ui-loading></scib-ui-loading>
								) : (
									this.dropdownOptionsListArray.map(elem =>
										elem.active ? (
											elem.icon ? (
												<button
													class="custom-option ui-dropdown__span--icon selected"
													data-value={elem.id}
													onClick={e => {
														e.preventDefault();
														this.handleOption(elem);
													}}
													tabindex="0"
													aria-expanded="false"
												>
													<img alt="" src={elem.icon}></img>
													<span>{elem.label}</span>
												</button>
											) : (
												<button
													class={{
														'custom-option selected': true,
														'ui-dropdown__option--wordbreak': this.wordBreakOpt,
													}}
													data-value={elem.id}
													onClick={e => {
														e.preventDefault();
														this.handleOption(elem);
													}}
													tabindex="0"
													aria-expanded="false"
												>
													{elem.label}
												</button>
											)
										) : this.iconheader != '' && this.iconheader != null && this.header === elem.label ? (
											<button
												class="custom-option ui-dropdown__span--icon selected"
												data-value={elem.id}
												onClick={e => {
													e.preventDefault();
													this.handleOption(elem);
												}}
												tabindex="0"
												aria-expanded="false"
											>
												<img alt="" src={elem.icon}></img>
												<span class={{ 'ui-dropdown__option--wordbreak': this.wordBreakOpt }}>{elem.label}</span>
											</button>
										) : elem.icon ? (
											<button
												class="custom-option ui-dropdown__span--icon"
												data-value={elem.id}
												onClick={e => {
													e.preventDefault();
													this.handleOption(elem);
												}}
												tabindex="0"
												aria-expanded="false"
											>
												<img alt="" src={elem.icon}></img>
												<span class={{ 'ui-dropdown__option--wordbreak': this.wordBreakOpt }}>{elem.label}</span>
											</button>
										) : (
											<button
												class={{ 'custom-option': true, 'ui-dropdown__option--wordbreak': this.wordBreakOpt }}
												data-value={elem.id}
												onClick={e => {
													e.preventDefault();
													this.handleOption(elem);
												}}
												tabindex="0"
												aria-expanded="false"
											>
												{elem.label}
											</button>
										),
									)
								)}
							</div>
						</div>
						{this.error && this.error !== '' && <span class="c-error-msg">{this.error}</span>}
					</div>

					{this.enableitemaddition && !this._openAddition && (
						<scib-ui-button
							iconLeft
							icon="icon-folder_new"
							link
							onClick={e => {
								e.preventDefault();
								document.querySelector('#dr' + this.idselect).classList.remove('open');
								this.opened = false;
								this._selecteditem = {
									label: '',
									id: '',
								};
								this.handleOpenAdditionBox();
							}}
							class={{
								'ui-dropdown__add-item-btn': true,
								'ui-dropdown__add-item-btn--noMinHeight': this.noMinHeight,
							}}
						>
							{this._literals.addItemLabel}
						</scib-ui-button>
					)}

					{this.enableitemaddition && this._openAddition && (
						<div
							class={{
								'ui-dropdown__input-item': true,
								'ui-dropdown__input-item--small': this.small,
								'ui-dropdown__input-item--medium': this.medium,
								'ui-dropdown__input-item--large': this.large,
							}}
						>
							<scib-ui-input
								type="text"
								placeholder={this._literals.inputPlaceholder}
								label={this._literals.itemInputLabel}
								required
								multiselect={false}
								onEventFormChange={e => {
									e.stopPropagation();
									this.eventFormChange.emit({
										name: this.name,
										value:
											e.detail.value && e.detail.value !== ''
												? { id: e.detail.value.replace(/\s+/g, ''), label: e.detail.value }
												: undefined,
										required: this._required,
										stepPosition: this.stepPosition,
									});
								}}
								onEventChange={e => {
									e.stopPropagation();
									const idGenerated = e.detail.value ? e.detail.value.replace(/\s+/g, '') : '';
									this.selectValue.emit({ id: idGenerated, label: e.detail.value, active: true });
								}}
							></scib-ui-input>
							<scib-ui-button
								icon="icon-delete"
								link
								hideTxt
								onClick={e => {
									e.preventDefault();
									this.handleCloseAdditionBox();
									this._selecteditem = undefined;
									this.eventFormChange.emit({
										name: this.name,
										value: this._selecteditem,
										required: this._required,
										stepPosition: this.stepPosition,
									});
								}}
							></scib-ui-button>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
