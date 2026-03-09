import { FunctionalComponent, h } from '@stencil/core';

export const UIButtonTooltip: FunctionalComponent<{
	/** Texto del tooltip */
	text: string;
	/** Clase del tooltip */
	classTooltip: string;
}> = props => {
	return (
		<div class={{ 'ui-button-tooltip': true, [props.classTooltip]: !!props.classTooltip }}>
			<span class="ui-button-tooltip__txt">{props.text}</span>
		</div>
	);
};
