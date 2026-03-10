'use client';

import * as React from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Users, Plus, Trash2, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';

type Member = {
  id: string;
  name: string;
  age: number;
  type: string;
  works: boolean;
};

export default function FamilyPage() {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Form states
  const [isAdding, setIsAdding] = React.useState(false);
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [type, setType] = React.useState('CONJUGE');
  const [works, setWorks] = React.useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/household');
      setMembers(res.data.data.members || []);
    } catch (error) {
      console.error('Failed to fetch household data', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    try {
      await api.post('/household', {
        name,
        age: parseInt(age),
        type,
        works
      });
      setIsAdding(false);
      setName('');
      setAge('');
      setWorks(false);
      fetchData();
    } catch (error) {
      console.error('Error adding member', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/household/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting member', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grupo Familiar</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre as pessoas que irão imigrar com você para calcularmos o custo de vida proporcional.
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2 bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4" /> Cadastrar Membro
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isAdding && (
            <Card className="border-brand-primary/50 bg-secondary/20 col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Novo Membro do Grupo</CardTitle>
                <CardDescription>Preencha os dados da pessoa que irá imigrar com você.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdd} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <Input placeholder="Ex: Maria" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Idade</label>
                      <Input type="number" placeholder="Ex: 30" value={age} onChange={e => setAge(e.target.value)} required min={0} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grau de Parentesco</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                        value={type} onChange={e => setType(e.target.value)}>
                        <option value="CONJUGE">Cônjuge</option>
                        <option value="FILHO">Filho(a)</option>
                        <option value="DEPENDENTE">Outro Dependente</option>
                      </select>
                    </div>
                    <div className="space-y-2 flex flex-col justify-end pb-2">
                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-input text-brand-primary focus:ring-brand-primary"
                          checked={works} onChange={e => setWorks(e.target.checked)} />
                        Esta pessoa irá trabalhar/contribuir com a renda?
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
                    <Button type="submit" className="bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground">Salvar Membro</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {members.length === 0 && !isAdding ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 border border-dashed border-border rounded-xl">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Nenhum familiar cadastrado</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2 mb-6">
                Por enquanto, consideraremos apenas os seus custos como pessoa solteira na simulação de custo de vida.
              </p>
              <Button onClick={() => setIsAdding(true)} variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                Adicionar Familiar
              </Button>
            </div>
          ) : (
            <>
              {/* Fake card for the user themselves */}
              <Card className="bg-secondary/10 border-brand-secondary/30">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-brand-secondary/20 p-3 rounded-full">
                    <UserCircle2 className="h-6 w-6 text-brand-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Você</CardTitle>
                    <CardDescription>Titular principal</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-foreground">Trabalha e contribui</p>
                </CardContent>
              </Card>

              {members.map(member => (
                <Card key={member.id} className="group relative overflow-hidden transition-all hover:border-brand-primary/50">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="bg-brand-primary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="capitalize">{member.type.toLowerCase()} • {member.age} anos</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${member.works ? 'bg-brand-primary/10 text-brand-primary ring-brand-primary/20' : 'bg-secondary text-muted-foreground ring-border'}`}>
                        {member.works ? 'Contribui c/ Renda' : 'Dependente Financeiro'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
