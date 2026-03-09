import { CDKVdrEdit } from '../component/cdk-vdr-edit';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('cdk-vdr-edit', () => {
	const literalsMock = {
		mainTitle: '<h2>Edit Virtual Data Room</h2>',
		labelInput: 'Name*',
		placeholderInput: 'Enter name',
		labelMultiSelect: 'Add owners*',
		placeholderMultiSelect: 'Choose owners',
		textAreaLabel: 'Description*',
		textAreaId: 'vdr-desc',
		textAreaName: 'textarea_desc',
		placeholderTextarea: 'Enter description...',
		notice: '*Required input',
		labelMultiSelectMembers: 'Add members*',
		membersId: 'members-id',
		placeholderMultiSelectMembers: 'Choose members',
		ownersList: 'Owners:',
		btnCancel: 'Cancel',
		btnSave: 'Save',
		ownersLabel: 'Owners:',
		membersLabel: 'Current members:',
		newMembersLabel: 'New members:',
		labelCheckboxNewItems: 'Add...',
		addUserLabel: 'Add new user',
	};

	describe('render', () => {
		it('builds', () => {
			expect(new CDKVdrEdit()).toBeTruthy();
		});

		it('should not have list members section if there are not members in vdr', async () => {
			const page = await newSpecPage({
				components: [CDKVdrEdit],
				template: () => (
					<scib-ui-dialog open is-emitter absolute>
						<scib-cdk-vdr-edit literals={literalsMock}></scib-cdk-vdr-edit>
					</scib-ui-dialog>
				),
				supportsShadowDom: true,
			});
			const componentHTML: string = page.root.innerHTML;
			expect(componentHTML.includes('<scib-ui-list label="Members:">')).toBe(false);
		});

		it('should have list members section if there are members in vdr', async () => {
			const mockMembersList = [
				{
					id: '1234',
					email: 'jcardenas@santander.es',
					name: 'Jesús Cárdenas Vizcaíno',
					avatar: {
						src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
						alt: 'Jesús Cárdenas Vizcaíno',
					},
				},
				{
					id: '1235',
					email: 'jmartinez@santander.es',
					name: 'Jeremías Martínez',
					avatar: {
						src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
						alt: 'Jesús Cárdenas Vizcaíno',
					},
				},
			];
			const page = await newSpecPage({
				components: [CDKVdrEdit],
				template: () => (
					<scib-ui-dialog open is-emitter absolute>
						<scib-cdk-vdr-edit literals={literalsMock} selectedMembers={JSON.stringify(mockMembersList)}></scib-cdk-vdr-edit>
					</scib-ui-dialog>
				),
				supportsShadowDom: true,
			});
			const componentHTML: string = page.root.innerHTML;
			expect(componentHTML.includes('<scib-ui-list label="Current members:">')).toBe(true);
		});
	});
});
