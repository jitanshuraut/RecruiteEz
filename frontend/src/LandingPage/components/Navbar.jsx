import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/LandingPage/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LuCross } from "react-icons/lu";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const routeList = [
    {
      href: "#features",
      label: "Features",
    },
    {
      href: "#testimonials",
      label: "Testimonials",
    },
    {
      href: "#Service",
      label: "Services",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-bgCol">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container flex justify-between h-14 px-4 w-screen">
          <NavigationMenuItem className="flex font-bold">
            <a
              href="/"
              rel="noreferrer noopener"
              className="flex items-center text-xl font-bold ml-2"
            >
              <LuCross className="mx-2" />
              RecruiteEz
            </a>
          </NavigationMenuItem>

          {/* Mobile View */}
          <div className="flex md:hidden items-center">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu Icon</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">
                    RecruiteEz
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col items-center justify-center mt-4 gap-2">
                  {routeList.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      rel="noreferrer noopener"
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop View */}
          <nav className="hidden md:flex items-center gap-2">
            {routeList.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                rel="noreferrer noopener"
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {label}
              </a>
            ))}
          </nav>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
