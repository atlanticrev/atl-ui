import * as react_jsx_runtime from 'react/jsx-runtime';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};
declare function Button({ variant, className, ...props }: ButtonProps): react_jsx_runtime.JSX.Element;

type ModalProps = PropsWithChildren<{
    open: boolean;
    onClose: () => void;
    title?: string;
}>;
declare function Modal({ open, onClose, title, children }: ModalProps): react_jsx_runtime.JSX.Element | null;

export { Button, type ButtonProps, type ButtonVariant, Modal, type ModalProps };
