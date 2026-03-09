import { FunctionalComponent, h } from '@stencil/core';
import { IUISelectOption } from '../models/ui-select.model';

export const UISelectOption: FunctionalComponent<{
	option: IUISelectOption;
	optionDetail?: boolean;
}> = (props) => {
	return (
		<div class="c-option">
			{props.option.avatar && <scib-ui-avatar class="c-option-avatar" images={[props.option.avatar]} is-employee={props.option.isEmployee} />}
			<div id="ui-select-option-text" class="c-option-text">
				{props.optionDetail ? (
					<span class="c-option-text --detail">
						{props.option.name}
						<span class="c-option-detail">{props.option.secondary}</span>
					</span>
				) : (
					<div class={{ 'c-option-text --main': true, 'c-option-text__extra-info': props.option.secondary ? true : false }}>
						<span style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: 'block', width: '13.5rem' }}>{props.option.name}</span>
						<p style={{ display: 'block' }}>
							{props.option.secondary && (
								<span
									style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: 'block', width: '13.5rem' }}
									class="c-option-text --secondary"
								>
									{props.option.secondary}
								</span>
							)}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
