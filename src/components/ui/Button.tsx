import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  // Yellow is reserved for the single main call to action per view.
  primary: "ui-btn ui-btn-primary",
  secondary: "ui-btn ui-btn-secondary",
  ghost: "ui-btn ui-btn-ghost",
};

type CommonProps = {
  variant?: Variant;
  /** Lucide icon rendered after the label (decorative). */
  icon?: LucideIcon;
  /** Lucide icon rendered before the label (decorative). */
  leadingIcon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
};

type LinkProps = CommonProps & {
  href: string;
  /** Open in a new tab with safe rel attributes. */
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type ButtonProps = CommonProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

// Tactile button: lifts on hover, presses 2px down on click (spring easing,
// see .ui-btn in globals.css). Renders a Next <Link>, external <a>, or <button>.
export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", icon: Icon, leadingIcon: Lead, className, children } = props;
  const cls = cn(VARIANTS[variant], "group", className);
  const content = (
    <>
      {Lead ? <Lead className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden /> : null}
      {children}
      {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden /> : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, variant: _v, icon: _i, leadingIcon: _l, className: _c, children: _ch, ...rest } =
      props as LinkProps;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={cls} {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {content}
      </Link>
    );
  }

  const { variant: _v, icon: _i, leadingIcon: _l, className: _c, children: _ch, type = "button", ...rest } =
    props as ButtonProps;
  return (
    <button type={type} className={cls} {...rest}>
      {content}
    </button>
  );
}
