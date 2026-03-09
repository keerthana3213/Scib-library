import { FunctionalComponent, h } from '@stencil/core';
import { IUIInputOption } from '../models/ui-input.model';

export const UIInputOption: FunctionalComponent<{
	option: IUIInputOption;
}> = (props) => {
	return (
		<div class="c-option">
			{props.option.avatar && (
				<scib-ui-avatar class="c-option-avatar" images={[props.option.avatar]} is-employee={props.option.isEmployee}></scib-ui-avatar>
			)}
			<div class="c-option-text-wrapper">
				<p class="c-option-text --main">
					{props.option.name && <span class="--primary">{props.option.name}</span>}
					{props.option.secondary && (
						<span class="c-option-text --secondary" title={props.option.secondary}>
							{props.option.secondary}
						</span>
					)}
				</p>
			</div>
		</div>
	);
};
