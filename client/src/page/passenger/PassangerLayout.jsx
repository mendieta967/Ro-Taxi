import { Outlet, NavLink } from "react-router-dom";

function PassengerLayout() {
  return (
    <div>
      <nav>
        <NavLink to="home"></NavLink>
        <NavLink to="perfil"></NavLink>
        <NavLink to="configuracion"></NavLink>
        <NavLink to="mis-viajes"></NavLink>
        <NavLink to="pagos"></NavLink>
      </nav>
      <main>
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
    </div>
  );
}

export default PassengerLayout;
