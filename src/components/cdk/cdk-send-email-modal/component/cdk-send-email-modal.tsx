import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKTopicCreateMembers } from '../../cdk-topic-create/models/cdk-topic-create.model';
import { Dataform, ILiterals } from '../models/cdk-send-email-modal.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-send-email-modal',
	styleUrl: 'cdk-send-email-modal.scss',
	shadow: false,
	scoped: true,
})
export class CDKSendEmailModal {
	/** Oculta el contenido del slot */
	@Prop({ reflect: true }) hide: boolean = false;

	/** Data form filled*/
	@Prop() dataForm: Dataform = {
		selectedMembers: [],
		textarea: '',
	};

	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: true }) disabledSubmit: boolean = true;

	/** ID de la lista de miembros */
	@Prop() idList: string;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
		this.dataForm.textarea = this._literals.textAreaValue;
	}

	/** Array de miembros de la conversación seleccionables para enviar el email */
	@Prop({ mutable: true, reflect: true }) members: string | ICDKTopicCreateMembers[];
	@State() _members: ICDKTopicCreateMembers[];
	@Watch('members') parseMembers(newVal: string | ICDKTopicCreateMembers[]) {
		this._members = _parseProp(newVal);
	}

	/** Selected members on edit modal */
	@Prop({ mutable: true, reflect: true }) selectedMembers: string | Array<string>;
	@State() _selectedMembers: Array<string> = [];
	@Watch('selectedMembers') parseSelectedMembers(newVal: string | Array<string>) {
		this._selectedMembers = _parseProp(newVal);
	}

	/** Array of owners from VDR */
	@Prop({ mutable: true, reflect: true }) owners: string | ICDKTopicCreateMembers[];
	@State() _owners: ICDKTopicCreateMembers[];
	@Watch('owners') parseOwners(newVal: string | ICDKTopicCreateMembers[]) {
		this._owners = _parseProp(newVal);
	}

	@Prop() isEmployee: boolean = true;
	@Watch('isEmployee') parseIsEmployee(newVal: boolean) {
		this._isEmployee = newVal;
		this.disabledSubmit = newVal;
	}
	@State() _isEmployee: boolean;

	@State() descriptionCounter: number = 0;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseMembers(this.members);
		this.parseIsEmployee(this.isEmployee);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Cic-lo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	/** Cambio en los miembros seleccionados */
	@Event() selectedMembersChange: EventEmitter;

	_handleCheckbox(e: any, id: string) {
		let selectedUser = this._members.filter(item => item.id == id)[0];
		if (e.detail === true && selectedUser) {
			this.dataForm.selectedMembers.push(selectedUser);
		} else {
			const index = this.dataForm.selectedMembers.map(user => user.id).indexOf(id);
			if (index !== -1) {
				this.dataForm.selectedMembers.splice(index, 1);
			}
		}

		if (this.dataForm.selectedMembers.length === 0) {
			this._allSelected = false;
			this._partialSelection = false;
			this._noneSelected = true;
		} else if (this.dataForm.selectedMembers.length < this._members.length) {
			this._allSelected = false;
			this._partialSelection = true;
			this._noneSelected = false;
		} else if (this.dataForm.selectedMembers.length === this._members.length) {
			this._allSelected = true;
			this._partialSelection = false;
			this._noneSelected = false;
		}
		this.dataForm = { ...this.dataForm };
		this.selectedMembersChange.emit(this.dataForm.selectedMembers);
		this.validationRequired();
	}

	_handleTextarea(e: any) {
		this.dataForm.textarea = e.detail;
		this.descriptionCounter = this.dataForm.textarea.length;
		this.validationRequired();
	}

	/** Emitter to cancel edit */
	_handleCancel() {
		this.eventCancelEdit.emit();
	}

	/** Emitter data form filled */
	_handleSend() {
		this.eventValuesFormEmitter.emit(JSON.stringify(this.dataForm));
	}

	/** Event cancel edit */
	@Event() eventCancelEdit: EventEmitter;

	/** Event form emitter */
	@Event() eventValuesFormEmitter: EventEmitter;

	@State() _allSelected: boolean = false;
	@State() _partialSelection: boolean = false;
	@State() _noneSelected: boolean = true;

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		this.disabledSubmit = !this.dataForm.textarea || (this._members && this._members.length > 0 && this.dataForm.selectedMembers.length === 0);
		return;
	}

	render() {
		return (
			<Host>
				<section class="cdk-sendEmail">
					<h1 class="cdk-sendEmail__title">{this._literals.title}</h1>
					<br />
					<p innerHTML={this._literals.infoMessage}></p>
					<br />
					{this._isEmployee ? (
						<div class="cdk-sendEmail__member-container">
							<div class="members-header">
								<label class={{ 'cdk-sendEmail__members-label': true, 'accessibility': !this._literals.membersLabel }} htmlFor={this.idList}>
									{this._literals.membersLabel.toUpperCase()}
								</label>
								<span
									class="toggle-select-all"
									onClick={() => {
										// SI TODOS SELECCIONAMOS VACIAMOS
										if (this._allSelected) {
											this.dataForm = { ...this.dataForm, selectedMembers: [] };
											this._allSelected = false;
											this._noneSelected = true;
											this._partialSelection = false;
											this.selectedMembersChange.emit(this.dataForm.selectedMembers);
											this.validationRequired();
										} else {
											this.dataForm.selectedMembers = [];
											setTimeout(() => {
												this.dataForm = { ...this.dataForm, selectedMembers: [...this._members] };
												this._allSelected = true;
												this._noneSelected = false;
												this._partialSelection = false;
												this.selectedMembersChange.emit(this.dataForm.selectedMembers);
												this.validationRequired();
											}, 0);
										}
									}}
								>
									{this._noneSelected || this._partialSelection ? this._literals.selectAllLabel : this._literals.unselectAllLabel}
								</span>
							</div>
							<ul class="cdk-sendEmail__list" id={this.idList}>
								{this._members &&
									this._members.length > 0 &&
									this._members?.map(selectedItem => (
										<li class="cdk-sendEmail__item">
											<scib-ui-checkbox
												is-employee={selectedItem.isEmployee}
												avatar={selectedItem.avatar}
												label={selectedItem.name}
												email={selectedItem.email}
												inSendEmail={true}
												onCheckboxChange={() => this._handleCheckbox(event, selectedItem.id)}
												checked={this.dataForm.selectedMembers?.map(member => member.id).indexOf(selectedItem?.id) !== -1 ? true : false}
											></scib-ui-checkbox>
										</li>
									))}
							</ul>
						</div>
					) : (
						''
					)}
					{this._isEmployee ? <br /> : ''}
					{this._isEmployee ? (
						<scib-ui-textarea
							label-txtarea={this._literals.textAreaLabel}
							id-txtarea={this._literals.textAreaId}
							name-txtarea={this._literals.textAreaName}
							onEventChange={() => this._handleTextarea(event)}
							required={true}
							placeholder-txtarea={this._literals.placeholderTextarea}
							value-txtarea={this._literals.textAreaValue}
						></scib-ui-textarea>
					) : (
						''
					)}
					<footer
						class={{
							'cdk-sendEmail__footer': true,
							'cdk-sendEmail__footer__client': !this._isEmployee,
							'cdk-sendEmail__footer__employee': this._isEmployee,
						}}
					>
						{this._isEmployee ? <span class="cdk-sendEmail__notice">{this._literals.notice}</span> : ''}
						<div class="cdk-sendEmail__buttons">
							<scib-ui-button secondary onEventClick={() => this._handleCancel()}>
								{this._literals.btnCancel}
							</scib-ui-button>
							<scib-ui-button primary disabled={this.disabledSubmit} onEventClick={() => this._handleSend()}>
								{this._literals.btnSend}
							</scib-ui-button>
						</div>
					</footer>
				</section>
			</Host>
		);
	}
}
