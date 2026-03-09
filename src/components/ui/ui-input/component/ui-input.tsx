import { MDCMenuSurface } from '@material/menu-surface';
import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { copyToClipboard } from '../../../../utils/helpers/common';
import { UIInputOption } from '../fragments/ui-input-option.fragment';
import { UIInputSkeleton } from '../fragments/ui-input-skeleton.fragment';
import { IUIInputOption } from '../models/ui-input.model';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-input',
	styleUrl: 'ui-input.scss',
	shadow: false,
	scoped: true
})
export class UIInput {
	$input!: HTMLInputElement;
	$inputSearch!: HTMLInputElement;
	$menuSurfaceElement!: HTMLElement;
	$buttonCopy!: HTMLElement;
	_debouncer: any;
	_menuSurfaceInstance: MDCMenuSurface;
	$iconButton!: HTMLElement;
	inputFocused: boolean;

	/** Eliminar el min-height del input */
	@Prop({ reflect: false }) noMinHeight: boolean;

	/** Variante del estilo del input como 'línea' */
	@Prop({ reflect: false }) asInline: boolean;

	/** Establece el input como tipo "autocomplete" */
	@Prop({ reflect: false }) autocomplete: boolean;

	/** Establece el input a tamaño medio */
	@Prop({ reflect: false }) medium: boolean;

	/** Establece el input a tamaño pequeño */
	@Prop({ reflect: false }) small: boolean;

	/** Set up font size for input to large */
	@Prop({ reflect: false }) inputTextLarge: boolean;

	/** Fix text overlapping  on right icon */
	@Prop({ reflect: false }) limitInputText: boolean = false;

	/** Set up styles for communication framework search input */
	@Prop({ reflect: false }) communicationSearch: boolean;

	/**
	 * Input Type
	 * *In html 5 there are multiple valid types for different data formats
	 * * ·Text - text: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
	 * * ·Password - pasdword: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
	 * * ·Date - date || datetime-local: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date ||
	 * * 	https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
	 * * ·Email - email: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
	 * * ·Number - number: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
	 * * ·Time - time: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
	 * * ·Checkbox -checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
	 * * ·Image - image: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image
	 * * ·Phone number - tel: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel
	 */
	@Prop({ reflect: false }) type: string = 'text';

	/** Propiedad que alamcena un patrón de validación del formato que se introduce en el input */
	@Prop({ reflect: false }) pattern: string;

	/** Boolean to activate the configuration of the simple search input, which can be seen in the story "Search" */
	@Prop({ mutable: true, reflect: false }) searchSimple: boolean;

	/** Permite añadir varios valores. */
	@Prop({ reflect: false, mutable: true }) multiselect: boolean = true;

	/** Valor por defecto del campo. */
	@Prop({ reflect: false, mutable: true }) value: string | string[];

	@Watch('value') parseValue(newVal: string | string[]) {
		this.eventFormChange.emit({
			name: this.name,
			value: newVal,
			required: this.required,
			stepPosition: this.stepPosition
		});
	}

	/** Tooltip position */
	@Prop({ reflect: true, mutable: true }) infoTooltipPosition: string;

	/** Valor del error */
	@Prop({ reflect: false }) error: string;

	/** Valor del error */
	@Prop({ mutable: true, reflect: false }) hiddenError: boolean;

	/** Valores del campo @multiselectOnly */
	@State() _multiValue: string[];

	/** Opciones para el autocompletar @autocompleteOnly */
	@Prop({ reflect: false }) options: string | IUIInputOption[];

	@State() _options: IUIInputOption[] = [];

	@Watch('options') parseOptions(newVal: string | IUIInputOption[]) {
		if (typeof newVal === 'string') {
			try {
				this._options = JSON.parse(newVal);
			} catch (e) {
				console.error(e);
			}
		} else {
			this._multiselectedItems?.map((selectedItem) => {
				{
					newVal.map((option) => {
						option.value == selectedItem.value ? (option.isSelected = true) : null;
					});
				}
			});
			this._options = newVal || [];
		}
		if (!this.automaticOpen && (this._options?.length > 0 || this._loading)) {
			this.openOptionsSurface();
		} else {
			// this.closeOptionsSurface();
		}
	}

	/** Controla si abre automaticamente el desplegable al ACTUALIZAR el array de opciones.
	 * Valor por defecto: true
	 */
	@Prop({ reflect: false }) automaticOpen: boolean = true;

	/** Título de las opciones para el autocompletar @autocompleteOnly */
	@Prop({ reflect: false }) optionsTitleTxt: string;

	/** Shows a tooltip when the text has ellipsis */
	@Prop({ reflect: false }) showLabelTooltip: boolean;

	/** Label. */
	@Prop({ reflect: false }) label: string;

	/** Capitalize label */
	@Prop() capitalizeLabel: boolean = false;

	/** Placeholder */
	@Prop({ reflect: false }) placeholder: string;

	/** Step Position for wizard modal form when required */
	@Prop({ reflect: true }) stepPosition?: number;

	@Prop({ reflect: false }) isCDKSignatureModal?: boolean = false;

	/** Required */
	@Prop({ reflect: false }) required: boolean | number;

	/** Límite minimo del valor del input */
	@Prop({ reflect: false }) minValueLimit: number;

	/** Límite máximo de valor del input */
	@Prop({ reflect: false }) maxValueLimit: number;

	/** Límite minimo de caracteres */
	@Prop({ reflect: false }) minCharLimit: number;

	/** Límite máximo de caracteres */
	@Prop({ reflect: false }) charLimit: number;

	/** Limite de caracteres */
	@Prop({ mutable: true, reflect: false }) charCounter: number = 0;

	/** Dont displays the character counter */
	@Prop({ reflect: false }) hideCharCounter: boolean = false;

	/** Mínimo de caracteres */
	@Prop({ mutable: true, reflect: false }) charMin: number;

	/** Name */
	@Prop({ reflect: false }) name: string;

	/** ID  */
	@Prop({ reflect: false }) idInput: string;

	/** Icono interno derecho */
	@Prop({ reflect: false }) iconInnerRight: string;

	/** The text that is gonna display inside the info tooltip */
	@Prop({ reflect: false }) infoTooltipText: string;

	/** Tiempo hasta que el evento de Change es emitido */
	@Prop({ reflect: false }) debounceTime: number = 0;

	/** Datos por defecto para el input */
	@Prop({ reflect: false }) defaultData: boolean;

	/** Indica si el input estará deshabilitado para posibles modificaciones */
	@Prop({ reflect: false }) disableEdit: boolean;

	/** Loading text alternative */
	@Prop({ reflect: false }) accessibleLoading: string = 'Loading info...';

	/** Loading skeleton view box size */
	@Prop({ reflect: true }) viewBoxSkeleton: string = '0 0 334 150';

	/** Indicates if text is visible or hidden on input type password */
	@Prop({ reflect: false }) viewPassword: boolean = true;

	/** Label info of button depending of iconInnerRight's value */
	@Prop({ mutable: true, reflect: false }) labelButton: string;

	/** Label icon of input*/
	@Prop({ reflect: false }) iconLabel: boolean = false;

	/** Copy icon of input*/
	@Prop({ reflect: false }) copyInfo: boolean = false;

	/** Enable this prop for search input */
	@Prop({ reflect: false }) searchInput: boolean = false;

	/** String to indicate that there are no matches with the search engine */
	@Prop({ mutable: true, reflect: false }) noResult: string;

	/** Show if iconInnerRight has value or not */
	@Prop({ mutable: true, reflect: false }) noIconRight: boolean;
	@Watch('noIconRight') handleNoIcon(val: boolean) {
		this.noIconRight = val;
	}

	/** Change status of loading on input @autocompleteOnly */
	@Prop() loading: boolean = false;

	@State() _loading: boolean;

	@State() _navigatorAutocompleteOff: boolean = true;

	@Watch('loading') changeLoading(newVal: boolean) {
		this._loading = newVal;

		if (!this.automaticOpen && (this._options?.length > 0 || this._loading)) {
			this.openOptionsSurface();
		}
	}

	/** Field is password field */
	@Prop({ mutable: false, reflect: true }) isPasswordField: boolean = false;

	/**  */
	@Prop({ reflect: false, mutable: true }) iconDisplay: string;

	/** */
	@Prop({ reflect: false, mutable: true }) decreaseInputWidth: boolean;

	@State() _clearSearch: boolean;

	@State() _hasSearchValue: boolean;

	@State() _multiselectedItems: IUIInputOption[] = [];

	/** Evento emitido al cambiar el valor */
	@Event() eventInputChange: EventEmitter;

	/** Evento emitido al cambiar el valor y que envia la opcion seleccionada */
	@Event() eventSendOptionWhenInputChange: EventEmitter;

	/** Evento emitido al pegar el valor */
	@Event() eventPaste: EventEmitter;

	/** Evento emitido al cambiar el valor */
	@Event() eventChange: EventEmitter;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventFormChange: EventEmitter;

	/** Evento emitido al cambiar el valor de array de elementos @multiselectOnly */
	@Event() listEventChange: EventEmitter;

	/** Event emitted when focus change */
	@Event() focusCheckedEmitter: EventEmitter;

	/** Estado del control (dirty,touched) */
	@Event() statusControl: EventEmitter;

	/** Escucha los eventos de tecla */
	@Listen('keydown', { target: 'document' }) handleKeyDown(ev: KeyboardEvent) {
		if (ev.key === 'Enter') {
			if (this.$inputSearch === document.activeElement) {
				this.setFirstOption();
			}
		}
		if (ev.key === 'Backspace') {
			if (this.$inputSearch === document.activeElement && this.$inputSearch.value.length == 0) {
				this.handleRemoveItem(this._multiselectedItems.length - 1);
			}
		}
	}

	/** Lanza el estado dirty del input */
	@Listen('focus', { capture: true }) handleFocus() {
		this.handleClick();
	}

	/** Cierra la lista autocomplete cuando pierde el focus */
	@Listen('blur', { capture: true }) handleBlur(ev: Event) {
		this._status.name = this.name;
		this._status.touched = true;
		this.statusControl.emit(this._status);
		if (!ev['relatedTarget'] || !ev['relatedTarget'].className.includes('sc-scib-ui-input')) {
			this.closeOptionsSurface();
		}
	}

	@Listen('resetInputValue', { target: 'window' }) resetInputValue({ detail }: CustomEvent) {
		if (detail.id) {
			if (detail.id === this.idInput && detail.reset) {
				this.resetOptions();
				this.handleClear();
				if (this._options.length) {
					this._options.map((option) => {
						option.isSelected = false;
					});
				}
			}
		} else {
			if (detail.reset && this._options.length) {
				this.resetOptions();
				this.handleClear();
				this._options.map((option) => {
					option.isSelected = false;
				});
			}
		}
	}

	componentWillLoad() {
		this.parseOptions(this.options);
		this.changeLoading(this.loading);
		this.handleNoIcon(this.noIconRight);
		this.labelButton = 'clear';
		if (this.searchInput) {
			this.noIconRight = false;
			this.multiselect = false;
		}
		if (!this.autocomplete && !this.searchSimple && this.noIconRight === undefined) {
			this.noIconRight = true;
		}
		if (this.noIconRight === undefined) {
			this.noIconRight = !this.iconInnerRight;
		}
		if (this.defaultData) {
			this.setFirstOption();
		}
		this.eventFormChange.emit({
			name: this.name,
			value: this.value,
			required: this.required,
			stepPosition: this.stepPosition
		});

		if (this.iconInnerRight === 'icon-open-eye' && !this.noIconRight) {
			this.type = 'password';
		}
		this.hiddenError = true;
	}

	componentDidLoad() {
		this.initSurface();
		setTimeout(() => {
			this._navigatorAutocompleteOff = false;
		}, 800);
	}

	/** Maneja el cambio en el input */
	handleEventChange() {
		if (this._debouncer) clearTimeout(this._debouncer);
		this._debouncer = setTimeout(() => {
			this.value = this.$input.value;
			this.charCounter = this.value.length || 0;
			this.eventChange.emit(this.$input.value);
			this.eventFormChange.emit({
				name: this.name,
				value: this.$input.value,
				required: this.required,
				stepPosition: this.stepPosition
			});
		}, this.debounceTime);
		this.charCounter = this.$input.value.length || 0;
	}

	/** Maneja el pegado en el input */
	handleEventPaste() {
		if (this._debouncer) clearTimeout(this._debouncer);
		this._debouncer = setTimeout(() => {
			this.value = this.$input.value;
			this.eventPaste.emit(this.$input.value);
		}, this.debounceTime);
	}

	/** Datos a enviar en el evento submit */
	@State() _status: any = {
		name: '',
		touched: false,
		dirty: false
	};

	/** Maneja el click en el input @autocompleteOnly y no es @multiselectOnly */
	handleClick() {
		this._status.name = this.name;
		this._status.dirty = true;
		this.statusControl.emit(this._status);
	}

	/** Maneja el cambio en el input @autocompleteOnly y no es @multiselectOnly */
	handleValueEventChange() {
		this.eventInputChange.emit(this.value);
	}

	/** Maneja cambios en el input  @multiselectOnly */
	handleMultiValueEventChange() {
		const newArray = this._multiselectedItems.map((item) => {
			return item.value;
		});
		this.value = newArray;
		this.listEventChange.emit(newArray);
	}

	/** Active emitter when focus/blur has detected */
	focusChecked(value: boolean): void {
		this.focusCheckedEmitter.emit(value);
		if (this.$iconButton) {
			if (value) {
				this.iconDisplay = 'icon-block';
				this.decreaseInputWidth = true;
			} else {
				this.iconDisplay = 'icon-hidden';
				this.decreaseInputWidth = false;
			}
		} else {
			this.decreaseInputWidth = false;
		}
		this.inputFocused = value;
	}

	mouseOver(value: boolean): void {
		if (this.$iconButton) {
			if (!value && !this.inputFocused) {
				this.iconDisplay = 'icon-hidden';
				this.decreaseInputWidth = false;
			} else {
				this.iconDisplay = 'icon-block';
				this.decreaseInputWidth = true;
			}
		}
	}

	/** Maneja la búsqueda de errores */
	handleClear() {
		if (this.multiselect) {
			this.value = [];
			this._multiselectedItems = [];
			this._options.map((option) => {
				option.isSelected = false;
			});
			this.handleMultiValueEventChange();
		} else {
			this.value = '';
			this.eventChange.emit(this.value);
			this.eventFormChange.emit({
				name: this.name,
				value: this.value,
				required: this.required,
				stepPosition: this.stepPosition
			});
			if (this.autocomplete) {
				this._options.map((option) => {
					option.isSelected = false;
				});
			}
		}
		if (this.searchInput) {
			this.value = '';
			this._clearSearch = true;
		}
		if (this.$inputSearch) {
			this.$inputSearch.value = '';
			this._hasSearchValue = false;
		}
	}

	/** Elimina el elemento selecionado @multiselectOnly */
	handleRemoveItem(elementIndex) {
		const newValueArray = [...this.value];
		const newNameArray = this._multiselectedItems;

		this._options.map((option, index) => {
			option.value == this._multiselectedItems[elementIndex].value ? (this._options[index].isSelected = false) : null;
		});

		newValueArray.splice(elementIndex, 1);
		this.value = [...newValueArray];

		newNameArray.splice(elementIndex, 1);
		this._multiselectedItems = [...newNameArray];

		this.handleMultiValueEventChange();
	}

	/** Inicializa la surface @autocompleteOnly */
	initSurface() {
		if (this.autocomplete) {
			this._menuSurfaceInstance = new MDCMenuSurface(this.$menuSurfaceElement);
			this._menuSurfaceInstance.setAnchorCorner(9);
			// this._menuSurfaceInstance.setAnchorMargin({bottom: 2});
			if (this.multiselect) {
				this.value = [];
			}
		}
	}

	/** Comprueba si una opción matchea con la búsqueda y la setea en el value @autocompleteOnly */
	setOptionFound(query: string) {
		const normalized = (string: string) =>
			string
				?.normalize('NFKD')
				?.replace(/[\u0300-\u036f]/g, '')
				?.toUpperCase()
				?.split(' ')
				?.join('') || string;
		const value = this._options?.find((option) => normalized(query) === normalized(option.name) && option.isSelected === true)?.value || '';
		this.value = value;
		if (value) {
			this.closeOptionsSurface();
		}
	}

	/** Comprueba si las opciones matchean con la búsqueda y las muestra en el listado */
	setOptionFilter(query: string) {
		const normalized = (string: string) =>
			string
				?.normalize('NFKD')
				?.replace(/[\u0300-\u036f]/g, '')
				?.toUpperCase()
				?.split(' ')
				?.join('') || string;

		this.resetOptions();
		this._options = this._options.filter((option) => {
			if (normalized(option.name).indexOf(normalized(query)) > -1) {
				return option;
			}
		});
	}

	resetOptions() {
		if (typeof this.options === 'string') {
			this._options = JSON.parse(this.options);
		} else {
			this._options = [...this.options];
		}
	}

	/** Abre la surface de opciones @autocompleteOnly */
	openOptionsSurface() {
		if (!this._menuSurfaceInstance?.isOpen() && this._options && this._options.length > 0) {
			this._menuSurfaceInstance.open();
		}
	}

	/** Abre la surface de opciones, incluyendo el item "no results" @searchSimple */
	openListSurface() {
		if (!this._menuSurfaceInstance?.isOpen() && this._options) {
			this._menuSurfaceInstance.open();
		}
	}

	/** Cierra la surface de opciones @autocompleteOnly */
	closeOptionsSurface() {
		if (this._menuSurfaceInstance?.isOpen()) {
			this._menuSurfaceInstance.close();
		}
	}

	/** Maneja los cambios en el "input" de búsqueda de opciones @searchSimple */
	handleSearchSimpleInputChanges(e: Event) {
		const queryValue = (e.target as HTMLInputElement).value;
		let queryValueLenght = (e.target as HTMLInputElement).value.length;
		this._hasSearchValue = Boolean(queryValue);
		if (queryValueLenght >= this.charMin) {
			this.openListSurface();
			this.setOptionFilter(queryValue);
			this.hiddenError = true;
		} else {
			this.closeOptionsSurface();
			this.hiddenError = false;
		}

		if (this._debouncer) clearTimeout(this._debouncer);
		this._debouncer = setTimeout(() => {
			this.eventChange.emit(queryValue);
			this.eventFormChange.emit({
				name: this.name,
				value: this.value
			});
		}, this.debounceTime);
	}

	/** Maneja los cambios en el "input" de búsqueda de opciones @autocompleteOnly */
	handleSearchInputChanges(e: Event) {
		const queryValue = (e.target as HTMLInputElement).value;
		this._hasSearchValue = Boolean(queryValue);

		queryValue ? this.openOptionsSurface() : this.closeOptionsSurface();

		// this.setOptionFound(queryValue);

		if (this._debouncer) clearTimeout(this._debouncer);
		this._debouncer = setTimeout(() => {
			this.eventChange.emit(queryValue);
			this.eventFormChange.emit({
				name: this.name,
				value: this.value,
				required: this.required,
				stepPosition: this.stepPosition
			});
		}, this.debounceTime);
	}

	/** Setea como valor la primera opción @autocompleteOnly */
	setFirstOption() {
		if (this.autocomplete && this._options && this._options.length > 0) {
			if (this.multiselect) {
				const firstOption = this._options.find((option) => {
					return option.isSelected === false;
				});
				if ((this._menuSurfaceInstance?.isOpen() || this._options.length === 1) && firstOption) {
					this._multiselectedItems = [...this._multiselectedItems, firstOption];
					if (this.$inputSearch) {
						this.$inputSearch.value = '';
					}
					this._options[0].isSelected = true;
					this.handleMultiValueEventChange();
				}
			} else {
				const firstOption = this._options[0];
				this.value = firstOption.value;
				this.$inputSearch.value = firstOption.name;
				this.$inputSearch.blur();
				this.closeOptionsSurface();
			}
		}
	}

	/** Maneja la selección de una opción @autocompleteOnly */
	handleSelectOption(selectedOption: IUIInputOption) {
		this.eventSendOptionWhenInputChange.emit(selectedOption);
		if (this.multiselect) {
			this._multiselectedItems = [...this._multiselectedItems, selectedOption];
			if (this.$inputSearch) {
				this.$inputSearch.value = '';
			}
			this.value = [...this.value, selectedOption.value];
			this.handleMultiValueEventChange();
		} else {
			this.value = selectedOption.value;
			this.$inputSearch.value = selectedOption.name;
			this.handleValueEventChange();
		}
		this.$inputSearch.blur();
		this.closeOptionsSurface();
		this._options.map((option) => {
			option.value == selectedOption.value ? (option.isSelected = true) : !this.multiselect ? (option.isSelected = false) : null;
		});
	}

	visibilityPassword() {
		this.viewPassword = !this.viewPassword;
		if (this.viewPassword) {
			this.type = 'password';
			this.iconInnerRight = 'icon-open-eye';
			this.labelButton = 'Show password';
		} else {
			this.type = 'text';
			this.iconInnerRight = 'icon-eye-hide';
			this.labelButton = 'Hide password';
		}
	}

	render() {
		const name = this.autocomplete ? this.name + '-search-input' : this.name;
		this.searchInput ? (this._clearSearch = false) : false;
		return (
			<Host>
				<div class={{ 'c-root': true, 'mdc-menu-surface--anchor': true, 'c-root--noMinHeight': this.noMinHeight }}>
					<label
						class={{
							'c-label': true,
							'--visually-hidden': !this.label,
							'c-label--capitalize': this.capitalizeLabel,
							'--no-tooltip': !this.showLabelTooltip && !this.copyInfo && !this.iconLabel
						}}
						htmlFor={this.idInput}
						onClick={(ev) => {
							ev.preventDefault();
						}}
					>
						{this.iconLabel && <span class="u-icon icon-size_refresh"></span>}

						<div class="c-label__text-wrapper" title={this.label || this.placeholder}>
							{this.label || this.placeholder}
						</div>

						{this.showLabelTooltip && (
							<scib-ui-info-tooltip
								tooltipPos={this.infoTooltipPosition ? this.infoTooltipPosition : null}
								text={this.infoTooltipText || this.label || this.placeholder}
							></scib-ui-info-tooltip>
						)}

						{this.copyInfo && (
							<scib-ui-button
								class="c-label__copy"
								link
								disableMinWidth
								labelSize
								disabled={!this.value}
								ref={(el) => (this.$buttonCopy = el as HTMLElement)}
								onClick={() => {
									let copied = copyToClipboard(
										this.value.toString(),
										this.value.toString().charAt(this.value.toString().search(/[^0-9a-zA-Z-_ ]+/))
									);
									if (copied) {
										let notcopy = this.$buttonCopy.querySelector('.icon-copy') as HTMLElement;
										let copy = this.$buttonCopy.querySelector('.icon-doc_ok') as HTMLElement;
										notcopy.style.display = 'none';
										copy.style.display = 'inline';
										setTimeout(function () {
											copy.style.display = 'none';
											notcopy.style.display = 'inline';
										}, 2000);
									}
								}}
							>
								{this.value ? (
									<span class="u-icon icon-copy c-label__copy--enabled"></span>
								) : (
									<span class="u-icon icon-copy c-label__copy--disabled"></span>
								)}
								<span class="u-icon icon-doc_ok"></span>
							</scib-ui-button>
						)}
					</label>
					<div
						class={{ 'c-field': true, 'c-field--disable': this.disableEdit }}
						onMouseOver={() => {
							this.mouseOver(true);
						}}
						onMouseOut={() => {
							this.mouseOver(false);
						}}
					>
						{this._multiselectedItems && this._multiselectedItems.length > 0 && (
							<input type="text" class="c-input --visually-hidden" name={this.name} value={this.value} />
						)}
						{this._multiselectedItems &&
							this._multiselectedItems.length > 0 &&
							this._multiselectedItems?.map((selectedItem, index) => (
								<div
									class={{
										'c-selected-user': true,
										'--without-btn': this.disableEdit
									}}
								>
									<span class="c-selected-name">{selectedItem.name}</span>
									{!this.disableEdit && (
										<button
											type="button"
											class={{
												'c-inner-icon u-icon icon-fill-clear --is-button': true,
												'--error': this.error && this.error !== ''
											}}
											onClick={() => this.handleRemoveItem(index)}
											arial-label="remove-item"
										></button>
									)}
								</div>
							))}
						{!this.autocomplete && !this.searchSimple && (
							<input
								class={{
									'c-input': true,
									'--visually-hidden': this.autocomplete,
									'--disable-edit': this.disableEdit,
									'--medium': this.medium,
									'--small': this.small,
									'--text-large': this.inputTextLarge,
									'--communication': this.communicationSearch,
									'decrease-input': this.decreaseInputWidth
								}}
								ref={(el) => (this.$input = el as HTMLInputElement)}
								autocomplete="off"
								disabled={this._navigatorAutocompleteOff || this.disableEdit}
								type={this.type}
								pattern={this.pattern ? this.pattern : null}
								placeholder={this.placeholder}
								name={this.name}
								id={this.idInput}
								aria-label={this.label}
								aria-hidden={this.autocomplete}
								onKeyUp={() => {
									if (!this.autocomplete) this.handleEventChange();
								}}
								onPaste={() => {
									this.handleEventPaste();
								}}
								onClick={() => {
									this.handleClick();
								}}
								required={!!this.required}
								min={this.minValueLimit ? this.minValueLimit : null}
								max={this.maxValueLimit ? this.maxValueLimit : null}
								minLength={this.minCharLimit ? this.minCharLimit : null}
								maxlength={this.charLimit ? this.charLimit : null}
								onBlur={() => {
									this.focusChecked(false);
								}}
								onFocus={() => {
									this.focusChecked(true);
								}}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										e.stopImmediatePropagation();
										e.stopPropagation();
									}
								}}
								value={this.value}
							/>
						)}
						{this.autocomplete && (
							<input
								class={{
									'c-input': true,
									'--visually-hidden': this.autocomplete,
									'--disable-edit': this.disableEdit,
									'--medium': this.medium,
									'--small': this.small,
									'--text-large': this.inputTextLarge
								}}
								ref={(el) => (this.$input = el as HTMLInputElement)}
								autocomplete="off"
								type={this.type}
								placeholder={this.placeholder}
								name={this.name}
								id={this.idInput}
								aria-label={this.label}
								aria-hidden={this.autocomplete}
								onKeyUp={() => {
									if (!this.autocomplete) this.handleEventChange();
								}}
								onClick={() => {
									this.handleClick();
								}}
								required={!!this.required}
								disabled={this.disableEdit}
								maxlength={this.charLimit ? this.charLimit : null}
								onBlur={() => {
									this.focusChecked(false);
								}}
								onFocus={() => {
									this.focusChecked(true);
								}}
								value={this.value}
							/>
						)}
						{!this.autocomplete && !this.searchSimple && !this.noIconRight ? (
							this.isPasswordField ? (
								<button
									type="button"
									class={{
										'c-inner-icon': true,
										'u-icon': true,
										[this.iconInnerRight]: true,
										'--is-button': true
									}}
									onClick={() => this.visibilityPassword()}
									arial-label={this.labelButton}
								></button>
							) : (
								<button
									ref={(el) => (this.$iconButton = el as HTMLElement)}
									type="button"
									class={{
										'c-inner-icon': true,
										'u-icon': true,
										[this.iconDisplay]: true,
										'icon-fill-clear': this.value && this.value.length > 0 ? true : false,
										[this.iconInnerRight]: !this.value || this.value.length === 0 ? false : true,
										'--is-button': true
									}}
									onClick={() => this.handleClear()}
									arial-label={this.labelButton}
								></button>
							)
						) : null}
						{this.autocomplete && !this.searchSimple && (
							<input
								autocomplete="off"
								ref={(el) => (this.$inputSearch = el as HTMLInputElement)}
								name={name}
								placeholder={this.placeholder}
								id={this.idInput}
								class={{
									'c-input': true,
									'--disable-edit': this.disableEdit,
									'--text-large': this.inputTextLarge
								}}
								onClick={() => {
									this.openOptionsSurface();
								}}
								onKeyUp={(e: Event) => this.handleSearchInputChanges(e)}
								disabled={this.disableEdit}
								onBlur={() => {
									this.focusChecked(false);
								}}
								onFocus={() => {
									this.focusChecked(true);
								}}
							/>
						)}

						{this.autocomplete && this.searchSimple && (
							<input
								autocomplete="off"
								ref={(el) => (this.$inputSearch = el as HTMLInputElement)}
								name={name}
								placeholder={this.placeholder}
								id={this.idInput}
								class={{
									'c-input': true,
									'--disable-edit': this.disableEdit,
									'--text-large': this.inputTextLarge,
									'--limit-text': this.limitInputText,
									autocomplete: true
								}}
								onKeyUp={(e: Event) => this.handleSearchSimpleInputChanges(e)}
								disabled={this.disableEdit}
								minlength={this.charMin ? this.charMin : null}
								onBlur={() => {
									this.focusChecked(false);
								}}
								onFocus={() => {
									this.focusChecked(true);
								}}
								value={this.value ? this.value : null}
							/>
						)}
						{(this.iconInnerRight || this.searchInput) && !this.value && !this.searchSimple && (
							<span
								class={{
									'c-inner-icon': true,
									'u-icon': true,
									[this.iconInnerRight]: true,
									'icon-search': this.searchInput
								}}
							></span>
						)}

						{this.autocomplete && (this.value || this._hasSearchValue) && !this.disableEdit && !this.noIconRight ? (
							<button
								type="button"
								class={{
									'c-inner-icon': true,
									'u-icon': true,
									'icon-fill-clear':
										this.iconInnerRight !== 'icon-open-eye' &&
										this.iconInnerRight !== 'icon-hide-24' &&
										this.value &&
										this.value.length > 0
											? true
											: false,
									[this.iconInnerRight]:
										this.iconInnerRight !== 'icon-open-eye' &&
										this.iconInnerRight !== 'icon-hide-24' &&
										this.value &&
										this.value.length === 0
											? false
											: true,
									'--is-button': true
								}}
								onClick={() =>
									this.iconInnerRight !== 'icon-open-eye' && this.iconInnerRight !== 'icon-hide-24'
										? this.handleClear()
										: this.visibilityPassword()
								}
								arial-label={this.labelButton}
							></button>
						) : null}
					</div>
					{this.autocomplete && (
						<div
							class={{
								'mdc-menu-surface': true,
								'mdc-menu-surface--hidden': this._options.length === 0 && !this._loading && !this.noResult,
								'height-options': this.isCDKSignatureModal,
								'cancel-height-options': this.isCDKSignatureModal && this._options.length === 0
							}}
							ref={(el) => (this.$menuSurfaceElement = el as HTMLElement)}
						>
							{this.optionsTitleTxt && <p class="c-menu-title">{this.optionsTitleTxt}</p>}
							{this._loading ? (
								<div role="status" aria-busy="true" aria-live="polite">
									<figure class="mdc-menu-surface__loading">
										<UIInputSkeleton literalSkeleton={this.accessibleLoading} viewBox={this.viewBoxSkeleton}></UIInputSkeleton>
									</figure>
								</div>
							) : (
								<ul class="c-menu">
									{this._options?.length > 0 ? (
										this._options?.map(
											(option) =>
												!option.isSelected && (
													<li class="c-menu-item">
														<button
															onClick={() => this.handleSelectOption(option)}
															class="c-menu-item-button"
															type="button"
														>
															<UIInputOption option={option} />
														</button>
													</li>
												)
										)
									) : (
										<li
											class={{
												'c-menu-item': true,
												'c-menu-item--noResult': true,
												'cancel-height-options': this.isCDKSignatureModal
											}}
										>
											{this.noResult}
										</li>
									)}
								</ul>
							)}
						</div>
					)}
					{this.charLimit && !this.hideCharCounter ? (
						<span class="c-input__counter" innerHTML={`${this.charCounter} / ${this.charLimit}`}></span>
					) : null}
					{this.error && this.error !== '' && !this.searchSimple && <span class="c-error-msg">{this.error}</span>}
					{this.error && this.searchSimple && (
						<span class={{ 'c-error-msg': true, 'c-error-msg--hidden': this.hiddenError }}>{this.error}</span>
					)}
				</div>
			</Host>
		);
	}
}
