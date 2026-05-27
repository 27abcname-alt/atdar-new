import { LoginPageClient } from './login-client'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return <LoginPageClient error={error} />
}
