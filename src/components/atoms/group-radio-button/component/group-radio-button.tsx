import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Option } from '../models/group-radio-button.model';
import { DirectionType } from '../../../../shared/models';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-atoms-group-radio-button',
	styleUrl: 'group-radio-button.scss',
	shadow: true
})
export class AtomsGroupRadioButton {
	@Element() _hostRef: HTMLElement;

	/**
	 *	Options
	 */
	@Prop() options: string | Option[];
	@State() _options: Option[];
	@Watch('options') _parseOptions(newOptions: string | Option[]) {
		this._options = _parseProp<Option[]>(newOptions, []);
	}

	/**
	 * Selected option
	 */
	@Prop({ mutable: true }) value: string = '';
	@State() _value: string;
	@Watch('value') _parsevalue(newvalue: string) {
		this._value = newvalue;
	}

	/**
	 * Radio group name
	 */
	@Prop({ reflect: true }) name: string;

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;
	@State() _disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean) {
		this._disabled = !!newValue;
	}

	/**
	 *	Mark as read only input.
	 */
	@Prop({ mutable: true, reflect: true }) readOnly: boolean;
	@State() _readOnly: boolean;
	@Watch('readOnly') _readOnlyHandler(newValue: boolean) {
		this._readOnly = !!newValue;
	}

	/**
	 *	Mark as invalid input.
	 */
	@Prop({ mutable: true, reflect: true }) invalid: boolean;
	@State() _invalid: boolean;
	@Watch('invalid') _invalidHandler(newValue: boolean) {
		this._invalid = !!newValue;
	}

	/**
	 *	To determinate de direction of input group.
	 */
	@Prop({ mutable: true }) direction: DirectionType = 'row';
	@State() _direction: DirectionType;
	@Watch('direction') _directionHandler(newValue: DirectionType) {
		this._direction = newValue;
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._parseOptions(this.options);
		this._parsevalue(this.value);
		this._invalidHandler(this.invalid);
		this._disabledHandler(this.disabled);
		this._readOnlyHandler(this.readOnly);
		this._directionHandler(this.direction);
	}

	/**
	 * Descripción del evento
	 */
	@Event() valueChange: EventEmitter;

	/**
	 *Event to handle the button click of an option
	 */
	@Event() optionButtonClick: EventEmitter<string>;

	render() {
		return (
			<Host>
				<div
					class={{
						wrapper: true,
						'mdc-form-direction-row': this.direction === 'row',
						'mdc-form-direction-column': this.direction === 'column'
					}}
				>
					{this._options?.map((option) => (
						<div class="mdc-form-field">
							<div class="mdc-radio">
								<input
									class={{ 'mdc-radio__native-control': true, 'mdc-radio__native-control--invalid': this._invalid }}
									type="radio"
									id={'radio-' + option.id}
									name={this.name}
									checked={option.value === this._value}
									disabled={this._disabled || this._readOnly}
									read-only={this._readOnly}
									onClick={() => {
										this.value = option.value;
										this.valueChange.emit(option);
									}}
								/>
								<div class="mdc-radio__background">
									<div class="mdc-radio__outer-circle"></div>
									<div class="mdc-radio__inner-circle"></div>
								</div>
								<div class="mdc-radio__ripple"></div>
							</div>
							<div class={'mdc-radio__label-container'}>
								<label>{option.label}</label>
								{option?.helperText && (
									<div class="mdc-radio__helper-text">
										{option?.helperText}
										{option?.button && (
											<scib-atoms-button
												class={'mdc-radio__helper-text__button'}
												text={option?.button?.text}
												disabled={option?.button?.disabled}
												size={'s'}
												level={option?.button?.level}
												onClick={() => this.optionButtonClick.emit(option.button.event)}
											></scib-atoms-button>
										)}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</Host>
		);
	}
}
