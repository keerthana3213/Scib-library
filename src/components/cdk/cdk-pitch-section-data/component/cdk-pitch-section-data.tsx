import { ICDKElements, ICDKLiterals, ICDKPitchData, ICDKPitchItem } from '../models/cdk-pitch-section-data.model';
import { ICDKElementsListData } from '../../cdk-elements-list/models/cdk-elements-list.model';
import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { CDKPitchSectionDataForm } from '../fragments/cdk-pitch-section-data-form.fragment';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-pitch-section-data',
	styleUrl: 'cdk-pitch-section-data.scss',
	shadow: false,
	scoped: true,
})
export class CDKPitchSectionData {
	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;
	/**Control nav buttons abled/disabled */
	@Prop({ reflect: true }) disabled: boolean = false;
	@Watch('disabled') parseDisabled(newVal: boolean) {
		this._disabled = newVal;
	}
	@State() _disabled: boolean;

	/**Control save button abled/disabled */
	@Prop({ reflect: true }) disabledsave: boolean = false;
	@Watch('disabledsave') parseDisabledSave(newVal: boolean) {
		this._disabledsave = newVal;
	}
	@State() _disabledsave: boolean;

	/**Exist items in pitch */
	@Prop({ reflect: false }) pitches: boolean = false;

	/** Data of new item added */
	@Prop({ mutable: true, reflect: true }) items: string | ICDKElementsListData[];
	@Watch('items') parseItems(newVal: string | ICDKElementsListData[]) {
		this._items = _parseProp(newVal);
	}
	@State() _items: ICDKElementsListData[];

	/**Aditional content personalContent */
	@Prop({ reflect: true }) additionalContent: boolean = true;
	@Watch('additionalContent') parseAdditionalContent(newVal: boolean) {
		this._additionalContent = newVal;
	}
	@State() _additionalContent: boolean;

	/**Template has selected */
	@Prop({ reflect: true }) template: boolean = true;
	@Watch('template') parseTemplate(newVal: boolean) {
		this._template = newVal;
	}
	@State() _template: boolean;

	/** Literals text */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKLiterals;
	@Watch('literals') parseLiterals(newVal: string | ICDKLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKLiterals;

	/** Items to add a new section */
	@Prop({ mutable: true, reflect: true }) elements: string | ICDKElements[];
	@Watch('elements') parseElements(newVal: string | ICDKElements[]) {
		this._elements = _parseProp(newVal);
	}
	@State() _elements: ICDKElements[];

	/** ruta de la imagen del Additional Content */
	@Prop({ reflect: true }) imageAdditionalContentSrc: string;

	/**Fill the selector template source and dispatch selected values*/
	@Prop() data: string | ICDKPitchData;
	@Watch('data') parseData(newData: string | ICDKPitchData) {
		this._data = _parseProp(newData);
		this._data.templates.forEach((template: ICDKPitchItem) => {
			template.image = template.thumbnail__target_id;
		});
		if (this._data.pitch.template) {
			this._data.templates.forEach((template: ICDKPitchItem) => {
				if (template.id === this._data.pitch.template) {
					this._data.pitch.selectedTemplate = {
						active: true,
						id: this._data.pitch.template,
						image: template.thumbnail__target_id,
						label: template.name,
					};
				}
			});
		}
	}
	@State() _data: ICDKPitchData;

	@State() _extensionesPermitidas: string = 'image/x-png,image/gif,image/jpeg';
	// @State() _extensionesPermitidas: string = 'image/*'; // 'image/x-png,image/gif,image/jpeg';

	/**
	 * ¿PARA QUE SIRVE?
	 */
	@State() _itemList: ICDKPitchItem[];

	/**
	 * Show pitch container
	 */
	@State() open: boolean = true;

	/*
	 * When sending event to enable/disable the save button, it collapse.
	 */
	@State() private _timeOt: ReturnType<typeof setTimeout> = null;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
		this.parseElements(this.elements);
		this.parseDisabled(this.disabled);
		this.parseDisabledSave(this.disabledsave);
		this.parseAdditionalContent(this.additionalContent);
		this.parseTemplate(this.template);
		this.parseItems(this.items);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Dispatch when save button has been clicked */
	savePitchClick(e) {
		e.preventDefault();
		this.savePitchClickEvent.emit();
	}

	/** Dispatch when help button has been clicked */
	helpPitchClick(e) {
		e.preventDefault();
		this.helpPitchClickEvent.emit(true);
	}

	/** Dispatch when preview button has been clicked */
	previewPitchClick(e) {
		e.preventDefault();
		this.previewPitchClickEvent.emit();
	}

	/** Dispatch when reset button has been clicked */
	resetPitchClick(e) {
		e.preventDefault();
		this.resetPitchClickEvent.emit();
	}

	/** Dispatch when values fields form has been changed */
	pitchFormChange(detail: any) {
		/* Selector template source */
		if (detail.type === 'selectTemplate') {
			this._data.pitch.template = detail.value.id;
			this._data.pitch.image = detail.value.image;
			this._data.pitch.selectedTemplate = {
				active: true,
				id: detail.value.id,
				image: detail.value.image,
				label: detail.value.label,
			};
		} else if (detail.type === 'name') {
			/* Input name */
			this._data.pitch.name = detail.value;
		} else if (detail.type === 'description') {
			/* Input description */
			this._data.pitch.description = detail.value;
		} else if (detail.type === 'private') {
			/* Checkbox private */
			this._data.pitch.private = detail.value;
		} else if (detail.type === 'contentButtonName') {
			/* Input button name */
			this._data.pitch.contentButtonName = detail.value;
		} else if (detail.type === 'contentTitle') {
			/* Input content title */
			this._data.pitch.contentTitle = detail.value;
		}
		/* image */
		// else {
		// 	this._data.pitch.selectedTemplate = detail.value;
		// 	this._data.pitch.image = detail.value.image;
		// }
		this._data = { ...this._data };
		this.pitchFormChangeEvent.emit(this._data);
	}
	selectorImage(item: any) {
		/* Open search files modal when template value is CUSTOM */
		if (item.id && item.selectedTemplate === '0') {
			document.getElementById(item.id).click();
		}
		/* When an image has been selected */
		if (item.selected) {
			this.onSelectFile(item.selected);
		}
	}
	onSelectFile(e) {
		let downloadUrlFile = [];
		const dataTransfer = e.currentTarget.files;
		Array.from(dataTransfer).forEach((file: any) => {
			if (this.validateFile(file)) {
				downloadUrlFile.push(URL.createObjectURL(file));
			}
		});
		this._data.pitch.image = this._data.pitch.selectedTemplate.image = downloadUrlFile[0];
		this._data = { ...this._data };
		this.pitchFormChangeEvent.emit(this._data);
	}

	validateFile(all) {
		const extensiones_permitidas = this._extensionesPermitidas.split(',');

		// var ultimo_punto = all.name.lastIndexOf(".");
		// var extension = all.name.slice(ultimo_punto, all.name.length);

		if (extensiones_permitidas.indexOf(all.type.toLowerCase()) == -1) {
			alert('Lo siento, sólo se admiten ficheros de tipo imagen. ');
			return false;
		}
		return true;
	}

	/** Form changes event */
	@Event() pitchFormChangeEvent: EventEmitter;

	/** Close button event */
	@Event() closePitchClickEvent: EventEmitter;

	/** Save button event */
	@Event() savePitchClickEvent: EventEmitter;

	/** Help button event */
	@Event() helpPitchClickEvent: EventEmitter;

	/** Preview button event */
	@Event() previewPitchClickEvent: EventEmitter;

	/** Reset button event */
	@Event() resetPitchClickEvent: EventEmitter;

	/** Add element event */
	@Event() eventAddElement: EventEmitter;

	/** Delete element event */
	@Event() eventChangeListElement: EventEmitter;

	/**
	 * Close Pitch view
	 * @param e Event
	 */
	closeWindow(e) {
		e.preventDefault();
		this.closePitchClickEvent.emit(false);
	}

	/**
	 * Open modal add element to pitch
	 * @param e Event
	 */
	addElement(e) {
		e.preventDefault();
		this.eventAddElement.emit(e.detail);
	}

	@Listen('elementClickEvent')
	changeElement(event: CustomEvent) {
		event.preventDefault();
		this.eventChangeListElement.emit(event.detail);
	}
	@State() focused: boolean = false;

	@Listen('focusin')
	getFocus() {
		if (document.activeElement.id === 'coverImage') {
			this.focused = true;
		} else {
			this.focused = false;
		}
	}
	render() {
		return (
			<Host
				class={{
					'--open': this.open,
					'--close': !this.open,
				}}
			>
				<div class="cdk-pitch-section-data">
					<section class="cdk-pitch-section-data__form">
						<CDKPitchSectionDataForm
							literals={this._literals}
							data={this._data}
							ext={this._extensionesPermitidas}
							focused={this.focused}
							onChangeForm={(e: Event) => {
								clearTimeout(this._timeOt);
								this._timeOt = setTimeout(() => {
									this.pitchFormChange(e);
								}, 300);
							}}
							selectorImage={(e: Event) => {
								this.selectorImage(e);
							}}
						></CDKPitchSectionDataForm>
					</section>
					<section class="cdk-pitch-section-data__pitch">
						<nav class="cdk-pitch-section-data__navbar">
							<ul class="cdk-pitch-section-data__list">
								{/* <li> */}
								{/* <button
										aria-label="reset pitch"
										disabled={this._disabled}
										class={{ 'cdk-pitch-section-data__button--disabled': this._disabled }}
										onClick={e => {
											this.resetPitchClick(e);
										}}
									>
										<span role="img" class="u-icon icon-clock icon-style"></span>
										{this._literals.resetText}
									</button> */}
								{/* </li> */}
								<li class="cdk-pitch-section-data__button--border">
									<button
										aria-label="preview pitch"
										disabled={this._disabled}
										class={{ 'cdk-pitch-section-data__button--disabled': this._disabled }}
										onClick={e => {
											this.previewPitchClick(e);
										}}
									>
										<span role="img" class="u-icon icon-open-eye icon-style"></span>
										{this._literals.previewText}
									</button>
								</li>
								{/* <li class="cdk-pitch-section-data__button--border">
									<button
										onClick={e => {
											this.helpPitchClick(e);
										}}
									>
										<span role="img" class="u-icon icon-help-empty icon-style"></span>
										{this._literals.helpText}
									</button>
								</li> */}
								<li
									class={{
										'cdk-pitch-section-data__list--item': true,
										'cdk-pitch-section-data__list--save': true,
										'c-button--disabled': this._disabledsave,
									}}
								>
									<button
										disabled={this._disabledsave}
										class={{ 'cdk-pitch-section-data__button--disabled': this._disabledsave }}
										onClick={e => {
											this.savePitchClick(e);
										}}
									>
										<span role="img" class="u-icon icon-save-24 icon-style"></span>
										{this._literals.saveText}
									</button>
								</li>
								<li class="cdk-pitch-section-data__list--close">
									<button
										aria-label="Close pitch"
										onClick={e => {
											this.closeWindow(e);
										}}
									>
										<span role="img" class="u-icon icon-close icon-style"></span>
										{this._literals.closeText}
									</button>
								</li>
							</ul>
						</nav>
						<div class="cdk-pitch-section-data__board">
							<div class="cdk-pitch-section-data__board--header">
								<span class="u-icon icon-options icon-style"></span>
								<span>{this._literals.page}</span>
							</div>
							<hr class="cdk-pitch-section-data__board--separator" role="separator"></hr>
							<div class="cdk-pitch-section-data__board--content">
								{this._additionalContent && (
									<div class="cdk-pitch-section-data__content--additional">
										<scib-ui-row>
											<scib-ui-column col-xs="2" col-md="2" col-lg="2" class="additionalContentSeparator">
												<scib-ui-input
													infoTooltipText={this._literals.contentButtonInfo}
													infoTooltipPosition="right"
													placeholder={this._literals.placeholderContentButton}
													label={this._literals.labelContentButton}
													charCounter={this._data.pitch.contentButtonName ? this._data.pitch.contentButtonName.length : 0}
													charLimit={this._literals.contetButtonLimit}
													value={this._data.pitch.contentButtonName ? this._data.pitch.contentButtonName : null}
													name={this._data.pitch.name + this._literals.placeholderContentButton}
													showLabelTooltip
													noIconRight
													onEventChange={e => {
														e.preventDefault();
														this.pitchFormChange({
															value: e.detail && e.detail.length > 0 ? e.detail : this._literals.contentButtonDefault,
															type: 'contentButtonName',
														});
													}}
												></scib-ui-input>
											</scib-ui-column>
											<scib-ui-column col-xs="4" col-md="4" col-lg="4">
												<scib-ui-row class="additional-content">
													<div class="additional-content--image-frame">
														<label class="cdk-pitch-section-data__content--label">{this._literals.labelContentImage}</label>
														<div class="cdk-pitch-section-data__content--upload">
															<div style={{ 'background-image': `url(${this.imageAdditionalContentSrc})` }} class="cdk-pitch-section-data__content--images"></div>
														</div>
													</div>
													<div class="additional-content--title">
														<scib-ui-input
															infoTooltipText={this._literals.contentTitleInfo}
															infoTooltipPosition="left"
															placeholder={this._literals.placeholderContentTitle}
															label={this._literals.labelContentTitle}
															charCounter={this._data.pitch.contentTitle ? this._data.pitch.contentTitle.length : 0}
															charLimit={this._literals.contetTitleLimit}
															value={this._data.pitch.contentTitle ? this._data.pitch.contentTitle : null}
															name={this._data.pitch.name + this._literals.placeholderContentTitle}
															showLabelTooltip
															noIconRight
															onEventChange={e => {
																e.preventDefault();
																this.pitchFormChange({
																	value: e.detail && e.detail.length > 0 ? e.detail : this._literals.contentTitleDefault,
																	type: 'contentTitle',
																});
															}}
														></scib-ui-input>
													</div>
												</scib-ui-row>
											</scib-ui-column>
										</scib-ui-row>
									</div>
								)}
								{/* {this._template && (
									<div class="cdk-pitch-section-data__content--type">
										<span role="img" class="u-icon icon-lock-24 icon-style"></span>
										<span>
											{' '}
											{this._data.pitch.selectedTemplate ? this._data.pitch.selectedTemplate.label : ''} - {this._literals.contents}
										</span>
									</div>
								)} */}

								{this._items && (
									<div class="cdk-pitch-section-data__list">
										<scib-cdk-elements-list data={this._items}></scib-cdk-elements-list>
									</div>
								)}
								{this._items.length > 0 ? (
									<h2 class="cdk-pitch-section-data__content--addsection" style={this._template ? { 'margin-top': 'rem(24)' } : { 'margin-top': 'rem(48)' }}>
										<span>{this._literals.addSection}</span>
									</h2>
								) : (
									<h2 class="cdk-pitch-section-data__content--addnewsection" style={this._template ? { 'margin-top': 'rem(24)' } : { 'margin-top': 'rem(48)' }}>
										{this._literals.startAddSection}
									</h2>
								)}
								<scib-cdk-add-element data={this._elements} section={this._items.length} onAddElementEvent={e => this.addElement(e)}></scib-cdk-add-element>
							</div>
						</div>
					</section>
				</div>
			</Host>
		);
	}
}
