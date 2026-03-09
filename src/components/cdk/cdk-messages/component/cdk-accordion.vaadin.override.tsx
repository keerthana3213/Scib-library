import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

export class VaadinAccordionAppTheme {
	constructor() {
		registerStyles(
			'vaadin-accordion-panel',
			css`
				[part='summary'] {
					background: #9bc3d3;
					color: white;
					font-weight: bold;
					font-size: 14px;
					line-height: 23px;
					border: 1px solid #8cb4c4;
					border-radius: 0;
					padding: 5px;
					user-select: none;
					justify-content: space-between;
				}
				[part='summary']:focus {
					background: #8cb4c4;
				}
				[part='summary']:hover {
					cursor: pointer;
					color: white !important;
				}
				[part='summary']:hover [part='toggle'] {
					color: white !important;
				}
				[part='toggle'] {
					order: 2;
					font-size: 14px;
					margin: 0;
					transform: rotate(90deg);
					color: white;
				}
				[part='toggle']::before {
					font-weight: normal;
				}
				:host([opened]) [part='toggle'] {
					transform: rotate(-90deg) !important;
				}
				@media only screen and (min-width: 1024px) {
					[part='summary'] {
						padding: 0 10px;
					}
				}
			`,
		);
	}
}
