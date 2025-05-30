import { Outlet, NavLink } from "react-router-dom";

function PassengerLayout() {
  return (
    <div>
      <nav>
        <NavLink to="/app/home"></NavLink>
        <NavLink to="/app/perfil"></NavLink>
        <NavLink to="/app/configuracion"></NavLink>
        <NavLink to="/app/mis-viajes"></NavLink>
        <NavLink to="/app/pagos"></NavLink>
      </nav>
      <main>
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
    </div>
  );
}

export default PassengerLayout;
