import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKCancelModalLiterals } from '../models/cdk-ssis-cancel.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-ssis-cancel',
	styleUrl: 'cdk-ssis-cancel.scss',
	shadow: false,
	scoped: true,
})
export class CDKSsisCancel {
	/** Data form filled*/
	@Prop() dataForm: any = {};
	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: true }) disabledSubmit: boolean = true;
	/** Textarea*/
	@Prop({ mutable: true, reflect: true }) textarea: '';

	/**Modal Literals */
	@Prop({ reflect: true }) literals: ICDKCancelModalLiterals | string;
	@Watch('literals') literalsChange(newVal: ICDKCancelModalLiterals | string) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKCancelModalLiterals;

	/** Event cancel modal */
	@Event() eventCancelModal: EventEmitter;
	/** Event form emitter */
	@Event() eventValuesFormEmitter: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.literalsChange(this.literals);
	}

	/** Bind of the scope of this.*/
	constructor() {
		this._handleTextarea = this._handleTextarea.bind(this);
	}

	_handleTextarea(e: any) {
		this.dataForm.textarea = e.detail;
		this.validationRequired();
	}

	/** Emitter to cancel modal */
	_handleCancel() {
		this.eventCancelModal.emit();
	}

	/** Emitter form filled */
	_handleFinish() {
		this.eventValuesFormEmitter.emit(this.dataForm);
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "submit" button
	 *  of the parent is activated*/
	validationRequired() {
		if (!this.dataForm.textarea || this.dataForm.textarea === '') {
			this.disabledSubmit = true;
		} else {
			this.disabledSubmit = false;
		}
		return;
	}
	render() {
		return (
			<section class="cdk-mssis">
				<h2 class="cdk-mssis__title">{this._literals.mainTitle}</h2>
				<form class="cdk-mssis__form" name="ssis-cancel-form" action="post">
					<fieldset class="cdk-mssis__fieldset">
						<legend class="cdk-mssis__legend">{this._literals.legend}</legend>
						<scib-ui-textarea
							label-txtarea={this._literals.textAreaLabel}
							id-txtarea="textAreaCancelModal"
							name-txtarea="CancelModalTextArea"
							placeholder-txtarea={this._literals.textAreaPlaceholder}
							onEventChange={this._handleTextarea}
							required={true}
						></scib-ui-textarea>
					</fieldset>
				</form>
				<footer class="cdk-mssis__footer">
					<span class="cdk-mssis__notice">{this._literals.notice}</span>
					<div class="cdk-mssis__buttons">
						<scib-ui-button secondary type="submit" onEventClick={() => this._handleCancel()}>
							{this._literals.cancelBtn}
						</scib-ui-button>
						<scib-ui-button primary type="submit" disabled={this.disabledSubmit} onEventClick={() => this._handleFinish()}>
							{this._literals.submitBtn}
						</scib-ui-button>
					</div>
				</footer>
			</section>
		);
	}
}
