import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// import { useStateContext } from '../contexts/ContextProvider';
import { CircleUser, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {

  const [isSheetOpen, setIsSheetOpen] = useState(false); // Add this state

  const handleLinkClick = () => {
    setIsSheetOpen(false); // Close the sheet when a link is clicked
  };

  return (
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8">
          <Link
            to="/"
            className="gap-2 font-black md: text-2xl italic"
          >
            GeoLynk
          </Link>
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/settings"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            System
          </Link>
          <Link
            to="/sensor"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Sensor
          </Link>
          <Link
            to="/lora"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Network
          </Link>
          <Link
            to="/files"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Files
          </Link>
        </nav>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              onClick={() => setIsSheetOpen(!isSheetOpen)} // Toggle the sheet
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[200px]">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription>
              </SheetDescription>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-black"
                onClick={handleLinkClick} // Add this line
                >
                GeoLynk
              </Link>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLinkClick} // Add this line
                >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLinkClick} // Add this line
                >
                System
              </Link>
              <Link
                to="/sensor"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLinkClick} // Add this line
                >
                Sensor
              </Link>
              <Link
                to="/lora"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLinkClick} // Add this line
              >
                Network
              </Link>
              <Link
                to="/files"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLinkClick} // Add this line
              >
                Files
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </header>
  )
}

export default Navbar