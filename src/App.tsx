/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Settings, 
  Eye, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin,
  CreditCard,
  Calendar,
  Hash,
  User,
  Building2,
  FileText,
  RotateCcw,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { cn } from '../lib/utils';

interface InvoiceItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
}

interface InvoiceData {
  companyName: string;
  companyTagline: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientPhone: string;
  clientEmail: string;
  invoiceNo: string;
  invoiceDate: string;
  paymentMethod: string;
  accountID: string;
  accountName: string;
  items: InvoiceItem[];
  taxRate: number;
  terms: string;
  signatureName: string;
  signatureTitle: string;
}

const initialData: InvoiceData = {
  companyName: "Yggdra Tech",
  companyTagline: "Soluções Tecnológicas de Ponta",
  companyAddress: "Av. Paulista, 1000 - São Paulo, Brasil",
  companyPhone: "+55 (11) 99999-9999",
  companyEmail: "contato@yggdratech.com.br",
  clientName: "Megumin Ryu",
  clientTitle: "Supervisor",
  clientCompany: "Blacksteel Company",
  clientPhone: "(+62) 898 1234 5678",
  clientEmail: "megumin_ryu@mail.com",
  invoiceNo: "YT-2024-001",
  invoiceDate: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
  paymentMethod: "Pix / Transferência Bancária",
  accountID: "Chave Pix: contato@yggdratech.com.br",
  accountName: "Yggdra Tech Soluções LTDA",
  items: [
    { id: '1', description: "Desenvolvimento de Software", price: 5000, quantity: 1 },
    { id: '2', description: "Consultoria em Cloud", price: 1500, quantity: 2 },
    { id: '3', description: "Manutenção Mensal", price: 800, quantity: 1 },
  ],
  taxRate: 6,
  terms: "Este orçamento é válido por 15 dias. O pagamento deve ser efetuado em até 5 dias após a entrega do serviço.",
  signatureName: "Diretoria Yggdra Tech",
  signatureTitle: "CEO"
};

export default function App() {
  const [data, setData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('invoice-studio-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar dados salvos", e);
        return initialData;
      }
    }
    return initialData;
  });

  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('invoice-studio-data', JSON.stringify(data));
  }, [data]);

  const subTotal = useMemo(() => {
    return data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [data.items]);

  const taxAmount = useMemo(() => {
    return (subTotal * data.taxRate) / 100;
  }, [subTotal, data.taxRate]);

  const total = useMemo(() => {
    return subTotal + taxAmount;
  }, [subTotal, taxAmount]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      price: 0,
      quantity: 1
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    setData({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData({
      ...data,
      items: data.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const handlePrint = () => {
    // Garante que estamos no modo preview antes de imprimir
    if (view !== 'preview') {
      setView('preview');
      // Pequeno delay para garantir que o DOM atualizou
      setTimeout(() => {
        window.focus();
        window.print();
      }, 300);
    } else {
      window.focus();
      window.print();
    }
  };

 const handleDownloadPDF = () => {
  if (view !== "preview") {
    setView("preview");

    setTimeout(() => {
      window.print();
    }, 500);

  } else {
    window.print();
  }
};
      
     

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os dados e voltar ao padrão?")) {
      setData(initialData);
      localStorage.removeItem('invoice-studio-data');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header / Controls */}
      <header className="no-print sticky top-0 z-50 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 p-2 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Estúdio de Orçamentos</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={view === 'edit' ? 'default' : 'outline'} 
            onClick={() => setView('edit')}
            className="gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Editar
          </Button>
          <Button 
            variant={view === 'preview' ? 'default' : 'outline'} 
            onClick={() => setView('preview')}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </Button>
          <Separator orientation="vertical" className="h-8 mx-2" />
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isDownloading}
              variant="outline"
              className="gap-2 border-neutral-200"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Baixar PDF
            </Button>
            <Button onClick={handlePrint} className="gap-2 bg-neutral-900 hover:bg-neutral-800">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Separator orientation="vertical" className="h-8 mx-1" />
            <Button 
              variant="ghost" 
              onClick={handleOpenNewTab}
              className="gap-2 text-neutral-500"
              title="Abrir em nova aba (melhor para imprimir)"
            >
              <ExternalLink className="w-4 h-4" />
              Nova Aba
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto w-full">
        {/* Editor Side */}
        <AnimatePresence mode="wait">
          {view === 'edit' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 space-y-8 no-print"
            >
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                  <Building2 className="w-4 h-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Sua Empresa</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input 
                      value={data.companyName} 
                      onChange={(e) => setData({...data, companyName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slogan / Subtítulo</Label>
                    <Input 
                      value={data.companyTagline} 
                      onChange={(e) => setData({...data, companyTagline: e.target.value})}
                      placeholder="Ex: Soluções Tecnológicas de Ponta"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone da Empresa</Label>
                    <Input 
                      value={data.companyPhone} 
                      onChange={(e) => setData({...data, companyPhone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail da Empresa</Label>
                    <Input 
                      value={data.companyEmail} 
                      onChange={(e) => setData({...data, companyEmail: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Endereço</Label>
                    <Input 
                      value={data.companyAddress} 
                      onChange={(e) => setData({...data, companyAddress: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                  <User className="w-4 h-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Informações do Cliente</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Cliente</Label>
                    <Input 
                      value={data.clientName} 
                      onChange={(e) => setData({...data, clientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input 
                      value={data.clientTitle} 
                      onChange={(e) => setData({...data, clientTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input 
                      value={data.clientCompany} 
                      onChange={(e) => setData({...data, clientCompany: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input 
                      value={data.clientPhone} 
                      onChange={(e) => setData({...data, clientPhone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input 
                      value={data.clientEmail} 
                      onChange={(e) => setData({...data, clientEmail: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                  <Hash className="w-4 h-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Detalhes do Orçamento</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nº do Orçamento</Label>
                    <Input 
                      value={data.invoiceNo} 
                      onChange={(e) => setData({...data, invoiceNo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input 
                      value={data.invoiceDate} 
                      onChange={(e) => setData({...data, invoiceDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                    <Input 
                      value={data.paymentMethod} 
                      onChange={(e) => setData({...data, paymentMethod: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ID da Conta (Pix/Banco)</Label>
                    <Input 
                      value={data.accountID} 
                      onChange={(e) => setData({...data, accountID: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome da Conta</Label>
                    <Input 
                      value={data.accountName} 
                      onChange={(e) => setData({...data, accountName: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <CreditCard className="w-4 h-4" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Itens</h2>
                  </div>
                  <Button onClick={handleAddItem} variant="outline" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Adicionar Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {data.items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-end">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] uppercase text-neutral-400">Descrição</Label>
                        <Input 
                          value={item.description} 
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Ex: Design de Logo"
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <Label className="text-[10px] uppercase text-neutral-400">Preço</Label>
                        <Input 
                          type="number"
                          value={item.price} 
                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-20 space-y-1">
                        <Label className="text-[10px] uppercase text-neutral-400">Qtd</Label>
                        <Input 
                          type="number"
                          value={item.quantity} 
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-neutral-400 hover:text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                  <Settings className="w-4 h-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Configurações Finais</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Taxa de Imposto (%)</Label>
                    <Input 
                      type="number"
                      value={data.taxRate} 
                      onChange={(e) => setData({...data, taxRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome para Assinatura</Label>
                    <Input 
                      value={data.signatureName} 
                      onChange={(e) => setData({...data, signatureName: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Termos e Condições</Label>
                    <Textarea 
                      value={data.terms} 
                      onChange={(e) => setData({...data, terms: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Side */}
        <div className={cn(
          "flex-1 flex justify-center",
          view === 'edit' ? "hidden lg:flex" : "flex"
        )}>
          <Card className="print-container w-full max-w-200 shadow-2xl border-none rounded-none overflow-hidden bg-white">
            <CardContent className="p-0">
              {/* Invoice Content - Matching the Image Style */}
              <div ref={invoiceRef} className="p-12 space-y-12 min-h-275 flex flex-col bg-white">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-black text-neutral-900 tracking-tight">{data.companyName}</h2>
                      <p className="text-[12px] text-neutral-500 font-medium uppercase tracking-[0.2em] mt-1">{data.companyTagline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-6xl font-black text-neutral-900 tracking-tighter opacity-10 absolute right-12 top-12 select-none">ORÇAMENTO</h1>
                    <h1 className="text-5xl font-black text-neutral-900 tracking-tighter relative z-10">ORÇAMENTO</h1>
                  </div>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Orçamento Para</p>
                      <h3 className="text-2xl font-bold text-neutral-900">{data.clientName}</h3>
                      <p className="text-sm text-neutral-500">{data.clientTitle}, {data.clientCompany}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pessoa de Contato</p>
                      <p className="text-sm text-neutral-700">Telefone : {data.clientPhone}</p>
                      <p className="text-sm text-neutral-700">E-mail : {data.clientEmail}</p>
                    </div>
                  </div>
                  <div className="space-y-6 text-right">
                    <div className="space-y-1">
                      <div className="flex justify-end gap-4">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nº do Orçamento</p>
                        <p className="text-sm font-medium text-neutral-700">: {data.invoiceNo}</p>
                      </div>
                      <div className="flex justify-end gap-4">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Data do Orçamento</p>
                        <p className="text-sm font-medium text-neutral-700">: {data.invoiceDate}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Método de Pagamento</p>
                      <div className="flex justify-end gap-4">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ID da Conta</p>
                        <p className="text-sm font-medium text-neutral-700">: {data.accountID}</p>
                      </div>
                      <div className="flex justify-end gap-4">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nome da Conta</p>
                        <p className="text-sm font-medium text-neutral-700">: {data.accountName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1">
                  <Table>
                    <TableHeader className="bg-neutral-800 hover:bg-neutral-800">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-white font-bold text-center w-12">#</TableHead>
                        <TableHead className="text-white font-bold uppercase tracking-widest text-xs">Descrição</TableHead>
                        <TableHead className="text-white font-bold uppercase tracking-widest text-xs text-center">Preço</TableHead>
                        <TableHead className="text-white font-bold uppercase tracking-widest text-xs text-center">Quantidade</TableHead>
                        <TableHead className="text-white font-bold uppercase tracking-widest text-xs text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.items.map((item, index) => (
                        <TableRow key={item.id} className={cn(
                          "border-none hover:bg-transparent",
                          index % 2 === 1 ? "bg-neutral-50" : "bg-white"
                        )}>
                          <TableCell className="text-center font-medium text-neutral-500">
                            {(index + 1).toString().padStart(2, '0')}
                          </TableCell>
                          <TableCell className="font-medium text-neutral-700">{item.description || "Item sem descrição"}</TableCell>
                          <TableCell className="text-center text-neutral-700">R$ {item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center text-neutral-700">{item.quantity}</TableCell>
                          <TableCell className="text-right font-bold text-neutral-900">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Totals */}
                  <div className="mt-8 flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total a Pagar</p>
                        <h4 className="text-3xl font-black text-neutral-900">R$ {total.toLocaleString('pt-BR')} BRL</h4>
                      </div>
                      <div className="h-1 w-32 bg-neutral-900" />
                      <p className="text-[10px] text-neutral-400 italic">Multa por atraso após 10 dias</p>
                    </div>

                    <div className="w-64 space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Subtotal</p>
                        <p className="text-sm font-bold text-neutral-700">R$ {subTotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Imposto ({data.taxRate}%)</p>
                        <p className="text-sm font-bold text-neutral-700">R$ {taxAmount.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center bg-neutral-800 p-4 text-white">
                        <p className="text-xs font-bold uppercase tracking-widest">Total</p>
                        <p className="text-lg font-black">R$ {total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-12">
                  <div className="flex justify-between items-end">
                    <div className="max-w-md space-y-4">
                      <h5 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 inline-block">Termos e Condições</h5>
                      <p className="text-[10px] leading-relaxed text-neutral-500 text-justify">
                        {data.terms}
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-32 h-12 flex items-center justify-center">
                        <p className="font-serif italic text-2xl text-neutral-800 opacity-80">{data.signatureName}</p>
                      </div>
                      <Separator className="w-40 mx-auto bg-neutral-900" />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">{data.signatureName}</p>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{data.signatureTitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-100 p-6 flex justify-between items-center text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      <p className="text-[9px] font-medium">{data.companyPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <p className="text-[9px] font-medium">{data.companyAddress}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      <p className="text-[9px] font-medium">{data.companyEmail}</p>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="no-print bg-white border-t border-neutral-200 p-6 text-center text-neutral-400 text-xs">
        <p>© 2024 Estúdio de Orçamentos. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}