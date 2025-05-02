import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-300",
  {
    variants: {
      variant: {
        default: "bg-emerald-400 text-white hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-500",

        neutral: "bg-gray-200 text-slate-900 border border-transparent hover:border-emerald-400 dark:bg-gray-700 dark:text-white hover:scale-[1.02] active:scale-[0.98]",

        outline: "border border-gray-300 bg-white text-slate-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-[#1d2228] dark:text-white dark:hover:bg-gray-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-10 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={`${buttonVariants({ variant, size })} ${className || ""}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
