'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plane, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

const registerSchema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    cpf: z.string().optional(),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const setCredentials = useAuthStore((state) => state.setCredentials);
    const [errorMsg, setErrorMsg] = React.useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setErrorMsg('');
            const response = await api.post('/auth/register', {
                name: data.name,
                email: data.email,
                cpf: data.cpf,
                password: data.password,
            });
            const { user, token } = response.data.data;
            setCredentials(user, token);
            router.push('/dashboard');
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* Visual / Brand Side */}
            <div className="hidden md:flex flex-1 flex-col justify-between bg-zinc-900 text-white p-12 relative overflow-hidden order-2">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-secondary/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative z-10 flex items-center gap-2 justify-end text-right">
                    <span className="text-xl font-bold tracking-tight">ImigraFlow</span>
                    <Plane className="h-6 w-6 text-brand-secondary transform rotate-45" />
                </div>

                <div className="relative z-10 max-w-md ml-auto text-right">
                    <h2 className="text-4xl font-bold leading-tight mb-4">A clareza que o seu planejamento precisa.</h2>
                    <p className="text-zinc-400 text-lg">Pare de sofrer com planilhas de múltiplos destinos. Consolide seus custos de vida e poder de compra de forma preditiva.</p>
                </div>

                <div className="relative z-10 text-sm font-medium text-zinc-500 text-right">
                    © {new Date().getFullYear()} ImigraFlow Inc.
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative order-1">
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
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Crie sua conta</h1>
                        <p className="text-muted-foreground mt-2">Comece grátis e ganhe clareza financeira para seu futuro.</p>
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
                            <label htmlFor="name" className="text-sm font-medium leading-none">Nome completo</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="João Silva"
                                {...register('name')}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="cpf" className="text-sm font-medium leading-none flex justify-between">
                                CPF <span className="text-xs text-muted-foreground">(Opcional para maior rapidez)</span>
                            </label>
                            <Input
                                id="cpf"
                                type="text"
                                placeholder="000.000.000-00"
                                {...register('cpf')}
                            />
                            {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">E-mail corporativo ou pessoal</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nome@email.com"
                                {...register('email')}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Sua senha forte</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Deve conter no mínimo 6 caracteres.</p>
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" variant="gradient" className="w-full mt-6" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                            {isSubmitting ? 'Criando Conta...' : 'Criar Conta Grátis'}
                        </Button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center text-sm text-muted-foreground mt-4"
                    >
                        Já possui uma conta?{' '}
                        <Link href="/login" className="font-semibold text-brand-primary hover:underline transition-all">
                            Acesse aqui
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
