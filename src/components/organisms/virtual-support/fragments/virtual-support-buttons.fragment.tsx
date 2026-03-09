import { FunctionalComponent, h } from '@stencil/core';
interface ButtonProps {
	buttons: any;
	handleButtonClicked: any;
}

export const OrganismsVirtualSupportButtons: FunctionalComponent<ButtonProps> = ({ buttons, handleButtonClicked }) => {
	return (
		<div class="virtual-support-buttons">
			{buttons.map((button) => (
				<scib-atoms-button
					class="virtual-support-buttons__btns"
					text={button?.text}
					key={button?.id}
					size="s"
					variant="basic"
					type="button"
					level="primary"
					onClick={() => handleButtonClicked(button?.actionType)}
				></scib-atoms-button>
			))}
		</div>
	);
};
