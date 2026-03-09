import { Component, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKWizardLiterals } from '../models/cdk-wizard.model';
import { tns } from 'tiny-slider/src/tiny-slider';

/**
 * Component description
 *
 * @slot step - Step slot container
 */
@Component({
	tag: 'scib-cdk-wizard',
	styleUrl: 'cdk-wizard.scss',
	shadow: false,
	scoped: false,
})
export class CDKWizard {
	$slider!: HTMLElement;

	@Element() _hostRef: HTMLElement;

	@State() _slider: any;

	/**Literales */
	@Prop({ reflect: true }) literals: ICDKWizardLiterals | string;

	@Watch('literals') literalsChange(newVal: ICDKWizardLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	@State() _literals: ICDKWizardLiterals;

	@State() _currentStep: number;

	/* (opcional) Velocidad en fotogramas del desplazamiento del slider */
	@Prop() speedSlider: number = 300;

	/* (opcional) Inidica si el slider comienza a desplazarse de manera automaticamente */
	@Prop() autoplaySlider: boolean = false;

	/* (opcional) Inidica si se debe centrar en vista mobile*/
	@Prop() centerOnMobile: boolean;

	/* (opcional) Indica si el desplazamiento del slider es circular */
	@Prop() loopSlider: boolean = false;

	/* (opcional) Indica si hay un banner footer */
	@Prop() hasBannerFooter: boolean = false;

	/** Setea la anchura al máximo */
	@Prop({ mutable: true, reflect: false }) fullWidth: boolean = false;

	/** Evento cuando finaliza el wizard */
	@Event() eventFinishWizard: EventEmitter;

	/** View later event */
	@Event() eventViewLater: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this._currentStep = 1;
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		this._slider = tns({
			container: this.$slider,
			items: 1,
			slideBy: 'page',
			controls: false,
			touch: false,
			mouseDrag: false,
			speed: this.speedSlider,
			nav: true,
			autoplay: this.autoplaySlider,
			loop: this.loopSlider,
		});

		this._slider?.events.on('transitionEnd', () => {
			this._currentStep = this._slider?.getInfo()?.displayIndex;
		});
	}

	_handleNext() {
		this._slider?.goTo('next');
	}

	_handlePrev() {
		this._slider?.goTo('prev');
	}

	_handleFinish() {
		this.eventFinishWizard.emit();
	}

	_handleViewLater() {
		this.eventViewLater.emit();
	}

	/** Comprueba si se encuentra en el último paso */
	_isWizardFinish(): boolean {
		const sliderInfo = this._slider?.getInfo();
		return this._currentStep === sliderInfo?.slideCount;
	}

	render() {
		return (
			<section class={{ 'cdk-wizard': true, 'cdk-wizard-full-width': this.fullWidth }}>
				<scib-ui-button onClick={() => this._handleViewLater()} class="cdk-wizard__view-later" nobackground link small>
					{this._literals.btnViewLater}
				</scib-ui-button>
				<section
					class={{
						'cdk-wizard__carousel': true,
						'cdk-wizard__carousel-full-width': this.fullWidth,
						'cdk-wizard__carousel-has-banner': this.hasBannerFooter,
					}}
					aria-label="Novedades destacadas"
					aria-live="polite"
				>
					<div ref={el => (this.$slider = el as HTMLElement)}>
						<slot name="step" />
					</div>
				</section>
				{this.hasBannerFooter && (
					<section class="cdk-wizard__banner-footer">
						<slot name="footer" />
					</section>
				)}
				<footer class="cdk-wizard__footer">
					{this._currentStep !== 1 && (
						<scib-ui-button secondary hide-txt icon="icon-chevron-left" onEventClick={() => this._handlePrev()}>
							{this._literals.btnBackTooltip}
						</scib-ui-button>
					)}

					{this._isWizardFinish() ? (
						<scib-ui-button primary onEventClick={() => this._handleFinish()}>
							{this._literals.btnFinish || '[[btnFinish]]'}
						</scib-ui-button>
					) : (
						<scib-ui-button primary onEventClick={() => this._handleNext()}>
							{this._literals.btnNext || '[[btnNext]]'}
						</scib-ui-button>
					)}
				</footer>
			</section>
		);
	}
}
