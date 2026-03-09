import { SelectOptions } from '../models/ui-v2-select.model';
import { FunctionalComponent, h } from '@stencil/core';
import { get, size } from 'lodash';

export const UIV2SelectChildren: FunctionalComponent<{
	parentId: string;
	childrenNode: SelectOptions;
	listHandler: (event: Event, id: any) => void;
	clickHandler: (event: CustomEvent<any>) => void;
	autocompleteStatusMap: any;
	variant?: any;
	level?: number;
}> = ({ parentId, childrenNode, listHandler, clickHandler, autocompleteStatusMap, variant, level = 0 }) => {
	return (
		<ul class="mdc-list" style={{ 'padding-left': `${32 * (level + 1)}px` }}>
			{(childrenNode || []).map((option, index) => {
				const optionId = `${parentId}-${option.id}`;
				return (
					<li class="mdc-list-checkbox" key={option.value || index} onClick={(event) => listHandler(event, optionId)}>
						<span class="mdc-list-item__ripple"></span>
						<scib-ui-v2-checkbox
							{...{
								key: option.value,
								label: option?.label || option.value,
								uid: optionId,
								...(autocompleteStatusMap[optionId] ? { value: 'checked' } : {})
							}}
							onValueChange={(event) => clickHandler(event)}
						></scib-ui-v2-checkbox>
						{size(get(option, 'children')) > 0 && (
							<UIV2SelectChildren
								parentId={optionId}
								childrenNode={option.children}
								variant={variant}
								autocompleteStatusMap={autocompleteStatusMap}
								clickHandler={clickHandler}
								listHandler={listHandler}
								level={level + 1}
							/>
						)}
					</li>
				);
			})}
		</ul>
	);
};
