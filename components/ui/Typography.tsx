import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

/* =========================================================
   TYPOGRAPHY SYSTEM — CORPORATE / E-COMMERCE READY (COMPACT)
   ========================================================= */

const H1 = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1
    className={cn(
      [
        "scroll-m-20",
        "text-3xl lg:text-4xl",
        "font-extrabold",
        "tracking-[-0.02em]",
        "leading-tight",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const H2 = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn(
      [
        "scroll-m-20",
        "text-2xl lg:text-3xl",
        "font-bold",
        "tracking-[-0.015em]",
        "leading-tight",
        "text-foreground",
        "border-b",
        "border-border",
        "pb-2",
        "first:mt-0",
      ],
      className
    )}
    {...props}
  />
)

const H3 = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className={cn(
      [
        "scroll-m-20",
        "text-xl lg:text-2xl",
        "font-semibold",
        "tracking-[-0.01em]",
        "leading-snug",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const H4 = ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className={cn(
      [
        "scroll-m-20",
        "text-lg",
        "font-semibold",
        "leading-snug",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const P = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      [
        "text-[15px]",
        "leading-6",
        "tracking-normal",
        "text-foreground/90",
        "[&:not(:first-child)]:mt-4",
      ],
      className
    )}
    {...props}
  />
)

const Lead = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      [
        "text-base lg:text-lg",
        "leading-7",
        "font-normal",
        "text-foreground/80",
      ],
      className
    )}
    {...props}
  />
)

const Muted = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      [
        "text-xs",
        "leading-5",
        "text-muted-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Small = ({ className, ...props }: ComponentPropsWithoutRef<"small">) => (
  <small
    className={cn(
      [
        "text-xs",
        "font-medium",
        "leading-none",
        "text-muted-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Blockquote = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"blockquote">) => (
  <blockquote
    className={cn(
      [
        "mt-4",
        "border-l-4",
        "border-border",
        "pl-4",
        "italic",
        "leading-6",
        "text-foreground/80",
      ],
      className
    )}
    {...props}
  />
)

const Ul = ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className={cn(
      [
        "my-4",
        "ml-5",
        "list-disc",
        "space-y-1.5",
        "text-[15px]",
        "text-foreground/90",
      ],
      className
    )}
    {...props}
  />
)

const Ol = ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className={cn(
      [
        "my-4",
        "ml-5",
        "list-decimal",
        "space-y-1.5",
        "text-[15px]",
        "text-foreground/90",
      ],
      className
    )}
    {...props}
  />
)

const Li = ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
  <li
    className={cn(
      [
        "leading-6",
      ],
      className
    )}
    {...props}
  />
)

const InlineCode = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"code">) => (
  <code
    className={cn(
      [
        "relative",
        "rounded-md",
        "bg-secondary/60",
        "px-1.5",
        "py-0.5",
        "font-mono",
        "text-[0.85em]",
        "font-medium",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Pre = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className={cn(
      [
        "mt-4",
        "mb-4",
        "overflow-x-auto",
        "rounded-xl",
        "border",
        "border-border",
        "bg-secondary/20",
        "p-4",
        "text-xs",
        "leading-5",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Hr = ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
  <hr
    className={cn(
      [
        "my-6",
        "border-0",
        "border-t",
        "border-border",
      ],
      className
    )}
    {...props}
  />
)

const Table = ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="my-4 w-full overflow-x-auto rounded-xl border border-border">
    <table
      className={cn(
        [
          "w-full",
          "border-collapse",
          "text-xs",
          "text-foreground",
        ],
        className
      )}
      {...props}
    />
  </div>
)

const Tr = ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr
    className={cn(
      [
        "border-b",
        "border-border",
        "transition-colors",
        "even:bg-secondary/20",
      ],
      className
    )}
    {...props}
  />
)

const Th = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      [
        "px-4",
        "py-2.5",
        "text-left",
        "text-xs",
        "font-semibold",
        "tracking-wide",
        "text-foreground",
        "bg-secondary/40",
      ],
      className
    )}
    {...props}
  />
)

const Td = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      [
        "px-4",
        "py-2.5",
        "align-middle",
        "text-foreground/85",
      ],
      className
    )}
    {...props}
  />
)

export {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Muted,
  Small,
  Blockquote,
  Ul,
  Ol,
  Li,
  InlineCode,
  Pre,
  Hr,
  Table,
  Tr,
  Th,
  Td,
}