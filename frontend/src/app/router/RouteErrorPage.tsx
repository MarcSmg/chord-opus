import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { ErrorPage } from "@/shared/components/ErrorPage";

export const RouteErrorPage = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error) && error.status === 404) {
        return (
            <ErrorPage
                title="Page not found"
                description="The page you're looking for doesn't exist or may have been moved."
            />
        );
    }

    return <ErrorPage />;
};
