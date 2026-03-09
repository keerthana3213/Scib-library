import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/File History',
	...getStoryConfig('scib-ui-file-history')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
`);

const TemplateList = (args) => render(args, `
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
`);

const TemplateDataLabel = (args) => render(args, `
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
	<scib-ui-file-history
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-ui-file-history>
`); 

// Default Story
export const Develop = Template.bind();
export const DevelopList = TemplateList.bind();
export const DevelopDataLabel = TemplateDataLabel.bind();
Develop.args = {
	literals: {
		title: "Recent version:",
		buttonLabelList: ["Edit", "Download"]
	},
	data: {
		fileName: "Confidantiality_Letter.pdf",
		fileExtension: "pdf",
		attributeList: ["12/07/2020", "1.4 MB", "Descripción random"],
		buttonList: [
			{
				eventName: "download",
				iconName: "icon-download"
			}
		]
	}
};

DevelopList.args = {
	literals: {
		buttonLabelList: ["Edit", "Download"]
	},
	data: {
		fileName: "Template name",
		highlightedName: true,
		fileExtension: "",
		attributeList: ["Template description"],
		buttonList: [
			{
				eventName: "delete",
				iconName: "icon-delete",
				hideTxt: true,
				separator: true,
				disabled:true
			},
			{
				eventName: "edit-pencil",
				iconName: "icon-edit-pencil",
				hideTxt: true
			},
			{
				eventName: "open-eye",
				iconName: "icon-open-eye",
				hideTxt: true
			}
		]
	}
};

DevelopDataLabel.args = {
	literals: {
		buttonLabelList: ["Download"]
	},
	data: {
		buttonList: [{
				eventName: "download",
				iconName: "icon-download",
				hideTxt: false,
				separator: true,
				disabled: false
			},],
		dataLabelList: [
			{
				title: "Product",
				description: "Cash Management"
			},
			{
				title: "Group",
				description: "Ungrouped"
			},
			{
				title: "Group",
				description: "Ungrouped"
			},
			{
				title: "Group",
				description: "Ungrouped"
			},
			{
				title: "Group",
				description: "Ungrouped"
			},
			{
				title: "Group",
				description: "Ungrouped"
			},
			{
				title: "Group",
				description: "Ungrouped"
			}
		]
	}
};

