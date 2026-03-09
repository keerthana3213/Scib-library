import { FunctionalComponent, h } from '@stencil/core';

export const CDKIsmModalDetailIsmContentResume: FunctionalComponent<{
	/** Ejemplo de prop declarada */
	data: any;
	size: number;
	sendData(element: string): void;
}> = props => {
	return (
		<div class="cdk-ism-content-resume">
			<article>
				<span class="cdk-ism-content-resume__items--title">{props.data.subtitle}</span>
				<div class="cdk-ism-content-resume__items--description">
					<pre>{props.data.description}</pre>
				</div>
			</article>

			{props.data.content.map(item => (
				<div class="cdk-ism-content-resume__items">
					<span class="cdk-ism-content-resume__items--title">{item.title}</span>
					<div class="cdk-ism-content-resume__item">
						{item.content.map(elem =>
							typeof elem.content !== 'string' && elem.content.length > 1 ? (
								props.size < 767 ? (
									<p>
										<span class="cdk-ism-content-resume__title">{elem.title}</span>
										<span>{elem.content.toString().replaceAll(',', ', ')}</span>
									</p>
								) : (
									<p>
										<div>
											<span class="cdk-ism-content-resume__title">{elem.title}</span>
											<scib-ui-info-tooltip title="Click to see more info" text={elem.content.toString().replaceAll(',', ', ')}></scib-ui-info-tooltip>
										</div>
										<span>{elem.content[0].toString()}, ...</span>
									</p>
								)
							) : (
								<p>
									<span class="cdk-ism-content-resume__title">{elem.title}</span>
									{elem.content ? (
										elem.status ? (
											<a
												href="#"
												title={'Open ' + elem.content + ' detail'}
												target="_blank"
												rel="noopener noreferrer"
												onClick={event => {
													event.preventDefault();
													props.sendData(elem.content);
												}}
											>
												{elem.content}
											</a>
										) : (
											<span>{elem.content}</span>
										)
									) : (
										<span>-</span>
									)}
								</p>
							),
						)}
					</div>
				</div>
			))}
		</div>
	);
};
