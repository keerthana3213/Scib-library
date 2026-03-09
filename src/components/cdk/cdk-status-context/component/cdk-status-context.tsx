import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKStatusContextLiterals } from '../models/cdk-status-context.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 * @slot dataContent - DataContent slot content
 */
@Component({
	tag: 'scib-cdk-status-context',
	styleUrl: 'cdk-status-context.scss',
	shadow: false,
	scoped: false,
})
export class CDKStatusContext {
	/** Literals */
	@Prop({ reflect: true }) literals: ICDKStatusContextLiterals | string;

	@Watch('literals') literalsChange(newVal: ICDKStatusContextLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	@State() _literals: ICDKStatusContextLiterals;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.literalsChange(this.literals);
	}

	render() {
		let sectionIndex: number[] = [];

		this._literals.items.forEach((card, index) => {
			if (index == 0) {
				sectionIndex.push(index);
			} else if (card.status != this._literals.items[index - 1].status) {
				sectionIndex.push(index);
			}
		});

		return (
			<Host>
				<scib-cdk-modal-form
					data={{
						title: this._literals.title,
						text: this._literals.text,
					}}
				>
					<section class="cdk-context" slot="">
						<ol class="cdk-context__list">
							{sectionIndex.map((startIndex, sectionNumber) => (
								<li class="cdk-context__row">
									<scib-ui-row>
										<scib-ui-column colXs={0} colLg={1}>
											<h3
												class={`cdk-context__number
													cdk-context__number--${this._literals.items[startIndex].status}`}
											>
												{sectionNumber + 1}
											</h3>
										</scib-ui-column>

										<scib-ui-column colXs={6} colLg={5}>
											{this._literals.items.map(
												(card, index) =>
													index >= startIndex &&
													(sectionNumber == sectionIndex.length - 1 || index < sectionIndex[sectionNumber + 1]) && (
														<scib-ui-row>
															<scib-ui-color-panel status={card.status}>
																<div slot="dataContent" class="cdk-context__data">
																	<h4 class="cdk-context__title">{card.title}</h4>
																	<p>{card.text}</p>
																</div>
															</scib-ui-color-panel>
														</scib-ui-row>
													),
											)}
										</scib-ui-column>
									</scib-ui-row>
								</li>
							))}
						</ol>
					</section>
				</scib-cdk-modal-form>
			</Host>
		);
	}
}
