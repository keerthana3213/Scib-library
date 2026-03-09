import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals } from '../models/cdk-admin-finder.model';

/**
 * Component description
 *
 * @slot content - Slot default
 */
@Component({
	tag: 'scib-cdk-admin-finder',
	styleUrl: 'cdk-admin-finder.scss',
	shadow: false,
	scoped: true,
})
export class CDKAdminFinder {
	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: false }) disabledSubmit: boolean = true;

	/** data form filled*/
	@Prop() dataForm: any;

	/** show Error Input*/
	@Prop() showErrorInput: boolean = false;

	/** show Error autoComplete*/
	@Prop() showErrorComplete: boolean = false;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	value: string | string[] = '';
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	/** Emite el evento que retorna los valorespara la busqueda */
	@Event() eventSearchEmitter: EventEmitter;

	/** Emite los cambios que se estan realizando en el autocomplete para añadir sus valores */
	@Event() eventChangeSearchEmitter: EventEmitter;

	@State() _inputValue: any;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.dataForm = {};
	}

	_handleInput(e: any, indexForm: number) {
		this.dataForm[indexForm] = null;
		this._inputValue = e.detail;
		this.dataForm[indexForm] = this._inputValue;
		this.validationRequired();
	}

	_handleInputChange(e: any, indexForm: number) {
		this.dataForm[indexForm] = null;
		if (e.detail.length == 0 || indexForm == 2 || (indexForm == 3 && e.detail.length >= 2) || (indexForm <= 1 && e.detail.length >= 3)) {
			this.dataForm[indexForm] = e.detail;
			this.showErrorComplete = false;
		} else {
			this.showErrorComplete = true;
		}

		if (indexForm == 0 || indexForm == 3) this.eventChangeSearchEmitter.emit(this.dataForm);
		this.validationRequired();
	}

	validationRequired() {
		const dataFormValues: string[] = Object.values(this.dataForm);
		// if() this.showErrorInput = false;

		if (dataFormValues.some((elem: any) => elem)) {
			this.disabledSubmit = false;
		} else {
			this.disabledSubmit = true;
		}
		return;
	}

	_searchElement() {
		this.eventSearchEmitter.emit(this.dataForm);
	}

	render() {
		return (
			<Host>
				<section class="cdk-finder">
					<h3 class="cdk-finder__title">{this._literals.title}</h3>
					<form class="cdk-finder__form">
						<fieldset class="cdk-finder__fieldset">
							<legend class="accessibility">{this._literals.legend}</legend>

							{this._literals.fieldset[0].autocomplete.hidden == true ? (
								''
							) : (
								<scib-ui-input
									autocomplete
									searchSimple
									noMinHeight
									multiselect={false}
									loading={false}
									disableEdit={false}
									noIconRight={false}
									debounceTime={this._literals.fieldset[0].autocomplete.debounceTime}
									iconInnerRight="icon-fill-clear"
									label={this._literals.fieldset[0].autocomplete.label}
									name={this._literals.fieldset[0].autocomplete.name}
									placeholder={this._literals.fieldset[0].autocomplete.placeholder}
									options={this._literals.fieldset[0].autocomplete.options}
									charMin={this._literals.fieldset[0].autocomplete.charMin}
									error={
										this.dataForm[0] ? '' : !this.showErrorComplete ? '' : this._literals.fieldset[0].autocomplete.error
									}
									noResult={this._literals.fieldset[0].autocomplete.noResult}
									onEventInputChange={e => this._handleInput(e, 0)}
									onEventChange={e => this._handleInputChange(e, 0)}
								></scib-ui-input>
							)}
							<scib-ui-input
								multiselect={false}
								label={this._literals.fieldset[1].input.label}
								name={this._literals.fieldset[1].input.name}
								placeholder={this._literals.fieldset[1].input.placeholder}
								charMin={this._literals.fieldset[1].input.charMin}
								error={this.dataForm[1] ? '' : !this.showErrorInput ? '' : this._literals.fieldset[0].autocomplete.error}
								onEventInputChange={e => this._handleInput(e, 1)}
								value={this.value}
								onEventChange={e => this._handleInputChange(e, 1)}
								noIconRight={false}
							></scib-ui-input>
							{this._literals.fieldset.length > 2 ? (
								<scib-ui-dropdown
									label={this._literals.fieldset[2].dropdown.label}
									header={this._literals.fieldset[2].dropdown.label}
									medium={true}
									multipleselector={'single'}
									onSelectValue={e => this._handleInputChange(e, 2)}
									options={this._literals.fieldset[2].dropdown.labels}
								></scib-ui-dropdown>
							) : (
								''
							)}
							{this._literals.fieldset.length > 3 ? (
								<scib-ui-input
									autocomplete
									searchSimple
									noMinHeight
									multiselect={false}
									loading={false}
									disableEdit={false}
									noIconRight={false}
									debounceTime={this._literals.fieldset[3].autocomplete.debounceTime}
									iconInnerRight="icon-fill-clear"
									label={this._literals.fieldset[3].autocomplete.label}
									name={this._literals.fieldset[3].autocomplete.name}
									placeholder={this._literals.fieldset[3].autocomplete.placeholder}
									options={this._literals.fieldset[3].autocomplete.options}
									charMin={this._literals.fieldset[3].autocomplete.charMin}
									error={
										this.dataForm[0] ? '' : !this.showErrorComplete ? '' : this._literals.fieldset[3].autocomplete.error
									}
									noResult={this._literals.fieldset[3].autocomplete.noResult}
									onEventInputChange={e => this._handleInput(e, 3)}
									onEventChange={e => this._handleInputChange(e, 3)}
								></scib-ui-input>
							) : (
								''
							)}
						</fieldset>
						<scib-ui-button
							primary
							no-min-height
							type="button"
							disabled={this.disabledSubmit || this.showErrorComplete || this.showErrorInput}
							onEventClick={() => this._searchElement()}
						>
							{this._literals.btn}
						</scib-ui-button>
					</form>
				</section>
			</Host>
		);
	}
}
