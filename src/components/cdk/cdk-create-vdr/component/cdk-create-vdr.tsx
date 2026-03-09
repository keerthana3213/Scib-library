import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKVdrCreateLiterals } from '../models/cdk-create-vdr.model';
import { tns } from 'tiny-slider/src/tiny-slider';

/**
 * Component description
 *
 * @slot fieldset - Fieldset slot content
 */
@Component({
	tag: 'scib-cdk-create-vdr',
	styleUrl: 'cdk-create-vdr.scss',
	shadow: false,
	scoped: false,
})
export class CDKCreateVdr {
	$slider!: HTMLElement;

	_slider: any;

	@State() _currentStep: number;

	/* (optional) Frame rate of slider movement */
	@Prop() speedSlider: number = 300;

	/* (optional) Indicates if the slider starts to move automatically */
	@Prop() autoplaySlider: boolean = false;

	/* (optional) Indicates whether to focus on mobile view*/
	@Prop() centerOnMobile: boolean;

	/* (optional) Indicates whether to focus on mobile view*/
	@Prop({ mutable: true, reflect: true }) disabled: boolean = true;
	// @Prop({mutable: true, reflect: true}) disabledSubmit: boolean = true;

	/* (optional) Indicates if the slider movement is circular */
	@Prop() loopSlider: boolean = false;

	/** Event when create modal ends */
	@Event() eventFinishCreate: EventEmitter;

	/** Event when click on prev button */
	@Event() eventPrevCreate: EventEmitter;

	/** Event when click on next button */
	@Event() eventNextCreate: EventEmitter;

	@Prop() dataForm: any = {};

	/**Literals */
	@Prop({ reflect: true }) literals: ICDKVdrCreateLiterals | string;

	@Watch('literals') literalsChange(newVal: ICDKVdrCreateLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	@State() _openModalNewUser: boolean;

	@Prop()
	isFinalStep: boolean = false;

	@Prop()
	goToCustomStep: any;

	@Watch('goToCustomStep') customStepChange(val) {
		this._slider.goTo(val);
	}

	@State() _literals: ICDKVdrCreateLiterals;

	@Listen('updateOwners')
	_handleUserUpdate() {
		setTimeout(() => {
			this._slider?.updateSliderHeight();
		}, 100);
	}

	@Listen('eventValueInput')
	_handleInput(e: any) {
		this.dataForm.input = e.detail.detail;
	}

	@Listen('eventValueTextarea')
	_handleTextarea(e: any) {
		this.dataForm.textArea = e.detail.detail;
	}

	@Listen('eventValueMultiselect')
	_handleMultiselect(e: any) {
		e.preventDefault();
		this.dataForm.multiselect = e.detail;
		setTimeout(() => {
			this._slider?.updateSliderHeight();
		}, 100);
	}

	@Listen('eventValueMultiselectMembers')
	_handleMultiselectMembers(e: any) {
		e.preventDefault();
		this.dataForm.multiselectMembers = e.detail;
		setTimeout(() => {
			this._slider?.updateSliderHeight();
		}, 100);
	}

	@Listen('eventValuesInitialFormEmitter')
	_handleRequired(e: any) {
		this.disabled = e.detail;
	}

	// @Listen ('eventValuesFinalFormEmitter')
	// _handleRequiredToSubmit(e:any){
	// 	 this.disabledSubmit = e.detail;
	// }

	/** Life cycle executed before first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this._currentStep = 1;
	}

	/** Life cycle executed after the first Render after loading */
	componentDidLoad() {
		this._slider = tns({
			container: this.$slider,
			items: 1,
			slideBy: 'page',
			controls: false,
			mouseDrag: false,
			speed: this.speedSlider,
			nav: false,
			autoplay: this.autoplaySlider,
			loop: this.loopSlider,
			autoHeight: true,
			touch: false,
		});

		this._slider.events.on('transitionEnd', () => {
			this._currentStep = this._slider?.getInfo()?.displayIndex;
		});
	}

	/** Next function */
	_handleNext() {
		this.eventNextCreate.emit(this.dataForm);
		this._slider?.goTo('next');
	}

	/** Prev function */
	_handlePrev() {
		this.eventPrevCreate.emit(this.dataForm);
		this._slider?.goTo('prev');
	}

	/** Emitter to last step with data form filled */
	_handleFinish() {
		this.eventFinishCreate.emit(this.dataForm);
	}

	/** Check if you are in the last step */
	_isCreationFinish(): boolean {
		// const sliderInfo = this._slider?.getInfo();
		// return this._currentStep === sliderInfo?.slideCount;
		return this._currentStep === 2;
	}

	render() {
		return (
			<section class="cdk-cvdr">
				<form class="cdk-cvdr__form" name="vdr-create-form" action="post">
					<div id="idSlider" ref={el => (this.$slider = el as HTMLElement)}>
						<slot name="fieldset" />
					</div>
				</form>
				<footer class={{ 'cdk-cvdr__footer': true, 'cdk-cvdr__footer--end': this._currentStep !== 1 }}>
					<span class={{ 'cdk-cvdr__notice': true, 'cdk-cvdr__notice--hide': this._currentStep !== 1 }}>
						{this._literals.notice}
					</span>
					{this._currentStep !== 3 && (
						<div class="cdk-cvdr__group">
							{this._isCreationFinish() && (
								// Back button
								<scib-ui-button
									large
									icon="icon-chrevron-right"
									showTextOn="tablet"
									secondary
									onEventClick={() => this._handlePrev()}
								>
									{this._literals.btnBack}
								</scib-ui-button>
							)}

							{this._isCreationFinish() ? (
								// Finish button
								<scib-ui-button
									large
									primary
									type="submit"
									// disabled={this.disabledSubmit}
									onEventClick={() => this._handleFinish()}
								>
									{this._literals.btnFinish}
								</scib-ui-button>
							) : (
								// Next button
								<scib-ui-button large primary disabled={this.disabled} onEventClick={() => this._handleNext()}>
									{this._literals.btnNext}
								</scib-ui-button>
							)}
						</div>
					)}
				</footer>
			</section>
		);
	}
}
