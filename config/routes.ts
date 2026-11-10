export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export const routesConfig: { mainNav: NavItem[]; footerNav: NavItem[] } = {
  mainNav: [
    { title: "Work", href: "/projects" },
    { title: "Experience", href: "/experience" },
    { title: "Stack", href: "/skills" },
    { title: "Writing", href: "/blogs" },
    { title: "Contact", href: "/contact" },
  ],
  footerNav: [
    { title: "Work", href: "/projects" },
    { title: "Experience", href: "/experience" },
    { title: "Stack", href: "/skills" },
    { title: "Writing", href: "/blogs" },
    { title: "Open source", href: "/contributions" },
    { title: "Contact", href: "/contact" },
  ],
};
