import { FunctionalComponent, h } from '@stencil/core';
import { generateRandomId } from '../../../../utils/public_api';

export const CDKMsgReplySkeleton: FunctionalComponent<{
	sender: boolean;
}> = (props) => {
	return Math.round(generateRandomId()) === 0 ? (
		props.sender ? (
			<svg width="796" height="211">
				<g id="Reply-Sender-Fat" transform="translate(796, 0) scale(-1, 1)">
					<rect id="Mask" fill="#DEEDF2" x="0" y="0" width="796" height="211" rx="8"></rect>
					<rect id="Rectangle" fill="#C3DEE7" x="56" y="18" width="204" height="20" rx="10"></rect>
					<circle id="Mask" fill="#C3DEE7" cx="32" cy="28" r="16"></circle>
					<rect id="Rectangle-Copy-8" fill="#C3DEE7" x="16" y="67" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-10" fill="#C3DEE7" x="16" y="123" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-11" fill="#C3DEE7" x="16" y="147" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-11" fill="#C3DEE7" x="16" y="147" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-12" fill="#C3DEE7" x="16" y="179" width="284" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-9" fill="#C3DEE7" x="16" y="91" width="577" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-7" fill="#C3DEE7" x="576" y="18" width="204" height="12" rx="6"></rect>
				</g>
			</svg>
		) : (
			<svg width="796" height="211">
				<g id="Reply-Fat">
					<rect id="Mask" fill="#DEEDF2" x="0" y="0" width="796" height="211" rx="8"></rect>
					<rect id="Rectangle" fill="#C3DEE7" x="56" y="18" width="204" height="20" rx="10"></rect>
					<circle id="Mask" fill="#C3DEE7" cx="32" cy="28" r="16"></circle>
					<rect id="Rectangle-Copy-8" fill="#C3DEE7" x="16" y="67" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-10" fill="#C3DEE7" x="16" y="123" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-11" fill="#C3DEE7" x="16" y="147" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-11" fill="#C3DEE7" x="16" y="147" width="764" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-12" fill="#C3DEE7" x="16" y="179" width="284" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-9" fill="#C3DEE7" x="16" y="91" width="577" height="16" rx="8"></rect>
					<rect id="Rectangle-Copy-7" fill="#C3DEE7" x="576" y="18" width="204" height="12" rx="6"></rect>
				</g>
			</svg>
		)
	) : props.sender ? (
		<svg width="796" height="123">
			<g id="Reply-Sender-Slim" transform="translate(796, 0) scale(-1, 1)">
				<rect id="Mask" fill="#DEEDF2" x="0" y="0" width="796" height="123" rx="8"></rect>
				<rect id="Rectangle" fill="#C3DEE7" x="56" y="18" width="204" height="20" rx="10"></rect>
				<circle id="Mask" fill="#C3DEE7" cx="32" cy="28" r="16"></circle>
				<rect id="Rectangle-Copy-8" fill="#C3DEE7" x="16" y="67" width="764" height="16" rx="8"></rect>
				<rect id="Rectangle-Copy-9" fill="#C3DEE7" x="203" y="91" width="577" height="16" rx="8"></rect>
				<rect id="Rectangle-Copy-7" fill="#C3DEE7" x="576" y="18" width="204" height="12" rx="6"></rect>
			</g>
		</svg>
	) : (
		<svg width="796" height="123">
			<g id="Reply-Slim">
				<rect id="Mask" fill="#DEEDF2" x="0" y="0" width="796" height="123" rx="8"></rect>
				<rect id="Rectangle" fill="#C3DEE7" x="56" y="18" width="204" height="20" rx="10"></rect>
				<circle id="Mask" fill="#C3DEE7" cx="32" cy="28" r="16"></circle>
				<rect id="Rectangle-Copy-8" fill="#C3DEE7" x="16" y="67" width="764" height="16" rx="8"></rect>
				<rect id="Rectangle-Copy-9" fill="#C3DEE7" x="16" y="91" width="577" height="16" rx="8"></rect>
				<rect id="Rectangle-Copy-7" fill="#C3DEE7" x="576" y="18" width="204" height="12" rx="6"></rect>
			</g>
		</svg>
	);
};
