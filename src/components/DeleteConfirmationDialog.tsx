'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  lang?: 'en' | 'th';
  type?: 'single' | 'all';
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
  title,
  description,
  confirmText,
  cancelText,
  lang = 'th',
  type = 'single',
}: DeleteConfirmationDialogProps) {
  const defaultTitle =
    type === 'all'
      ? lang === 'th'
        ? 'ลบทั้งหมด'
        : 'Delete All'
      : lang === 'th'
        ? 'ลบรายการ'
        : 'Delete Item';

  const defaultDescription =
    type === 'all'
      ? lang === 'th'
        ? 'คุณแน่ใจหรือไม่ที่จะลบประวัติทั้งหมด? การกระทำนี้ไม่สามารถยกเลิกได้'
        : 'Are you sure you want to delete all history? This action cannot be undone.'
      : lang === 'th'
        ? 'คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การกระทำนี้ไม่สามารถยกเลิกได้'
        : 'Are you sure you want to delete this item? This action cannot be undone.';

  const defaultConfirmText = lang === 'th' ? 'ลบ' : 'Delete';
  const defaultCancelText = lang === 'th' ? 'ยกเลิก' : 'Cancel';

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="text-left">
              {title || defaultTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {cancelText || defaultCancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {lang === 'th' ? 'กำลังลบ...' : 'Deleting...'}
              </>
            ) : (
              confirmText || defaultConfirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

