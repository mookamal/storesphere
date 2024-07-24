import siteInfo from "../../../data/site.json";
import Link from 'next/link';
export default function Hero() {
  return (
    <div className="d-flex bg-color-white  justify-content-center align-items-center vh-100">
      <div className="p-5">
        <div className="container text-center">
          <h1 className="display-4 font-weight-bold text-dark">
            {siteInfo.name}
          </h1>
          <p className="mt-4 lead text-muted">
            {siteInfo.description}
          </p>
          <Link href="/register" className="btn btn-primary">Start free trial</Link>
        </div>
      </div>
    </div>
  );
}
