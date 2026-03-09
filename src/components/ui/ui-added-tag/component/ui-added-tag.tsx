import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-added-tag',
	styleUrl: 'ui-added-tag.scss',
	shadow: false,
	scoped: true,
})
export class UIAddedTag {
	@Prop({ reflect: true }) literals: any | string;
	@Watch('literals') literalsChange(newVal: any | string) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: any | string;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
	}
	render() {
		return (
			<Host>
				<figure class="ui-added">
					<span class="u-icon icon-confirm"></span>
					<label class="ui-added__label">{this._literals.added}</label>
				</figure>
			</Host>
		);
	}
}
