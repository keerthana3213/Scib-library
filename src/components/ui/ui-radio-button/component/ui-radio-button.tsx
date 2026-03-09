import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { parseProp as _parseProp, generateRandomId } from '../../../../utils/public_api';
import { ICDKActionMenu, IURadioButton } from '../models/ui-radio-button.model';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-radio-button',
	styleUrl: 'ui-radio-button.scss',
	shadow: false,
	scoped: true
})
export class UIRadioButton {
	/** Boolean to activate 14px-radiobutton styles */
	@Prop({ reflect: false }) extraSmall: boolean;

	/** Boolean to active 32px-radiobutton styles*/
	@Prop({ reflect: false }) bigSize: boolean;

	/** The property defines the name reference of the radio button group. */
	@Prop({ reflect: true }) groupName: string;

	@Prop({ reflect: true }) idRadio: string;

	/** Activating this property changes the display of the component (Cards mode) */
	@Prop({ mutable: true, reflect: false }) isRadioCard: boolean;

	/** Tooltip text shown on disabled option hover */
	@Prop({ mutable: true, reflect: false }) tooltipText?: string;

	/** Set up sub-label on vertical middle align */
	@Prop({ reflect: false }) subLabelAlignMiddle: boolean = false;

	/** Column display of the radio-button list */
	@Prop() showInColumn: boolean = false;

	/** (Optional) The property defines the unique identifier of the root node in order to be able to access the HTML node. */
	@Prop() idRootNode: string = (new Date().getTime() + Math.floor(generateRandomId() * 1000)).toString();

	/** The property indicates the position of the active radio button. */
	@Prop({ reflect: true }) activeButtonIndex: number = 0;
	@Watch('activeButtonIndex') setActiveButton(newVal: number) {
		this._activeButtonIndex = newVal;
		this._options.forEach((item) => {
			item.isChecked = false;
		});
		if (this._activeButtonIndex >= 0 && this._options && this._options.length > 0) {
			this._options[this._activeButtonIndex].isChecked = true;
			this.setOption(this._activeButtonIndex);
		}
	}
	@State() _activeButtonIndex: number;

	/** Opciones para los botones */
	@Prop({ mutable: true, reflect: true }) options: string | IURadioButton[];

	@State() _options: IURadioButton[];

	@Watch('options') parseOptions(newVal: string | IURadioButton[]) {
		this._options = _parseProp(newVal);
		if (this._activeButtonIndex >= 0 && this._options && this._options.length > 0) {
			this._options[this._activeButtonIndex].isChecked = true;
		}
	}

	/** Porpiedad que define el string con el cual se va a realizar un filtrado
	 * de los items del listado
	 */
	@Prop({ mutable: true, reflect: true }) changeFilter: string;

	@Watch('changeFilter') onChnageFilterOptions(newVal: string) {
		this.filterOptions(newVal);
	}

	/** Opciones para los botones */
	@Prop({ mutable: true, reflect: true }) actionMenu: string | ICDKActionMenu;
	@Watch('actionMenu') parseActionMenu(newVal: string | ICDKActionMenu) {
		this._actionMenu = _parseProp(newVal);
	}
	@State() _actionMenu: ICDKActionMenu;

	@State() _totalItems: number;

	@Event() changeTotalItems: EventEmitter<number | string>;

	/** Emite al setear el radio button activo (incluído al inicio si no hay una) */
	@Event() eventRadioButtonChange: EventEmitter<IURadioButton>;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventFormChange: EventEmitter;

	/** Evento emitido al hacer click en alguna opción del action menu*/
	@Event() eventActionMenuSelect: EventEmitter;

	componentWillLoad() {
		this.parseOptions(this.options);
		this.parseActionMenu(this.actionMenu);
		let checkedIndex = this.activeButtonIndex;
		if (checkedIndex === 0) {
			const index = this._options.findIndex((option) => option.isChecked);
			checkedIndex = index > -1 ? index : 0;
		}
		this.setActiveButton(checkedIndex || this.activeButtonIndex);
		if (this._options && this._options.length > 0) {
			this._options[checkedIndex].isChecked = true;
		}
	}

	componentDidLoad() {
		this.eventFormChange.emit({
			name: this.groupName,
			value: this._options[this._activeButtonIndex]
		});
	}

	setOption(option: number) {
		if (option !== this._activeButtonIndex) {
			this._activeButtonIndex = option;
			if (this._options && this._options.length > 0) {
				this._options[this._activeButtonIndex].isChecked = true;
			}

			this.eventRadioButtonChange.emit(this._options[this._activeButtonIndex]);

			this.eventFormChange.emit({
				name: this.groupName,
				value: this._options[this._activeButtonIndex]
			});
		}
	}

	openActionMenu(idOpen, index) {
		this.eventActionMenuSelect.emit({
			id: idOpen,
			eventId: 'set_priority',
			index
		});
	}

	filterOptions(newVal: string) {
		const listItems = document.getElementById(this.idRootNode).getElementsByTagName('div');
		this._totalItems = 0;

		Array.from(listItems)?.map((res) => {
			if (res?.dataset?.id?.toLowerCase().indexOf(newVal.toLowerCase()) > -1) {
				res.style.display = '';
				this._totalItems++;
			} else {
				res.style.display = 'none';
			}
		});

		this.changeTotalItems.emit(this._totalItems);
	}

	render() {
		return (
			<Host>
				<div
					class={{
						'ui-radio': true,
						'ui-radio--big': this.bigSize,
						'ui-radio--xs': this.extraSmall,
						'ui-radio--card': this.isRadioCard,
						'ui-radio--columns': this.showInColumn
					}}
					id={this.idRootNode}
				>
					{!this.isRadioCard
						? this._options?.map((option, index) =>
								!!this.tooltipText?.length ? (
									<div class="ui-radio__container">
										<label class="ui-radio__element" htmlFor={this.idRadio ? this.idRadio + '-' + option.id : option.id}>
											<scib-ui-info-tooltip text={this.tooltipText} hide={!option.disabled} hover={true}>
												<input
													class={{ 'ui-radio__input': true, 'ui-radio__input--selected': option.isChecked }}
													type="radio"
													checked={option.isChecked}
													name={this.groupName}
													id={this.idRadio ? this.idRadio + '-' + option.id : option.id}
													value={option.value}
													disabled={option.disabled}
													onClick={() => this.setOption(index)}
												/>
												<span
													class={{
														'ui-radio__title': true,
														'ui-radio__title--selected': option.isChecked,
														'ui-radio__title--disabled': option.disabled
													}}
												>
													{option.label}
												</span>
												{option.subLabel && (
													<span class={{ 'ui-radio__sub-label': true, 'ui-radio__sub-label--selected': option.isChecked }}>
														&nbsp;{option.subLabel}
													</span>
												)}
											</scib-ui-info-tooltip>
										</label>
									</div>
								) : (
									<div class="ui-radio__container" data-id={option.label}>
										<label
											class={{
												'ui-radio__element': true,
												'ui-radio__element--ellipsis': this._actionMenu?.options?.length > 0 && !option.dontShowIsPredefined
											}}
											htmlFor={this.idRadio ? this.idRadio + '-' + option.id : option.id}
										>
											<input
												class={{ 'ui-radio__input': true, 'ui-radio__input--selected': option.isChecked }}
												type="radio"
												checked={option.isChecked}
												name={this.groupName}
												id={this.idRadio ? this.idRadio + '-' + option.id : option.id}
												value={option.value}
												disabled={option.disabled}
												onClick={() => this.setOption(index)}
											/>
											<span
												class={{
													'ui-radio__title': true,
													'ui-radio__title--selected': option.isChecked,
													'ui-radio__title--disabled': option.disabled,
													'ui-radio__title--ellipsis': this._actionMenu?.options?.length > 0
												}}
											>
												{option.label}
											</span>
											{option.subLabel && (
												<span
													class={{
														'ui-radio__sub-label': true,
														'ui-radio__sub-label--selected': option.isChecked,
														'ui-radio__sub-label--align-middle': this.subLabelAlignMiddle
													}}
												>
													{option.subLabel}
												</span>
											)}
										</label>
										{this._actionMenu?.options?.length > 0 && !this._options[index]?.dontShowIsPredefined && (
											<scib-ui-button
												icon={!this._options[index].isPredefined ? 'icon-marcador_off-24' : 'icon-marcador_on-24'}
												class={{
													'ui-radio__action-btn': !this._options[index].isPredefined && this._actionMenu.hover
												}}
												hideTxt
												small
												link
												onClick={() => {
													this.openActionMenu(option.id, index);
												}}
											/>
										)}
									</div>
								)
						  )
						: this._options?.map((option, index) =>
								!!this.tooltipText?.length ? (
									<label class={{ 'ui-radio__element': true, 'ui-radio__element--disabled': option.disabled }} htmlFor={option.id}>
										<scib-ui-info-tooltip text={this.tooltipText} hide={!option.disabled} hover={true}>
											<div class={{ 'ui-radio__card': true, 'ui-radio__card--disabled': option.disabled }}>
												<input
													class="ui-radio__input"
													type="radio"
													checked={option.isChecked}
													name={this.groupName}
													id={option.id}
													value={option.value}
													disabled={option.disabled}
													onClick={() => this.setOption(index)}
												/>
												<span class={{ 'ui-radio__title': true, 'ui-radio__title--disabled': option.disabled }}>
													{option.label}
												</span>
												<p class="ui-radio__txt">{option.description}</p>
												<ul class="ui-radio__list">
													{option.list?.map((items) => (
														<li class="ui-radio__txt ui-radio__txt--nomrg">{items}</li>
													))}
												</ul>
											</div>
										</scib-ui-info-tooltip>
									</label>
								) : (
									<label class={{ 'ui-radio__element': true, 'ui-radio__element--disabled': option.disabled }} htmlFor={option.id}>
										<div class={{ 'ui-radio__card': true, 'ui-radio__card--disabled': option.disabled }}>
											<input
												class="ui-radio__input"
												type="radio"
												checked={option.isChecked}
												name={this.groupName}
												id={option.id}
												value={option.value}
												disabled={option.disabled}
												onClick={() => this.setOption(index)}
											/>
											<span class={{ 'ui-radio__title': true, 'ui-radio__title--disabled': option.disabled }}>
												{option.label}
											</span>
											<p class="ui-radio__txt">{option.description}</p>
											<ul class="ui-radio__list">
												{option.list?.map((items) => (
													<li class="ui-radio__txt ui-radio__txt--nomrg">{items}</li>
												))}
											</ul>
										</div>
									</label>
								)
						  )}
				</div>
			</Host>
		);
	}
}
