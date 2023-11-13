import { Outlet } from "@remix-run/react";
import BusinessForm from "./businessForm";

export default function Index() {
  return (
    <div>
      <BusinessForm />
      <Outlet />
    </div>
  );
}
