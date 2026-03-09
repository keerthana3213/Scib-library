import { FunctionalComponent, h } from '@stencil/core';

export const UIButtonLoading: FunctionalComponent<{}> = () => {
	return (
		<div class="c-loader">
			<svg class="c-loader-circular">
				<circle class="c-loader-path" fill="none" r="20" cx="50" cy="50" stroke-width="5" stroke-miterlimit="10" />
			</svg>
		</div>
	);
};
