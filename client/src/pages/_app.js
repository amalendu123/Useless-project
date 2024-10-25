import Navigation from "@/components/Navigation";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Navigation />
    </>
  );
}
