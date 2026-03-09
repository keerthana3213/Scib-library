import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IContent } from '../models/cdk-carousel.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-carousel',
	styleUrl: 'cdk-carousel.scss',
	shadow: false,
	scoped: true,
})
export class CDKCarousel {
	/** Show bottom dots on carousel */
	@Prop({ reflect: true }) showDots: boolean;

	/** Add transparent  background to content  when accordeon is open */
	@Prop({ mutable: true, reflect: true }) transparentBg: boolean;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) content: IContent | string;
	@State() _content: IContent;
	@Watch('content') parseContent(newContent: IContent | string) {
		this._content = _parseProp<IContent>(newContent as string);
	}

	/** Indicates which slide is being displayed*/
	@State() _activeSlide: number = 0;

	/** Controls X translation of the carousel*/
	@State() move: number = 0;

	/** Bottom navigation dots*/
	@State() arrayDots: Array<any> = [];

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseContent(this.content);
		this.drawDots();
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	plusSlides(id) {
		if (id === 'next') {
			this._activeSlide += 1;
			this.move -= 1248;
		} else {
			this._activeSlide -= 1;
			this.move += 1248;
		}
		this.arrayDots = [];
		this.drawDots();
	}

	changeSlide(index) {
		if (index > this._activeSlide) {
			this.plusSlides('next');
		} else {
			this.plusSlides('prev');
		}
	}

	drawDots() {
		for (let i = 0; i < Math.abs(this._content.length / 4); i++) {
			this.arrayDots.push(
				<li>
					<button class={{ 'cdk-carousel__dots--dot': true, 'cdk-carousel__dots--active': i === this._activeSlide }} onClick={() => this.changeSlide(i)}></button>
				</li>,
			);
		}
	}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<Host style={{ backgroundColor: this.transparentBg ? 'transparent' : 'var(--cdk-carousel-bg-color)' }}>
				<div class="cdk-carousel">
					{this._activeSlide > 0 ? <button class="cdk-carousel__arrow u-icon icon-arrow-chassis" id="prev" onClick={() => this.plusSlides('prev')}></button> : ''}
					{/* This condition was thinking for show 4 cdk-ism-contact cards, for other cases maybe must be change*/}
					{this._activeSlide < Math.abs(this._content.length / 4) - 1 ? (
						<button class="cdk-carousel__arrow u-icon icon-arrow-chassis" id="next" onClick={() => this.plusSlides('next')}></button>
					) : (
						''
					)}
					<section>
						<div class="cdk-carousel__content" style={{ left: this._activeSlide === 0 ? '0px' : '' }}>
							<div class="cdk-carousel__content--item" style={{ left: this.move.toString() + 'px' }}>
								<slot />
							</div>
						</div>
						{this.showDots ? <ul class="cdk-carousel__dots">{this.arrayDots}</ul> : ''}
					</section>
				</div>
			</Host>
		);
	}
}
