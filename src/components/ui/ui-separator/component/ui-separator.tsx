import { Component, Host, h } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-separator',
	styleUrl: 'ui-separator.scss',
	shadow: false,
	scoped: false,
})
export class UISeparator {
	render() {
		return (
			<Host>
				<hr class="ui-separator" role="separator"></hr>
			</Host>
		);
	}
}
