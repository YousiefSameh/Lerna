import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Home,
  BookOpen,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";

interface IUserDropdownProps {
  handleLogout: () => void;
  name: string;
  email: string;
  image: string;
}

export default function UserDropdown({ handleLogout, name, email, image }: IUserDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              {image ? (
                <AvatarImage src={image} alt={name[0]} />
              ) : (
                <AvatarFallback>
                  {name[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <div className="px-4 py-3">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {email}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2 w-full">
              <Home className="h-4 w-4" /> <span>Home</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/courses" className="flex items-center gap-2 w-full">
              <BookOpen className="h-4 w-4" /> <span>Courses</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center gap-2 w-full">
              <LayoutDashboard className="h-4 w-4" /> <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
