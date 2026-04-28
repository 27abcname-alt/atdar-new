import { login } from '../auth/actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-[calc(100-80px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-slate-200 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Xush kelibsiz</CardTitle>
          <CardDescription>
            Tizimga kirish uchun elektron pochtangizni kiriting
          </CardDescription>
        </CardHeader>
        <form action={login}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Elektron pochta</Label>
              <Input id="email" name="email" type="email" placeholder="example@mail.com" required className="rounded-xl border-slate-200 h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Parol</Label>
              </div>
              <Input id="password" name="password" type="password" required className="rounded-xl border-slate-200 h-12" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20">
              Kirish
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Hisobingiz yo&apos;qmi?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
