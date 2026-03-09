import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { ICDKModalMassiveLoadLiterals } from '../models/cdk-modal-massive-load.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-modal-massive-load',
	styleUrl: 'cdk-modal-massive-load.scss',
	shadow: false,
	scoped: true,
})
export class CDKModalMassiveLoad {
	@Prop() isLoading: boolean = false;

	/** Modal is open */
	@Prop({ mutable: true, reflect: true }) open?: boolean;
	@Watch('open') watchOpen(value: boolean) {
		this.open = value;
	}

	/** Literales */
	@Prop({ mutable: true, reflect: false }) literals: ICDKModalMassiveLoadLiterals | string = JSON.stringify({
		isRequiredLabel: '*Required input',
		buttonLabelList: ['Cancel', 'Submit'],
	});
	@Watch('literals') parseLiterals(newLiterals: ICDKModalMassiveLoadLiterals | string) {
		this._literals = _parseProp(newLiterals);
		this._buttonsList = this._literals.buttonList.map(item => {
			return item.text;
		});
		this._fileSelector = this._literals.fileSelector;
	}
	@State() _literals: ICDKModalMassiveLoadLiterals;

	/** Para modificar el titulo del selector, según si es movil o tablet/desktop */
	@State() _fileSelector: any = {};
	/** Datos a enviar en el evento submit */
	@State() _formData: any = {};
	/** Lista de required del formulario */
	@State() _requiredFields: any = {};
	/** Lista de required del formulario */
	@State() _disableButton: any = {};
	/** Lista de required del formulario */
	@State() _buttonsList: any = [];
	/** Evento de accion de usuario */
	@Event() userAction: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.cargaPagina();
	}

	componentDidLoad() {}

	cargaPagina() {
		const body = document.body,
			html = document.documentElement;

		const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		const width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

		if (
			(width <= 320 && height <= 640) /* Mobile vertical */ ||
			(width <= 640 && height <= 320) /* Mobile horizontal */ ||
			(width <= 414 && height <= 736) /* Large mobile vertical */ ||
			(width <= 736 && height <= 414) /* Large mobile horizontal */ ||
			(width <= 768 && height <= 1024) /* Tablet vertical */ ||
			(width <= 1024 && height <= 768) /* Tablet horizontal */ ||
			(width <= 1024 && height <= 1366) /* Large tablet vertical */ ||
			(width <= 1366 && height <= 1024) /* Large tablet horizontal */
		) {
			this._fileSelector.titleselector = this._literals.fileSelector.titleselectorMobile;
		}
	}

	@Listen('eventFormChange', { target: 'window' })
	eventFormChangeHandler(event: CustomEvent) {
		if (event.detail.required && (event.detail.value == '' || event.detail.value == undefined || event.detail.value.length == 0)) {
			this._requiredFields[event.detail.name] = true;
		} else {
			this._requiredFields[event.detail.name] = false;
		}
		this._formData[event.detail.name] = event.detail.value;
		this._disableButton = Object.values(this._requiredFields).includes(true);
	}

	render() {
		return (
			<scib-ui-dialog
				open={this.open}
				is-emitter
				absolute
				onEventCancelProcess={() => {
					this.userAction.emit({
						type: this._literals.close.eventName,
						payload: this._formData,
					});
				}}
			>
				<form class="cdk-modal-massive-load">
					{this.isLoading && (
						<div class="cdk-modal-massive-load__loading">
							<figure class="cdk-modal-massive-load__loading-fig">
								<img class="cdk-modal-massive-load__loading-img" src={this._literals.loadingImgSrc} alt="Loading..." />
							</figure>
						</div>
					)}
					{this._literals.title && <h3 class="cdk-modal-massive-load__title">{this._literals.title}</h3>}
					<fieldset>
						<legend class="accessibility">{this._literals.legend}</legend>
						<section>
							<div class="cdk-modal-massive-load__row--separator">
								<div class="cdk-modal-massive-load__head">
									<div>
										<span class="cdk-modal-massive-load--info">{this._literals.message}</span>
									</div>
									<div class="cdk-modal-massive-load--download">
										<scib-ui-button
											ultra-small
											link
											icon-left
											icon="icon-download"
											onEventClick={ev => {
												this.userAction.emit({
													type: this._literals.downloadcsv.eventName,
												});
												ev.preventDefault();
											}}
										>
											{this._literals.downloadcsv.text}
										</scib-ui-button>
									</div>
								</div>
							</div>
							<div class="cdk-modal-massive-load--selector">
								<scib-cdk-file-selector
									show-upload-files
									required
									name="file-selector"
									allowedFilesExt={JSON.stringify(['.csv'])}
									literals={JSON.stringify(this._fileSelector)}
									maxfiles={1}
									smallsize={true}
								></scib-cdk-file-selector>
							</div>
							<div class="cdk-modal-massive__row cdk-modal-massive-load--notification">
								<div class="cdk-modal-massive-load__column">
									<scib-ui-input
										label={this._literals.notification.label}
										name={this._literals.notification.formName}
										value=""
										placeholder={this._literals.notification.placeholder}
										multiselect={false}
									></scib-ui-input>
								</div>
								<div class="cdk-modal-massive-load__column">
									<div class="cdk-modal-massive-load--subinput">
										<span class="" innerHTML={this._literals.notification.subMessaje}></span>
									</div>
								</div>
							</div>
						</section>
					</fieldset>
					<footer class="cdk-modal-massive-load__footer">
						{this._literals.showIsRequired && <span class="cdk-modal-massive-load__required">{this._literals.isRequiredLabel}</span>}
						{this._literals.buttonList && this._literals.buttonList.length > 0 && (
							<div class="cdk-modal-massive-load__buttons">
								{this._literals.buttonList.map((button, index) => (
									<scib-ui-button
										icon={button.iconName}
										primary={button.type === 'primary'}
										secondary={button.type === 'secondary'}
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
										{this._literals.buttonList[index].text}
									</scib-ui-button>
								))}
							</div>
						)}
					</footer>
				</form>
			</scib-ui-dialog>
		);
	}
}
