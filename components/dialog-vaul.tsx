import * as React from 'react';

import { useMediaQuery } from 'react-responsive';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@radix-ui/react-dialog';
interface DialogVaulProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
}
function DialogVaul({
  open,
  onOpenChange,
  children,
  title,
  description,
  ...props
}: DialogVaulProps) {
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const cls = 'flex-1 flex flex-col';

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        <DialogContent className="sm:max-w-[425px] h-[650px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="text-xl">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className={cls}>{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...props}>
      <DrawerContent className="h-full flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl">{title}</DrawerTitle>
          <DrawerDescription className="text-xl">hey</DrawerDescription>
        </DrawerHeader>
        <div className={cls}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}

export default DialogVaul;
