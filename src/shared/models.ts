export type VariantTypes = 'white' | 'blue' | 'red' | 'lightblue' | 'none';
export type LevelSelect = 'primary' | 'secondary' | 'tertiary';
export type BackgroundColorVariant = 'white' | 'blue';
export type StyleVariant = 'standard' | 'minimal';
export type SizeTypes = 'xs' | 's' | 'm' | 'smalltable' | 'mediumtable' | 'largetable';
export type ButtonSizeTypes = 's' | 'm';
export type CommonSizeTypes = 's' | 'm';
export type HelperLevel = 'primary' | 'secondary' | 'tertiary';
export type TabLevels = 'primary' | 'primary-white' | 'secondary' | 'secondary-black';
export type TextFieldTypes = 'text' | 'number' | 'password' | 'textarea' | 'email' | 'tel' | 'url' | 'time';
export type AutocompleteFieldTypes = 'text' | 'password' | 'email' | 'tel' | 'url';
export type RangeInputTypes = 'amount' | 'date';
export type VariantArrowTypes = 'left' | 'right';
export type ToasterVariant = 'normal' | 'actions';
export type UiKitLocaleCodes = 'en-GB' | 'en-US' | 'es-ES' | 'it-IT';
export type DirectionType = 'row' | 'column';
export type Types = 'success' | 'warning' | 'alert' | 'info' | 'primary' | 'promotion' | 'neutral';

export type Literals<T = string> = Record<string, T>;
