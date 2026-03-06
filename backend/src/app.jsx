import { ShoppingCart, Star, Shield, Truck, CreditCard } from 'lucide-react'

export default function Home() {
  const produtos = [
    {
      id: 1,
      nome: "Camiseta Premium",
      descricao: "Algodão egípcio, corte slim fit",
      preco: "R$ 149,90",
      imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      cor: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      nome: "Blazer Modern",
      descricao: "Tecido italiano, corte contemporâneo",
      preco: "R$ 489,90",
      imagem: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w-800&auto=format&fit=crop",
      cor: "from-emerald-500 to-teal-400"
    },
    {
      id: 3,
      nome: "Calça Jeans Fit",
      descricao: "Denim stretch, lavagem moderna",
      preco: "R$ 229,90",
      imagem: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
      cor: "from-purple-500 to-violet-400"
    },
    {
      id: 4,
      nome: "Tênis Urban",
      descricao: "Couro premium, solado antiderrapante",
      preco: "R$ 399,90",
      imagem: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop",
      cor: "from-orange-500 to-amber-400"
    }
  ]

  const beneficios = [
    { icon: Truck, texto: "Frete grátis acima de R$ 300" },
    { icon: Shield, texto: "Garantia de 1 ano" },
    { icon: CreditCard, texto: "12x sem juros" },
    { icon: Star, texto: "Produtos premium" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Rei de Copas
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
            <ShoppingCart size={20} />
            <span className="font-medium">Carrinho</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">3</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium">
            Coleção Outono/Inverno 2024
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent leading-tight">
            Estilo que<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              transforma
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-lg">
            Moda masculina premium que combina design contemporâneo, qualidade excepcional e conforto inigualável.
          </p>
          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-300">
              Explorar coleção
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-indigo-50 transition-all duration-300">
              Ver vídeo
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-20"></div>
          <img 
            src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&auto=format&fit=crop"
            alt="Coleção masculina premium"
            className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* Benefícios */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300">
              <beneficio.icon className="w-10 h-10 text-indigo-600 mb-4" />
              <p className="font-medium text-slate-800">{beneficio.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produtos */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-slate-900 mb-4">Destaques da coleção</h3>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Peças selecionadas que definem o novo padrão de estilo masculino
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {produtos.map((produto) => (
            <div key={produto.id} className="group">
              <div className="relative overflow-hidden rounded-3xl mb-6 h-64">
                <div className={`absolute inset-0 bg-gradient-to-br ${produto.cor} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <img 
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-900">
                  Novo
                </div>
              </div>
              <h4 className="font-bold text-xl text-slate-900 mb-2">{produto.nome}</h4>
              <p className="text-slate-600 mb-3">{produto.descricao}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {produto.preco}
                </span>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Comprar agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">Junte-se ao estilo</h3>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Receba ofertas exclusivas e seja o primeiro a conhecer nossas novas coleções
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors duration-300">
              Inscrever
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">R</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold">Rei de Copas</h4>
                <p className="text-slate-300">Estilo que transforma</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-slate-300 text-sm mb-2">
                © {new Date().getFullYear()} Rei de Copas. Todos os direitos reservados.
              </p>
              <p className="text-slate-400 text-sm">
                Desenvolvido com estilo e modernidade
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}