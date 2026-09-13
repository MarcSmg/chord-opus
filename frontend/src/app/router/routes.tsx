import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { ChordSearchPage } from "../../features/chord/pages/ChordSearchPage";
import { SavedChordsPage } from "../../features/chord/pages/SavedChordsPage";
import { AuthPage } from "../../features/auth/pages/AuthPage";
import { ProfilePage } from "../../features/user/pages/ProfilePage";
import { HomePage } from "../../features/chord/pages/HomePage";
// import { LandingPage } from "../../pages/landing/LandingPage";
import { AuthLayout } from "../layout/AuthLayout";
import { LandingLayout } from "../layout/LandingLayout";
import { GuestRoute } from "./GuestRoute";
import { RequireAuth } from "./RequireAuth";
import { ProgressionsPage } from "@/features/progressions/pages/ProgressionsPage";
import { RouteErrorPage } from "./RouteErrorPage";

export const router = createBrowserRouter([
    {
        errorElement: <RouteErrorPage />,
        children: [
            {
                element: <GuestRoute />,
                children: [
                    {
                        path: "/",
                        element: <LandingLayout/>,
                        children: [
                            { index: true, element: <AuthPage initialMode="login" />},
                        ]
                    },
                    {
                        element: <AuthLayout/>,
                        children: [
                            { path: "/login", element: <AuthPage initialMode="login" /> },
                            { path: "/signup", element: <AuthPage initialMode="signup" /> },
                        ]
                    },
                ]
            },
            {
                element: <RequireAuth />,
                children: [
                    {
                        element: <AppLayout />,
                        children: [
                            { path: "/home", element: <HomePage /> },
                            { path: "/search", element: <ChordSearchPage/>},
                            { path: "/saved-chords", element: <SavedChordsPage /> },
                            { path: "/progressions", element: <ProgressionsPage /> },
                            { path: "/profile", element: <ProfilePage /> }
                        ],
                    },
                ],
            },
        ],
    },
]);