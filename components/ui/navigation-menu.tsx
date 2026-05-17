
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

function NavigationMenu({
    className,
    children,
    viewport = true,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean;
}) {
    return (
        <NavigationMenuPrimitive.Root
            data-slot="navigation-menu"
            data-viewport={viewport}
            className={cn(
                "group/navigation-menu relative z-10 flex max-w-full w-full items-center justify-between bg-surface-primary px-6 h-16",
                className
            )}
            {...props}
        >
            {children}
            {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
    );
}

function NavigationMenuList({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
    return (
        <NavigationMenuPrimitive.List
            data-slot="navigation-menu-list"
            className={cn(
                "group flex flex-1 list-none items-center justify-start gap-2 h-full",
                className
            )}
            {...props}
        />
    );
}

function NavigationMenuItem({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
    return (
        <NavigationMenuPrimitive.Item
            data-slot="navigation-menu-item"
            className={cn("relative flex items-center h-full", className)}
            {...props}
        />
    );
}

const navigationMenuTriggerStyle = cva(
    "group inline-flex h-10 w-max items-center justify-center bg-transparent px-4 text-md font-semibold capitalize text-fg-primary relative transition-colors duration-150 outline-none select-none hover:text-action-primary-hover focus:text-action-primary-hover disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-action-primary-hover after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-transparent data-[state=open]:after:bg-brand-charcoal hover:after:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-action-primary"
);

function NavigationMenuTrigger({
    className,
    children,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
    return (
        <NavigationMenuPrimitive.Trigger
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), className)}
            {...props}
        >
            {children}
        </NavigationMenuPrimitive.Trigger>
    );
}

function NavigationMenuContent({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
    return (
        <NavigationMenuPrimitive.Content
            data-slot="navigation-menu-content"
            className={cn(
                "left-0 top-0 w-full p-6 md:absolute md:w-auto min-w-[400px]",
                "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-10 data-[motion=from-start]:slide-in-from-left-10 data-[motion=to-end]:slide-out-to-right-10 data-[motion=to-start]:slide-out-to-left-10 duration-200",
                "group-data-[viewport=false]/navigation-menu:bg-surface-primary group-data-[viewport=false]/navigation-menu:text-fg-primary group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-border-default group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:shadow-lg **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
                className
            )}
            {...props}
        />
    );
}

function NavigationMenuViewport({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
    return (
        <div className={cn("absolute top-full left-0 isolate z-50 flex w-full justify-start mt-[1px]")}>
            <NavigationMenuPrimitive.Viewport
                data-slot="navigation-menu-viewport"
                className={cn(
                    "origin-top-left bg-surface-primary text-fg-primary border-x border-b border-border-default shadow-xl relative h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden md:w-[var(--radix-navigation-menu-viewport-width)] transition-[width,height] duration-200",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    className
                )}
                {...props}
            />
        </div>
    );
}

function NavigationMenuLink({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
    return (
        <NavigationMenuPrimitive.Link
            data-slot="navigation-menu-link"
            className={cn(
                "outline-none focus-visible:ring-2 focus-visible:ring-action-primary",
                className
            )}
            {...props}
        />
    );
}

function NavigationMenuIndicator({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
    return (
        <NavigationMenuPrimitive.Indicator
            data-slot="navigation-menu-indicator"
            className={cn(
                "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in bottom-0 z-[2] flex h-[2px] justify-center overflow-hidden transition-all duration-200",
                className
            )}
            {...props}
        >
            <div className="bg-brand-charcoal w-full h-full" />
        </NavigationMenuPrimitive.Indicator>
    );
}

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
};