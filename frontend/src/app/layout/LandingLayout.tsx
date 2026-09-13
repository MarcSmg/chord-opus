import { Outlet } from "react-router-dom"

// Unlike AppLayout, this scrolls the window itself — once there's real
// content here, wrap it in <ReactLenis root> from "lenis/react" (root mode
// needs no wrapper/content refs, since it drives window scroll directly).
export const LandingLayout = () => {
  return (
    <main>
        <Outlet/>
    </main>
  )
}
