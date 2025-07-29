// app/components/ui/dialog.tsx
'use client';

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "~/utils/shadcn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    customOverlayStyle?: React.CSSProperties;
    customOverlayClick?: (e: React.MouseEvent) => void;
  }
>(({ className, customOverlayStyle, customOverlayClick, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    onClick={e => customOverlayClick?.(e)}
    style={customOverlayStyle}
    className={cn(
      "fixed inset-0 z-[1200] bg-black bg-opacity-60 " +
        "data-[state=open]:animate-in data-[state=closed]:animate-out " +
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    removeCloseIcon?: boolean;
    isBottomSheet?: boolean;
    isRightAnchoredDrawer?: boolean;
    customOverlayStyle?: React.CSSProperties;
    customOverlayClick?: (e: React.MouseEvent) => void;
  }
>(
  (
    {
      className,
      children,
      removeCloseIcon = false,
      isBottomSheet = false,
      isRightAnchoredDrawer = false,
      customOverlayStyle,
      customOverlayClick,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay
        customOverlayStyle={customOverlayStyle}
        customOverlayClick={customOverlayClick}
      />
      {/* empty title slot in case consumer wants to inject */}
      <DialogPrimitive.Title className="sr-only" />
      <DialogPrimitive.Content
        ref={ref}
        style={{ height: "fit-content", border: "none" }}
        className={cn(
          "fixed w-fit z-[1200] bg-background text-center duration-300 " +
            // replace `primaryFont.className` with your own font utility if needed:
            // `${jakartaFont} ` +
            (isRightAnchoredDrawer
              ? "bottom-0 data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full"
              : isBottomSheet
              ? "bottom-0 data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full"
              : "top-1/2 -translate-y-1/2 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95") +
            " sm:rounded-lg focus:outline-none",
          className
        )}
        onPointerDownOutside={e => {
          // prevent clicks on Toasts from dismissing:
          if (e.target instanceof Element && e.target.closest("[data-sonner-toast]")) {
            e.preventDefault();
          }
          props.onPointerDownOutside?.(e);
        }}
        {...props}
      >
        {children}
        {!removeCloseIcon && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = "DialogContent";

export const DialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", props.className)}
  />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      props.className
    )}
  />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
