import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { AlignRight } from "lucide-react";
import Logo from "../Logo";

export default function NavbarSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <AlignRight />
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center justify-center">
        <SheetHeader>
          <SheetTitle>
            <Logo mainSize="text-4xl" size="text-xl" href="" />
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
