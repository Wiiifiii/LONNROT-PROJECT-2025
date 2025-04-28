// Summary: Renders a navigation link using Next.js Link component with custom styling.

import Link from "next/link";

const NavLink = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="block py-2 pl-3 pr-4 text-gray-200 sm:text-xl rounded md:p-0 hover:text-white hover:text-red-400"
    >
      {title}
    </Link>
  );
};

export default NavLink;