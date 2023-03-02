import "@/index.css"
import { AppProps } from "next/app"
import Router from "next/router"
import NProgress from "nprogress"

export default ({ Component, pageProps }: AppProps) => (
	<Component {...pageProps} />
)

Router.events.on("routeChangeStart", () => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())
