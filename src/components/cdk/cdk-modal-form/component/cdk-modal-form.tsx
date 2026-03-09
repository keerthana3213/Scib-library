import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { ICDKModelFormData, ICDKModelFormLiterals } from '../models/cdk-modal-form.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 * @slot header - Header slot content
 */
@Component({
	tag: 'scib-cdk-modal-form',
	styleUrl: 'cdk-modal-form.scss',
	shadow: false,
	scoped: false,
})
export class CDKModalForm {
	@Prop() isLoading: boolean = false;

	/** Header has separator below */
	@Prop({ mutable: true, reflect: true }) separator: boolean = false;

	/** Modal is open */
	@Prop({ mutable: true, reflect: true }) isOpen?: boolean;

	/** Literales */
	@Prop({ mutable: true, reflect: false }) literals: ICDKModelFormLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: ICDKModelFormLiterals | string) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: ICDKModelFormLiterals;

	/** Datos */
	@Prop({ mutable: true, reflect: true }) data: ICDKModelFormData | string;
	@Watch('data') parseData(newData: ICDKModelFormData | string) {
		if (newData) {
			this._data = _parseProp(newData);
		}
	}
	@State() _data: ICDKModelFormData = {};

	/** Datos a enviar en el evento submit */
	@State() _formData: any = {};

	/** Lista de required del formulario */
	@State() _requiredFields: any = {};

	/** Lista de required del formulario */
	@State() _disableButton: boolean = false;

	/** Step position @WizardStepOnly */
	@State() _stepPosition: number = 1;

	/** Evento de accion de usuario */
	@Event() userAction: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseData(this.data);
		this.parseLiterals(this.literals);
	}

	componentDidLoad() {}

	@Listen('eventFormChange', { target: 'window' })
	eventFormChangeHandler(event: CustomEvent) {
		this.eventHandler(event);
	}

	@Listen('eventMultiFormChange', { target: 'window' })
	eventMultiFormChangeHandler(event: CustomEvent) {
		this.eventHandler(event);
	}

	eventHandler = (event: CustomEvent) => {
		if (!!event.detail.required && (event.detail.value == '' || event.detail.value == undefined || event.detail.value.length == 0)) {
			!this._data.steps?.length && !event.detail.stepPosition
				? (this._requiredFields[event.detail.name] = true)
				: (this._requiredFields[event.detail.name] = event.detail.stepPosition.toString());
		} else {
			this._requiredFields[event.detail.name] = false;
		}
		if (event.detail.validValue === false) {
			this._requiredFields[event.detail.name] = true;
		}
		this._formData[event.detail.name] = event.detail.value;
		!this._data.steps?.length
			? (this._disableButton = Object.values(this._requiredFields).includes(true))
			: (this._disableButton = Object.values(this._requiredFields).includes(this._stepPosition.toString()));
	};

	render() {
		return (
			<scib-ui-dialog
				open
				is-emitter
				absolute
				onEventCancelProcess={() =>
					this.userAction.emit({
						type: 'closeModal',
						payload: this._formData,
					})
				}
			>
				<form class="cdk-form" data-cy="modal-form">
					{this.isLoading && (
						<div class="cdk-form__loading">
							<figure class="cdk-form__loading-fig">
								<img class="cdk-form__loading-img" src={this._data.loadingImgSrc} alt={this._literals.loading} />
							</figure>
						</div>
					)}
					{!!this._data.steps?.length && (
						<div class="cdk-form__ribbon">
							{this._data.steps.map((item, index) => (
								<span
									class={{
										'cdk-form__steps': true,
										'cdk-form__steps--active': this._stepPosition >= index + 1,
										'cdk-form__steps--current': this._stepPosition === index + 1,
									}}
								>{`${index + 1}. ${item}`}</span>
							))}
						</div>
					)}
					{this._data.title && <h3 class="cdk-form__title">{this._data.title}</h3>}
					{this._data.text && <p class="cdk-form__text">{this._data.text}</p>}
					<div class={{ 'cdk-form__header': true, 'cdk-form__header--separator': this.separator }}>
						<slot name="header" />
					</div>
					{this._data.steps?.length > 0 ? (
						this._data.steps.map((step, index) => (
							<fieldset key={step} class={this._stepPosition !== index + 1 && 'cdk-form__fieldset--hidden'} data-cy="modal-form-fieldset">
								<legend class="accessibility">{this._data.legend}</legend>
								<slot name={(index + 1).toString()} />
							</fieldset>
						))
					) : (
						<fieldset data-cy="modal-form-fieldset">
							<legend class="accessibility">{this._data.legend}</legend>
							<slot />
						</fieldset>
					)}
					<footer class={{ 'cdk-form__footer': true, 'cdk-form__footer--flexend': !this._data.showIsRequired }}>
						{this._data.showIsRequired && <span class="cdk-form__required">{this._literals.isRequiredLabel}</span>}
						{this._data.buttonList &&
							this._data.buttonList.length > 0 &&
							(!this._data.steps?.length ? (
								<div class="cdk-form__buttons">
									{this._data.buttonList.map((button, index) => (
										<scib-ui-button
											icon={button.iconName}
											primary={button.type === 'primary'}
											secondary={button.type === 'secondary'}
											tertiary={button.type === 'tertiary'}
											link={button.type === 'link'}
											nobackground={button.type === 'nobackground'}
											onEventClick={ev => {
												this.userAction.emit({
													type: button.eventName,
													payload: this._formData,
												});
												ev.preventDefault();
											}}
											disabled={button.disabledIfRequired && this._disableButton}
										>
											{this._literals.buttonLabelList[index]}
										</scib-ui-button>
									))}
								</div>
							) : (
								<div class="cdk-form__buttons">
									{this._stepPosition === 1 ? (
										<scib-ui-button
											icon={this._data.buttonList[0].iconName}
											primary={this._data.buttonList[0].type === 'primary'}
											secondary={this._data.buttonList[0].type === 'secondary'}
											tertiary={this._data.buttonList[0].type === 'tertiary'}
											link={this._data.buttonList[0].type === 'link'}
											nobackground={this._data.buttonList[0].type === 'nobackground'}
											onEventClick={ev => {
												this.userAction.emit({
													type: this._data.buttonList[0].eventName,
													payload: this._formData,
												});
												ev.preventDefault();
											}}
											disabled={this._data.buttonList[0].disabledIfRequired && this._disableButton}
										>
											{this._literals.buttonLabelList[0]}
										</scib-ui-button>
									) : (
										<scib-ui-button
											icon="icon-chevron-left"
											hideTxt={true}
											primary={this._data.buttonList[0].type === 'primary'}
											secondary={this._data.buttonList[0].type === 'secondary'}
											tertiary={this._data.buttonList[0].type === 'tertiary'}
											link={this._data.buttonList[0].type === 'link'}
											nobackground={this._data.buttonList[0].type === 'nobackground'}
											onEventClick={ev => {
												--this._stepPosition;
												this._disableButton = Object.values(this._requiredFields).includes(this._stepPosition.toString());
												ev.preventDefault();
											}}
											disabled={this._data.buttonList[0].disabledIfRequired && this._disableButton}
										></scib-ui-button>
									)}
									{this._stepPosition === this._data.steps?.length ? (
										<scib-ui-button
											icon={this._data.buttonList[1].iconName}
											primary={this._data.buttonList[1].type === 'primary'}
											secondary={this._data.buttonList[1].type === 'secondary'}
											tertiary={this._data.buttonList[1].type === 'tertiary'}
											link={this._data.buttonList[1].type === 'link'}
											nobackground={this._data.buttonList[1].type === 'nobackground'}
											onEventClick={ev => {
												this.userAction.emit({
													type: this._data.buttonList[1].eventName,
													payload: this._formData,
												});
												ev.preventDefault();
											}}
											disabled={this._data.buttonList[1].disabledIfRequired && this._disableButton}
										>
											{this._literals.buttonLabelList[1]}
										</scib-ui-button>
									) : (
										<scib-ui-button
											primary={this._data.buttonList[1].type === 'primary'}
											secondary={this._data.buttonList[1].type === 'secondary'}
											tertiary={this._data.buttonList[1].type === 'tertiary'}
											link={this._data.buttonList[1].type === 'link'}
											nobackground={this._data.buttonList[1].type === 'nobackground'}
											onEventClick={ev => {
												++this._stepPosition;
												this._disableButton = Object.values(this._requiredFields).includes(this._stepPosition.toString());
												ev.preventDefault();
											}}
											disabled={this._disableButton}
										>
											{this._literals.next}
										</scib-ui-button>
									)}
								</div>
							))}
					</footer>
				</form>
			</scib-ui-dialog>
		);
	}
}
