import { FunctionalComponent, h } from '@stencil/core';

export const CDKMsgNewBody: FunctionalComponent<{
	onDiscard?: (event: CustomEvent) => void;
	contentEditableRef?: (el: HTMLElement) => void;
}> = props => {
	return (
		<div class="c-body">
			<div contentEditable class="c-body-editable" ref={props.contentEditableRef}></div>
			<div class="c-body-footer">
				<scib-ui-button secondary onEventClick={props.onDiscard}>
					{' '}
					Discard{' '}
				</scib-ui-button>
				<scib-ui-button primary type="submit">
					{' '}
					Send{' '}
				</scib-ui-button>
			</div>
		</div>
	);
};
