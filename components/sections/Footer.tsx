import { Facebook, Twitter, Instagram, Rss } from "lucide-react";
import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-[#fdfaf0] to-white py-6 mx-auto">
      <div className="container mx-auto">
        {/* Main Footer Links */}
        <div className="flex justify-between px-20 flex-wrap">
          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 text-sm">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Microblading
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Ombre Shading
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Lip Blush
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Eyeliner Tattoo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Touch-ups
                </a>
              </li>
            </ul>
          </div>

          {/* Aesthetician */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 text-sm">Training</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Professional
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Regular
                </a>
              </li>
            </ul>
          </div>

          {/* Branches */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 text-sm">Branches</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Lipa City
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Batangas City
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Sto Tomas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Lemery
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 text-sm">About</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Company
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Legal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <Logo mainSize="text-4xl" size="text-xl" href="/" />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            © 2025 Glow Aesthetics. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6">
          <a
            href="#"
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-primarytransition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-primary-600 transition-colors"
          >
            <Rss className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
