import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";
import { RootLayout } from "../layouts/root";
import { HomePage, HostRoomPage } from "../pages/home";
import { InitPage } from "../pages/Auth/Init";
import { SearchRoomsPage } from "../pages/home/search-room";
import { RoomPage } from "../pages/room";
import { RoomLayout } from "../layouts/room";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="auth">
        <Route index element={<InitPage />} />
      </Route>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search-room" element={<SearchRoomsPage />} />
        <Route path="room" element={<RoomLayout />}>
          <Route index element={<RoomPage />} />
        </Route>
        <Route path="host-room" element={<HostRoomPage />} />
        <Route path="*" element={<>404 Not Fouded</>} />
      </Route>
    </>
  )
)