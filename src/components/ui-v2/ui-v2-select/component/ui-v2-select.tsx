import { DefaultFocusState, MDCMenu } from '@material/menu';
import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { compact, deburr, first, get, isBoolean, isEmpty, isNull, isNumber, merge, pickBy, size, toLower, toString } from 'lodash';
import { registerClickOutside, removeClickOutside } from 'stencil-click-outside';
import { LevelSelect, VariantTypes } from '../../../../shared/models';
import { parseProp, preventEvents, removePreventEvents } from '../../../../utils/helpers/common';
import { AtomsTooltipInfo } from '../../../atoms/tooltip-info/component/tooltip-info';
import { UIV2SelectChildren } from '../fragments/ui-v2-select-children.fragment';
import { SelectOptions } from '../models/ui-v2-select.model';

const cleanString = (value) => toLower(deburr(toString(value)));
const cleanStringCaseSensitive = (value) => deburr(toString(value));

@Component({
	tag: 'scib-ui-v2-select',
	styleUrl: 'ui-v2-select.scss',
	shadow: true
})
export class UI_V2Select {
	private _menuRef: MDCMenu;
	private _internalChange: boolean;
	private _inputTextValue: string;
	private _inputReference: HTMLScibUiV2TextFieldElement;
	private _moveEvents: string[] = ['wheel', 'touchmove'];
	private _scrollBarInstance: HTMLElement;
	private _closing: boolean = false;
	private _maxItemsBeforeScroll = 3;

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 * Enable alternative design
	 */
	@Prop({ reflect: true }) level: LevelSelect = 'primary';

	/**
	 *	Input name.
	 */
	@Prop({ mutable: true, reflect: true }) name: string;

	/**
	 *
	 */
	@Prop() multiselect: boolean;
	@State() $multiselect: boolean;
	@Watch('multiselect') _multiselectHandler(newValue: boolean) {
		this.$multiselect = !!(isBoolean(newValue) && newValue);
	}
	/**
	 * Disable Select-all
	 */
	@Prop() disableSelectAll: boolean = false;
	@State() $disableSelectAll: boolean;
	@Watch('disableSelectAll') _disableSelectAll(newValue: boolean) {
		this.$disableSelectAll = !!newValue;
	}

	/**
	 *	Show clean icon.
	 */
	@Prop() showCleanIcon: boolean = true;
	@State() $showCleanIcon: boolean;
	@Watch('showCleanIcon') _showCleanIconHandler(newValue: boolean | undefined) {
		this.$showCleanIcon = !!newValue;
	}

	/**
	 *
	 */
	@Prop() selectAllText: string = 'Select all';

	/**
	 *
	 */
	@Prop({ mutable: true }) value: string;
	@State() $value: string;
	@State() $visibleText: string;
	@Watch('value') _valueHandler(newValue: string) {
		if (this.$multiselect && !this._internalChange) {
			this._menuOptionsHandler(this.menuOptions);
			const multiSelectLabel = this._getMultiSelectLabel(newValue);
			requestAnimationFrame(() => this._updateMultiselectVisibleLabels(multiSelectLabel));
		} else {
			let _value = '';
			if (typeof newValue === 'string') {
				_value = newValue;
			}
			this.$value = _value;
			if (!this._internalChange) {
				this._updateVisibleText();
			}
		}
		if (!this._internalChange && this._inputReference && typeof newValue === 'string') {
			this.valueChange.emit(newValue || '');
		}
		this._internalChange = false;
	}

	/**
	 *
	 */
	@Prop() menuOptions: any;
	@State() $menuOptions: SelectOptions;
	@State() $menuOptionsFiltered: SelectOptions = [];
	@Watch('menuOptions') _menuOptionsHandler(newValue: any) {
		let options = parseProp<SelectOptions>(newValue, []);
		if (this.$multiselect) {
			const values = (this.value || '').split(',');
			options = options.map((option) => {
				const isChecked = values.findIndex((value) => cleanString(value) === cleanString(option.value)) > -1;
				return {
					...option,
					checked: isChecked
				};
			});
		}
		this.$menuOptions = options;
		this.$menuOptionsFiltered = this.$menuOptions;
		if (!this._internalChange) {
			this._saveChildrenIds(this.$menuOptions);
			this._updateVisibleText();
		}
	}

	/**
	 *
	 */
	@Prop() label: string;
	@State() $label: string;
	@Watch('label') _labelHandler(newValue: string) {
		this.$label = newValue;
	}

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean = false;
	@State() $disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean) {
		this.$disabled = !!newValue;
	}

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) readOnly: boolean = false;
	@State() $readOnly: boolean;
	@Watch('readOnly') _readOnlyHandler(newValue: boolean) {
		this.$readOnly = !!newValue;
	}

	/**
	 *	Mark as loading input.
	 */
	@Prop({ reflect: true, mutable: true }) loading: boolean = false;

	/**
	 *	Mark as loading input.
	 */
	@Prop({ reflect: true, mutable: true }) warning: boolean = false;

	/**
	 *	Mark as invalid input.
	 */
	@Prop({ reflect: true, mutable: true }) invalid: boolean = false;

	/**
	 *	Mark as success input.
	 */
	@Prop({ reflect: true, mutable: true }) success: boolean = false;

	/**
	 *	This text appear when input is invalid.
	 */
	@Prop() helperText: string;
	@State() $helperText: string;
	@Watch('helperText') _helperTextHandler(newValue: string | undefined) {
		this.$helperText = newValue;
	}

	/**
	 *	Yo cant type for searching options.
	 */
	@Prop() onlySelect: boolean = false;

	/**
	 *	Mark as required input.
	 */
	@Prop({ reflect: true }) required: boolean;

	/**
	 *	Disable the label of the input.
	 */
	@Prop() withoutLabel: boolean = false;

	/**
	 *	Enable or disable the tooltip for helperText
	 */
	@Prop() enableTooltip: boolean;
	@State() $enableTooltip: boolean;
	@Watch('enableTooltip') _enableTooltipHandler(newValue: boolean | undefined) {
		this.$enableTooltip = !!newValue;
	}
	/**
	 *	Tooltip configuration options
	 */
	@Prop() tooltipConfig: string | Partial<AtomsTooltipInfo>;
	@State() $tooltipConfig: Partial<AtomsTooltipInfo> = {
		arrow: 'bottom'
	};
	@Watch('tooltipConfig') _tooltipConfigHandler(newValue: string | Partial<AtomsTooltipInfo>) {
		this.$tooltipConfig = merge({}, { arrow: 'bottom' }, parseProp(newValue, {}));
	}

	/**
	 * Enable automatic tooltip activation when text overflows. When set to true, the component
	 * will automatically check if the helper text overflows its container and show a tooltip if needed.
	 * When set to false (default), the tooltip will only be shown if explicitly enabled via enableTooltip.
	 * This is particularly useful for dynamic text that may or may not overflow.
	 * @default false
	 */
	@Prop() enableAutoTooltip: string | boolean;
	@State() $enableAutoTooltip: boolean;
	@Watch('enableAutoTooltip') _enableAutoTooltipHandler(newValue: string | boolean) {
		this.$enableAutoTooltip = !!newValue;
	}

	/**
	 *
	 */
	@State() $icon: 'chevron-down' | 'chevron-up' = 'chevron-down';

	/**
	 *
	 */
	@State() $showSelect: boolean;

	/**
	 *
	 */
	@State() $autocompleteStatus = {};

	/**
	 *
	 */
	@State() $alternativeValue;

	/**
	 *
	 */
	@State() $lastAlternativeValue;

	/**
	 *
	 */
	@Event() valueChange: EventEmitter<string>;

	/**
	 *
	 */
	@Event() activateFocus: EventEmitter<void>;

	/**
	 *
	 */
	@Event() deactivateFocus: EventEmitter<void>;

	/**
	 *
	 * @param event
	 */
	@Listen('scrollBarInstance', { capture: true }) _scrollBarInstanceHandler(event) {
		const { detail } = event;
		this._scrollBarInstance = detail;
	}

	/**
	 *
	 * @param event
	 */
	@Listen('iconClick', { capture: true }) _iconClickHandler(event: CustomEvent<any>) {
		event.stopPropagation();
		event.preventDefault();
		const { detail } = event;
		if (this.$showSelect || get(detail, 'focusOut')) {
			this._inputReference.focusDeactivate();
			this.deactivateFocus.emit();
			this._closing = true;
			this._setFilteredOptions('', true);
			if (this.$multiselect && this.value) {
				this.$alternativeValue = this._getMultiSelectLabel(this.value);
			}
		} else if (!this._closing) {
			this._inputReference.setFocus();
			this._hostRef.focus();
			this.activateFocus.emit();
			this.openMenu('');
		}
		if (!get(detail, 'focusOut')) {
			this._closing = false;
		}
	}

	/**
	 *
	 */
	@Method() async setFocus() {
		setTimeout(() => {
			if (this._inputReference) {
				this._inputReference.setFocus();
			}
		});
	}

	/**
	 *
	 */
	@Method() async focusDeactivate() {
		setTimeout(() => {
			if (this._inputReference) {
				this._inputReference.focusDeactivate();
			}
		});
	}

	/**
	 *
	 */
	@Method() async open() {
		this.openSelect();
	}

	/**
	 *
	 */
	@Method() async close() {
		this.closeSelect();
	}

	/**
	 *
	 */
	componentWillLoad() {
		this._multiselectHandler(this.multiselect);
		this._menuOptionsHandler(this.menuOptions);
		this._disabledHandler(this.disabled);
		this._readOnlyHandler(this.readOnly);
		this._helperTextHandler(this.helperText);
		this._labelHandler(this.label);
		this._valueHandler(this.value);
		this._showCleanIconHandler(this.showCleanIcon);
		this._disableSelectAll(this.disableSelectAll);
		this._enableTooltipHandler(this.enableTooltip);
		this._tooltipConfigHandler(this.tooltipConfig);
		this._enableAutoTooltipHandler(this.enableAutoTooltip);
	}

	/**
	 *
	 */
	componentDidLoad() {
		this._destroy();
		this._menuRef = MDCMenu.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-menu'));
		this._menuRef.setDefaultFocusState(DefaultFocusState.NONE);
		registerClickOutside(this, this._hostRef, () => this._closeIfOpened());
		this._setListeners();
	}

	/**
	 *
	 */
	_closeIfOpened() {
		if (this.$showSelect) {
			this._inputReference.focusDeactivate();
			this.deactivateFocus.emit();
			this._closing = true;
			this.closeSelect();
		}
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._menuRef) && this._menuRef.destroy) {
			try {
				removePreventEvents(this._hostRef.shadowRoot, this._moveEvents);
				this._menuRef?.unlisten('MDCMenu:selected', () => {});
				removeClickOutside(this, this._hostRef, () => {});
				this._menuRef?.destroy();
			} catch (error) {}
		}
	}

	/**
	 *
	 */
	private _saveChildrenIds(childrenNodes: SelectOptions, parentId?: number | string) {
		(childrenNodes || []).forEach((option) => {
			const optionId = parentId ? `${parentId}-${option.id}` : toString(option.id);
			this.$autocompleteStatus[optionId] = get(option, 'checked', false);
			const children = get(option, 'children', []);
			if (children.length > 0) {
				this._saveChildrenIds(option.children, optionId);
			}
		});
	}

	/**
	 *
	 */
	private _setListeners() {
		this._menuRef.listen('MDCMenu:selected', (event: CustomEvent<any>) => {
			event.preventDefault();
			event.stopPropagation();
			this.$showSelect = false;
			const _item = get(event, ['detail', 'item'], '');
			const value = get(event, ['detail', 'item', 'innerText'], '');
			if (_item && value) {
				const selectionId = _item.getAttribute('itme-id');
				const item = this._getOptionBySelectionIdAndValueCaseSensitive(selectionId, value);
				if (item) {
					this._internalChange = true;
					this.$visibleText = item.label || item.value;
					this.value = item.value;
					this.valueChange.emit(this.value);
					this.closeSelect();
					this._inputReference.focusDeactivate();
				}
			}
		});
	}

	/**
	 *
	 */
	openMenu(filter?: string) {
		// Don't clear $alternativeValue when there are selected values
		if (this.$multiselect && !this.value) {
			this.$alternativeValue = '';
		} else if (this.$multiselect && this.value) {
			// Ensure the text of selected options remains visible
			this._updateVisibleLabelsForMultiselect();
		}

		if (this.$menuOptions && this.$menuOptions.length > 0 && !this.$disabled) {
			this._setFilteredOptions(filter || filter === '' ? filter : this._inputTextValue);
			if (this.$menuOptionsFiltered.length > 0 && (!this.$readOnly || this.onlySelect)) {
				this.openSelect();
			}
		}
	}

	/**
	 *
	 * @param event
	 */
	closeFocusOut(event: CustomEvent<any>) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.$multiselect) {
			const valueFinded = this._getOptionByValueCaseSensitive(this.$visibleText);
			if (!valueFinded) {
				this._internalChange = true;
				this.$visibleText = '';
				this.value = '';
				this.valueChange.emit(this.value);
				this._internalChange = false;
			}
		}
		const _event = new CustomEvent('iconClick', { detail: { focusOut: true } });
		this._hostRef.dispatchEvent(_event);
	}

	/**
	 *
	 */
	closeSelect() {
		removePreventEvents(this._hostRef.shadowRoot, this._moveEvents);
		this.$showSelect = false;
		this.$icon = 'chevron-down';
		setTimeout(() => (this._closing = false), 250);
	}

	/**
	 *
	 */
	onClickAlternative() {
		if (this.$showSelect) {
			if (this.$multiselect && !this.value) {
				this.$lastAlternativeValue = '';
			}
			this.closeSelect();
		} else {
			this.openMenu('');
		}
	}

	/**
	 *
	 */
	getAlternativeValue() {
		return this.value ? this.$lastAlternativeValue : '';
	}

	/**
	 *
	 */
	openSelect() {
		preventEvents(this._hostRef.shadowRoot, this._moveEvents);
		if (!this.$showSelect && this._scrollBarInstance) {
			requestAnimationFrame(() => (this._scrollBarInstance.scrollTop = 0));
		}
		this.$showSelect = true;
		this.$icon = 'chevron-up';
	}

	/**
	 *
	 * @param event
	 */
	textFieldValueChangeHandler(event: CustomEvent<string>) {
		const { detail = '' } = event;
		this._inputTextValue = detail || '';
		this.$visibleText = detail;
		if (isEmpty(detail) && !this.$multiselect) {
			this._internalChange = true;
			this.value = '';
			this.valueChange.emit(this.value);
		}
		if (isEmpty(detail) && this.$multiselect) {
			Object.keys(this.$autocompleteStatus).forEach((key) => {
				this.$autocompleteStatus[key] = false;
			});
			this._internalChange = true;
			this.value = '';
			this.valueChange.emit(this.value);
		}
		detail.length > 0 ? this.openMenu(this._inputTextValue) : this._setFilteredOptions('');
	}

	/**
	 *
	 */
	private _updateVisibleText() {
		this.$visibleText = isEmpty(this.value) ? this.value : get(this._getOptionByValue(this.value), 'label', this.value);
	}

	/**
	 *
	 * @param filter
	 */
	private _setFilteredOptions(filter?: string, reset?: boolean) {
		const inputValue = cleanString(filter);
		const options = isEmpty(inputValue)
			? this.$menuOptions
			: this.$menuOptions.filter((option) => {
					return (cleanString(option.label) || '').includes(inputValue) || (cleanString(option.value) || '').includes(inputValue);
			  });
		this.$menuOptionsFiltered = this.$multiselect
			? options.map((option) => ({ ...option, checked: this.$autocompleteStatus[option.id] }))
			: options;
		if (!reset && this.$menuOptionsFiltered.length > 0 && (!this.$readOnly || this.onlySelect)) {
			this.openSelect();
		} else {
			this.closeSelect();
		}
	}

	/**
	 *
	 * @param value
	 */
	private _getOptionByValue(value: string) {
		return (this.$menuOptions || []).find(
			(option) => cleanString(option.value) === cleanString(value) || cleanString(option.label) == cleanString(value)
		);
	}

	/**
	 *
	 * @param value Value or label of the selection
	 */
	private _getOptionByValueCaseSensitive(value: string) {
		return (this.$menuOptions || []).find(
			(option) =>
				cleanStringCaseSensitive(option.value) === cleanStringCaseSensitive(value) ||
				cleanStringCaseSensitive(option.label) === cleanStringCaseSensitive(value)
		);
	}

	/**
	 *
	 * @param selectionId Key Id of the selection
	 * @param value Value or label of the selection
	 */
	private _getOptionBySelectionIdAndValueCaseSensitive(selectionId: string, activeValue: string) {
		const _selectionId = toString(selectionId);
		const foundValue = (this.$menuOptions || []).find((option) => {
			const { id, value, label } = option;
			const _label = toString(label);
			const _value = toString(value);
			const _id = toString(id);
			return (
				(!isNull(selectionId) && _id === _selectionId) ||
				((isNull(selectionId) || _id === _selectionId) &&
					cleanStringCaseSensitive(_value) === cleanStringCaseSensitive(toString(activeValue))) ||
				((isNull(selectionId) || _id === _selectionId) &&
					cleanStringCaseSensitive(_label) === cleanStringCaseSensitive(toString(activeValue)))
			);
		});
		return foundValue ? foundValue : first(this.$menuOptions);
	}

	/**
	 *
	 * @param data
	 */
	handleCheckboxChange(event: CustomEvent) {
		event.preventDefault();
		event.stopPropagation();
		const { detail = {} } = event;
		const { checkboxId, checkboxValue } = detail;
		const isSelected = checkboxValue === 'checked';
		const availableId = isNumber(checkboxId) ? checkboxId > -1 : !isEmpty(checkboxId);

		if (availableId) {
			// Update the state of the selected checkbox
			this.$autocompleteStatus[toString(checkboxId)] = isSelected;

			// Get the selected values to emit
			const selectedValues = this._getSelectedValues();

			// Update the internal value and emit changes
			this._updateValueAndEmit(selectedValues);

			// Immediately update the UI
			this._updateVisibleLabelsForMultiselect();

			// Update the filtered options while maintaining the current filter
			this._setFilteredOptions(this._inputTextValue);
		}
	}

	/**
	 * Obtains the values currently selected in array format
	 * @returns Array of selected values
	 * @private
	 */
	private _getSelectedValues(): string[] {
		const selectedItems = pickBy(this.$autocompleteStatus, (value) => value);
		return compact(
			Object.keys(selectedItems).map((id) => {
				const option = this.$menuOptions.find((option) => cleanString(option.id) === cleanString(id));
				return get(option, ['value'], null);
			})
		);
	}

	/**
	 * Updates the internal value with the selected values and emits the change event
	 * @param selectedValues - Array of values to join with commas
	 * @private
	 */
	private _updateValueAndEmit(selectedValues: string[]): void {
		this._internalChange = true;
		this.value = selectedValues.join(',');
		this.valueChange.emit(this.value);
	}

	/**
	 * Updates the visible labels with the currently selected values
	 * @private
	 */
	private _updateVisibleLabelsForMultiselect(): void {
		const multiSelectLabel = this._getMultiSelectLabel(this.value);
		this._updateMultiselectVisibleLabels(multiSelectLabel);
	}

	/**
	 *
	 * @param event
	 */
	checkboxListClickHandle(event: Event, checkboxId: string) {
		event.preventDefault();
		event.stopPropagation();
		const status = !this.$autocompleteStatus[checkboxId];
		const customEvent = new CustomEvent('select', {
			detail: { checkboxId, checkboxValue: status ? 'checked' : 'unchecked' }
		});
		this.handleCheckboxChange(customEvent);
	}

	/**
	 *
	 * @param event
	 */
	selectAll(event: any) {
		event.preventDefault();
		event.stopPropagation();
		const allSelected = Object.values(this.$autocompleteStatus).every((value) => !!value);
		const itemsSelected = [];
		this.$autocompleteStatus = Object.keys(this.$autocompleteStatus).reduce((acc, key) => {
			acc[key] = !allSelected;
			if (acc[key]) {
				const option = this.$menuOptions.find((option) => cleanString(option.id) === cleanString(key));
				itemsSelected.push(get(option, ['value'], null));
			}
			return acc;
		}, {});

		this._internalChange = true;
		this.value = compact(itemsSelected).join(',');
		this.valueChange.emit(this.value);

		// Update the visible text in the input field after selecting or deselecting all
		this._updateVisibleLabelsForMultiselect();
	}

	/**
	 *
	 */
	getSelectAllStatus(): any {
		const allSelected = Object.values(this.$autocompleteStatus).every((value) => !!value);
		const allUnselected = Object.values(this.$autocompleteStatus).every((value) => !value);
		return allSelected ? 'checked' : allUnselected ? 'unchecked' : 'indeterminate';
	}

	/**
	 * @description  Action when input has focus
	 * @returns {void}
	 * @param { }
	 */
	private _activateFocus(): void {
		this.activateFocus.emit();
	}

	/**
	 * @description Action when input loses focus
	 * @returns {void}
	 * @param { }
	 */
	private _deactivateFocus(): void {
		this.deactivateFocus.emit();
	}

	/**
	 *
	 * @param value
	 */
	private _getMultiSelectLabel(value: string) {
		const values = toString(value || '').split(',');
		const options = values.map((key) => {
			const menuOption = this.$menuOptions.find((item) => cleanString(item.value) === cleanString(key));
			return menuOption ? menuOption.label || menuOption.value : null;
		});
		this.$lastAlternativeValue = compact(options).join(', ');
		return this.$lastAlternativeValue;
	}

	/**
	 * Updates all visible labels for the multiselect mode
	 * @param labelText - The formatted text to display
	 * @private
	 */
	private _updateMultiselectVisibleLabels(labelText: string): void {
		this.$alternativeValue = labelText;
		this.$visibleText = labelText;

		if (this._inputReference) {
			this._inputReference.alternativeValue = labelText;
			this._inputReference.value = labelText;
		}
	}

	render() {
		return (
			<Host onFocusout={(event) => this.closeFocusOut(event)}>
				{this.level !== 'primary' && (
					<div class="altDesign-container">
						{!this.withoutLabel && <span class="altDesign-container__label">{this.$label}</span>}
						<div class="altDesign-container__value-container" onClick={() => this.onClickAlternative()}>
							<span class="altDesign-container__value">{this.$multiselect ? this.getAlternativeValue() : this.$visibleText}</span>
							<span class="icon-container icon-container--handler" style={{ '--icon-content': `var(--theme-scib-icon-${this.$icon})` }}>
								<i
									class="icon mdc-text-field__icon mdc-text-field__icon--fixed"
									style={{ color: `var(--_ui-v2-text-field-fixed-icon-color)` }}
								/>
							</span>
						</div>
					</div>
				)}
				<scib-ui-v2-text-field
					style={{
						display: this.level !== 'primary' ? 'none' : 'flex',
						'--ui-v2-text-field-helper-line-display': this.$showSelect ? 'none' : 'flex',
						'--_ui-v2-text-field-icon-cursor': 'pointer'
					}}
					class={{ 'only-select': this.onlySelect }}
					ref={(element) => (this._inputReference = element)}
					icon={this.$icon}
					name={this.name}
					variant={this.variant}
					showCleanIcon={this.$showCleanIcon}
					label={this.$label}
					withoutLabel={this.withoutLabel}
					value={this.$visibleText}
					alternative-value={this.$alternativeValue}
					disabled={this.$disabled}
					loading={this.loading}
					warning={this.warning}
					readOnly={this.$readOnly || this.onlySelect}
					focusReadOnly={true}
					required={this.required}
					invalid={this.invalid}
					success={this.success}
					helperText={this.$helperText}
					onActivateFocus={() => this._activateFocus()}
					onDeactivateFocus={() => this._deactivateFocus()}
					onClick={() => this.openMenu('')}
					enableTooltip={this.$enableTooltip}
					tooltipConfig={this.$tooltipConfig}
					enableAutoTooltip={this.$enableAutoTooltip}
					onValueChange={(event) => {
						event.stopPropagation();
						event.preventDefault();
					}}
					onInternalValueChange={(event) => this.textFieldValueChangeHandler(event)}
				></scib-ui-v2-text-field>
				<div
					class={{
						'menu-wrapper': true,
						'menu-wrapper--show': this.$menuOptionsFiltered.length > 0
					}}
				>
					<div
						class={{
							'mdc-menu mdc-menu-surface': true,
							'mdc-menu--open': this.$showSelect && !this.$disabled
						}}
					>
						<ul class="mdc-list mdc-list--father" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
							<scib-ui-v2-scroll-container>
								<div class="mdc-list__container">
									{this.$multiselect && !this.$disableSelectAll && (
										<div>
											<li
												class={{
													'mdc-list-checkbox': true,
													'mdc-list--with-scroll': this.$menuOptionsFiltered.length > this._maxItemsBeforeScroll
												}}
												onClick={(event) => this.selectAll(event)}
											>
												<span class="mdc-list-item__ripple"></span>
												<scib-ui-v2-checkbox
													{...{
														label: this.selectAllText,
														uid: 'internal-select-all'
													}}
													value={this.getSelectAllStatus()}
													onValueChange={(event) => this.selectAll(event)}
												></scib-ui-v2-checkbox>
											</li>
											<div
												class={{
													'mdc-list__container__spacer': true,
													'mdc-list__container__spacer--with-scroll':
														this.$menuOptionsFiltered.length > this._maxItemsBeforeScroll
												}}
											></div>
										</div>
									)}
									{this.$menuOptionsFiltered.map((option, index) => {
										return this.$multiselect ? (
											<li
												class={{
													'mdc-list-checkbox': true,
													'mdc-list--with-scroll': this.$menuOptionsFiltered.length > this._maxItemsBeforeScroll
												}}
												key={option.value || index}
												onClick={(event) => this.checkboxListClickHandle(event, option.id)}
											>
												<span class="mdc-list-item__ripple"></span>
												<scib-ui-v2-checkbox
													{...{
														key: option.value,
														label: option?.label || option.value,
														uid: toString(option.id),
														...(this.$autocompleteStatus[option.id] ? { value: 'checked' } : {})
													}}
													onValueChange={(event) => this.handleCheckboxChange(event)}
												></scib-ui-v2-checkbox>
												{size(get(option, 'children')) > 0 && (
													<UIV2SelectChildren
														parentId={toString(option.id)}
														childrenNode={option.children}
														variant={this.variant}
														autocompleteStatusMap={this.$autocompleteStatus}
														clickHandler={this.handleCheckboxChange.bind(this)}
														listHandler={this.checkboxListClickHandle.bind(this)}
													/>
												)}
											</li>
										) : (
											<li
												class={{
													'mdc-list-item': true,
													'mdc-list--with-scroll': this.$menuOptionsFiltered.length > this._maxItemsBeforeScroll
												}}
												itme-id={option.id}
												role="menuitem"
												key={option.id || index}
												value={option.id}
											>
												<span class="mdc-list-item__ripple"></span>
												<span class="mdc-list-item__text" title={option?.label || option?.value}>
													{option?.label || option?.value}
												</span>
											</li>
										);
									})}
								</div>
							</scib-ui-v2-scroll-container>
						</ul>
					</div>
				</div>
			</Host>
		);
	}
}
