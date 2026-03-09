import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

export class VaadinDialogTheme {
	constructor() {
		registerStyles(
			'vaadin-dialog-overlay',
			css`
				[part='backdrop'] {
					background: rgba(0, 0, 0, 0.32);
				}
				[part='overlay'] {
					top: 0 !important;
					position: relative;
					display: block;
					width: calc(100% - 80px);
					height: calc(100% - 100px);
					overflow: auto;
					padding: 50px 40px;
					box-shadow: none !important;
					background: transparent !important;
					box-sizing: content-box;
					background: transparent;
				}
				.resizer-container {
					height: auto;
					width: fit-content;
					overflow: visible;
					max-width: 840px;
					min-width: 300px;
					margin: 75px auto 20px;
					background: transparent;
				}
				:host(.c-scib-ui-dialog--full-width) .resizer-container {
					max-width: none;
					width: 100%;
				}
				[part='content'] {
					padding: 24px;
					background: white;
					box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
					border-radius: var(--lumo-border-radius-m);
				}
				[part='overlay'] {
					background: transparent;
					box-shadow: none;
				}
				@media only screen and (max-width: 767px) {
					[part='overlay'] {
						width: calc(100% - 40px);
						height: calc(100% - 48px);
					}
				}
				@media only screen and (max-width: 1023px) {
					.resizer-container {
						max-width: 100%;
					}
				}
				@media only screen and (max-width: 334px) {
					[part='overlay'] {
						padding-left: 20px;
					}
				}
			`,
		);
	}
}
