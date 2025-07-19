import { useRouteError } from "react-router-dom";

export default function ErrorView() {
  const error = useRouteError() as { statusText?: string, message?: string }
  console.error(error)

  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100vh">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}