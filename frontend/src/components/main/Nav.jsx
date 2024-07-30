import siteInfo from "../../data/site.json"
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  DarkThemeToggle,
} from "flowbite-react";

export default function MainNavbar() {
  return (
    <Navbar>
      <NavbarBrand href="/">
        <img src={siteInfo.logo} className="mr-3 h-6 sm:h-9" alt={siteInfo.name} />
      </NavbarBrand>
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#">About</NavbarLink>
        <NavbarLink href="#">Services</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarCollapse>
      <DarkThemeToggle />
    </Navbar>
  );
}
