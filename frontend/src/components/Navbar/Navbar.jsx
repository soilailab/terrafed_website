import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";

const navLinks = [
  { id: 1, path: "#about", name: "About" },
  { id: 2, path: "#features", name: "Features" },
  { id: 3, path: "#contact", name: "Contact" },
  { id: 4, path: "/development", name: "Development" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full py-5 px-[2%] lg:flex lg:justify-between lg:items-center z-[100] bg-black/70 backdrop-blur-md shadow-xl">
      <div className="flex justify-between items-center">
        <a href="/" className="text-2xl text-white font-bold tracking-wide">
          TerraFed
        </a>
        <button
          className="text-3xl text-white cursor-pointer lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Nav links */}
      <nav
        className={`${
          isOpen ? "max-h-64" : "max-h-0 overflow-hidden"
        } transition-all duration-500 lg:max-h-none lg:overflow-visible`}
      >
        <ul className="flex flex-col lg:flex-row lg:gap-6 mt-4 lg:mt-0">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.path}
                className="block text-white font-medium text-lg px-2 py-3 text-center hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a
        href="#"
        className="hidden lg:inline-block border-2 border-white rounded-xl text-lg font-bold text-white px-5 py-2 hover:bg-white hover:text-primary transition-colors duration-200"
      >
        Get Started
      </a>
    </header>
  );
};

export default Navbar;
