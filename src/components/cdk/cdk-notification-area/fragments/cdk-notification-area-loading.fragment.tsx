import { FunctionalComponent, h } from '@stencil/core';

export const CDKNotificationAreaLoading: FunctionalComponent<{
	show: boolean;
}> = props => {
	return (
		<div class="c-notarea-list-loading-container" style={{ display: props.show ? 'block' : 'none' }}>
			<div class="c-notarea-list-loading">
				<svg class="c-notarea-list-loading-circular">
					<circle class="c-notarea-list-loading-path" fill="none" r="20" cx="50" cy="50" stroke-width="5" stroke-miterlimit="10" />
				</svg>
			</div>
		</div>
	);
};
