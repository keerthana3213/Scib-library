import { ECDKSidecommTabIds } from '../models/cdk-sidebar-communications.model';
import { FunctionalComponent, h } from '@stencil/core';

export const CDKSidebarCommunicationsTab: FunctionalComponent<{
	icon: ECDKSidecommTabIds | string;
	onClick?: (event: MouseEvent) => void;
	label?: string;
	active?: boolean;
	notifications?: number;
	day?: string;
}> = props => {
	return (
		<button
			onClick={props.onClick}
			class={{
				'c-tab': true,
				'--active': props.active,
			}}
			aria-label={props.label || props.icon}
		>
			<div class="c-tab-icon-container">
				{props.notifications && <span class="c-tab-nots">{props.notifications < 99 ? props.notifications : 99}</span>}
				{props.icon === ECDKSidecommTabIds.ALE && <span class="c-tab-day">{new Date().toISOString().slice(8, 10)}</span>}
				<i
					class={{
						'c-tab-icon u-icon': true,
						'icon-bulletines_diseable': props.icon === ECDKSidecommTabIds.BUL,
						'icon-messages_deseable': props.icon === ECDKSidecommTabIds.MSG && !props.active,
						'icon-messages_active': props.icon === ECDKSidecommTabIds.MSG && props.active,
						'icon-alerts': props.icon === ECDKSidecommTabIds.ALE,
						[props.icon]: true,
					}}
				></i>
			</div>
			{props.label && <span class="c-tab-label">{props.label}</span>}
		</button>
	);
};
