import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";
import { RootLayout } from "../layouts/root";
import { HomePage } from "../pages/home";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </>
  )
)