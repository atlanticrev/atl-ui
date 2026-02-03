import * as react from 'react';
import { ButtonHTMLAttributes, ElementType, ComponentPropsWithoutRef, InputHTMLAttributes, ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

type ButtonVariant = 'primary' | 'ghost';

declare const AtlButton: react.ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    disableMotion?: boolean;
} & react.RefAttributes<HTMLButtonElement>>;

type CardProps<T extends ElementType> = {
    as?: T;
    className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;
declare function AtlCard<T extends ElementType = 'div'>({ as, className, ...props }: CardProps<T>): react_jsx_runtime.JSX.Element;

type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
type DropdownMode = 'anchored' | 'modal' | 'auto';
type DropdownPosition = {
    top: number;
    left: number;
    minWidth: number;
    transformOrigin: string;
    placement: DropdownPlacement;
};

type DropdownProps = {
    anchorRef: React.RefObject<HTMLElement | null>;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    offset?: number;
    placement?: DropdownPlacement;
    mode?: DropdownMode;
    mobileBreakpoint?: number;
};
declare const AtlDropdown: ({ anchorRef, children, isOpen, onClose, className, offset, placement, mode, mobileBreakpoint, }: DropdownProps) => react.ReactPortal | null;

type FileUploadProps = {
    label: string;
    onFileSelected: (file: File | null) => void;
    accept?: string;
    hint?: string;
    className?: string;
};
declare function AtlFileUpload({ label, onFileSelected, accept, hint, className }: FileUploadProps): react_jsx_runtime.JSX.Element;

type AtlInputSize = 'xl' | 'l' | 'm' | 's' | 'xs';
type AtlInputStatus = 'default' | 'error' | 'success';
type AtlInputVariant = 'text' | 'number';
type AtlInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> & {
    testId?: string;
    value?: string;
    label?: string;
    helperText?: string;
    size?: AtlInputSize;
    status?: AtlInputStatus;
    variant?: AtlInputVariant;
    maxLength?: number;
    showCharacterCount?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    iconRightRotated?: boolean;
    onIconRightClick?: () => void;
    onChange?: (value: string) => void;
};

declare const AtlInput: react.MemoExoticComponent<react.ForwardRefExoticComponent<Omit<react.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> & {
    testId?: string;
    value?: string;
    label?: string;
    helperText?: string;
    size?: AtlInputSize;
    status?: AtlInputStatus;
    variant?: AtlInputVariant;
    maxLength?: number;
    showCharacterCount?: boolean;
    iconLeft?: react.ReactNode;
    iconRight?: react.ReactNode;
    iconRightRotated?: boolean;
    onIconRightClick?: () => void;
    onChange?: (value: string) => void;
} & react.RefAttributes<HTMLInputElement>>>;

type ProgressProps = {
    label: string;
    value: number;
};
declare function AtlProgress({ label, value }: ProgressProps): react_jsx_runtime.JSX.Element;

type SelectOption = {
    value: string;
    label: string;
};

type SelectProps = {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    helper?: string;
    className?: string;
    dropdownOffset?: number;
};
declare function AtlSelect({ label, value, options, onChange, helper, className, dropdownOffset }: SelectProps): react_jsx_runtime.JSX.Element;

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

export { AtlButton, AtlCard, AtlDropdown, AtlFileUpload, AtlInput, type AtlInputProps, type AtlInputSize, type AtlInputStatus, type AtlInputVariant, AtlProgress, AtlSelect, AtlToastProvider, type ButtonVariant, type DropdownMode, type DropdownPlacement, type DropdownPosition, type SelectOption, type ToastContextValue, type ToastItem, type ToastOptions, type ToastVariant, useAtlToast };
