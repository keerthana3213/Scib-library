import { Component, h, Prop, Watch, State } from '@stencil/core';
import { IUIEmptyStateLiterals } from '../models/ui-empty-state.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-empty-state',
	styleUrl: 'ui-empty-state.scss',
	shadow: false,
	scoped: true
})
export class UIEmptyState {
	/** Literals */
	@Prop({ reflect: false }) literals: string | IUIEmptyStateLiterals;
	@Watch('literals') literalsChange(newVal: string | IUIEmptyStateLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: IUIEmptyStateLiterals;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
	}

	render() {
		return (
			<section class="ui-emptye">
				<figure class="ui-emptye__figure">
					<img class="ui-emptye__img" src={this._literals.imgSrc} alt="" />
				</figure>
				<strong class="ui-emptye__title">
					{this._literals.mainTitle}
					<span class="ui-emptye__desc">{this._literals.desc}</span>
				</strong>
			</section>
		);
	}
}
