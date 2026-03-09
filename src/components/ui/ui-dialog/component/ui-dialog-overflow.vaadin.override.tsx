import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

export class VaadinDialogOverflowTheme {
	constructor() {
		registerStyles(
			'vaadin-dialog-overlay',
			css`
				[part='overlay'] {
					border: 0;
					border-radius: 8px;
					position: absolute;
					top: 0;
					bottom: 0;
					margin: auto;
					width: 100%;
					height: fit-content;
					max-height: inherit;
				}
				.resizer-container {
					overflow: visible;
				}
				[part='content'] {
					padding: 20px 16px;
				}
				@media only screen and (min-width: 768px) {
					[part='overlay'] {
						width: inherit;
						max-width: 821px;
					}
					[part='content'] {
						padding: 0 24px;
					}
				}
			`,
		);
	}
}
