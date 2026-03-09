import { Component, Host, Prop, Event, EventEmitter, Element, State, Watch, Listen, h } from '@stencil/core';
import { UISelectSkeleton } from '../fragments/ui-select-skeleton.fragment';
import { UISelectOption } from '../fragments/ui-select-option.fragment';
import { IUISelectOption } from '../models/ui-select.model';
import { MDCMenuSurface } from '@material/menu-surface';
import { CheckboxValue } from '../../../ui-v2/ui-v2-checkbox/models/ui-v2-checkbox.model';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-select',
	styleUrl: 'ui-select.scss',
	shadow: false,
	scoped: true
})
export class UISelect {
	@Element() _hostRef: HTMLElement;

	/** Variante del estilo del input como 'línea' */
	@Prop({ reflect: true }) asInline: boolean;

	/** Establece el input como tipo "autocomplete" */
	@Prop({ reflect: true }) autocomplete: boolean;

	/** Establece el input como tipo "multiselect" como en la V2 de este componente */
	@Prop({ reflect: true }) multiselectV2: boolean = false;
	@Prop({ reflect: true }) selectAllMultiselectV2: boolean = false;
	@State() showMultiselectV2: boolean = false;

	/** Establece el input como tipo "addUser" */
	@Prop({ reflect: true }) addUser: boolean;

	/** Icono interno izquierdo */
	@Prop({ reflect: true }) iconLeftClasses: string = '';

	/** Type del <input> */
	@Prop({ reflect: true }) type: string = 'text';

	/** Permite añadir varios valores. */
	@Prop({ reflect: true }) multiselect: boolean = true;

	/** Valor por defecto del campo. */
	@Prop({ mutable: true, reflect: true }) value: string | string[];
	@Watch('value') parseValue(newVal: string | string[]) {
		this._value = newVal;
	}
	@State() _value: string | string[];

	@Prop({ reflect: true }) valueAutoComplete: {
		name: string;
		apply: boolean;
		detail: {
			[key: string]: any;
		};
		[key: string]: any;
	} = { name: '', apply: false, detail: { value: '' } };

	/** Valores del campo @multiselectOnly */
	@State() _multiValue: string[];

	/** Opciones para el autocompletar @autocompleteOnly */
	@Prop({ reflect: true }) options: string | IUISelectOption[];

	/** Añadir el min-height del input */
	@Prop({ reflect: true }) minHeight: boolean;

	@Watch('options') parseOptions(newVal: string | IUISelectOption[]) {
		if (typeof newVal === 'string') {
			try {
				this._options = JSON.parse(newVal);
				this._options.map((item) => {
					item.apply = typeof item.apply === 'boolean' ? item.apply : false;
				});
				if (this.backMode) {
					this.openOptionsSurface();
				}
			} catch (e) {
				console.error(e);
			}
		} else {
			newVal?.map((item) => {
				item.apply = typeof item.apply === 'boolean' ? item.apply : false;
			});
			this._multiselectedItems?.map((selectedItem) => {
				{
					newVal.map((option) => {
						option.value == selectedItem.value ? (option.isSelected = true) : null;
					});
				}
			});
			this._options = newVal || [];
			if (this.backMode) {
				this.openOptionsSurface();
			}
		}
		if (this.multiselectV2) {
			this.setMultiselectV2InitialOptionsValues();
		}
	}

	/** Título de las opciones para el autocompletar @autocompleteOnly */
	@Prop({ reflect: true }) optionsTitleTxt: string;

	/** Label. */
	@Prop({ reflect: true }) label: string;

	/** Placeholder */
	@Prop({ reflect: true }) placeholderSelect: string;

	/** Placeholder */
	@Prop({ reflect: true }) required: boolean;

	/** Name */
	@Prop({ reflect: true }) name: string;

	/** Id */
	@Prop({ reflect: true }) idSelect: string;

	/** Icono interno derecho */
	@Prop({ reflect: true }) iconInnerRight: string = '';

	/** Loading text alternative */
	@Prop({ reflect: true }) accessibleLoading: string = 'Loading info...';

	/** String to indicate that there are no matches with the search engine */
	@Prop({ mutable: true, reflect: false }) noResult: string;

	/** String to indicate that there are no matches with the search engine */
	@Prop({ mutable: true, reflect: false }) addNewUser: string;

	/** Evento emitido al cambiar el valor */
	@Event() eventChange: EventEmitter;

	/** Evento emitido al cambiar el valor de array de elementos @multiselectOnly */
	@Event() listEventChange: EventEmitter;

	@Event() eventAddUser: EventEmitter;

	/** Tiempo hasta que el evento de Change es emitido */
	@Prop({ reflect: true }) debounceTime: number = 0;

	/** Tiempo hasta que el evento de Change es emitido */
	@Prop({ reflect: true }) viewBoxSkeleton: string = '0 0 334 150';

	/** Change input cursor to default text */
	@Prop({ reflect: true }) textCursor: boolean = false;

	/** Change status of loading on input @autocompleteOnly */
	@Prop() loading: boolean = false;
	@Watch('loading') changeLoading(newVal: boolean) {
		this._loading = newVal;
	}

	@State() _allOptionsMultiselectV2Checked: CheckboxValue = 'unchecked';
	@State() _options: IUISelectOption[] = [];
	@State() _autocompleteSelectedOptions: IUISelectOption[];
	@State() _loading: boolean;
	@State() _hasSearchValue: boolean;
	@Prop({ mutable: true, reflect: true }) _multiselectedItems: IUISelectOption[] = [];
	@Prop({ mutable: true }) isSignatureModalManager?: boolean = false;

	@Event() selectedValue: EventEmitter;
	@Event() resetSelectValues: EventEmitter;
	/** Selected Item */
	@Prop({ reflect: true, mutable: true }) reset: boolean = false;
	@Watch('reset') resetList(bool: boolean) {
		if (bool) {
			const newArray = this._multiselectedItems;
			this._options.forEach((element) => {
				element.isSelected = false;
			});
			newArray.pop();
			this._multiselectedItems = [...newArray];
			this.setMultiselectV2InitialOptionsValues(bool);
			this.handleClear();
			this.handleSingleValueEventChange();
			this.reset = false;
			this.resetSelectValues.emit(this.reset);
		}
	}

	private selectedOption: IUISelectOption;

	@Listen('resetSelectInputValue', { target: 'window' }) resetInputSearchValue(isSelectedManagerRemoved?: boolean) {
		this.$inputSearch.value = '';
		if (isSelectedManagerRemoved) {
			this.resetOptions();
			this.handleClear();
			this._options.map((option) => {
				option.isSelected = false;
			});
		}
	}

	/**
	 *
	 */
	@State() multiselectV2OptionsStatus = [];

	/** Mostrar mensaje de error */
	@Prop({ reflect: true, mutable: true }) error: string;
	@Watch('error') changeerror(newVal: string) {
		this._error = newVal;
	}
	@State() _error: string;

	/** Deshabilitar */
	@Prop({ reflect: true, mutable: true }) disabled: boolean;
	@Watch('disabled') changedisabled(newVal: boolean) {
		this._disabled = newVal;
	}
	@State() _disabled: boolean;

	/** Habilitar openOptionsSurface cuando entre un array nuevo (prop options) */
	@Prop({ reflect: true, mutable: true }) openOptions: boolean = false;
	@Watch('openOptions') changeOpenOptions(newVal: boolean) {
		newVal ? this.openOptionsSurface() : this.closeOptionsSurface();
	}

	/** Habilitar modo back para que cuando el array de options llegue, se abra directamente el desplegable de las opciones */
	@Prop({ reflect: true, mutable: true }) backMode: boolean = false;

	/** Show extra info in options */
	@Prop() optionDetail?: boolean = false;
	@Watch('optionDetail') optionDetailHandler(newVal: boolean) {
		this._optionDetail = newVal;
	}
	@State() _optionDetail: boolean;

	$input!: HTMLInputElement;
	$inputSearch!: HTMLInputElement;
	$menuSurfaceElement!: HTMLElement;
	$multiselectV2Option!: HTMLElement;
	_debouncer: any;
	_menuSurfaceInstance: MDCMenuSurface;
	inputSearchValue: any;

	@Listen('mouseover', { target: 'document' }) handleMouseOver() {
		if (this._disabled && this.$inputSearch === document.activeElement) {
			this.$inputSearch.blur();
		}
	}

	/** Escucha los eventos de tecla */
	@Listen('keydown', { target: 'document' }) handleKeyDown(ev: KeyboardEvent) {
		if (this.disabled) {
			return;
		}
		if (ev.key === 'Enter') {
			if (this.$inputSearch === document.activeElement) {
				this.setFirstOption();
			}
		}
		if (ev.key === 'Backspace') {
			if (this.$inputSearch === document.activeElement && this.$inputSearch.value.length == 0) {
				const newArray = this._multiselectedItems;
				this._options[this._options.length - 1].isSelected = false;
				newArray.pop();
				this._multiselectedItems = [...newArray];
				this.handleMultiValueEventChange();
			}
		}
	}

	@Prop() removedPosition;
	@Watch('removedPosition')
	removePosition(newValue) {
		if (!newValue) {
			return;
		}
		this.handleRemoveItem(newValue);
	}

	componentWillLoad() {
		// this.parseOptions(this.options);
		this.changeLoading(this.loading);
		this.resetList(this.reset);
		this.changeerror(this.error);
		this.changedisabled(this.disabled);
		this.optionDetailHandler(this.optionDetail);
		this.parseValue(this.value);
	}

	componentDidLoad() {
		this.initSurface();
		this.parseOptions(this.options);
		this.changeOpenOptions(this.openOptions);
	}

	/** Maneja el cambio en el input */
	handleEventChange() {
		this._value = this.$input.value;
		this.valueAutoComplete.name = this.$input.name;
		if (this._debouncer) clearTimeout(this._debouncer);
		this._debouncer = setTimeout(() => {
			this.eventChange.emit(this.$input.value);
		}, this.debounceTime);
	}

	handleMultiValueEventChange() {
		if (this.valueAutoComplete.apply) {
			this.listEventChange.emit(this._value);
			return;
		}
		this.listEventChange.emit(this._multiselectedItems);
	}
	/** Maneja cambios en el input  @SingleSelectOnly */
	handleSingleValueEventChange() {
		if (this.valueAutoComplete.apply) {
			this.listEventChange.emit(this.valueAutoComplete.detail);
			return;
		}
	}

	/** Maneja la búsqueda de errores */
	handleClear() {
		if (this.multiselect) {
			this._value = [];
			this._multiselectedItems = [];
			this._options.map((option) => {
				option.isSelected = false;
			});
			this.handleMultiValueEventChange();
		} else {
			this._value = '';
			this.valueAutoComplete.name = '';
			this.eventChange.emit(this._value);
		}
		if (this.$inputSearch) {
			this.$inputSearch.value = '';
			this.valueAutoComplete.name = '';
			this._hasSearchValue = false;
		}
	}

	handleAddUserEvent() {
		this.eventAddUser.emit({ event: 'add-user' });
	}

	/** Elimina el elemento selecionado @multiselectOnly */
	handleRemoveItem(element) {
		if (!element) {
			return;
		}
		this._options.map((option, index) => {
			option.value == element.detail.value ? (this._options[index].isSelected = false) : null;
		});
		this.getMultiSelectedValues(element.detail);
		this.listEventChange.emit(this._multiselectedItems);
	}

	private getMultiSelectedValues(element: any) {
		if (element.value) {
			this._multiselectedItems = this._multiselectedItems.filter((user) => user.value !== element.value);
			return;
		}
		this._multiselectedItems = this._multiselectedItems.filter((user) => user.value !== element);
	}

	/** Inicializa la surface @autocompleteOnly */
	initSurface() {
		if (this.autocomplete) {
			this._menuSurfaceInstance = new MDCMenuSurface(this.$menuSurfaceElement);
			this._menuSurfaceInstance.setAnchorCorner(9);
			// this._menuSurfaceInstance.setAnchorMargin({bottom: 2});
			if (this.multiselect && !this.valueAutoComplete.apply) {
				this._value = [];
				this.valueAutoComplete.name = '';
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

		// const value =
		// 	this._options?.find(
		// 		option =>
		// 			normalized(query) === normalized(option.name) &&
		// 			option.isSelected === true
		// 	)?.value || "";

		// if (value) {
		// 	this.closeOptionsSurface();
		// }

		this.resetOptions();
		if (this.isSignatureModalManager && this.selectedOption) {
			this._options.map((option) => {
				if (option.id === this.selectedOption.id) {
					option.isSelected = true;
				} else {
					option.isSelected = false;
				}
			});
		}
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
		if (this._disabled) {
			this.$inputSearch.blur();
		}
		if (!this._disabled && !this._menuSurfaceInstance.isOpen() && ((this._options && this._options.length > 0) || this._loading)) {
			if (this.multiselectV2) {
				this.resetOptions();
				this.inputSearchValue = this.$inputSearch.value.length == 0 ? this.inputSearchValue : this.$inputSearch.value;
				this.$inputSearch.value = '';
			}
			this._menuSurfaceInstance.open();
		}
	}

	/** Cierra la surface de opciones @autocompleteOnly */
	closeOptionsSurface() {
		if (this._menuSurfaceInstance.isOpen()) {
			this._menuSurfaceInstance.close();
		}
	}

	/** Maneja los cambios en el "input" de búsqueda de opciones @autocompleteOnly */
	handleSearchInputChanges(e: Event) {
		const queryValue = (e.target as HTMLInputElement).value;
		this._hasSearchValue = Boolean(queryValue);

		// queryValue ? this.openOptionsSurface() : this.closeOptionsSurface();
		this.openOptionsSurface();
		if (!this.backMode) {
			this.setOptionFound(queryValue);
		}

		if (this._debouncer) clearTimeout(this._debouncer);
		this._debouncer = setTimeout(() => {
			this.eventChange.emit(queryValue);
		}, this.debounceTime);
		if (this.multiselectV2 && !this.showMultiselectV2) this.showMultiselectV2 = true;
	}

	/** Setea como valor la primera opción @autocompleteOnly */
	setFirstOption() {
		if (this.autocomplete && this._options && this._options.length > 0) {
			if (this.multiselect) {
				const firstOption = this._options.find((option) => {
					return option.isSelected === false;
				});
				if (this._menuSurfaceInstance.isOpen() && firstOption) {
					this._multiselectedItems = [...this._multiselectedItems, firstOption];
					if (this.$inputSearch) {
						this.$inputSearch.value = '';
					}
					this._options[0].isSelected = true;
					this.handleMultiValueEventChange();
				}
			} else {
				const firstOption = this._options[0];
				this._value = firstOption.value;
				this.valueAutoComplete.name = firstOption.name;
				this.valueAutoComplete.detail = { ...firstOption };
				this.$inputSearch.value = firstOption.name;
				this.$inputSearch.blur();
				this.closeOptionsSurface();
				this.handleSingleValueEventChange();
			}
		}
	}

	setMultiselectV2InitialOptionsValues(reset?: boolean) {
		let multiselectOptionsStatusAux = [];
		this._options.forEach((element, index) => {
			const optionInitialStatus = `{"${element?.id}": ""}`;
			multiselectOptionsStatusAux.push(JSON.parse(optionInitialStatus));
			multiselectOptionsStatusAux[index][element?.id] = false;
			if (this._value !== undefined && this._value.length && !reset) {
				const value: string = this._value as string;
				value?.split(', ').forEach((valueChecked) => {
					if (element?.label === valueChecked) {
						multiselectOptionsStatusAux[index][element?.id] = true;
					}
				});
			}
		});
		this.multiselectV2OptionsStatus = multiselectOptionsStatusAux;
	}

	/** Maneja la selección o deselección de todas las opciones del multiselect V2 */
	selectAllInMultiselectV2(event: any) {
		event.preventDefault();
		event.stopPropagation();
		const options = JSON.parse(this.options as string);
		options.forEach((element, index) => {
			this.multiselectV2OptionsStatus[index][element?.id] = this._allOptionsMultiselectV2Checked === 'checked' ? false : true;
		});
		if (this.multiselectV2OptionsStatus[0][this._options[0].id]) {
			this._allOptionsMultiselectV2Checked = 'checked';
		} else {
			this._allOptionsMultiselectV2Checked = 'unchecked';
		}
		this.$multiselectV2Option.click();
		this.obtainAndEmitValueMultiselectV2();
	}

	/** Maneja la selección de una opción del multiselect V2 */
	handleCheckboxChangeInMultiselectV2(optionId: string) {
		this.multiselectV2OptionsStatus.find((option) => option[optionId] !== undefined)[optionId] = !this.multiselectV2OptionsStatus.find(
			(option) => option[optionId] !== undefined
		)[optionId];

		const allSelected = Object.values(this.multiselectV2OptionsStatus).every((value) => JSON.stringify(value).includes('true'));
		const noneSelected = Object.values(this.multiselectV2OptionsStatus).every((value) => JSON.stringify(value).includes('false'));
		if (allSelected) {
			this._allOptionsMultiselectV2Checked = 'checked';
		} else if (noneSelected) {
			this._allOptionsMultiselectV2Checked = 'unchecked';
		} else {
			this._allOptionsMultiselectV2Checked = 'indeterminate';
		}
		this.obtainAndEmitValueMultiselectV2();
	}

	obtainAndEmitValueMultiselectV2() {
		let valueToEmit = [];
		let inputTextValue = '';
		const options = JSON.parse(this.options as string);
		options.forEach((element, index) => {
			if (this.multiselectV2OptionsStatus[index][element?.id]) {
				valueToEmit.push(element);
				inputTextValue += element.name + ', ';
			}
		});
		inputTextValue = inputTextValue.substring(0, inputTextValue.length - 2);
		this.$inputSearch.value = inputTextValue;
		this._value = inputTextValue;
		this.listEventChange.emit(valueToEmit);
	}

	closeFocusOutV2 = (element) => {
		document.addEventListener('click', (e) => {
			if (!element.contains(e.target)) {
				this.showMultiselectV2 = false;
				this.$inputSearch.value =
					this.$inputSearch.value.length == 0 && this._value && this._value?.length !== 0 ? this.inputSearchValue : this.$inputSearch.value;
			}
		});
	};

	/** Maneja la selección de una opción @autocompleteOnly */
	handleSelectOption(selectedOption: IUISelectOption, isSignatureModalManager: boolean) {
		this.selectedValue.emit(selectedOption);
		this.selectedOption = selectedOption;
		if (isSignatureModalManager) {
			this.$inputSearch.blur();
			this.closeOptionsSurface();
			this.resetOptions();
			this.handleClear();
			this._options.map((option) => {
				if (option.id === selectedOption.id) {
					option.isSelected = true;
				} else {
					option.isSelected = false;
				}
			});
		} else {
			if (this.multiselect) {
				this._multiselectedItems = [...this._multiselectedItems, selectedOption];
				if (this.$inputSearch) {
					this.$inputSearch.value = '';
				}
				this._value = this._value ? this._value : [];
				this._value = [...this._value, selectedOption.value];
				this.valueAutoComplete.name = selectedOption.name;
				this.handleMultiValueEventChange();
			} else {
				this._value = selectedOption.value;
				this.valueAutoComplete.name = this._value;
				this.valueAutoComplete.detail = { ...selectedOption };
				this.$inputSearch.value = selectedOption.value;
				this.handleSingleValueEventChange();
			}

			this.$inputSearch.blur();
			this.closeOptionsSurface();
			this.resetOptions();
			this._options.map((option) => {
				option.value == selectedOption.value ? (option.isSelected = true) : null;
			});
		}
	}

	private isEllipsed(clickedElement) {
		const list = document.getElementById(`ui-select${clickedElement.label}`); //ul element
		const elementsList = list.children; //li elements

		for (let i = 1; i < elementsList.length; i++) {
			const elementParent = elementsList[i] as HTMLElement; //li element
			const title = elementParent.firstChild ? (elementParent.firstElementChild as HTMLElement) : null; //button inside li element
			const element =
				title && title.firstElementChild && title.firstElementChild.children
					? (title.firstElementChild.children.namedItem('ui-select-option-text').firstElementChild as HTMLElement)
					: null; //p which shows data whith ellipsis (inside select-option-fragment)
			if (element && element.offsetWidth >= element.scrollWidth) {
				title.removeAttribute('title');
			}
		}
	}

	render() {
		const name = this.autocomplete ? this.name + '-search-select' : this.name;
		return (
			<Host
				onFocusout={() => {
					if (this.multiselectV2) {
						this.closeFocusOutV2(this._hostRef);
					}
				}}
			>
				<div class={{ 'c-root': true, 'mdc-menu-surface--anchor': true, 'c-root--minHeight': this.minHeight }}>
					<label class={{ 'c-label': true, '--visually-hidden': !this.label }} htmlFor={name}>
						{this.label}
					</label>
					<div
						onClick={() => {
							if (this.autocomplete) this.openOptionsSurface();
							if (this.multiselectV2) {
								this.showMultiselectV2 = true;
							}
						}}
						class={{
							'c-signature': this.isSignatureModalManager,
							'c-field': true,
							'c-field--hide-chevron': this.textCursor,
							'disabled-selector': this._disabled
						}}
					>
						{this.iconLeftClasses != '' ? <i class={this.iconLeftClasses}></i> : ''}
						<input
							class={{
								'c-select': true,
								'--visually-hidden': this.autocomplete,
								'displace-placeholder': this.iconLeftClasses != '',
								'--cursor-text': this.textCursor
							}}
							ref={(el) => (this.$input = el as HTMLInputElement)}
							autocomplete="off"
							type={this.type}
							placeholder={this.placeholderSelect}
							value={this._value}
							name={this.name}
							id={this.idSelect}
							aria-label={this.label}
							aria-hidden={this.autocomplete}
							onKeyUp={() => {
								if (!this.autocomplete) this.handleEventChange();
							}}
							required={this.required}
						/>
						{this.autocomplete && (
							<input
								class={{
									'c-signature-width': this.isSignatureModalManager,
									'c-select': true,
									'disabled-selector': this._disabled,
									'displace-placeholder': this.iconLeftClasses != '',
									'--cursor-text': this.textCursor
								}}
								autocomplete="off"
								value={this.valueAutoComplete.apply ? this._value : null}
								ref={(el) => (this.$inputSearch = el as HTMLInputElement)}
								name={name}
								placeholder={this.placeholderSelect}
								onClick={() => {
									this.openOptionsSurface();
									this.isEllipsed(this);
								}}
								onBlur={() => {
									this.$inputSearch.scrollLeft = 0;
								}}
								onKeyUp={(e: Event) => this.handleSearchInputChanges(e)}
							/>
						)}
						{this.iconInnerRight != '' ? <i class={this.iconInnerRight}></i> : ''}
					</div>
					{this.multiselectV2 && (
						<div>
							<div
								class={{
									'mdc-menu mdc-menu-surface': true,
									'mdc-menu--open': true,
									margin: true,
									'no-display': !this.showMultiselectV2
								}}
							>
								<ul class="mdc-list mdc-list--father" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
									<scib-ui-v2-scroll-container>
										<div class="mdc-list__container">
											{this.selectAllMultiselectV2 && (
												<div>
													<li
														class={{
															'mdc-list-checkbox': true
														}}
														onClick={(event) => this.selectAllInMultiselectV2(event)}
													>
														<span class="mdc-list-item__ripple"></span>
														<scib-ui-v2-checkbox
															{...{
																label: 'Select all',
																uid: 'internal-select-all'
															}}
															value={this._allOptionsMultiselectV2Checked}
															onClick={(event) => this.selectAllInMultiselectV2(event)}
														></scib-ui-v2-checkbox>
													</li>
													<div
														class={{
															'mdc-list__container__spacer': true
														}}
													></div>
												</div>
											)}
											{this._options.map((option, index) => {
												return (
													<li
														class={{
															'mdc-list-checkbox': true
														}}
														key={option.value || index}
														ref={(el) => (this.$multiselectV2Option = el as HTMLElement)}
													>
														<span class="mdc-list-item__ripple"></span>
														<scib-ui-v2-checkbox
															{...{
																key: option?.name,
																label: option?.name,
																uid: option?.id
															}}
															value={this.multiselectV2OptionsStatus[index][option?.id] ? 'checked' : 'unchecked'}
															onValueChange={() => this.handleCheckboxChangeInMultiselectV2(option?.id)}
														></scib-ui-v2-checkbox>
													</li>
												);
											})}
										</div>
									</scib-ui-v2-scroll-container>
								</ul>
							</div>
						</div>
					)}
					{this.autocomplete && (
						<div
							class={{ 'mdc-menu-surface': true, 'no-display': this.multiselectV2 }}
							ref={(el) => (this.$menuSurfaceElement = el as HTMLElement)}
						>
							{this.optionsTitleTxt && <p class="c-menu-title">{this.optionsTitleTxt}</p>}

							{this._loading ? (
								<div role="status" aria-busy="true" aria-live="polite">
									<figure class="c-select__loading">
										<UISelectSkeleton literalSkeleton={this.accessibleLoading} viewBox={this.viewBoxSkeleton} />
									</figure>
								</div>
							) : (
								<ul class="c-menu" id={'ui-select' + this.label}>
									{this._options.length > 0 ? (
										this._options?.map(
											(option) =>
												!option.isSelected && (
													<li
														class={{
															'c-menu-item': true,
															'hide-lines': this._optionDetail
														}}
													>
														<button
															onClick={() => this.handleSelectOption(option, this.isSignatureModalManager)}
															class={{
																'c-menu-item-button --select': true,
																'hover-color': this._optionDetail
															}}
															type="button"
															data-cy="el-menu-item-button"
															title={option.secondary ? option.name + ' ' + option.secondary : option.name}
														>
															<UISelectOption option={option} optionDetail={this._optionDetail} />
														</button>
													</li>
												)
										)
									) : (
										// <li class="c-menu-item c-menu-item--noResult">
										<li
											class={{
												'c-menu-item': true,
												'c-menu-item--noResult': true,
												'c-menu-item--noResultAddUser': this.addUser
											}}
										>
											{this.noResult}
											{this.addUser && (
												<div class="c-addUser" onClick={() => this.handleAddUserEvent()}>
													<span class="c-addUser-literal">{this.addNewUser}</span>
													<i class="icon c-addUser-icon"></i>
												</div>
											)}
										</li>
									)}
								</ul>
							)}
						</div>
					)}
				</div>
				{this.error && this.error !== '' && <span class="c-error-msg">{this.error}</span>}
			</Host>
		);
	}
}
