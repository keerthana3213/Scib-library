import { FunctionalComponent, h } from '@stencil/core';

export const MoleculesUploadFilesInputFile: FunctionalComponent<{
	idelement: string;
	acceptedTypeFiles: string;
	onSelectFile: Function;
	name: string;
	disabled: boolean;
}> = ({ idelement, acceptedTypeFiles, onSelectFile, name, disabled }) => {
	return (
		<input
			class="accessibility"
			type="file"
			id={idelement}
			multiple
			accept={acceptedTypeFiles}
			onClick={($event) => (($event.target as HTMLInputElement).value = null)}
			onChange={($event) => onSelectFile($event)}
			name={name}
			disabled={disabled}
		/>
	);
};
