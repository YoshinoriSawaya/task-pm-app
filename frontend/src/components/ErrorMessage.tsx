interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps): React.JSX.Element {
  return <p role="alert">{message}</p>
}
