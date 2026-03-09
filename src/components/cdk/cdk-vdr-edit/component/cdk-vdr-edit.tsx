import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import {
	ETypeOfValueCheckBox,
	ICDKVdrEditLiterals,
	IEventDetailCheckboxClicked,
	IMemberList,
	IMemberListProp,
	IMemberRemove,
	INewMemberRemove,
	ISelectListChange,
	TOptionDefaultCheckbox
} from '../models/cdk-vdr-edit.model';

@Component({
	tag: 'scib-cdk-vdr-edit',
	styleUrl: 'cdk-vdr-edit.scss',
	shadow: false,
	scoped: false
})
export class CDKVdrEdit {
	parseOwnersCounter = 0;

	parseMembersCounter = 0;

	hasChanged: boolean = false;

	initialOwners: any[] = [];

	/**Literals */
	@Prop({ reflect: true }) literals: ICDKVdrEditLiterals | string;

	/** Input*/
	@Prop({ mutable: true, reflect: true }) input: '';
	@Prop({ mutable: true, reflect: true }) inputDisabled: boolean = false;

	/** Textarea*/
	@Prop({ mutable: true, reflect: true }) textarea: '';
	@Prop({ mutable: true, reflect: true }) textareaDisabled: boolean = false;

	/** Multiselect Contact*/
	@Prop({ reflect: true }) contactsLabelTxt: string;

	/** Owners selected to multislect*/
	@Prop({ mutable: true, reflect: true }) selectedOwners: string;

	@State() _selectedOwners = [];

	@State() loadingSaveVDR: boolean;

	@Watch('selectedOwners') parseSelectedOwners(newVal?) {
		if (newVal && this.initialOwners.length > 0) {
			const parsedNewVal = JSON.parse(newVal);
			const sortedInitialOwners = [...this.initialOwners].sort((a, b) => a.value - b.value);
			const sortedParsedNewVal = [...parsedNewVal].sort((a, b) => a.value - b.value);

			sortedParsedNewVal.forEach((ow, i) => {
				if (ow?.value !== undefined && sortedInitialOwners[i]?.value !== ow?.value) {
					this.hasChanged = true;
					this.validationRequired();
				} else {
					this.hasChanged = false;
				}
			});
		}

		if (!this.selectedOwners) return;
		const parsedOwners = JSON.parse(this.selectedOwners);
		this._selectedOwners = [...parsedOwners, ...this._newOwners];
	}

	/** Members selected to multislect*/
	@Prop({ mutable: true, reflect: true }) selectedMembers: string;

	@State() _selectedMembers = [];

	@Watch('selectedMembers') parseSelectedMembers(_newVal?: any) {
		if (!this.selectedMembers) return;
		this._selectedMembers = JSON.parse(this.selectedMembers);
	}

	/** Remove owners selected to multislect*/
	@Prop({ mutable: true, reflect: true }) removedOwner;

	/** Remove members selected to multislect*/
	@Prop({ mutable: true, reflect: true }) removedMember;

	@Prop({ mutable: true, reflect: true }) membertoadd: string;
	@State() _membertoadd;
	@Watch('membertoadd') addNewMember() {
		try {
			if (!this.membertoadd) return;
			this._membertoadd = JSON.parse(this.membertoadd);
			const _event = new CustomEvent('addNewMember', { detail: this._membertoadd });
			this.listEventChangeHandler2(_event);
		} catch (e) {
			console.error(e);
		}
	}

	/** Owners list to multislect*/
	@Prop({ mutable: true, reflect: true }) ownersList: string;

	@State() _ownersList;

	@Watch('ownersList') parseOwnersList() {
		try {
			if (!this.ownersList) return;
			this._ownersList = JSON.parse(this.ownersList);

			this.mapOptionsToInput = this._ownersList.map((user) => ({
				value: user.id,
				name: user.name,
				secondary: user.email ? user.email : null,
				avatar: user.avatar,
				isSelected: false,
				isEmployee: user.isEmployee,
				ldapUid: user.ldapUid
			}));

			if (this.selectedOwners && this.parseOwnersCounter === 0) {
				const preselected = JSON.parse(this.selectedOwners);
				for (const ps of preselected) {
					this.mapOptionsToInput = this.mapOptionsToInput.filter((option) => {
						if (option.value !== ps.value) {
							return option;
						}
					});
				}
				this.parseOwnersCounter++;
			}
		} catch (e) {
			console.error(e);
		}
	}

	@Prop({ mutable: true, reflect: true }) membersList: string;

	@State() _membersList: IMemberList[];

	@Watch('membersList') parseMembersList() {
		try {
			if (!this.membersList) return;

			this._membersList = JSON.parse(this.membersList || '{}')?.map((user: IMemberListProp) => ({
				value: user?.id,
				name: user?.name,
				secondary: user?.email ? user.email : null,
				avatar: user?.avatar,
				isSelected: false,
				isEmployee: user?.isEmployee,
				ldapUid: user?.ldapUid
			}));

			if (this.selectedMembers && this.parseMembersCounter === 0) {
				const preselected = JSON.parse(this.selectedMembers);
				for (const ps of preselected) {
					this._membersList = this._membersList.filter((option) => {
						if (option.value !== ps.value) {
							return option;
						}
					});
				}
				this.parseMembersCounter++;
			}
		} catch (e) {
			console.error(e);
		}
	}

	/** Enable open select when new array is introduced */
	@Prop({ reflect: true }) openOptionsMembers: boolean;

	/** Enable open select when new array is introduced */
	@Prop({ reflect: true }) openOptionsOwners: boolean;

	/** Enable skeleton in select */
	@Prop({ reflect: true }) loadingSelectMembers: boolean;

	/** Enable skeleton in select */
	@Prop({ reflect: true }) loadingSelectOwners: boolean;

	/** If it is true, open Select Options when input array is introduced */
	@Prop({ reflect: true }) backMode: boolean;

	@Prop({ mutable: true, reflect: true }) mapOptionsToInput;

	@Prop() optionDefaultCheckbox: TOptionDefaultCheckbox;

	/** Data form filled*/
	@Prop() dataForm: any = {};
	@Watch('dataForm') checkDataForm(newVal?) {
		if (newVal) {
			this.hasChanged = true;
			this.validationRequired();
		}
	}

	@Prop({ mutable: true, reflect: true }) monitorizedOwner;

	@State() _monitorizedOwner;

	@Watch('monitorizedOwner') parseMonitorizedOwner() {
		const newMonitorized = this.monitorizedOwner;
		if (newMonitorized) {
			let currentElement = this._selectedOwners.find((owner) => owner.value == newMonitorized);
			if (currentElement) {
				this._monitorizedOwner = currentElement;
				this.removedOwner = { detail: this._monitorizedOwner };
				this._handleOwnerRemove(this.removedOwner);
			}
		}
	}

	@Prop({ mutable: true, reflect: true }) monitorizedMember = '';

	@State() _monitorizedMember;

	@Watch('monitorizedMember') parseMonitorizedMember() {
		const newMonitorized = this.monitorizedMember;

		if (newMonitorized) {
			const currentElement = this._selectedMembers.find((owner) => owner.value == newMonitorized);
			if (currentElement) {
				this._monitorizedMember = currentElement;
				this.removedMember = { detail: currentElement };
				this._handleMemberRemove(this.removedMember);
			}
		}
	}

	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: true }) disabledSubmit: boolean = true;

	/** Id del usuario logado. */
	@Prop({ mutable: true, reflect: true }) loggedUser: string;

	@Watch('literals') literalsChange(newVal: ICDKVdrEditLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	@State() _literals: ICDKVdrEditLiterals;

	/** String to indicate that there are no matches with the search engine */
	@Prop({ mutable: true, reflect: false }) noResult: string;

	@State() _ownerIsNew: boolean;

	@State() _newOwners = [];

	@State() _newSelectedMembers;
	@Watch('_newSelectedMembers') checkNewSelectedMembers(newVal?) {
		if (newVal && newVal.length > 0) {
			this.hasChanged = true;
			this.validationRequired();
		}
	}

	@State() _memberIsNew: boolean;

	/** Event member remove */
	@Event() eventMemberRemove: EventEmitter;

	/** Event new member remove */
	@Event() eventNewMemberRemove: EventEmitter;

	/** Event member remove */
	@Event() eventOwnerRemove: EventEmitter;

	/** Event cancel edit */
	@Event() eventCancelEdit: EventEmitter;

	/** Event form emitter */
	@Event() eventValuesFormEmitter: EventEmitter;

	/** Event form emitter */
	@Event() eventInputSelectOwners: EventEmitter;

	/** Event form emitter */
	@Event() eventInputSelectMembers: EventEmitter;

	/** Event form emitter */
	@Event() eventUserSelectClicked: EventEmitter;

	@Event() eventMemberSelectClicked: EventEmitter;

	@Listen('updateOwners') updateOnwersHandler(removedOwner) {
		if (!this._ownerIsNew) return;
		this.hasChanged = false;
		this.removedOwner = removedOwner;
		const index = this._selectedOwners.indexOf(this.removedOwner.detail);
		if (index > -1) {
			this._selectedOwners.splice(index, 1);
		}
		this.validationRequired();
	}

	@Listen('checkboxClicked') _handlerCheckboxClicked(e: CustomEvent & { detail: IEventDetailCheckboxClicked }) {
		this._newSelectedMembers[Number(e.detail?.id)].isCheckboxChecked = e?.detail?.value === ETypeOfValueCheckBox.checked ? true : false;
	}

	constructor() {
		this._handleInput = this._handleInput.bind(this);
		this._handleTextarea = this._handleTextarea.bind(this);
	}

	/*** Custom Methods ***/

	_handleInput(e: any) {
		this.dataForm.input = e.detail;
		this.validationRequired();
	}

	_handleTextarea(e: any) {
		this.dataForm.textarea = e.detail;
		this.validationRequired();
	}

	_handleMultiselect(e: any) {
		this.dataForm.selectedOwners = e;
		this.validationRequired();
	}

	_handleMultiselectMembers(e: any) {
		this.dataForm.selectedMembers = e;
		this.validationRequired();
	}

	_handleMemberRemove(e: CustomEvent & { detail: IMemberRemove }) {
		e.stopPropagation();
		e.preventDefault();

		const initialMembers = JSON.parse(this.selectedMembers);
		this._memberIsNew = true;

		initialMembers.forEach((mb) => {
			if (e.detail.value === mb.value) {
				this._memberIsNew = false;
			}
		});

		this.updateMembersHandler(e);
		this.eventMemberRemove.emit({ user: e.detail, isNew: this._memberIsNew });
	}

	_handleNewMemberRemove(e: CustomEvent & { detail: INewMemberRemove }) {
		e.stopPropagation();
		e.preventDefault();

		this._newSelectedMembers = this._newSelectedMembers?.filter((element) => e.detail?.value !== element?.value);

		const initialMembers = JSON.parse(this.selectedMembers);
		this._memberIsNew = true;

		initialMembers.forEach((mb) => {
			if (e.detail.value === mb.value) {
				this._memberIsNew = false;
				this.hasChanged = true;
			} else {
				this.hasChanged = false;
			}
		});

		this.updateMembersHandler(e);
		this.validationRequired();
		this.eventNewMemberRemove.emit(e.detail);
	}

	_handleOwnerRemove(owner) {
		this._ownerIsNew = true;
		this.initialOwners.forEach((ow) => {
			if (owner?.detail?.value === ow?.value) {
				this._ownerIsNew = false;
			}
		});

		this.updateOnwersHandler(owner);
		this.eventOwnerRemove.emit({ user: owner.detail, isNew: this._ownerIsNew });
	}

	_handleCancel() {
		this.eventCancelEdit.emit();
		this._newSelectedMembers = [];
		this.hasChanged = false;
	}

	_handleFinish(e: CustomEvent) {
		e.stopPropagation();
		e.preventDefault();
		this.loadingSaveVDR = true;
		this.eventValuesFormEmitter.emit(this._newSelectedMembers);
	}

	_handleSelect1(e: CustomEvent & { detail: string }) {
		e.stopPropagation();
		e.preventDefault();
		this.eventInputSelectOwners.emit(e);
	}

	_handleSelect2(e: CustomEvent & { detail: string }) {
		e.stopPropagation();
		e.preventDefault();
		this.eventInputSelectMembers.emit(e);
	}

	updateMembersHandler(removedMember: any) {
		if (!this._memberIsNew) return;
		this.removedMember = removedMember;
		const index = this._selectedMembers.indexOf(this.removedMember);
		if (index > -1) {
			this._selectedMembers.splice(index, 1);
		}
	}

	listEventChangeHandler(event) {
		event.preventDefault();
		event.detail['selectType'] = 'owner';
		this.eventUserSelectClicked.emit(event.detail);

		setTimeout(() => {
			let element = event.detail;
			element.map((el, el_index) => {
				this._selectedOwners.map((sm) => {
					if (el.value === sm.value) {
						element.splice(el_index, 1);
					}
				});
			});
			this._newOwners = element;
			this._selectedOwners = [...this._selectedOwners, ...this._newOwners];
			this._handleMultiselect(this._selectedOwners);
		}, 100);
	}

	listEventChangeHandler2(e: CustomEvent & { detail: ISelectListChange[] }) {
		e.preventDefault();
		e.stopPropagation();
		e.detail['selectType'] = 'member';

		this.eventMemberSelectClicked.emit(e.detail);

		setTimeout(() => {
			if (this._newSelectedMembers?.length) {
				if (this._newSelectedMembers.map((elem) => elem.value).indexOf(e?.detail[e?.detail?.length - 1].value) < 0) {
					this._newSelectedMembers = [...this._newSelectedMembers, e?.detail[e?.detail?.length - 1]];
				}
			} else {
				this._newSelectedMembers = e?.detail;
			}

			this._newSelectedMembers?.forEach((element) => {
				element.labelCheckbox = this._literals.labelCheckboxNewItems;

				if (!element?.isCheckboxChecked) element.isCheckboxChecked = false;
				if (!element.isCheckboxCheckedDefault) {
					element.optionDefaultCheckbox = this.optionDefaultCheckbox;
					element.isCheckboxChecked = this.optionDefaultCheckbox === ETypeOfValueCheckBox.checked ? true : false;
				}
			});
			this._handleMultiselectMembers(this._selectedMembers);
		}, 100);
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		if (
			(!this.dataForm.input && !this.input) ||
			(!this.dataForm.textarea && !this.textarea) ||
			this._selectedOwners.length < 1 ||
			!this.hasChanged
		) {
			this.disabledSubmit = true;
		} else {
			this.disabledSubmit = false;
		}
	}

	resetToOwnersList(user) {
		const userExists = this.mapOptionsToInput.filter((option) => option.value === user.value);
		if (userExists.length === 0) {
			this.mapOptionsToInput.push(user);
		}
	}

	resetToMembersList(user) {
		const userExists = this._membersList.filter((option) => option.value === user.value);
		if (userExists.length === 0) {
			this._membersList.push(user);
		}
	}

	/** LifeCycle methods */

	componentWillLoad() {
		this.initialOwners = JSON.parse(this.selectedOwners);
		this.literalsChange(this.literals);
		this.addNewMember();
		this.parseOwnersList();
		this.parseMembersList();
		this.parseSelectedMembers();
		this.parseSelectedOwners();
		this.checkDataForm();
		this.parseMonitorizedOwner();
		this.parseMonitorizedMember();
		this.loadingSaveVDR = false;
	}

	render() {
		return (
			<section class="cdk-evdr">
				<form class="cdk-evdr__form" name="vdr-edit-form" action="post">
					<fieldset class="cdk-evdr__fieldset">
						<legend class="cdk-evdr__title" innerHTML={this._literals.mainTitle}></legend>
						<div class="cdk-evdr__group">
							<scib-ui-input
								label={this._literals.labelInput}
								placeholder={this._literals.placeholderInput}
								required={true}
								debounceTime={450}
								value={this.input}
								onEventChange={this._handleInput}
								disableEdit={this.inputDisabled}
								no-min-height
							/>
							<scib-ui-textarea
								label-txtarea={this._literals.textAreaLabel}
								id-txtarea={this._literals.textAreaId}
								name-txtarea={this._literals.textAreaName}
								placeholder-txtarea={this._literals.placeholderTextarea}
								onEventChange={this._handleTextarea}
								valueTxtarea={this.textarea}
								required={true}
								disableEdit={this.textareaDisabled}
							/>
							<scib-ui-list
								owners={this._selectedOwners}
								label={this._literals.ownersLabel}
								onUpdateOwners={this._handleOwnerRemove.bind(this)}
								loggedUser={this.loggedUser}
								hiddenLabel={false}
							/>
							<scib-ui-select
								class="c-header-form-field"
								iconLeftClasses="c-tab-icon u-icon icon-search iconitem-glass"
								idSelect="owners"
								name="owner-list"
								debounce-time="300"
								viewBoxSkeleton="0 0 668 150"
								autocomplete
								required={true}
								noResult={this.noResult}
								label={this._literals.labelMultiSelect}
								placeholder-select={this._literals.placeholderMultiSelect}
								removedPosition={this.removedOwner}
								optionsTitleTxt={this.contactsLabelTxt}
								backMode={this.backMode}
								openOptions={this.openOptionsOwners}
								loading={this.loadingSelectOwners}
								options={this.mapOptionsToInput}
								onEventChange={(e) => this._handleSelect1(e)}
								onListEventChange={this.listEventChangeHandler.bind(this)}
							/>
						</div>
						<div class="cdk-evdr__members">
							{this._selectedMembers?.length > 0 && (
								<scib-ui-list
									owners={this._selectedMembers}
									label={this._literals.membersLabel}
									hiddenLabel={false}
									onUpdateOwners={this._handleMemberRemove.bind(this)}
								/>
							)}
							<scib-ui-select
								class="cdk-evdr__multiselect"
								iconLeftClasses="c-tab-icon u-icon icon-search iconitem-glass"
								idSelect="members"
								owner-list="owner-members"
								name="member-list"
								debounce-time="300"
								viewBoxSkeleton="0 0 668 150"
								required={true}
								noResult={this.noResult}
								label={this._literals.labelMultiSelectMembers}
								placeholder-select={this._literals.placeholderMultiSelectMembers}
								removedPosition={this.removedMember}
								autocomplete
								addUser
								add-new-user={this._literals.addUserLabel}
								optionsTitleTxt={this.contactsLabelTxt}
								backMode={this.backMode}
								openOptions={this.openOptionsMembers}
								loading={this.loadingSelectMembers}
								options={this._membersList}
								onEventChange={(e) => this._handleSelect2(e)}
								onListEventChange={this.listEventChangeHandler2.bind(this)}
							/>
							{this._newSelectedMembers?.length > 0 && (
								<scib-ui-list
									owners={this._newSelectedMembers}
									label={this._literals.newMembersLabel}
									hiddenLabel={false}
									showCheckbox={true}
									onUpdateOwners={this._handleNewMemberRemove.bind(this)}
								/>
							)}
						</div>
					</fieldset>
				</form>
				<footer class="cdk-evdr__footer">
					<span class="cdk-evdr__notice">{this._literals.notice}</span>
					<div class="cdk-evdr__buttons">
						<scib-ui-button secondary type="submit" onEventClick={() => this._handleCancel()}>
							{this._literals.btnCancel}
						</scib-ui-button>
						<scib-ui-button
							primary
							type="submit"
							disabled={this.disabledSubmit}
							onEventClick={(e) => this._handleFinish(e)}
							loading={this.loadingSaveVDR}
						>
							{this._literals.btnSave}
						</scib-ui-button>
					</div>
				</footer>
			</section>
		);
	}
}
