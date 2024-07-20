'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useState } from 'react';

export default function MainNavbar({ info }) {
    const [userIsLogin, setUserIsLogin] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <nav className={`navbar navbar-expand-lg ${styles['bg-navbar']}`}>
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
                {/* Desktop */}
                <div className="ml-auto d-none d-lg-flex">
                    {!userIsLogin ? (
                        <ul className="nav">
                            <Link href="/login" legacyBehavior>
                                <button className="btn fw-bold mx-2">Login</button>
                            </Link>
                            <Link href="/register" legacyBehavior>
                                <button className="btn mx-2 fw-bold my-btn-secondary">Register</button>
                            </Link>
                        </ul>
                    ) : (
                        <Link href="/register" legacyBehavior>
                            <button className="btn mx-2 btn-dark">Logout</button>
                        </Link>
                    )}
                </div>
                {/* End Desktop */}

                {/* Mobile */}
                <button
                    type="button"
                    className="btn btn-light d-lg-none"
                    onClick={handleShowModal}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {showModal && (
                    <div className="modal fade show d-block" id="mobileNav"  aria-labelledby="mobileNavLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="mobileNavLabel">Menu</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                                </div>
                                <div className="modal-body">
                                    {!userIsLogin ? (
                                        <ul className="nav flex-column">
                                            <Link href="/login" legacyBehavior>
                                                <button className="btn fw-bold my-2 btn-light">Login</button>
                                            </Link>
                                            <Link href="/register" legacyBehavior>
                                                <button className="btn fw-bold my-2 my-btn-secondary">Register</button>
                                            </Link>
                                        </ul>
                                    ) : (
                                        <Link href="/register" legacyBehavior>
                                            <button className="btn btn-dark my-2">Logout</button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* End Mobile */}
            </div>
        </nav>
    );
}
