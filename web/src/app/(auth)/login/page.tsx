'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plane, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setCredentials = useAuthStore((state) => state.setCredentials);
    const [errorMsg, setErrorMsg] = React.useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setErrorMsg('');
            const response = await api.post('/auth/login', data);
            const { user, token } = response.data.data;
            setCredentials(user, token);
            router.push('/dashboard');
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Erro ao efetuar login.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* Visual / Brand Side */}
            <div className="hidden md:flex flex-1 flex-col justify-between bg-zinc-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518105779140-1014a6007bbf?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 flex items-center gap-2">
                    <Plane className="h-6 w-6 text-brand-primary" />
                    <span className="text-xl font-bold tracking-tight">ImigraFlow</span>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-bold leading-tight mb-4">Seu próximo capítulo começa hoje.</h2>
                    <p className="text-zinc-400 text-lg">Acesse seu planejamento e tenha clareza de cada passo até seu novo país.</p>
                </div>

                <div className="relative z-10 text-sm font-medium text-zinc-500">
                    © {new Date().getFullYear()} ImigraFlow Inc.
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
                <div className="w-full max-w-[400px] space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center md:text-left"
                    >
                        <div className="md:hidden flex justify-center mb-6">
                            <Link href="/" className="flex items-center gap-2">
                                <Plane className="h-6 w-6 text-brand-primary" />
                                <span className="text-xl font-bold">ImigraFlow</span>
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h1>
                        <p className="text-muted-foreground mt-2">Insira suas credenciais para acessar sua conta.</p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {errorMsg && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                E-mail
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nome@email.com"
                                {...register('email')}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium leading-none">
                                    Senha
                                </label>
                                <Link href="#" className="text-xs font-semibold text-brand-primary hover:underline">Esqueceu a senha?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" variant="gradient" className="w-full mt-6" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
                            {isSubmitting ? 'Entrando...' : 'Entrar na conta'}
                        </Button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center text-sm text-muted-foreground mt-4"
                    >
                        Ainda não tem uma conta?{' '}
                        <Link href="/register" className="font-semibold text-brand-primary hover:underline transition-all">
                            Cadastre-se grátis
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
