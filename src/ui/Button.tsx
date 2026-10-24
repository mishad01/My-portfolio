import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { type ButtonSize, type ButtonVariant, type IconButtonVariant, type IconTint, button, cx, iconButton } from './classes';
import { Icon } from './Icon';

type Common = { variant?: ButtonVariant; size?: ButtonSize; icon?: string; trailingIcon?: string; children: ReactNode; className?: string };
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { href?: undefined };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string };

/** M3 common button; renders a link when given `href`. */
export function Button({ variant = 'filled', size = 'lg', icon, trailingIcon, children, className, ...rest }: AsButton | AsLink) {
  const cls = cx(button(variant, size, !!icon), trailingIcon && 'pr-6 pl-7', className);
  const inner = (
    <>
      {icon && <Icon name={icon} size={20} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={20} />}
    </>
  );
  if ('href' in rest && rest.href !== undefined) return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>{inner}</a>;
  return <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>{inner}</button>;
}

type IconCommon = { icon: string; label: string; variant?: IconButtonVariant; tint?: IconTint; className?: string };

/** M3 icon button; `label` is required for screen readers. */
export function IconButton({ icon, label, variant = 'standard', tint, className, ...rest }: IconCommon & (Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string })))  {
  const cls = cx(iconButton(variant, tint), className);
  if ('href' in rest && rest.href) return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} aria-label={label} title={label} className={cls}><Icon name={icon} /></a>;
  return <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} aria-label={label} title={label} className={cls}><Icon name={icon} /></button>;
}
