import { Component, Host, h, EventEmitter, Event, Element, Prop } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { SwitchVariants } from '../models/switch.model';
import { MDCSwitch } from '@material/switch';
import { isEmpty, isNil } from 'lodash';

/**
 * Component description
 */
@Component({
	tag: 'scib-atoms-switch',
	styleUrl: 'switch.scss',
	shadow: true
})
export class AtomsSwitch {
	_switchRef: MDCSwitch;

	@Element() _hostRef: HTMLElement;

	/**
	 *	Filed name.
	 */
	@Prop({ mutable: true, reflect: true }) name: string;

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: true }) checked: boolean;

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: true }) readOnly: boolean;

	/**
	 *
	 */
	@Prop({ mutable: true }) label: string;
	/**
	 *
	 */
	@Prop({ reflect: true }) variant: SwitchVariants = 'default';
	/**
	 * Default to 'right'
	 */
	@Prop({ reflect: true }) direction: 'right' | 'left' = 'left';

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		this._switchRef = MDCSwitch.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-switch'));
		this._switchRef.listen('click', () => {
			this.checked = !!this._switchRef.selected;
			this.valueChange.emit(this.checked);
		});
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._switchRef) && this._switchRef.destroy) {
			this._switchRef.unlisten('click', () => {});
			this._destroy();
		}
	}

	/**
	 * Descripción del evento
	 */
	@Event() valueChange: EventEmitter;

	render() {
		return (
			<Host>
				<button
					id="switch"
					class={{
						'mdc-switch': true,
						'mdc-switch--unselected': !this.checked,
						'mdc-switch--selected': this.checked,
						'mdc-switch--read-only': this.readOnly
					}}
					type="button"
					role="switch"
					aria-checked="false"
					disabled={this.disabled || this.readOnly}
					read-only={this.readOnly}
					name={this.name}
				>
					<div class="mdc-switch__track"></div>
					<div class="mdc-switch__handle-track">
						<div class="mdc-switch__handle">
							<i class="icon"></i>
							<div class="mdc-switch__ripple"></div>
						</div>
					</div>
				</button>
				<label class="mdc-switch__label" htmlFor="switch">
					{!isNil(this.label) && !isEmpty(this.label) ? this.label : <slot></slot>}
				</label>
			</Host>
		);
	}
}
