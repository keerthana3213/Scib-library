import { FunctionalComponent, h } from '@stencil/core';

export const CDKIsmModalDetailIsmContentText: FunctionalComponent<{
	data: any;
	sendData(element: string): void;
}> = props => {
	return (
		<div class="cdk-ism-content-text">
			{props.data.map(item =>
				typeof item.content !== 'string' && item.content.length > 1 ? (
					<p class="cdk-ism-content__tooltip--content">
						<div class="cdk-ism-content__tooltip">
							<span class="cdk-ism-content-text__title">{item.title}</span>
							<scib-ui-info-tooltip title="Click to see more info" text={item.content.toString().replaceAll(',', ', ')}></scib-ui-info-tooltip>
						</div>
						<span>{item.content[0].toString()}, ...</span>
					</p>
				) : (
					<p>
						<span class="cdk-ism-content-text__title">{item.title}</span>
						{item.content ? (
							item.status ? (
								<a
									href="#"
									title={'Open ' + item.content + ' detail'}
									target="_blank"
									rel="noopener noreferrer"
									onClick={event => {
										event.preventDefault();
										props.sendData(item.content);
									}}
								>
									{item.content}
								</a>
							) : (
								<span>{item.content}</span>
							)
						) : (
							<span>-</span>
						)}
					</p>
				),
			)}
		</div>
	);
};
