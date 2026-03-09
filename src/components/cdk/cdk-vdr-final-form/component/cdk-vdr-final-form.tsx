import { Component, Prop, h, Listen, State, Watch, EventEmitter, Event } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-vdr-final-form',
	styleUrl: 'cdk-vdr-final-form.scss',
	shadow: false,
	scoped: true,
})
export class CDKVdrFinalForm {
	@Prop() mainTitle: string;

	/*Form action*/
	@Prop() actionForm: string;

	/*Form name*/
	@Prop() nameForm: string;

	/*Form legend*/
	@Prop() legend: string;

	@Prop({ reflect: true }) toLabelTxt: string;

	@Prop({ reflect: true }) contactsLabelTxt: string;

	/** Placeholder */
	@Prop({ reflect: true }) placeholderSelect: string;

	@Prop({ reflect: true }) addNewUserLiteral: string;

	/** Members list label */
	@Prop({ reflect: true }) membersLabel: string;
	/** Enable open select when new array is introduced */
	@Prop({ reflect: true }) openOptions: boolean;

	/** Enable skeleton in select */
	@Prop({ reflect: true }) loadingSelect: boolean;

	/** If it is true, open Select Options when input array is introduced */
	@Prop({ reflect: true }) backMode: boolean;

	/** Enable auto complete */
	@Prop({ reflect: true }) autoComplete: boolean = true;

	/** String to indicate that there are no matches with the search engine */
	@Prop({ mutable: true, reflect: false }) noResult: string;

	/** Event multiselect enter value */
	@Event() eventValueMultiselectMembers: EventEmitter;

	/** Event reset select input value */
	@Event() resetSelectInputValue: EventEmitter;

	/** Event removed user click */
	@Event() eventRemoveUser: EventEmitter;

	/**
	 *	Mark as reset input.
	 */
	@Prop({ mutable: true, reflect: true }) resetValueInput: boolean;
	@Watch('resetValueInput') _resetHandler(newValue: boolean | undefined) {
		this.resetValueInput = newValue;
		if (this.resetValueInput) {
			this.resetSelectInputValue.emit();
		}
	}

	// @Event() eventAddUser: EventEmitter;

	@Listen('listEventChange') listEventChangeHandler(event) {
		event.preventDefault();
		setTimeout(() => {
			let element = event.detail;
			const mergeMembers = [...this.selectedMembers, ...element];
			this.selectedMembers = [...new Set(mergeMembers)];
			this.eventValueMultiselectMembers.emit(this.selectedMembers);
			this.validationRequired();
		}, 100);
	}

	@Prop({ mutable: true, reflect: true }) removedOwner;

	@Listen('updateOwners') updateMembersHandler(removedOwner) {
		this.removedOwner = removedOwner;
		this.eventRemoveUser.emit(removedOwner.detail);
		let index = this.selectedMembers.indexOf(this.removedOwner.detail);
		if (index >= 0) this.selectedMembers.splice(index, 1);
		this.validationRequired();
	}

	@Prop({ mutable: true, reflect: true }) selectedMembers: any[];

	@Prop({ mutable: true, reflect: true }) emitMultiSelectMembers: any[];

	@Watch('emitMultiSelectMembers') _emitMultiSelectMembersHandler(newValue) {
		if (newValue != undefined) {
			this.eventValueMultiselectMembers.emit(this.selectedMembers);
		}
	}

	@State() _membersList;

	/** Listado de usuarios para "New" */
	@Prop({ mutable: true, reflect: true }) membersList: string;

	@Watch('membersList') parseMembersList() {
		try {
			this._membersList = JSON.parse(this.membersList);

			this.mapOptionsToInput = this._membersList.map(user => ({
				value: user.id,
				name: user.name,
				secondary: user.email ? user.email : null,
				avatar: user.avatar,
				isSelected: false,
				isEmployee: user.isEmployee,
				ldapUid: user.ldapUid,
			}));
		} catch (e) {
			console.error(e);
		}
	}

	@Prop({ mutable: true, reflect: true }) monitorizedMember = '';
	@Watch('monitorizedMember') parsemonitorizedOwner() {
		let newMonitorized = this.monitorizedMember;
		if (newMonitorized) {
			let currentElement = this.selectedMembers.find(owner => owner.value == newMonitorized);
			if (currentElement) {
				this._monitorizedMember = currentElement;
				this.updateMembersHandler({ detail: currentElement });
			}
		}
	}
	@State() _monitorizedMember;
	@Prop({ mutable: true, reflect: true }) mapOptionsToInput;

	@Event() eventValuesFinalFormEmitter: EventEmitter;
	@Event() eventValuesInputSelect: EventEmitter;

	/** Enable font-family-scib */
	@Prop({ reflect: true }) fontSCIB: boolean = true;

	/** Emmit input select value*/
	_handleSelect(e: any) {
		this.eventValuesInputSelect.emit(e);
		// this.validationRequired();
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.selectedMembers = [];
		this.parseMembersList();
		this.validationRequired();
		this.parsemonitorizedOwner();
	}

	validationRequired() {
		if (this.selectedMembers.length < 1) {
			this.eventValuesFinalFormEmitter.emit(true);
			return;
		}
		this.eventValuesFinalFormEmitter.emit(false);
	}

	// handleAddNewUserEvent(event){
	// 	// this.eventAddUser.emit(event)
	// }

	render() {
		return (
			<fieldset class="cdk-cvdr__fieldset">
				<legend
					class={{ 'cdk-cvdr__title': true, '--font-family-scib': this.fontSCIB && this.mainTitle.includes('<h') }}
					innerHTML={this.mainTitle}
				></legend>
				<p class="cdk-cvdr__paragraph" innerHTML={this.legend}></p>
				<scib-ui-select
					noResult={this.noResult}
					class="cdk-cvdr__multiselect"
					label={this.toLabelTxt}
					placeholder-select={this.placeholderSelect}
					idSelect="members"
					removedPosition={this.removedOwner}
					autocomplete
					addUser
					addNewUser={this.addNewUserLiteral}
					optionsTitleTxt={this.contactsLabelTxt}
					onEventChange={e => this._handleSelect(e)}
					// onEventAddUser={e => this.handleAddNewUserEvent(e)}
					onListEventChange={this.listEventChangeHandler.bind(this)}
					owner-list="owner-members"
					name="owner-list"
					required={true}
					debounce-time="300"
					viewBoxSkeleton="0 0 668 150"
					openOptions={this.openOptions}
					backMode={this.backMode}
					loading={this.loadingSelect}
					options={this.mapOptionsToInput}
					icon-left-classes="c-tab-icon u-icon icon-search iconitem-glass"
					text-cursor={true}
				></scib-ui-select>
				{this.selectedMembers.length > 0 && (
					<scib-ui-list
						owners={this.selectedMembers}
						onUpdateOwners={this.updateMembersHandler.bind(this)}
						label={this.membersLabel}
					></scib-ui-list>
				)}
			</fieldset>
		);
	}
}
