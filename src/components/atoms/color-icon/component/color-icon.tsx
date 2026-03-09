import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { Component, Host, h, Prop, Element } from '@stencil/core';
import { IconsName } from '../models/color-icon.model';

/**
 * Component description
 *
 * @status stable
 */
@Component({
	tag: 'scib-atoms-color-icon',
	styleUrl: 'color-icon.scss',
	shadow: true
})
export class AtomsColorIcon {
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ attribute: 'name' }) name: IconsName = 'attach-document';

	/**
	 *
	 * @param iconName
	 * @returns
	 */
	getIconUrl(iconName: string): string {
		const _url = `/assets/color_icons/${iconName}.svg`;
		return assetUrl(_url);
	}

	render() {
		return (
			<Host>
				<div class="color-icon__container">
					<img src={this.getIconUrl(this.name)} />
				</div>
			</Host>
		);
	}
}
