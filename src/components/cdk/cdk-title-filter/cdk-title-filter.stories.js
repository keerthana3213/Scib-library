import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
    title: 'Design System/DEPRECATED/CDK/Title Filter',
    parameters: {
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#ffffff' },
                { name: 'dark', value: '#333333' }
            ]
        }
    },
    ...getStoryConfig('scib-cdk-title-filter')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
    <div style="display:flex;justify-content:center;">
        <scib-cdk-title-filter
            secondary='${parseBoolean(args.secondary)}'
            small='${parseBoolean(args.small)}'
            right='${parseBoolean(args.right)}'
            small-radios='${parseBoolean(args.smallRadios)}'
            show-total='${parseBoolean(args.showTotal)}'
            loading='${parseBoolean(args.loading)}'
            max-height-scroll='${parseBoolean(args.maxHeightScroll)}'
            separate-arrow='${parseBoolean(args.separateArrow)}'
            max-height-elements='${args.maxHeightElements}'
            literals='${parseObject(args.literals)}'
            options-filter='${parseObject(args.optionsFilter)}'
            option-index-selected='${args.optionIndexSelected}'
            action-menu='${parseObject(args.actionMenu)}'
            show-search-engine='${parseBoolean(args.showSearchEngine)}'
            >
        </scib-cdk-title-filter>
    </div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
    optionIndexSelected: 0,
    secondary: false,
    small: false,
    right: false,
    smallRadios: false,
    showTotal: false,
    maxHeightScroll: false,
    maxHeightElements: 0,
    loading: false,
    separateArrow: false,
    showSearchEngine: false,
    literals: {
        subtitle: 'View',
        title: 'Opened topics',
        accessibleLoading: 'Loading...',
        textLabelSearchEngineInput: '',
    },
    optionsFilter: [
        {
            id: 'opened_vdr',
            label: 'Opened topics',
            value: 'opened_vdr',
        },
        {
            id: 'closed_vdr',
            label: 'Closed topics',
            value: 'closed_vdr',
        },
        {
            id: 'all_vdr',
            label: 'All topics',
            value: 'all_vdr',
        },
    ]
    // Add default values here
};

// Multi GLCS Header selector
export const MultiGLCS = Template.bind();
MultiGLCS.args = {
    optionIndexSelected: 2,
    optionIndexPrioritySelected: 2,
    secondary: true,
    small: true,
    right: true,
    smallRadios: true,
    showTotal: true,
    maxHeightScroll: true,
    maxHeightElements: 5,
    loading: false,
    separateArrow: false,
    showSearchEngine: true,
    literals: {
        subtitle: 'Client area',
        title: 'Opened topics',
        accessibleLoading: 'Loading...',
        priorityTag: 'Priority',
        totalItems: 'Total:',
        textLabelSearchEngineInput: 'Search...',
    },
    optionsFilter: [
        {
            id: '0',
            label: 'Repsol Trading, S.A.',
            value: '0',
            subLabel: '',
            isPredefined: false
        },
        {
            id: '1',
            label: 'Repsol Exploración, S.A.',
            value: '1',
            subLabel: '',
            isPredefined: false,
            dontShowIsPredefined: true
        },
        {
            id: '2',
            label: 'Repsol Brazil',
            value: '2',
            subLabel: '(Priority)',
            isPredefined: true
        },
        {
            id: '3',
            label: 'Repsol India',
            value: '3',
            subLabel: '',
            isPredefined: false
        },
        {
            id: '4',
            label: 'Repsol Madrid',
            value: '4',
            subLabel: '',
            isPredefined: false
        },
        {
            id: '5',
            label: 'Repsol Scroll',
            value: '5',
            subLabel: '',
            isPredefined: false
        },
        {
            id: '6',
            label: 'India',
            value: '6',
            subLabel: '',
            isPredefined: false
        },
    ],
    actionMenu: {
        hover: true,
        options: [{
            id: 0,
            text: "Set as priority entity",
            separator: false,
            eventId: "set_priority"
        }]
    }

    // Add default values here
};
MultiGLCS.parameters = {
    backgrounds: { default: 'dark' }
}
