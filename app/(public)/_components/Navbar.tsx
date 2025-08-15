"use client";

import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { authClient } from "@/lib/auth-client";
import UserDropdown from "./UserDropdown";
import Link from "next/link";
import { useSignOut } from "@/hooks/use-signout";

export function Navbar() {
  const handleLogout = useSignOut();
  const { data: session } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Lerna"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-foreground">Lerna</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>

          {/* CTA Buttons / User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {session?.user ? (
              <UserDropdown
                handleLogout={handleLogout}
                name={session.user.name}
                email={session.user.email}
                image={session.user.image || ""}
              />
            ) : (
              <>
                <Link href='/login' className={buttonVariants({
                  variant: 'default'
                })}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                About
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>

              <div className="flex items-center pt-4 pb-2 space-x-2">
                <ThemeToggle />

                {session?.user ? (
                  <UserDropdown
                    handleLogout={handleLogout}
                    name={session.user.name}
                    email={session.user.email}
                    image={session.user.image || ""}
                  />
                ) : (
                  <>
                    <Link
                      href='/login'
                      className={buttonVariants({
                        variant: "default",
                        className: "w-full justify-start",
                      })}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
