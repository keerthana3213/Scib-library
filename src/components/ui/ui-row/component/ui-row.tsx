import { Component, h, Prop } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-row',
	styleUrl: 'ui-row.scss',
	shadow: false,
	scoped: false,
})
export class UIRow {
	@Prop() separator: boolean = false;

	@Prop() alignBottom: boolean = false;

	render() {
		return (
			<div class={{ 'ui-row': true, 'ui-row--bottom': this.alignBottom }}>
				<slot />
				{this.separator && (
					<scib-ui-column colLg={6}>
						<scib-ui-separator></scib-ui-separator>
					</scib-ui-column>
				)}
			</div>
		);
	}
}
