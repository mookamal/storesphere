import Logo from "../../../components/main/Logo";

export default function Signup() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <section className="col-md-4 col-10 border-0 card p-4">
        <div className="login-card__header">
          <h1 className="login-card__logo">
            <Logo />
          </h1>
        </div>
        <div className="login-card__content">
          <h2 className="login-card__title h4">Sign Up</h2>
          
        </div>
      </section>
    </div>
  );
}
