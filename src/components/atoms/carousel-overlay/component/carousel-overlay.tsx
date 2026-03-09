import { Component, Host, h, Prop, EventEmitter, State, Event, Element, Method } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-carousel-overlay',
	styleUrl: 'carousel-overlay.scss',
	shadow: true
})
export class AtomsCarouselOverlay {
	@Element() _hostRef: HTMLElement;

	public buttonPrevOverlayRef: HTMLButtonElement;
	public buttonNextOverlayRef: HTMLButtonElement;
	public buttonPrevOverlayCloseRef: HTMLButtonElement;

	public sliderRef: HTMLElement;
	public overlayRef: HTMLElement;
	public navigationRef: HTMLElement;

	public slotsElement: HTMLElement[];
	public slideDots: Element[];

	public arrayLength: any;

	/**
	 *
	 */
	@Prop({ mutable: true }) disableDots: boolean;

	/**
	 *
	 */
	@State() $overlayIndex: number = 0;

	/**
	 *
	 */
	@State() _data: any[];

	/**
	 *
	 */
	@State() $open: boolean;

	/**
	 *
	 */
	@Method() async open(elements: any[], itemIdnex: number) {
		this._setData(elements, itemIdnex);
		this.$overlayIndex = itemIdnex;
		this.setTranslateSliderHandler();
		this.slidesDotsHandler(this.$overlayIndex);
		this.eventOverlayOpen.emit();
	}

	/**
	 *
	 */
	@Method() async close() {
		this.$open = false;
		this.eventOverlayClose.emit();
	}

	/**
	 *
	 */
	@Event() eventOverlayClose: EventEmitter<void>;

	/**
	 *
	 */
	@Event() eventOverlayOpen: EventEmitter<void>;

	/**
	 *
	 * @param newValue
	 */
	private _setData(elementsList: any[], itemIdnex: number) {
		this.slotsElement = (elementsList || []).map((element) => element.cloneNode(true));
		this.arrayLength = this.slotsElement.length;
		this._data = [...this.slotsElement];
		this.getListDots(itemIdnex);
		this.slideDots = [...this._hostRef.shadowRoot.querySelectorAll('.navigation li')];
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
	getListDots(itemIdnex: number) {
		this.navigationRef.replaceChildren('');
		(this._data || []).forEach((_, index) => {
			const _li = this._getDotIem(index);
			if (itemIdnex === index) {
				_li?.classList.add('navigation__item--active');
			}
			this.navigationRef.appendChild(_li);
		});
	}

	/**
	 *
	 */
	handlerOverlayClose() {
		this.close();
	}

	/**
	 *
	 */
	previousSlide() {
		if (this.$overlayIndex === 0) {
			this.goToSlide(this.arrayLength - 1);
		} else {
			this.goToSlide(--this.$overlayIndex);
		}
		this.setTranslateSliderHandler();
		this.slidesDotsHandler(this.$overlayIndex);
	}

	/**
	 *
	 */
	nextSlide() {
		if (this.$overlayIndex == this.arrayLength - 1) {
			this.goToSlide(0);
		} else {
			this.goToSlide(++this.$overlayIndex);
		}
		this.setTranslateSliderHandler();
		this.slidesDotsHandler(this.$overlayIndex);
	}

	/**
	 *
	 * @param slide
	 */
	goToSlide(slideIndex: number) {
		this.$overlayIndex = slideIndex;
	}

	/**
	 *
	 * @param index
	 */
	private _navigateByIndex(index: number) {
		this.goToSlide(index);
		this.$overlayIndex = index;
		this.setTranslateSliderHandler();
		this.slidesDotsHandler(this.$overlayIndex);
	}

	/**
	 *
	 */
	setTranslateSliderHandler() {
		this.sliderRef.style.transform = `translateX(${-100 * this.$overlayIndex}%)`;
		this.sliderRef.style.transition = `all 0.5s ease-in-out`;
	}

	/**
	 *
	 * @param dot
	 */
	slidesDotsHandler(dotIndex: number) {
		this.slideDots.forEach((slideDot) => slideDot?.classList.remove('navigation__item--active'));
		this.slideDots[dotIndex]?.classList.add('navigation__item--active');
	}

	/**
	 *
	 * @param parentNode
	 * @param element
	 */
	appendElement(parentNode: HTMLElement, element: HTMLElement) {
		element?.classList.add('overlay-container__item');
		parentNode.replaceChildren(element);
	}

	render() {
		return (
			<Host>
				<div ref={(el) => (this.overlayRef = el as HTMLElement)} class="overlay">
					<div class="container-overlay">
						<button
							type="button"
							ref={(el) => (this.buttonPrevOverlayCloseRef = el as HTMLButtonElement)}
							onClick={() => this.handlerOverlayClose()}
							class="btn-close"
						>
							<span class="fas fa-chevron-right" aria-hidden="true"></span>
							<span style={{ '--icon-content': `var(--theme-scib-icon-close-thin)` }}>
								<i class="icon" />
							</span>
						</button>
						<div class="container">
							<div class="slider" ref={(el) => (this.sliderRef = el as HTMLElement)}>
								{this._data &&
									this._data.map((item) => <div class="overlay-container" ref={(parent) => this.appendElement(parent, item)} />)}
							</div>
						</div>
						<button
							type="button"
							ref={(el) => (this.buttonNextOverlayRef = el as HTMLButtonElement)}
							onClick={() => this.nextSlide()}
							class="btn btn-next"
						>
							<span class="fas fa-chevron-right" aria-hidden="true"></span>
							<span style={{ '--icon-content': `var(--theme-scib-icon-chevron)` }}>
								<i class="icon" />
							</span>
						</button>
						<button
							type="button"
							ref={(el) => (this.buttonPrevOverlayRef = el as HTMLButtonElement)}
							onClick={() => this.previousSlide()}
							class="btn btn-prev"
						>
							<span class="fas fa-chevron-left" aria-hidden="true"></span>
							<span style={{ '--icon-content': `var(--theme-scib-icon-chevron-left)` }}>
								<i class="icon" />
							</span>
						</button>

						<ul
							ref={(el) => (this.navigationRef = el as HTMLElement)}
							class={{
								navigation: true,
								'navigation--hidden': this.disableDots
							}}
						></ul>
					</div>
				</div>
			</Host>
		);
	}
}
