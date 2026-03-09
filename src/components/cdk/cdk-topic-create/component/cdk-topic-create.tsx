import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKTopicCreateLiterals, ICDKTopicCreateMembers, ICDKTopicEdit } from '../models/cdk-topic-create.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-topic-create',
	styleUrl: 'cdk-topic-create.scss',
	shadow: false,
	scoped: false,
})
export class CDKTopicCreate {
	/** Data form filled*/
	@Prop() dataForm: any = {};

	/** ID de la lista de miembros */
	@Prop() idList: string;

	/** Indica si la modal se abrira en modo edición */
	@Prop() edit: boolean = false;

	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: true }) disabledSubmit: boolean = true;

	/** Selected members on edit modal */
	@Prop({ mutable: true, reflect: true }) selectedMembers: string | Array<string>;
	@Watch('selectedMembers') parseSelectedMembers(newVal: string | Array<string>) {
		this._selectedMembers = _parseProp(newVal);
	}
	@State() _selectedMembers: Array<string>;

	/** Literales de la modal */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKTopicCreateLiterals;
	@Watch('literals') parseLiterals(newVal: string | ICDKTopicCreateLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKTopicCreateLiterals;

	/** Array de miembros de la VDR que se pueden añadir al topico */
	@Prop({ mutable: true, reflect: true }) members: string | ICDKTopicCreateMembers[];
	@Watch('members') parseMembers(newVal: string | ICDKTopicCreateMembers[]) {
		this._members = _parseProp(newVal);
	}
	@State() _members: ICDKTopicCreateMembers[];

	/** Array of owners from VDR */
	@Prop({ mutable: true, reflect: true }) owners: string | ICDKTopicCreateMembers[];
	@Watch('owners') parseOwners(newVal: string | ICDKTopicCreateMembers[]) {
		this._owners = _parseProp(newVal);
	}
	@State() _owners: ICDKTopicCreateMembers[];

	/** Topic form data */
	@Prop({ mutable: true, reflect: true }) topicData: string | ICDKTopicEdit;
	@Watch('topicData') parseTopicData(newVal: string | ICDKTopicEdit) {
		this._topicData = _parseProp(newVal);
		this.nameCounter = this._topicData.name.length;
		this.descriptionCounter = this._topicData.description.length;
	}
	@State() _topicData: ICDKTopicEdit;

	/** Limite de caracteres de la descripción */
	@Prop() charLimitDescription: number;

	/** Limite de caracteres del nombre */
	@Prop() charLimitName: number;

	@State() descriptionCounter: number = 0;
	@State() nameCounter: number = 0;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseMembers(this.members);
		this.parseOwners(this.owners);
		this.parseSelectedMembers(this.selectedMembers);
		this.parseTopicData(this.topicData);
		this.dataForm.selectedMembers = [];

		if (this.edit) {
			this.dataForm = {
				input: this._topicData.name,
				textarea: this._topicData.description,
				selectedMembers: this._selectedMembers,
			};
		}

		// this.selectOwners();
	}

	/** Event cancel edit */
	@Event() eventCancelEdit: EventEmitter;

	/** Event form emitter */
	@Event() eventValuesFormEmitter: EventEmitter;

	/** Event input enter value */
	@Event() eventValueInput: EventEmitter;

	/** Event open VDR config */
	@Event() eventOpenVdrConfig: EventEmitter;

	_handleInput(e: any) {
		this.dataForm.input = e.detail;
		this.nameCounter = this.dataForm.input.length;
		this.eventValueInput.emit(e);
		this.validationRequired();
	}

	_handleTextarea(e: any) {
		this.dataForm.textarea = e.detail;
		this.descriptionCounter = this.dataForm.textarea.length;
		this.validationRequired();
	}

	_handleCheckbox(e: any, id: string) {
		if (e.detail === true) {
			this.dataForm.selectedMembers.push(id);
		} else {
			const index = this.dataForm.selectedMembers.indexOf(id);
			if (index > -1) {
				this.dataForm.selectedMembers.splice(index, 1);
			}
		}
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

	/** Emitter to open VDR configuration */
	_handleOpenVdr() {
		this.eventOpenVdrConfig.emit();
	}

	selectOwners() {
		if (this._owners?.length > 0) {
			this._owners.map(owners => {
				this.dataForm.selectedMembers.push(owners.id);
			});
			this.validationRequired();
		}
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		this.disabledSubmit =
			!this.dataForm.input ||
			this.dataForm.input.length === 0 ||
			!this.dataForm.textarea ||
			(this._members &&
				this._members.length > 0 &&
				this.dataForm.selectedMembers.length === 0 &&
				this._owners &&
				this._owners.length === 0);
		return;
	}

	render() {
		return (
			<Host>
				<section class="cdk-topic">
					<form class="cdk-topic__form" name="vdr-edit-form" action="post">
						<fieldset class="cdk-topic__fieldset">
							<legend
								class="cdk-topic__title"
								innerHTML={this.edit ? this._literals.editTitle : this._literals.mainTitle}
							></legend>
							<div class="cdk-topic__group cdk-topic__group--half">
								<scib-ui-input
									label={this._literals.labelInput}
									placeholder={this._literals.placeholderInput}
									required={true}
									debounceTime={450}
									onEventChange={$event => this._handleInput($event)}
									onListEventChange={$event => this._handleInput($event)}
									value={this._topicData?.name}
									no-min-height
									char-limit={this.charLimitName ? this.charLimitName : null}
									char-counter={this.nameCounter}
								></scib-ui-input>
							</div>
							<scib-ui-textarea
								label-txtarea={this._literals.textAreaLabel}
								id-txtarea={this._literals.textAreaId}
								name-txtarea={this._literals.textAreaName}
								placeholder-txtarea={this._literals.placeholderTextarea}
								onEventChange={() => this._handleTextarea(event)}
								required={true}
								value-txtarea={this._topicData?.description}
								char-limit={this.charLimitDescription ? this.charLimitDescription : null}
								char-counter={this.descriptionCounter}
							></scib-ui-textarea>
							<div class="cdk-topic__member-container">
								<label
									class={{ 'cdk-topic__members-label': true, 'accessibility': !this._literals.membersLabel }}
									htmlFor={this.idList}
								>
									{this._literals.membersLabel}
								</label>
								<ul class="cdk-topic__list" id={this.idList}>
									{this._owners &&
										this._owners.length > 0 &&
										this._owners?.map(selectedItem => (
											<li class="cdk-topic__item">
												<scib-ui-checkbox
													is-employee={selectedItem.isEmployee}
													avatar={selectedItem.avatar}
													label={selectedItem.name}
													onCheckboxChange={() => this._handleCheckbox(event, selectedItem.id)}
													checked={true}
													isDisabled
												></scib-ui-checkbox>
											</li>
										))}
									{this._members &&
										this._members.length > 0 &&
										this._members?.map(selectedItem => (
											<li class="cdk-topic__item">
												<scib-ui-checkbox
													is-employee={selectedItem.isEmployee}
													avatar={selectedItem.avatar}
													label={selectedItem.name}
													onCheckboxChange={() => this._handleCheckbox(event, selectedItem.id)}
													checked={
														this._selectedMembers && this.edit
															? this._selectedMembers.indexOf(selectedItem.id) !== -1
																? true
																: false
															: false
													}
												></scib-ui-checkbox>
											</li>
										))}
								</ul>
							</div>
							{!this._members || this._members.length === 0 || this._members === null ? (
								<div class="cdk-topic__no-members-container">
									<span class="cdk-topic__no-members-txt">{this._literals.noMembers}</span>
									<scib-ui-button onClick={() => this._handleOpenVdr()} class="cdk-topic__vdr-btn" nobackground link small>
										{this._literals.vdrConfig}
									</scib-ui-button>
								</div>
							) : null}
						</fieldset>
					</form>
					<footer class="cdk-topic__footer">
						<span class="cdk-topic__notice">{this._literals.notice}</span>
						<div class="cdk-topic__buttons">
							<scib-ui-button secondary type="submit" onEventClick={() => this._handleCancel()}>
								{this._literals.btnCancel}
							</scib-ui-button>
							<scib-ui-button primary type="submit" disabled={this.disabledSubmit} onEventClick={() => this._handleFinish()}>
								{this._literals.btnSave}
							</scib-ui-button>
						</div>
					</footer>
				</section>
			</Host>
		);
	}
}
