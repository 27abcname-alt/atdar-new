'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, User, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { updateUserRole } from './auth/actions'

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = async () => {
    if (!selectedRole) return
    setIsLoading(true)
    try {
      await updateUserRole(selectedRole)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xl px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-[48px] border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="pt-12 pb-8 px-10 text-center space-y-4">
            <div className="mx-auto w-20 h-2 bg-primary/20 rounded-full mb-4" />
            <CardTitle className="text-4xl font-black tracking-tight text-slate-900">
              Siz kimsiz?
            </CardTitle>
            <CardDescription className="text-lg text-slate-500 font-medium">
              Platformadan foydalanish turini tanlang. <br />Buni keyinchalik sozlamalarda o&apos;zgartirishingiz mumkin.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-12 space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Seller Option */}
              <button
                onClick={() => setSelectedRole('seller')}
                className={`group relative flex flex-col items-center p-8 rounded-[40px] border-4 transition-all duration-300 ${
                  selectedRole === 'seller'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
                  selectedRole === 'seller' ? 'bg-primary text-white scale-110' : 'bg-white text-slate-400 group-hover:text-slate-600'
                }`}>
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className={`text-xl font-black transition-colors ${
                  selectedRole === 'seller' ? 'text-primary' : 'text-slate-900'
                }`}>
                  Sotuvchi
                </h3>
                <p className="mt-2 text-center text-sm font-medium text-slate-500 leading-relaxed">
                  Mahsulotlarimni sotmoqchiman va e&apos;lonlar bermoqchiman
                </p>
                {selectedRole === 'seller' && (
                  <motion.div 
                    layoutId="check"
                    className="absolute -top-3 -right-3 bg-primary text-white rounded-full p-1.5 shadow-lg ring-4 ring-white"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </motion.div>
                )}
              </button>

              {/* Buyer Option */}
              <button
                onClick={() => setSelectedRole('buyer')}
                className={`group relative flex flex-col items-center p-8 rounded-[40px] border-4 transition-all duration-300 ${
                  selectedRole === 'buyer'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
                  selectedRole === 'buyer' ? 'bg-primary text-white scale-110' : 'bg-white text-slate-400 group-hover:text-slate-600'
                }`}>
                  <User className="h-10 w-10" />
                </div>
                <h3 className={`text-xl font-black transition-colors ${
                  selectedRole === 'buyer' ? 'text-primary' : 'text-slate-900'
                }`}>
                  Xaridor
                </h3>
                <p className="mt-2 text-center text-sm font-medium text-slate-500 leading-relaxed">
                  Mahsulotlarni qidirmoqchiman va sotib olmoqchiman
                </p>
                {selectedRole === 'buyer' && (
                  <motion.div 
                    layoutId="check"
                    className="absolute -top-3 -right-3 bg-primary text-white rounded-full p-1.5 shadow-lg ring-4 ring-white"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </motion.div>
                )}
              </button>
            </div>

            <Button
              onClick={handleSelect}
              disabled={!selectedRole || isLoading}
              className="w-full h-16 rounded-[24px] text-xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Davom etish
                  <ArrowRight className="h-6 w-6" />
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
