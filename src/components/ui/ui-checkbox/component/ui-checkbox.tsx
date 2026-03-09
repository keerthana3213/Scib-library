import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-checkbox',
	styleUrl: 'ui-checkbox.scss',
	shadow: false,
	scoped: true
})
export class UICheckbox {
	/** Checkbox Label */
	@Prop({ mutable: true, reflect: true }) label: string;

	/** Checkbox Name */
	@Prop({ mutable: true, reflect: true }) name: string;

	/** Checkbox ID */
	@Prop({ mutable: true, reflect: true }) idCheck: string;

	/** Checkbox disabled status */
	@Prop({ mutable: true, reflect: true }) isDisabled: boolean;

	/** Avatar del miembro */
	@Prop({ mutable: true, reflect: true }) avatar: any;

	/** Indica si el miembro es empleado */
	@Prop({ mutable: true, reflect: true }) isEmployee: boolean;

	/** Email del miembro */
	@Prop({ mutable: true, reflect: true }) email?: string;

	/** Indica el estado del checkbox */
	@Prop({ mutable: true, reflect: true }) checked: boolean;

	/** Su principal funcionalidad es poder mantener un checkbox marcado independientemente del flujo de cambios del componente */
	@Prop({ mutable: true }) hardChecked: boolean = false;

	// /** Show/Hidde Accesibility */
	@Prop({ mutable: true, reflect: false }) hiddenAccesibility: boolean = false;

	@Prop({ mutable: true, reflect: false }) paddingBottom: boolean = false;

	@Prop({ mutable: true, reflect: false }) spanBlack: boolean = false;

	@Watch('checked') parseChecked(newVal: any) {
		this._checked = newVal;
	}
	@State() _checked: boolean;

	// /** Indica si los checks anidados es parcialmente seleccionado */
	@Prop({ mutable: true, reflect: true }) indeterminate: boolean;
	@Watch('indeterminate') parseIndeterminate(newVal: any) {
		this._indeterminate = newVal;
	}
	@State() _indeterminate: boolean = false;

	@Listen('unSelectAllInstructions', { target: 'window' })
	_handleUnSelectAllInstruction(e: any) {
		e.preventDefault();
		this._checked = false;
	}

	/** Corregir top en send-email */
	@Prop() inSendEmail?: boolean;
	@Watch('inSendEmail') parseInSendEmail(newVal: any) {
		this._inSendEmail = newVal;
	}
	@State() _inSendEmail: boolean = false;

	/** Añadir tooltip para el label */
	@Prop({ mutable: true, reflect: true }) labelInfo: string;

	/** Set the text to a regular font-size */
	@Prop({ mutable: true, reflect: true }) regularSize: boolean;

	/** Evento emitido al cambiar el valor */
	@Event() checkboxChange: EventEmitter;

	/** Event emitted when focus change */
	@Event() focusCheckedEmitter: EventEmitter;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventFormChange: EventEmitter;

	private onClick = (ev: Event) => {
		ev.stopPropagation();
		ev.preventDefault();
		if (this.isDisabled && this._checked) {
			this._checked = true;
		} else if (this.isDisabled) {
			this._checked = false;
		} else {
			this._checked = !this._checked;
			this.checkboxChange.emit(this._checked);
			this.eventFormChange.emit({
				name: this.name,
				value: this._checked,
				required: false
			});
		}
	};

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseChecked(this.checked);
		this.parseIndeterminate(this.indeterminate);
		this.eventFormChange.emit({
			name: this.name,
			value: this._checked,
			required: false
		});
	}

	/** Active emitter when focus/blur has detected */
	focusChecked(value: boolean) {
		this.focusCheckedEmitter.emit(value);
	}

	render() {
		return (
			<Host onClick={this.onClick} regularSize={this.regularSize} paddingBottom={this.paddingBottom}>
				<label
					class={{
						'ui-checkbox': true,
						'ui-checkbox--disabled': this.isDisabled,
						'ui-checkbox--disabled-checked': this.isDisabled && this._checked,
						'ui-checkbox--indeterminate': !this._indeterminate,
						'ui-checkbox--disabled-indeterminate': this.isDisabled && this._indeterminate,
						'ui-checkbox--padding-botton': this.paddingBottom,
						accessibility: this.hiddenAccesibility
					}}
					htmlFor={this.idCheck}
				>
					<input
						class="accessibility ui-checkbox__input"
						type="checkbox"
						name={this.name}
						id={this.idCheck}
						checked={this._checked || this.hardChecked === true}
						indeterminate={this._indeterminate}
						disabled={this.isDisabled}
						onFocus={() => {
							this.focusChecked(true);
						}}
						onBlur={() => {
							this.focusChecked(false);
						}}
					/>
					<span
						class={{
							'ui-checkbox__label': true,
							'--avatar': this.avatar,
							'--regular-size': this.regularSize,
							'in-send-email': this.inSendEmail
						}}
					>
						{this.avatar && <scib-ui-avatar is-employee={this.isEmployee} images={[this.avatar]}></scib-ui-avatar>}
						{this.inSendEmail ? (
							<span class="in-send-email-span">
								<span class="title-span" title={this.label}>
									{this.label}
								</span>
								<span class="subtitle-span">{this.email}</span>
							</span>
						) : (
							<span class={{ 'span-black': this.spanBlack }} title={this.label}>
								{this.label}
							</span>
						)}
					</span>
					{this.label !== undefined && this.label != '' && this.labelInfo !== undefined && this.labelInfo != '' ? (
						<scib-ui-info-tooltip text={this.labelInfo}></scib-ui-info-tooltip>
					) : null}
				</label>
			</Host>
		);
	}
}
