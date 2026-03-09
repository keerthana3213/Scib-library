import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { CDKIsmLinkCardSkeleton } from '../fragments/cdk-ism-link-card-skeleton.fragment';
import { ILiterals } from '../models/cdk-ism-link-card.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-ism-link-card',
	styleUrl: 'cdk-ism-link-card.scss',
	shadow: false,
	scoped: true,
})
export class CDKIsmLinkCard {
	@Prop({ reflect: true }) showSkeleton: boolean;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ILiterals[] | string;
	@State() _literals: ILiterals[];
	@Watch('literals') parseLiterals(newLiterals: ILiterals[] | string) {
		this._literals = _parseProp<ILiterals[]>(newLiterals as string);
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<Host>
				<div>
					{this._literals &&
						this._literals.map(item =>
							this.showSkeleton ? (
								<div class="cdk-ism__skeleton">
									<div class="cdk-ism__skeleton-container">
										<CDKIsmLinkCardSkeleton />
										<div class="cdk-ism__skeleton-shine" />
									</div>
								</div>
							) : (
								<div class="cdk-ism-link-card">
									<scib-ui-card iconArrow ismcard>
										<article>
											<div class="cdk-ism-link-card__head">
												<figure>
													<img src={item.icon}></img>
												</figure>
												<h2>{item.title}</h2>
											</div>
											<scib-ui-separator></scib-ui-separator>
											<div class="cdk-ism-link-card__content">
												<div class="cdk-ism-link-card__steps">
													<div class="cdk-steps">
														<div class="cdk-steps__point">
															<span>1</span>
														</div>
														{item.step1}
													</div>
													{/* Change p by icon */}
													<p>
														<span>.</span>
														<span>.</span>
														<span>.</span>
														<span>.</span>
													</p>
													<div class="cdk-steps">
														<div class="cdk-steps__point">
															<span>2</span>
														</div>
														{item.step2}
													</div>
												</div>
												<figure>
													<img src={item.image}></img>
												</figure>
											</div>
										</article>
									</scib-ui-card>
								</div>
							),
						)}
				</div>
			</Host>
		);
	}
}
