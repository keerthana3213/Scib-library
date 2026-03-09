import { FunctionalComponent, h } from '@stencil/core';

export const CDKSidebarCommunicationsProfileBar: FunctionalComponent<{
	name: string;
	avatarSrc?: string;
	avatarAlt?: string;
	hasEmptyData: boolean;
	isMobile?: boolean;
	onClose?: (event: MouseEvent) => void;
}> = props => {
	return (
		<div class={{ 'c-profile': true, 'c-profile--empty': !props.hasEmptyData }}>
			<figure
				class="c-profile-avatar"
				style={{
					'background-image': props.avatarSrc
						? `url(${props.avatarSrc}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 350 350' class='sc-scib-ui-avatar' style=' height: 100%25; width: 100%25; fill: %23b5b5b5;%0A'%3E%3Cg class='sc-scib-ui-avatar'%3E%3Cpath d='M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587 C104.535,132.855,136.084,171.173,175,171.173z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761 s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131 c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496 c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`
						: null,
				}}
			>
				{!props.avatarSrc && (
					<span class="c-profile-avatar-fallback">
						{props?.name?.slice(0, 1).toUpperCase()}
						{props?.name?.split(' ')[1]?.slice(0, 1)?.toUpperCase()}
					</span>
				)}
				<figcaption>{props?.avatarAlt}</figcaption>
			</figure>
			<p class="c-profile-name">{props?.name}</p>
			<button class={{ 'c-profile-close': true, 'c-profile-mobile': props?.isMobile }} onClick={props?.onClose} aria-label="close">
				<i class={{ 'u-icon icon-close': true }}></i>
			</button>
		</div>
	);
};
