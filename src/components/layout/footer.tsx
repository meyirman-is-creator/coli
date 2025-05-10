"use client";

import React from "react";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6">
      <div className="container-custom mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Shanyraq Logo" className="h-8 w-auto mr-2" />
            <span className="font-bold text-xl text-primary">Shanyraq</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Shanyraq, все права защищены.
          </p>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="https://t.me/shanyraq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Telegram</span>
            </Link>
            <Link 
              href="https://instagram.com/shanyraq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}