import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-vdr-initial-form',
	styleUrl: 'cdk-vdr-initial-form.scss',
	shadow: false,
	scoped: true
})
export class CDKVdrInitialForm {
	/**Modal title*/
	@Prop() mainTitle: string;

	/*Input label*/
	@Prop() name: string;

	/*Input placeholder*/
	@Prop() placeholder: string;

	/** Label textarea */
	@Prop({ reflect: true }) labelTxtarea: string;

	/** Id textarea */
	@Prop({ reflect: true }) idTxtarea: string;

	/** Name textarea */
	@Prop({ reflect: true }) nameTxtarea: string;

	/** Placeholder textarea*/
	@Prop({ reflect: true }) placeholderTxtarea: string;

	/** Owner list label*/
	@Prop({ reflect: true }) ownersLabel: string;

	/** Enable open select when new array is introduced */
	@Prop({ reflect: true }) openOptions: boolean;

	/** Enable skeleton in select */
	@Prop({ reflect: true }) loadingSelect: boolean;

	/** If it is true, open Select Options when input array is introduced */
	@Prop({ reflect: true }) backMode: boolean;

	/** Textarea*/
	@Prop({ mutable: true, reflect: true }) textarea: any = '';

	/** Input*/
	@Prop({ mutable: true, reflect: true }) input: any = '';

	/** Placeholder */
	@Prop({ reflect: true }) placeholderSelect: string;

	/** String to indicate that there are no matches with the search engine */
	@Prop({ mutable: true, reflect: false }) noResult: string;

	/** Event input enter value */
	@Event() eventValueInput: EventEmitter;

	/** Event textarea enter value */
	@Event() eventValueTextarea: EventEmitter;

	/** Event multiselect enter value */
	@Event() eventValueMultiselect: EventEmitter;

	/** Event value change emitter */
	@Event() eventValuesInitialFormEmitter: EventEmitter;

	/** Event value change select input */
	@Event() eventValuesInputSelect: EventEmitter;

	/** Event removed user click */
	@Event() eventRemoveUser: EventEmitter;

	/** Limite de caracteres de la descripción */
	@Prop() charLimitDescription: number;

	/** Limite de caracteres del nombre */
	@Prop() charLimitName: number;

	@State() descriptionCounter: number = 0;
	@State() nameCounter: number = 0;

	/** Bind of the scope of this.*/
	constructor() {
		this._handleInput = this._handleInput.bind(this);
		this._handleTextarea = this._handleTextarea.bind(this);
		this._selectedOwners = [];
	}

	/** Emmit input value*/
	_handleInput(e: any) {
		let value = e.detail;
		this.nameCounter = value.length;
		if (value && value.replace(/ /g, '').length > 0) {
			this.input = e.detail;
		} else {
			this.input = '';
		}
		this.eventValueInput.emit(e);
		this.validationRequired();
	}

	/** Emmit textarea value*/
	_handleTextarea(e: any) {
		let value = e.detail;
		this.descriptionCounter = value.length;
		if (value && value.replace(/ /g, '').length > 0) {
			this.textarea = e.detail;
		} else {
			this.textarea = '';
		}
		this.eventValueTextarea.emit(e);
		this.validationRequired();
	}

	/** Emmit input select value*/
	_handleSelect(e: any) {
		this.eventValuesInputSelect.emit(e);
		// this.validationRequired();
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		if (this.input === '' || this.textarea === '' || this._selectedOwners.length < 1) {
			this.eventValuesInitialFormEmitter.emit(true);
			return;
		}
		this.eventValuesInitialFormEmitter.emit(false);
	}

	@Prop({ reflect: true }) toLabelTxt: string;

	@Prop({ reflect: true }) contactsLabelTxt: string;

	listEventChangeHandler(event) {
		event.preventDefault();
		setTimeout(() => {
			let element = event.detail;
			element.map((el, el_index) => {
				this._selectedOwners.forEach((sm) => {
					if (el.value === sm.value) {
						element.splice(el_index, 1);
					}
				});
				if (this.removedOwner) {
					if (el.value === this.removedOwner.detail.value) {
						element.splice(el_index, 1);
					}
				}
			});
			this.removedOwner = undefined;
			this._selectedOwners = [...this._selectedOwners, ...element];
			this.eventValueMultiselect.emit(this._selectedOwners);
			this.validationRequired();
		}, 100);
	}

	@Prop({ mutable: true, reflect: true }) removedOwner;
	updateOnwersHandler(removedOwner) {
		this.eventRemoveUser.emit(removedOwner.detail);
		this.removedOwner = removedOwner;
		let index = this._selectedOwners.indexOf(this.removedOwner.detail);
		if (index > -1) {
			this._selectedOwners.splice(index, 1);
			this.resetToOwnersList(this.removedOwner.detail);
		}
		this.validationRequired();
	}
	@Prop({ mutable: true, reflect: true }) monitorizedOwner = null;
	@Watch('monitorizedOwner') parsemonitorizedOwner(newMonitorized: any) {
		if (newMonitorized) {
			let currentElement = this._selectedOwners.find((owner) => owner.value == newMonitorized);
			if (currentElement) {
				this._monitorizedOwner = currentElement;
				this.updateOnwersHandler({ detail: currentElement });
			}
		}
	}

	/** Event reset select input value */
	@Event() resetSelectInputValue: EventEmitter;
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

	@State() _monitorizedOwner;

	@State() _selectedOwners = [];
	@Prop({ mutable: true, reflect: true }) selectedOwners: string;

	@State() _ownersList;

	/** Listado de usuarios para "New" */
	@Prop({ mutable: true, reflect: true }) ownersList: string;
	@Watch('ownersList') parseOwnersList() {
		try {
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
			if (this.selectedOwners) {
				const preselected = JSON.parse(this.selectedOwners);
				this.mapOptionsToInput.map((option) => {
					for (const ps of preselected) {
						if (option.value === ps.value) {
							option.isSelected = true;
						}
					}
				});
			}
		} catch (e) {
			console.error(e);
		}
	}

	@Prop({ mutable: true, reflect: true }) mapOptionsToInput;

	resetToOwnersList(user) {
		// const userExists = this.mapOptionsToInput.filter(option => option.value === user.value);
		// if (userExists.length === 0) {
		// 	console.log(user)
		// 	user.isSelected = false;
		// 	this.mapOptionsToInput.push(user);
		// } else {
		// }
		this.mapOptionsToInput.map((option) => {
			if (user.value === option.value) {
				option.isSelected = false;
			}
		});
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseOwnersList();
		if (this.selectedOwners) {
			this._selectedOwners = [...JSON.parse(this.selectedOwners)];
			this.eventValueMultiselect.emit(this._selectedOwners);
		}
		this.parsemonitorizedOwner(this.monitorizedOwner);
	}

	render() {
		return (
			<fieldset class="cdk-cvdr__fieldset">
				<legend class={{ 'cdk-cvdr__title': true, '--font-family-scib': this.mainTitle.includes('<h') }} innerHTML={this.mainTitle}></legend>
				<div class="cdk-cvdr__group">
					<scib-ui-input
						placeholder={this.placeholder}
						label={this.name}
						required={true}
						debounceTime={450}
						name={this.name}
						onEventChange={this._handleInput}
						no-min-height
						char-limit={this.charLimitName ? this.charLimitName : null}
						char-counter={this.nameCounter}
					></scib-ui-input>
					<scib-ui-select
						noResult={this.noResult}
						idSelect="owners"
						removedPosition={this.removedOwner}
						placeholder-select={this.placeholderSelect}
						autocomplete
						optionsTitleTxt={this.contactsLabelTxt}
						class="c-header-form-field"
						label={this.toLabelTxt}
						name="owner-list"
						required={true}
						debounce-time="300"
						viewBoxSkeleton="0 0 668 150"
						openOptions={this.openOptions}
						backMode={this.backMode}
						loading={this.loadingSelect}
						options={this.mapOptionsToInput}
						onEventChange={(e) => this._handleSelect(e)}
						onListEventChange={this.listEventChangeHandler.bind(this)}
						icon-left-classes="c-tab-icon u-icon icon-search iconitem-glass"
						text-cursor={true}
					></scib-ui-select>
				</div>

				<scib-ui-textarea
					label-txtarea={this.labelTxtarea}
					id-txtarea={this.idTxtarea}
					name-txtarea={this.nameTxtarea}
					placeholder-txtarea={this.placeholderTxtarea}
					onEventChange={this._handleTextarea}
					required={true}
					char-limit={this.charLimitDescription ? this.charLimitDescription : null}
				></scib-ui-textarea>
				<scib-ui-list
					owners={this._selectedOwners}
					label={this.ownersLabel}
					onUpdateOwners={this.updateOnwersHandler.bind(this)}
				></scib-ui-list>
			</fieldset>
		);
	}
}
