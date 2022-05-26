import Meta from "components/meta";
import SidebarOverlay from "./sidebar-overlay";
import Sidebar from "./sidebar";
import MobileHeader from "./mobile-header";
import router from "next/router";
import fetchJson from "lib/fetchJson";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  HomeIcon,
  DocumentSearchIcon,
  FireIcon,
  ChatAlt2Icon,
} from "@heroicons/react/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Incidents", href: "/incidents", icon: DocumentSearchIcon },
  { name: "Problem Management", href: "/problem", icon: FireIcon },
  { name: "Tickets", href: "#", icon: ChatAlt2Icon },
];

async function logout() {
  try {
    const response = await fetchJson("/api/logout");
    if (response.status === 200) {
      router.push("/auth");
    }
  } catch (error) {
    toast.error(`${error}`);
  }
}

export default function Layout({ children, session }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Meta />
      <div className="relative h-screen flex overflow-hidden bg-gray-100">
        {/* Set sidebar overlay when on mobile screen */}
        <SidebarOverlay
          navigation={navigation}
          router={router}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Static sidebar for desktop */}
        <Sidebar
          navigation={navigation}
          router={router}
          session={session}
          action={logout}
        />
        {/* Main column */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          {/* Mobile header */}
          <MobileHeader setSidebarOpen={setSidebarOpen} action={logout} />
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
