import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  File,
  CircleUser,
  PlusCircle,
  ChevronRight,
  Home,
  LineChart,
  Menu,
  Package,
  DollarSign,
  CreditCard,
  ListFilter,
  Activity,
  Package2,
  Search,
  ShoppingCart,
  Users,
  MoreHorizontal,
  Eye,
  Star,
  CalendarCheck,
  CirclePlus,
  UserRoundCheck,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function SideNavbar({ index_, Role } = props) {
  const map_nav_Cad = [
    {
      link: "/candidate-dashboard",
      name: "Dashboard",
      index_: 0,
      icon: <Home className="h-4 w-4" />,
    },
    {
      link: "/search-jobs",
      name: "Search Jobs",
      index_: 1,
      icon: <Search className="h-4 w-4" />,
    },
    {
      link: "/jobs-applied",
      name: "Jobs Applied",
      index_: 2,
      icon: <Package className="h-4 w-4" />,
    },
    {
      link: "/scheduled-interviews",
      name: "Interview Scheduled",
      index_: 3,
      icon: <Users className="h-4 w-4" />,
    },

    {
      link: "/offered-jobs",
      name: "Offers",
      index_: 4,
      icon: <LineChart className="h-4 w-4" />,
    },
  ];
  const map_nav_REC = [
    {
      link: "/dashboard",
      name: "dashboard",
      index_: 0,
      icon: <Home className="h-4 w-4" />,
    },
    {
      link: "/create-job",
      name: "Create Job",
      index_: 1,
      icon: <CirclePlus className="h-4 w-4" />,
    },
    {
      link: "/edit-job-status",
      name: "Edit Job Status",
      index_: 2,
      icon: <Home className="h-4 w-4" />,
    },
    {
      link: "/interviews-all",
      name: "Interview Sceduled",
      index_: 3,
      icon: <Headset className="h-4 w-4" />,
    },

    {
      link: "/hired-all",
      name: "Hired Candidates",
      index_: 4,
      icon: <Users className="h-4 w-4" />,
    },

    {
      link: "/selected-all",
      name: "Selected Candidates",
      index_: 5,
      icon: <UserRoundCheck className="h-4 w-4" />,
    },
  ];
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 cursor-pointer">
            {Role == "candidate"
              ? map_nav_Cad.map((nav_) => {
                  if (nav_.index_ == index_) {
                    return (
                      <div
                      key={nav_.index_}
                        onClick={() => navigate(nav_.link)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all hover:text-primary"
                      >
                        {nav_.icon}
                        {nav_.name}
                      </div>
                    );
                  } else {
                    return (
                      <div
                       key={nav_.index_}
                        onClick={() => navigate(nav_.link)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      >
                        {nav_.icon}
                        {nav_.name}
                      </div>
                    );
                  }
                })
              : map_nav_REC.map((nav_) => {
                  if (nav_.index_ == index_) {
                    return (
                      <div
                        key={nav_.index_}
                        onClick={() => navigate(nav_.link)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all hover:text-primary"
                      >
                        {nav_.icon}
                        {nav_.name}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={nav_.index_}
                        onClick={() => navigate(nav_.link)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      >
                        {nav_.icon}
                        {nav_.name}
                      </div>
                    );
                  }
                })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default SideNavbar;
