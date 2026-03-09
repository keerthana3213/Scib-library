import { FunctionalComponent, h } from '@stencil/core';

export const CDKMessagesConversationsItemSkeleton: FunctionalComponent<{
	literalSkeleton: string;
}> = props => {
	return (
		<svg width="321px" height="80px" viewBox="0 0 321 80" version="1.1">
			<title>{props.literalSkeleton}</title>
			<g id="Desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="Skeletone_Desktop" transform="translate(-86.000000, -209.000000)">
					<g id="Group-11" transform="translate(88.000000, 211.000000)">
						<g id="message">
							<rect id="Rectangle" fill="#DCDCDC" x="17" y="77" width="302" height="1"></rect>
							<rect id="Rectangle" fill="#C3DEE7" x="48" y="0" width="168" height="20" rx="10"></rect>
							<rect id="Rectangle-Copy-13" fill="#DEEDF2" x="48" y="28" width="214" height="16" rx="8"></rect>
							<rect id="Rectangle-Copy-14" fill="#DEEDF2" x="48" y="48" width="271" height="12" rx="6"></rect>
							<rect id="Rectangle-Copy-6" fill="#C3DEE7" x="275" y="4" width="44" height="12" rx="6"></rect>
							<g id="profilepicturev2">
								<circle fill="#C3DEE7" stroke="#C3DEE7" stroke-width="2" cx="16" cy="16" r="17"></circle>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
	);
};
