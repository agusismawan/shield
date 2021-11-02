import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "nprogress/nprogress.css";
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    const handleStart = (url) => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
