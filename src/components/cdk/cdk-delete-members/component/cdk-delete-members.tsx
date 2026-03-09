import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { ICDKDeleteMembersLiterals, ICDKDeleteMember } from '../models/cdk-delete-members.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot form - Form slot content
 */
@Component({
	tag: 'scib-cdk-delete-members',
	styleUrl: 'cdk-delete-members.scss',
	shadow: false,
	scoped: true,
})
export class CDKDeleteMembers {
	_dialogLiterals: string;

	/** Data form filled*/
	@Prop() dataForm: any = {};

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKDeleteMembersLiterals;
	@Watch('literals') parseLiterals(newLiterals: string | ICDKDeleteMembersLiterals) {
		this._literals = _parseProp(newLiterals);
	}

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) member: string | ICDKDeleteMember;
	@Watch('member') parseMember(newVal: string | ICDKDeleteMember) {
		this._member = _parseProp(newVal);
	}

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) topics: string | Array<string>;
	@Watch('topics') parseTopics(newVal: string | Array<string>) {
		this._topics = _parseProp(newVal);
	}

	@State() disabledSubmit: boolean = true;
	@State() _literals: ICDKDeleteMembersLiterals;
	@State() _member: ICDKDeleteMember;
	@State() _topics: Array<string>;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseMember(this.member);
		this.parseTopics(this.topics);
		this._dialogLiterals = JSON.stringify({
			typeDialog: 'attention',
			mainTitle: this._literals.title,
			message: this._literals.subTitle,
			btnLeft: this._literals.cancelBtn,
			btnRight: this._literals.submitBtn,
		});
	}

	_handleCheckbox(e: any) {
		this.dataForm.confirmDelete = e.detail;
		this.validationRequired();
	}

	_handleTextarea(e: any) {
		this.dataForm.textarea = e.detail;
		this.validationRequired();
	}

	/** Emitter to cancel edit */
	_handleCancel() {
		this.eventCancelEdit.emit();
	}

	/** Emitter data form filled */
	_handleFinish() {
		this.eventValuesFormEmitter.emit(this.dataForm);
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		if (!this.dataForm.confirmDelete || !this.dataForm.textarea) {
			this.disabledSubmit = true;
		} else {
			this.dataForm.userId = this._member.id;
			this.disabledSubmit = false;
		}
		return;
	}

	@Listen('eventFinishProcess')
	eventFinishProcessHandler() {
		this._handleFinish();
	}

	@Listen('eventContractionProcess')
	eventContractionProcessHandler() {
		this._handleCancel();
	}

	/** Evento lanzado cuando se cancela la acción */
	@Event() eventCancelEdit: EventEmitter;

	/** Evento lanzado cuando se finaliza la acción */
	@Event() eventValuesFormEmitter: EventEmitter;

	render() {
		return (
			<Host>
				<scib-cdk-dialog-process literals={this._dialogLiterals} disabled-finish={this.disabledSubmit} alt-text>
					<section slot="form" class="cdk-delete-member">
						<scib-ui-avatar is-employee={this._member.isEmployee} images={[this._member.avatar]}></scib-ui-avatar>
						<span class="cdk-delete-member__name">{this._member.name}</span>
						<span class="cdk-delete-member__description">
							<span class="cdk-delete-member__message">{this._literals.message} </span>
							<span class="cdk-delete-member__message--topics">
								{this._topics.map((topic, index) => {
									if (index === this._topics.length - 1) {
										return topic + '.';
									} else {
										return topic + ', ';
									}
								})}
							</span>
						</span>
						<form class="cdk-delete-member__form" name="vdr-edit-form" action="post">
							<div class="cdk-delete-member__group">
								<scib-ui-checkbox label={this._literals.selectLabel} onCheckboxChange={() => this._handleCheckbox(event)} checked={false}></scib-ui-checkbox>
							</div>
							<scib-ui-textarea
								label-txtarea={this._literals.textAreaLabel}
								id-txtarea="deleteMemberReason"
								name-txtarea="deleteMemberReason"
								placeholder-txtarea={this._literals.textAreaPlaceholder}
								onEventChange={() => this._handleTextarea(event)}
								required={true}
							></scib-ui-textarea>
						</form>
					</section>
				</scib-cdk-dialog-process>
			</Host>
		);
	}
}
