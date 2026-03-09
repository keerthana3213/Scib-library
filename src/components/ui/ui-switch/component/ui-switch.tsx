import { Component, Host, h, Prop, EventEmitter, Event, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-switch',
	styleUrl: 'ui-switch.scss',
	shadow: false,
	scoped: true,
})
export class UISwitch {
	/** Label. */
	@Prop({ reflect: true }) myapps: boolean;

	/** Label black style */
	@Prop({ reflect: true }) labelBlack: boolean;

	/** Atributo checked reflejado del input nativo */
	@Prop({ mutable: true, reflect: true }) checked: boolean = false;

	/** Etiqueta del switch */
	@Prop({ reflect: true }) label: string;

	/** "Name" del input */
	@Prop({ reflect: true }) name: string;

	@Prop({ reflect: true }) disabled: boolean = false;
	@Watch('disabled') disabledChange(newVal: boolean) {
		this._disabled = newVal;
	}
	@State() _disabled: boolean;

	/** Event emitter to change value */
	@Event() eventChange: EventEmitter;

	$checkedValue: HTMLInputElement;

	componentWillLoad() {
		this.disabledChange(this.disabled);
	}
	/** Handle change value */
	handleEventChange() {
		this.checked = this.$checkedValue.checked;
		this.eventChange.emit({ item: this.name, value: this.$checkedValue.checked });
	}

	render() {
		return (
			<Host>
				<label class={{ 'c-label': true, 'c-label--myapps': this.myapps, 'c-label--black': this.labelBlack }} htmlFor={this.name}>
					{this.label}
				</label>
				<input
					class="c-input"
					name={this.name}
					ref={el => (this.$checkedValue = el as HTMLInputElement)}
					type="checkbox"
					checked={this.checked}
					disabled={this._disabled}
					onChange={() => {
						this.handleEventChange();
					}}
				/>
				<div class={{ 'c-switch': true, 'c-switch__disabled': this._disabled }}></div>
			</Host>
		);
	}
}
