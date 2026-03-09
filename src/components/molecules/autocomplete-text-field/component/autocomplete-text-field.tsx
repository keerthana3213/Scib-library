import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { isEmpty, isUndefined, merge } from 'lodash';
import { BehaviorSubject, Subscription, tap, timer } from 'rxjs';
import { debounce, distinctUntilChanged, filter, skipWhile } from 'rxjs/operators';
import { registerClickOutside, removeClickOutside } from 'stencil-click-outside';
import { AutocompleteFieldTypes, VariantTypes } from '../../../../shared/models';
import { parseProp } from '../../../../utils/public_api';
import { AtomsTooltipInfo } from '../../../atoms/tooltip-info/component/tooltip-info';

/**
 * Component description
 *
 * @slot content - Slot for showing your own list
 */
@Component({
	tag: 'scib-molecules-autocomplete-text-field',
	styleUrl: 'autocomplete-text-field.scss',
	shadow: true
})
export class MoleculesAutocompleteTextField {
	private readonly _inputValue$: BehaviorSubject<string> = new BehaviorSubject(undefined);
	private _inputReference: HTMLScibUiV2TextFieldElement;
	private _inputValueSubscription: Subscription;
	private _internalChange: boolean;
	private _wasDisconnected: boolean = false;

	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	/**
	 *	Different variations of the visual components.
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *	The fixed right icon.
	 */
	@Prop() icon: string;

	/**
	 *	The placeholder text.
	 */
	@Prop() label: string;

	/**
	 *	Input name.
	 */
	@Prop() name: string;

	/**
	 *	Input id.
	 */
	@Prop({ attribute: 'id' }) _id: string;

	/**
	 *	Minimum characters required to display the options list .
	 */
	@Prop() minChars: number = 3;

	/**
	 *	The type of the input like native html input.
	 */
	@Prop() type: AutocompleteFieldTypes = 'text';

	/**
	 *	Mark as required input.
	 */
	@Prop({ mutable: true, reflect: true }) required: boolean;
	@State() $required: boolean = false;
	@Watch('required') _requiredHandler(newValue: boolean) {
		this.$required = !!newValue;
	}

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;
	@State() $disabled: boolean = false;
	@Watch('disabled') _disabledHandler(newValue: boolean) {
		this.$disabled = !!newValue;
	}

	/**
	 *	Mark as read only input.
	 */
	@Prop({ mutable: true, reflect: true }) readOnly: boolean;
	@State() $readOnly: boolean = false;
	@Watch('readOnly') _readOnlyHandler(newValue: boolean) {
		this.$readOnly = !!newValue;
	}

	/**
	 *	Mark as warning helper text.
	 */
	@Prop({ reflect: true, mutable: true }) warning: boolean;
	@State() $warning: boolean;
	@Watch('warning') _warningHandler(newValue: boolean | undefined) {
		this.$warning = !!newValue;
	}

	/**
	 *	Mark as warning helper text.
	 */
	@Prop({ reflect: true, mutable: true }) loadingHelperText: boolean;
	@State() $loadingHelperText: boolean;
	@Watch('loadingHelperText') _loadingHelperTextHandler(newValue: boolean | undefined) {
		this.$loadingHelperText = !!newValue;
	}

	/**
	 *	Delay between input value changes.
	 */
	@Prop() debounceTime: number = 200;

	/**
	 *	This text appear when input is invalid.
	 */
	@Prop() helperText: string;
	@State() $helperText: string;
	@Watch('helperText') _helperTextHandler(newValue: string) {
		this.$helperText = newValue;
	}
	/**
	 *	Alerts if value is invalid.
	 */
	@Prop({ mutable: true }) invalid: boolean = false;
	@State() $invalid: boolean;
	@Watch('invalid') _invalidHandler(newVal: boolean) {
		this.$invalid = newVal;
	}

	/**
	 *	The value of the input.
	 */
	@Prop({ mutable: true }) value: string;
	@State() $value: string;
	@Watch('value') _valueHandler(newValue: string) {
		this.$value = newValue || '';
		if (!this._internalChange && this._inputReference && typeof newValue === 'string') {
			this._inputValue$.next(newValue || '');
		}
		if (this._internalChange) {
			this.selectedValue = this.$value;
		}
		this._internalChange = false;
	}

	/**
	 *	The value that you want to show but you don't want to fire the events.
	 */
	@Prop({ mutable: true }) selectedValue: string;
	@State() $selectedValue: string;
	@Watch('selectedValue') _selectedValueHandler(newVal: string) {
		requestAnimationFrame(() => (this.$selectedValue = newVal));
	}

	/**
	 *	Show skeleton while loading list.
	 */
	@Prop({ mutable: true }) loading: boolean = false;
	@State() $loading: boolean;
	@Watch('loading') _loadingHandler(newVal: boolean) {
		this.$loading = newVal;
	}

	/**
	 *	The maximum number of characters that the user will be able to write.
	 */
	@Prop() limit: number;
	@State() $limit: number;
	@Watch('limit') _limitHandler(newValue: number | undefined) {
		if (typeof newValue === 'number' && newValue > 0) {
			this.$limit = newValue;
			this.setLimitInput();
		}
	}

	/**
	 *	Enable or disable the tooltip for helperText
	 */
	@Prop() enableTooltip: boolean = false;
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
	@Prop() enableAutoTooltip: boolean;
	@State() $enableAutoTooltip: boolean;
	@Watch('enableAutoTooltip') _enableAutoTooltipHandler(newValue: boolean) {
		this.$enableAutoTooltip = !!newValue;
	}

	/**
	 *	Control open/close list options
	 */
	@State() _panelOpen = false;

	/**
	 * Control the vertical scroll
	 */
	@State() hasVerticalScroll: boolean = false;

	/**
	 * Mthod to indicate that the data had been loaded
	 */
	@Method() async loaded() {
		this.loading = false;
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._valueHandler(this.value);
		this._loadingHandler(this.loading);
		this._invalidHandler(this.invalid);
		this._helperTextHandler(this.helperText);
		this._disabledHandler(this.disabled);
		this._warningHandler(this.warning);
		this._loadingHandler(this.loading);
		this._readOnlyHandler(this.readOnly);
		this._requiredHandler(this.required);
		this._selectedValueHandler(this.selectedValue);
		this._limitHandler(this.limit);
		this._enableAutoTooltipHandler(this.enableAutoTooltip);
		this._tooltipConfigHandler(this.tooltipConfig);
		this._enableTooltipHandler(this.enableTooltip);
	}

	connectedCallback(): void {
		this.attachSubscription();
	}

	componentDidRender(): void {
		this.setLimitInput();
	}

	/**
	 *
	 */
	openPanel() {
		this._panelOpen = true;
		this.loading = true;
		requestAnimationFrame(() => registerClickOutside(this, this._hostRef, () => this.closePanel()));
	}

	/**
	 *
	 */
	closePanel() {
		this._panelOpen = false;
		requestAnimationFrame(() => removeClickOutside(this, this._hostRef, () => {}));
	}

	/**
	 *
	 */
	setLimitInput() {
		if (this._inputReference && this.$limit && this.$limit > 0) {
			const inputNativeRef = this._inputReference.shadowRoot.querySelector('input');
			if (inputNativeRef) {
				inputNativeRef.setAttribute('max', `${this.$limit}`);
				inputNativeRef.setAttribute('maxlength', `${this.$limit}`);
			}
		}
	}

	/**
	 *
	 */
	private attachSubscription() {
		if (!(this._inputValueSubscription instanceof Subscription)) {
			this._inputValueSubscription = this._inputValue$
				.pipe(
					skipWhile((value) => isUndefined(value)),
					/**
					 * Avoid opening the panel after the component has been disconnected and connected again
					 */
					filter(() => {
						if (this._wasDisconnected === true) {
							this._wasDisconnected = false;
							return false;
						}

						return true;
					}),
					distinctUntilChanged(),
					tap((inputValue) => this._showMenu(inputValue)),
					debounce(() => timer(this.debounceTime || 200))
				)
				.subscribe((inputValue) => {
					if (inputValue === '' || this._validLength(inputValue)) {
						this._internalChange = true;
						this.value = inputValue;
						this.valueChange.emit(inputValue);
						if (isEmpty(this.value)) {
							this.closePanel();
						}
					}
				});
		}
	}

	/**
	 *
	 */
	disconnectedCallback() {
		if (this._inputValueSubscription?.unsubscribe) {
			this._inputValueSubscription.unsubscribe();
			this._inputValueSubscription = null;
			this._wasDisconnected = true;
		}
		requestAnimationFrame(() => removeClickOutside(this, this._hostRef, () => {}));
	}

	/**
	 *
	 * @param inputValue
	 */
	private _validLength(inputValue?: string) {
		const _length = (inputValue || this._inputValue$.value || '').length;
		return _length >= this.minChars;
	}

	/**
	 * Control to display menu
	 * @param inputValue
	 */
	private _showMenu(inputValue?: string, emitValue?: boolean): void {
		if (emitValue && this._validLength(this.selectedValue) && !isEmpty(this.selectedValue)) {
			this.openPanel();
			this.valueChange.emit(this.selectedValue);
		} else if (this._validLength(inputValue)) {
			this.openPanel();
			emitValue && this.valueChange.emit(inputValue || this._inputValue$.value);
		} else {
			this.closePanel();
		}
	}

	/**
	 * @description  Action when input has focus
	 * @returns {void}
	 * @param { }
	 */
	private _activateFocus(): void {
		if (this.minChars === 0) {
			this._showMenu(null, true);
		}
	}

	/**
	 * @description Action when input change value
	 * @returns {void}
	 * @param { }
	 */
	private _valueChange({ detail }: CustomEvent<string>): void {
		this.selectedValue = detail;
		this._inputValue$.next(detail);
	}

	/**
	 * Adjust vertical scroll
	 * @param scrollbarComponent
	 */
	private _adjustVerticalScroll(customEvent: any) {
		const { detail } = customEvent;
		this.hasVerticalScroll = !!detail;
	}

	/**
	 * Descripción del evento
	 */
	@Event() valueChange: EventEmitter;

	render() {
		return (
			<Host>
				<div class="autocomplete-text-field">
					<scib-ui-v2-text-field
						ref={(element) => (this._inputReference = element)}
						id={this._id}
						name={this.name}
						type={this.type}
						variant={this.variant}
						label={this.label}
						icon={this.icon}
						invalid={this.$invalid}
						disabled={this.$disabled}
						warning={this.$warning}
						loading={this.$loadingHelperText}
						read-only={this.$readOnly}
						helper-text={this.$helperText}
						required={this.$required}
						value={this.$value}
						enableTooltip={this.enableTooltip}
						tooltipConfig={this.tooltipConfig}
						enableAutoTooltip={this.$enableAutoTooltip}
						alternative-value={this.$selectedValue}
						onActivateFocus={() => this._activateFocus()}
						onInternalValueChange={(event) => this._valueChange(event)}
						onValueChange={(ev) => {
							ev.stopPropagation();
							ev.preventDefault();
						}}
					></scib-ui-v2-text-field>
					{this._panelOpen && (
						<div class="autocomplete-text-field__list">
							{this.$loading ? (
								<div class="autocomplete-text-field__list--loading">
									<scib-atoms-skeleton skeletonType="list"></scib-atoms-skeleton>
								</div>
							) : (
								<div
									class={{
										'autocomplete-text-field__list--parent': true,
										'vertical-scroll': this.hasVerticalScroll
									}}
									role="menu"
								>
									<scib-ui-v2-scroll-container onHasVerticalScroll={(event) => this._adjustVerticalScroll(event)}>
										<slot name="content-list" />
										<slot />
									</scib-ui-v2-scroll-container>
								</div>
							)}
						</div>
					)}
				</div>
			</Host>
		);
	}
}
