
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
} from "flowbite-react";

export default function MainNavbar() {
  return (
    <Navbar container>
      <NavbarBrand href="/">
        <img src="/assets/site/logo.jpeg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
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
