import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-textarea',
	styleUrl: 'ui-textarea.scss',
	shadow: false,
	scoped: true,
})
export class UITextarea {
	/** Label textarea */
	@Prop({ reflect: true }) labelTxtarea: string;

	/** Use aria-label in case there is no label */
	// @Prop({reflect: true}) ariaLabelTxtarea: string;

	/** Placeholder*/
	@Prop({ reflect: true }) placeholderTxtarea: string;

	/** Step Position for wizard modal form when required */
	@Prop({ reflect: true }) stepPosition?: number;

	/** Required */
	@Prop({ reflect: true }) required: boolean;

	/** Id */
	@Prop({ reflect: true }) idTxtarea: string;

	/** Name */
	@Prop({ reflect: true }) nameTxtarea: string;

	/** Default value */
	@Prop({ reflect: true }) valueTxtarea: string;

	/** Limite de caracteres */
	@Prop({ reflect: true }) charLimit: number;

	/** Input's Character counter */
	@Prop({ reflect: false }) charCounter: number = 0;

	/** Indica si el textarea estará deshabilitado para posibles modificaciones */
	@Prop({ reflect: true }) disableEdit: boolean;

	/** Event emitter to change value */
	@Event() eventChange: EventEmitter;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventFormChange: EventEmitter;

	$textarea!: HTMLTextAreaElement;

	componentDidLoad() {
		this.eventFormChange.emit({
			name: this.nameTxtarea,
			value: this.$textarea.value,
			required: this.required,
			stepPosition: this.stepPosition,
		});
	}
	/** Handle change value */
	handleEventChange() {
		this.eventChange.emit(this.$textarea.value);
		this.eventFormChange.emit({
			name: this.nameTxtarea,
			value: this.$textarea.value,
			required: this.required,
			stepPosition: this.stepPosition,
		});
		this.charCounter = this.$textarea.value.length || 0;
	}

	render() {
		return (
			<Host>
				<label
					class={{
						'c-textarea__label': true,
						'--visually-hidden': !this.labelTxtarea,
					}}
					htmlFor={this.idTxtarea}
				>
					{this.labelTxtarea}
				</label>
				<textarea
					class={{
						'c-textarea': true,
						'c-textarea--disabled': this.disableEdit,
					}}
					ref={el => (this.$textarea = el as HTMLTextAreaElement)}
					placeholder={this.placeholderTxtarea}
					value={this.valueTxtarea}
					name={this.nameTxtarea}
					id={this.idTxtarea}
					onKeyUp={() => {
						this.handleEventChange();
					}}
					// aria-label={this.labelTxtarea}
					required={!!this.required}
					maxlength={this.charLimit ? this.charLimit : null}
					disabled={this.disableEdit}
				></textarea>
				{this.charLimit ? <span class="c-textarea__counter" innerHTML={`${this.charCounter} / ${this.charLimit}`}></span> : null}
			</Host>
		);
	}
}
