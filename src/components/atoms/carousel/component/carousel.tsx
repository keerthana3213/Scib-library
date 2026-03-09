import { AtomsCarouselOverlay } from '../../carousel-overlay/component/carousel-overlay';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Component, Host, h, Prop, State, Element } from '@stencil/core';
/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-carousel',
	styleUrl: 'carousel.scss',
	shadow: true
})
export class AtomsCarousel {
	@Element() _hostRef: HTMLElement;
	public buttonPrevRef: HTMLButtonElement;
	public buttonNextRef: HTMLButtonElement;
	public navigationRef: HTMLElement;
	public overlayRef: AtomsCarouselOverlay;

	public sliderContainer: HTMLSlotElement;
	public slotContainer: HTMLSlotElement;
	public slotsElements: Element[];
	public slotsElementsLength: number;
	public slideDots: Element[];
	public widthCalculator: number;
	public gapSpacebetweenImages: number = 20;

	/**
	 *
	 */
	@Prop({ reflect: true }) positionNavigation: 'center' | 'right' | 'left' = 'center';

	/**
	 * Número de slides por vista
	 */
	@Prop() itemsBySlide: number = 1;

	/**
	 * Deshabilita la navigación por puntos
	 */
	@Prop() disableDots: boolean;

	/**
	 * Deshabilita el overlay
	 */
	@Prop() disableOverlay: boolean;

	/**
	 * Control del ciere y apertura del overlay
	 */
	@State() $open: boolean;

	/**
	 *
	 */
	@State() slideIndex: number = 0;

	/**
	 *
	 */
	@State() $itemsToMove: number = 0;

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this.sliderContainer = this._hostRef.shadowRoot.querySelector('.slider');
		this.slotContainer = this._hostRef.shadowRoot.querySelector('slot');
		this.slotsElements = Object.assign(this.slotContainer.assignedElements?.());
		this.getListDots();
		this.slideDots = [...this._hostRef.shadowRoot.querySelectorAll('.navigation li')];
		this.initSetCalculatorSlides();
		this.handlerSlidersEvent();
	}

	/**
	 *
	 */
	handlerSlidersEvent() {
		this.slotsElements.forEach((slotsElement, index) => {
			slotsElement.addEventListener('click', (event) => {
				event.stopImmediatePropagation();
				event.preventDefault();
				this.handlerOpenOverlay(index);
			});
		});
	}

	/**
	 * Controla la apertura del overlay
	 */
	handlerOpenOverlay(itemIndex: number) {
		this.overlayRef.open(this.slotsElements, itemIndex);
		this.$open = true;
	}

	/**
	 * Controla el cierre del overlay
	 */
	handlerCloseOverlay() {
		this.$open = false;
	}

	/**
	 * Calcular la anchura que debe tener cada slot
	 */
	initSetCalculatorSlides() {
		new ResizeObserver((entries: any) => {
			entries.forEach(() => {
				const { width }: { width: number } = this.sliderContainer.getBoundingClientRect();
				this.widthCalculator = (width + this.gapSpacebetweenImages) / this.itemsBySlide;
				this.setSlotInputListener();
				this.setTranslateSliderHandler();
			});
		}).observe(this.sliderContainer);
	}

	/**
	 * Asigna la anchura a cada slot
	 */
	setSlotInputListener() {
		this.slotsElements.forEach((slotsElement: HTMLElement) => {
			slotsElement.style.flex = `0 0 ${this.widthCalculator - this.gapSpacebetweenImages}px`;
			slotsElement.style.minWidth = `${this.widthCalculator - this.gapSpacebetweenImages}px`;
		});
	}

	/**
	 *
	 * @param index
	 */
	private _getDotIem(index: number): HTMLElement {
		const _li = document.createElement('li');
		_li.setAttribute('key', `${index}`);
		_li?.classList.add('navigation__item');
		_li.onclick = (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			this._navigateByIndex(index);
		};
		return _li;
	}

	/**
	 * Genera la lista de dots en función del número de slot
	 */
	getListDots() {
		this.slotsElementsLength = this.slotsElements.length;
		this.navigationRef.replaceChildren('');
		(this.slotsElements || []).forEach((_, index) => {
			if (index === 0) {
				const _li = this._getDotIem(index);
				_li?.classList.add('navigation__item--active');
				this.navigationRef.appendChild(_li);
			} else if (index < Math.ceil(this.slotsElementsLength / this.itemsBySlide)) {
				const _li = this._getDotIem(index);
				this.navigationRef.appendChild(_li);
			}
		});
	}

	/**
	 * Control hacia las anteriores slides
	 */
	previousSlide() {
		if (this.slideIndex === 0) {
			this.goToSlide(Math.ceil(this.slotsElementsLength / this.itemsBySlide) - 1);
			this.$itemsToMove = this.slotsElementsLength - this.itemsBySlide;
		} else if (this.slideIndex === 1) {
			this.goToSlide(0);
			this.$itemsToMove = 0;
		} else {
			this.goToSlide(--this.slideIndex);
			this.$itemsToMove -= this.itemsBySlide;
		}
		this.setTranslateSliderHandler();
		this.slidesDotsHandler(this.slideIndex);
	}

	/**
	 * Control hacia las siguientes slides
	 */
	nextSlide() {
		if (this.slideIndex === Math.ceil(this.slotsElementsLength / this.itemsBySlide) - 1) {
			this.goToSlide(0);
			this.$itemsToMove = 0;
		} else if (this.slideIndex === Math.ceil(this.slotsElementsLength / this.itemsBySlide) - 2) {
			this.goToSlide(++this.slideIndex);
			this.$itemsToMove += this.slotsElementsLength % this.itemsBySlide ? this.slotsElementsLength % this.itemsBySlide : this.itemsBySlide;
		} else {
			this.goToSlide(++this.slideIndex);
			this.$itemsToMove += this.itemsBySlide;
		}
		this.setTranslateSliderHandler();
		this.slidesDotsHandler(this.slideIndex);
	}

	/**
	 *
	 */
	goToSlide(slideIndex: number) {
		this.slideIndex = slideIndex;
	}

	/**
	 *
	 * @param index
	 */
	private _navigateByIndex(index: number) {
		this.goToSlide(index);
		this.$itemsToMove = index;
		this.setTranslateSliderHandler();
		this.slidesDotsHandler(this.slideIndex);
	}

	/**
	 *
	 */
	setTranslateSliderHandler() {
		this.slotContainer.style.transform = `translateX(${-this.widthCalculator * this.$itemsToMove}px)`;
		this.slotContainer.style.transition = `all 0.5s ease-in-out`;
	}

	/**
	 * Controla los puntos de navegación
	 */
	slidesDotsHandler(dotIndex: number) {
		this.slideDots.forEach((slideDot) => slideDot?.classList.remove('navigation__item--active'));
		this.slideDots[dotIndex]?.classList.add('navigation__item--active');
	}

	render() {
		return (
			<Host>
				<div
					class={{
						slider: true,
						'slider--actions': !this.disableOverlay
					}}
				>
					<scib-atoms-button
						class="btn btn-next"
						icon="chevron-right"
						icon-position="trailing"
						level="secondary"
						size="m"
						type="button"
						variant="icon"
						onClick={() => this.nextSlide()}
					></scib-atoms-button>
					<div class="slider__container">
						<slot />
					</div>
					<scib-atoms-button
						class="btn btn-prev"
						icon="chevron-left"
						icon-position="trailing"
						level="secondary"
						size="m"
						type="button"
						variant="icon"
						onClick={() => this.previousSlide()}
					></scib-atoms-button>
				</div>

				<ul
					class={{
						navigation: true,
						'navigation--hidden': this.disableDots
					}}
					ref={(el) => (this.navigationRef = el as HTMLElement)}
				></ul>

				{!this.disableOverlay && (
					<div
						class={{
							overlay: true,
							'overlay--show': this.$open
						}}
					>
						<scib-atoms-carousel-overlay
							disableDots={this.disableDots}
							ref={(el) => (this.overlayRef = el as any)}
							onEventOverlayClose={() => this.handlerCloseOverlay()}
						></scib-atoms-carousel-overlay>
					</div>
				)}
			</Host>
		);
	}
}
