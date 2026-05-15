import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, ElementType, ComponentPropsWithoutRef, ComponentType, SVGProps, RefObject, ReactElement, Key, HTMLAttributes, CSSProperties, JSX as JSX$1 } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { A as AtlInputSize, a as AtlInputStatus, b as AtlInputVariant, c as AtlSelectProps, d as AtlCheckboxProps, e as AtlRadioButtonProps, f as AtlSwitcherProps, g as AtlAutocompleteProps } from './types-lO5EwfVY.js';
export { h as AtlInputProps, i as AutocompleteOption, C as ControlSize, S as SelectOption } from './types-lO5EwfVY.js';

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

type AtlProgressStatus = 'default' | 'running' | 'completed' | 'failed' | 'aborted';
type AtlProgressSize = 'sm' | 'md';
type AtlProgressProps = {
    ariaLabel?: string;
    className?: string;
    indeterminate?: boolean;
    label?: ReactNode;
    max?: number;
    showValue?: boolean;
    size?: AtlProgressSize;
    status?: AtlProgressStatus;
    testId?: string;
    value?: number | null;
};

declare const AtlProgress: ({ ariaLabel, className, indeterminate, label, max, showValue, size, status, testId, value, }: AtlProgressProps) => JSX.Element;

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

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement> & {
    size?: number;
}>;
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

declare const AtlRadioButton: ({ checked, disabled, invalid, label, size, testId, ...props }: AtlRadioButtonProps) => JSX.Element;

type SidebarItem = {
    icon: ReactElement;
    key: string;
    label: string;
};
type AtlSidebarProps = {
    className?: string;
    collapsed?: boolean;
    footer?: ReactNode;
    footerItems?: SidebarItem[];
    header?: ReactNode;
    items: SidebarItem[];
    loading?: boolean;
    onItemClick?: (key: string) => void;
    selectedKey?: string;
    testId: string;
};

declare const AtlSidebar: ({ className, collapsed, footer, footerItems, header, items, loading, onItemClick, selectedKey, testId, }: AtlSidebarProps) => JSX.Element;

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

declare const AtlAutocomplete: <T>({ className, disabled, filterFn, flip, helperText, inputPattern, label, maxDropdownHeight, noResultsIcon, noResultsText, onChange, options, placeholder, searchPlaceholder, showDescription, size, status, testId, value, }: AtlAutocompleteProps<T>) => JSX.Element;

type AtlSkeletonShapeVariant = 'line' | 'rect' | 'circle';
type AtlSkeletonVariant = 'overlay' | AtlSkeletonShapeVariant;
type AtlSkeletonProps = {
    borderRadius?: CSSProperties['borderRadius'];
    children?: ReactNode;
    className?: string;
    height?: CSSProperties['height'];
    loading?: boolean;
    size?: CSSProperties['width'];
    testId?: string;
    variant?: AtlSkeletonVariant;
    width?: CSSProperties['width'];
};
type AtlSkeletonRepeatProps = {
    children: ReactNode;
    className?: string;
    count: number;
    gap?: CSSProperties['gap'];
    testId?: string;
};

declare const AtlSkeletonRepeat: ({ children, className, count, gap, testId, }: AtlSkeletonRepeatProps) => JSX$1.Element;

type AtlSkeletonComponentType = ((props: AtlSkeletonProps) => ReactNode) & {
    Repeat: typeof AtlSkeletonRepeat;
};
declare const AtlSkeleton: AtlSkeletonComponentType;

export { AtlAutocomplete, AtlAutocompleteProps, AtlAvatar, type AtlAvatarProps, AtlBreadcrumbs, type AtlBreadcrumbsProps, AtlButton, AtlCard, AtlCheckbox, AtlCheckboxProps, AtlChip, type AtlChipProps, AtlDropdown, type AtlDropdownProps, AtlFileUpload, type AtlFileUploadProps, AtlInput, AtlInputSize, AtlInputStatus, AtlInputVariant, AtlModal, type AtlModalProps, AtlPopup, type AtlPopupProps, AtlProgress, type AtlProgressProps, type AtlProgressSize, type AtlProgressStatus, AtlRadioButton, AtlRadioButtonProps, AtlSelect, AtlSidebar, type AtlSidebarProps, AtlSimpleTable, type AtlSimpleTableProps, AtlSkeleton, type AtlSkeletonProps, type AtlSkeletonRepeatProps, type AtlSkeletonShapeVariant, type AtlSkeletonVariant, AtlSwitcher, AtlSwitcherProps, AtlTabs, type AtlTabsProps, AtlToastProvider, AtlTooltip, type AtlTooltipProps, type AvatarSize, type BorderRadiusValue, type BreadcrumbItem, type ButtonVariant, type ChipSize, type ChipVariant, type CustomChipColors, type DropdownItem, type FileUploadStatus, type ModalContentSize, type SidebarItem, type SimpleTableColumn, type SimpleTableLocale, type SimpleTablePaginationConfig, type SvgIconComponent, type TabItem, type TabsSize, type ToastContextValue, type ToastItem, type ToastOptions, type ToastVariant, type TooltipPlacement, useAtlToast };
