import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, ElementType, ComponentPropsWithoutRef, InputHTMLAttributes, RefObject, ComponentType, SVGProps, MouseEvent, ReactElement, Key, HTMLAttributes, CSSProperties } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'danger';
type ButtonSize = 48 | 40 | 32 | 24;
type ButtonIconSize = 16 | 24;

declare const AtlButton: react.ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    disableMotion?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    iconSize?: ButtonIconSize;
    loading?: boolean;
    size?: ButtonSize;
    variant?: ButtonVariant;
} & react.RefAttributes<HTMLButtonElement>>;

type CardProps<T extends ElementType> = {
    as?: T;
    className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;
declare function AtlCard<T extends ElementType = 'div'>({ as, className, ...props }: CardProps<T>): react_jsx_runtime.JSX.Element;

type DropdownItem<T = string> = {
    description?: string;
    disabled?: boolean;
    icon?: ReactNode;
    label: string;
    value: T;
};
type AtlDropdownProps<T = string> = {
    className?: string;
    emptyState?: ReactNode;
    footerText?: string;
    headerSlot?: ReactNode;
    highlightedIndex?: number;
    id?: string;
    items: DropdownItem<T>[];
    maxHeight?: number;
    multiSelect?: boolean;
    onSelect?: (value: T) => void;
    onSelectAll?: () => void;
    optionIdPrefix?: string;
    selectAllText?: string;
    selectedValues?: T[];
    showFooter?: boolean;
    testId: string;
};

declare const AtlDropdown: <T>({ className, emptyState, footerText, headerSlot, highlightedIndex, id, items, maxHeight, multiSelect, onSelect, onSelectAll, optionIdPrefix, selectAllText, selectedValues, showFooter, testId, }: AtlDropdownProps<T>) => JSX.Element;

type FileUploadStatus = 'default' | 'error' | 'success';
type AtlFileUploadProps = {
    accept?: string;
    className?: string;
    disabled?: boolean;
    helperText?: string;
    label: string;
    multiple?: boolean;
    onChange?: (files: File[]) => void;
    status?: FileUploadStatus;
    testId?: string;
};

declare const AtlFileUpload: ({ accept, className, disabled, helperText, label, multiple, onChange, status, testId }: AtlFileUploadProps) => JSX.Element;

type AtlInputSize = 'xl' | 'l' | 'm' | 's' | 'xs';
type AtlInputStatus = 'default' | 'error' | 'success';
type AtlInputVariant = 'text' | 'number';
type AtlInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> & {
    className?: string;
    description?: string;
    helperText?: string;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    iconRightRotated?: boolean;
    iconRightTooltip?: ReactNode;
    iconRightTooltipOpen?: boolean;
    label?: string;
    maxLength?: number;
    onChange?: (value: string) => void;
    onIconRightClick?: () => void;
    readOnlyStyled?: boolean;
    rootRef?: RefObject<HTMLLabelElement | null>;
    showCharacterCount?: boolean;
    size?: AtlInputSize;
    status?: AtlInputStatus;
    testId?: string;
    value?: string;
    variant?: AtlInputVariant;
};

declare const AtlInput: react.MemoExoticComponent<react.ForwardRefExoticComponent<Omit<react.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> & {
    className?: string;
    description?: string;
    helperText?: string;
    iconLeft?: react.ReactNode;
    iconRight?: react.ReactNode;
    iconRightRotated?: boolean;
    iconRightTooltip?: react.ReactNode;
    iconRightTooltipOpen?: boolean;
    label?: string;
    maxLength?: number;
    onChange?: (value: string) => void;
    onIconRightClick?: () => void;
    readOnlyStyled?: boolean;
    rootRef?: react.RefObject<HTMLLabelElement | null>;
    showCharacterCount?: boolean;
    size?: AtlInputSize;
    status?: AtlInputStatus;
    testId?: string;
    value?: string;
    variant?: AtlInputVariant;
} & react.RefAttributes<HTMLInputElement>>>;

type ProgressProps = {
    label: string;
    value: number;
};
declare function AtlProgress({ label, value }: ProgressProps): react_jsx_runtime.JSX.Element;

type ComboboxOption<T = string> = {
    description?: string;
    disabled?: boolean;
    icon?: ReactNode;
    label: string;
    value: T;
};

type SelectOption<T = string> = ComboboxOption<T>;
type SelectBaseProps = Pick<AtlInputProps, 'className' | 'disabled' | 'helperText' | 'label' | 'placeholder' | 'size' | 'status'>;
type SelectCommonProps<T> = SelectBaseProps & {
    filterFn?: (option: SelectOption<T>, searchValue: string) => boolean;
    flip?: boolean;
    footerText?: string;
    maxDropdownHeight?: number;
    multiSelect?: boolean;
    noResultsText?: string;
    onSelectAll?: () => void;
    options: SelectOption<T>[];
    searchPlaceholder?: string;
    searchable?: boolean;
    selectAllText?: string;
    showFooter?: boolean;
    testId: string;
};
type SelectSingleProps<T> = {
    multiSelect?: false;
    onChange?: (value: T) => void;
    value?: T;
};
type SelectMultiProps<T> = {
    multiSelect: true;
    onChange?: (values: T[]) => void;
    value?: T[];
};
type AtlSelectProps<T = string> = SelectCommonProps<T> & (SelectSingleProps<T> | SelectMultiProps<T>);

declare const AtlSelect: <T>({ className, disabled, filterFn, flip, footerText, helperText, label, maxDropdownHeight, multiSelect, noResultsText, onChange, onSelectAll, options, placeholder, searchPlaceholder, searchable, selectAllText, showFooter, size, status, testId, value, }: AtlSelectProps<T>) => JSX.Element;

type ToastVariant = 'info' | 'success' | 'error';
type ToastOptions = {
    variant?: ToastVariant;
    duration?: number;
};
type ToastItem = {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
};
type ToastContextValue = {
    enqueueToast: (message: string, options?: ToastOptions) => string;
    closeToast: (id: string) => void;
};

type ToastProviderProps = {
    children: React.ReactNode;
};
declare const AtlToastProvider: ({ children }: ToastProviderProps) => react_jsx_runtime.JSX.Element;
declare const useAtlToast: () => ToastContextValue;

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type BorderRadiusValue = `${number}%` | `${number}px` | number;
type AvatarSize = 24 | 32 | 40 | 48 | 64 | number;
type AtlAvatarProps = {
    backgroundColor?: string;
    border?: {
        color: string;
        width: number;
    };
    borderRadius?: BorderRadiusValue;
    className?: string;
    icon?: SvgIconComponent;
    iconColor?: string;
    iconScale?: number;
    iconSize?: number | string;
    image?: string;
    imageAlt?: string;
    imagePadding?: string;
    initials: string;
    objectFit?: 'cover' | 'contain';
    onImageError?: () => void;
    size?: AvatarSize;
    textColor?: string;
};

declare const AtlAvatar: (props: AtlAvatarProps) => JSX.Element;

type BreadcrumbItem = {
    label: string;
    onClick?: () => void;
    testId: string;
};
type AtlBreadcrumbsProps = {
    className?: string;
    items: BreadcrumbItem[];
};

declare const AtlBreadcrumbs: ({ className, items }: AtlBreadcrumbsProps) => JSX.Element;

type ControlSize = 's' | 'm' | 'l';
type AtlCheckboxProps = {
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    invalid?: boolean;
    label?: string;
    loading?: boolean;
    onChange?: (checked: boolean) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    size?: ControlSize;
    testId?: string;
};

declare const AtlCheckbox: ({ checked, className, disabled, indeterminate, invalid, label, loading, onChange, onClick, size, testId }: AtlCheckboxProps) => JSX.Element;

type ChipSize = 'M' | 'S';
type ChipVariant = 'default' | 'frozen' | 'danger';
type CustomChipColors = {
    background: string;
    text: string;
};
type AtlChipProps = {
    customColors?: CustomChipColors;
    disabled?: boolean;
    label: string;
    onRemove?: () => void;
    size?: ChipSize;
    testId: string;
    variant?: ChipVariant;
    withCross?: boolean;
};

declare const AtlChip: ({ customColors, disabled, label, onRemove, size, testId, variant, withCross }: AtlChipProps) => JSX.Element;

type AtlPopupProps = {
    anchorRef: RefObject<HTMLElement | null>;
    children: ReactNode;
    className?: string;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    flip?: boolean;
    gap?: number;
    inputRootRef?: RefObject<HTMLElement | null>;
    isOpen: boolean;
    onClose: () => void;
    testId?: string;
};

declare const AtlPopup: ({ anchorRef, children, className, closeOnEscape, closeOnOutsideClick, flip, gap, inputRootRef, isOpen, onClose, testId }: AtlPopupProps) => JSX.Element | null;

type AtlRadioButtonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
    invalid?: boolean;
    label?: string;
    size?: ControlSize;
    testId?: string;
};

declare const AtlRadioButton: ({ checked, disabled, invalid, label, size, testId, ...props }: AtlRadioButtonProps) => JSX.Element;

type SidebarItem = {
    icon: ReactElement;
    key: string;
    label: string;
};
type AtlSidebarProps = {
    collapsed?: boolean;
    footer?: ReactNode;
    footerItems?: SidebarItem[];
    items: SidebarItem[];
    loading?: boolean;
    onItemClick?: (key: string) => void;
    selectedKey?: string;
    testId: string;
};

declare const AtlSidebar: ({ collapsed, footer, footerItems, items, loading, onItemClick, selectedKey, testId }: AtlSidebarProps) => JSX.Element;

type AtlSwitcherProps = {
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
    onChange?: (checked: boolean) => void;
    size?: Extract<ControlSize, 'm' | 'l'>;
    testId?: string;
};

declare const AtlSwitcher: ({ checked, className, disabled, invalid, onChange, size, testId }: AtlSwitcherProps) => JSX.Element;

type SimpleTableColumn<RecordType> = {
    align?: 'left' | 'center' | 'right';
    className?: string;
    dataIndex?: string | number;
    key?: Key;
    render?: (value: unknown, record: RecordType, index: number) => ReactNode;
    title?: ReactNode | ((properties: Record<string, unknown>) => ReactNode);
    width?: string | number;
};
type SimpleTablePaginationConfig = {
    current?: number;
    onChange?: (page: number, pageSize: number) => void;
    pageSize?: number;
    total?: number;
};
type SimpleTableLocale = {
    emptyText?: ReactNode;
};
type AtlSimpleTableProps<RecordType extends object = object> = {
    ariaLabel?: string;
    className?: string;
    columns?: SimpleTableColumn<RecordType>[];
    dataSource?: RecordType[] | null;
    locale?: SimpleTableLocale;
    onRow?: (record: RecordType, index?: number) => HTMLAttributes<HTMLTableRowElement>;
    pagination?: SimpleTablePaginationConfig | false;
    rowClassName?: string | ((record: RecordType, index: number) => string);
    rowKey?: string | ((record: RecordType) => string);
    style?: CSSProperties;
};

declare const AtlSimpleTable: <RecordType extends object>({ ariaLabel, className, columns, dataSource, locale, onRow, pagination, rowClassName, rowKey, style }: AtlSimpleTableProps<RecordType>) => JSX.Element;

type TabsSize = 40 | 32;
type TabItem = {
    children?: ReactNode;
    disabled?: boolean;
    key: string;
    label: ReactNode;
};
type AtlTabsProps = {
    activeKey: string;
    className?: string;
    contentClassName?: string;
    items: TabItem[];
    onChange: (key: string) => void;
    size?: TabsSize;
    testId: string;
};

declare const AtlTabs: ({ activeKey, className, contentClassName, items, onChange, size, testId }: AtlTabsProps) => JSX.Element;

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
type AtlTooltipProps = {
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    open?: boolean;
    placement?: TooltipPlacement;
    testId?: string;
    title: ReactNode;
    trigger?: 'hover' | 'click';
};

declare const AtlTooltip: ({ children, className, defaultOpen, onOpenChange, open, placement, testId, title, trigger }: AtlTooltipProps) => JSX.Element;

type ModalContentSize = 520 | 620 | 760 | 848;
type AtlModalProps = HTMLAttributes<HTMLDivElement> & {
    cancelText?: string;
    children: ReactNode;
    confirmText?: string;
    confirmVariant?: ButtonVariant;
    footer?: ReactNode;
    header?: ReactNode;
    isCloseHidden?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    isOpen: boolean;
    onCancel?: () => void;
    onClose: () => void;
    onConfirm?: () => void;
    size?: ModalContentSize;
    testId: string;
    title?: ReactNode;
};

declare const AtlModal: ({ cancelText, children, className, confirmText, confirmVariant, footer, header, isCloseHidden, isDisabled, isLoading, isOpen, onCancel, onClose, onConfirm, size, testId, title, ...props }: AtlModalProps) => JSX.Element | null;

type AutocompleteOption<T = string> = ComboboxOption<T>;
type AutocompleteBaseProps = Pick<AtlInputProps, 'className' | 'disabled' | 'helperText' | 'label' | 'placeholder' | 'size' | 'status'>;
type AtlAutocompleteProps<T = string> = AutocompleteBaseProps & {
    filterFn?: (option: AutocompleteOption<T>, searchValue: string) => boolean;
    flip?: boolean;
    inputPattern?: RegExp;
    maxDropdownHeight?: number;
    noResultsIcon?: React.ReactNode;
    noResultsText?: string;
    onChange: (value: T) => void;
    options: AutocompleteOption<T>[];
    searchPlaceholder?: string;
    showDescription?: boolean;
    testId: string;
    value?: T;
};

declare const AtlAutocomplete: <T>({ className, disabled, filterFn, flip, helperText, inputPattern, label, maxDropdownHeight, noResultsIcon, noResultsText, onChange, options, placeholder, searchPlaceholder, showDescription, size, status, testId, value, }: AtlAutocompleteProps<T>) => JSX.Element;

export { AtlAutocomplete, type AtlAutocompleteProps, AtlAvatar, type AtlAvatarProps, AtlBreadcrumbs, type AtlBreadcrumbsProps, AtlButton, AtlCard, AtlCheckbox, type AtlCheckboxProps, AtlChip, type AtlChipProps, AtlDropdown, type AtlDropdownProps, AtlFileUpload, type AtlFileUploadProps, AtlInput, type AtlInputProps, type AtlInputSize, type AtlInputStatus, type AtlInputVariant, AtlModal, type AtlModalProps, AtlPopup, type AtlPopupProps, AtlProgress, AtlRadioButton, type AtlRadioButtonProps, AtlSelect, AtlSidebar, type AtlSidebarProps, AtlSimpleTable, type AtlSimpleTableProps, AtlSwitcher, type AtlSwitcherProps, AtlTabs, type AtlTabsProps, AtlToastProvider, AtlTooltip, type AtlTooltipProps, type AutocompleteOption, type AvatarSize, type BorderRadiusValue, type BreadcrumbItem, type ButtonVariant, type ChipSize, type ChipVariant, type ControlSize, type CustomChipColors, type DropdownItem, type FileUploadStatus, type ModalContentSize, type SelectOption, type SidebarItem, type SimpleTableColumn, type SimpleTableLocale, type SimpleTablePaginationConfig, type SvgIconComponent, type TabItem, type TabsSize, type ToastContextValue, type ToastItem, type ToastOptions, type ToastVariant, type TooltipPlacement, useAtlToast };
