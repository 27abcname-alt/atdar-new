import { signup } from '../auth/actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-[calc(100-80px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-slate-200 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Ro&apos;yxatdan o&apos;tish</CardTitle>
          <CardDescription>
            Platformamizga a&apos;zo bo&apos;ling
          </CardDescription>
        </CardHeader>
        <form action={signup}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="full_name">To&apos;liq ism</Label>
              <Input id="full_name" name="full_name" placeholder="Ali Valiyev" required className="rounded-xl border-slate-200 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Telefon raqami</Label>
              <Input id="phone_number" name="phone_number" placeholder="+998 90 123 45 67" required className="rounded-xl border-slate-200 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Elektron pochta</Label>
              <Input id="email" name="email" type="email" placeholder="example@mail.com" required className="rounded-xl border-slate-200 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input id="password" name="password" type="password" required className="rounded-xl border-slate-200 h-12" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20">
              Ro&apos;yxatdan o&apos;tish
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Hisobingiz bormi?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Kirish
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
