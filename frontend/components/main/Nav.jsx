import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
export default  function MainNavbar({info}) {

    return (
        <nav className={`navbar navbar-expand-lg  ${styles['bg-navbar']}`}>
            <div className="container">

                <Link href="/" className="navbar-brand">
                        <Image 
                            src={info.logo}
                            className="d-inline-block align-text-top"
                            width={30}
                            height={24}
                            alt={info.name}
                        />
                </Link>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/" legacyBehavior>
                                <a className="nav-link active" aria-current="page">Home</a>
                            </Link>
                        </li>
                    </ul>
                    <hr />
                    <ul className="nav d-flex justify-content-center d-lg-none">
                        <Link href="/login" legacyBehavior>
                            <button className="btn fw-bold mx-2">Login</button>
                        </Link>
                        <Link href="/register" legacyBehavior>
                            <button className={`btn mx-2 fw-bold my-btn-secondary `}>Register</button>
                        </Link>
                    </ul>
                </div>

                <div className="ml-auto d-none d-lg-flex">
                    <ul className="nav">
                        <Link href="/login" legacyBehavior>
                            <button className="btn fw-bold mx-2">Login</button>
                        </Link>
                        <Link href="/register" legacyBehavior>
                            <button className={`btn mx-2 fw-bold my-btn-secondary`}>Register</button>
                        </Link>
                    </ul>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
            </div>
        </nav>
    )
}