import Logo from "./Logo";
import siteInfo from "../../data/site.json";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-light">
      <section className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 text-center">
          <div className="col md-3"> <Logo /></div>
          <div className="col mb-3">
            <h5>{siteInfo.name}</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link href="/" className="nav-link p-0 text-body-secondary">Home</Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/about" className="nav-link p-0 text-body-secondary">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
}
