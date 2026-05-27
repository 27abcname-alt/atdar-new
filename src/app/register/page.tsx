import { RegisterPageClient } from "./register-client";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return <RegisterPageClient error={error} />;
}
