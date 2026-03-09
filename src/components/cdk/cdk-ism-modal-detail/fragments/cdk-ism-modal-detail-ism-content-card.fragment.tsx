import { FunctionalComponent, h } from '@stencil/core';

export const CDKIsmModalDetailIsmContentCard: FunctionalComponent<{
	/** Ejemplo de prop declarada */
	data: any;
}> = props => {
	return (
		<div class="cdk-ism-content-card">
			{props.data.map(item => (
				<scib-cdk-ism-contracts-card literals={item}></scib-cdk-ism-contracts-card>
			))}
		</div>
	);
};
