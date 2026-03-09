import { FunctionalComponent, h } from '@stencil/core';

export const CDKIsmModalDetailIsmContentFiles: FunctionalComponent<{
	data: any;
}> = props => {
	return (
		<div class="cdk-ism-content-files">
			<p>
				<span class="cdk-ism-content-files__title">{props.data.title} </span>
				<span>{props.data.content} </span>
			</p>
			<scib-cdk-messages-attached-bar files={props.data.files} downloadable></scib-cdk-messages-attached-bar>
		</div>
	);
};
