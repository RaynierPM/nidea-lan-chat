import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";
import { RootLayout } from "../layouts/root";
import { HomePage } from "../pages/home";
import { InitPage } from "../pages/Init";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="auth" element={<InitPage />} />
        <Route path="search-room" element={<InitPage />} />
        <Route path="host-room" element={<InitPage />} />
        <Route path="*" element={<>404 Not Fouded</>} />
      </Route>
    </>
  )
)