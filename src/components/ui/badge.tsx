import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy text-white",
        primary: "border-transparent bg-primary text-white",
        teal: "border-transparent bg-teal text-white",
        mint: "border-transparent bg-mint-bg text-teal border border-mint/50",
        success: "border-transparent bg-mint-bg text-success border border-mint/50",
        outline: "border-grey bg-white text-navy",
        navy: "border-transparent bg-blue-tint text-primary",
        warning: "border-transparent bg-amber-50 text-amber-800 border border-amber-100",
        emergency: "border-transparent bg-emergency text-white",
        slate: "border-transparent bg-slate text-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
