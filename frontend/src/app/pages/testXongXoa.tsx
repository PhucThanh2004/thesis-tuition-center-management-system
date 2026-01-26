import { useState } from "react";
import { Checkbox } from "../components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";

export default function Test() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold">
            Xóa học viên
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn dữ liệu học viên.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* ✅ TEST CHECKBOX Ở ĐÂY */}
          <div className="flex items-center gap-2 py-3">
            <Checkbox
              id="confirm"
              checked={checked}
              onCheckedChange={(v) => setChecked(!!v)}
            />
            <label htmlFor="confirm" className="text-sm">
              Tôi hiểu và đồng ý xóa
            </label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction disabled={!checked}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
