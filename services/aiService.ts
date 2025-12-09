import { GoogleGenAI } from "@google/genai";
import { Product, Sale } from "../types";

export const generateInsights = async (sales: Sale[], products: Product[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Chave de API não configurada. Adicione a variável de ambiente API_KEY para ativar o Assistente Inteligente Plena.";
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare a summary of data to save tokens
  const last7DaysSales = sales
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 100); // Last 100 sales for analysis
  
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).map(p => p.name);
  
  const summary = {
    totalSalesCount: sales.length,
    recentTransactions: last7DaysSales.map(s => ({
      total: s.total,
      items: s.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      date: s.date
    })),
    lowStockAlerts: lowStockProducts
  };

  const prompt = `
    Você é um especialista em gestão de varejo para pequenas distribuidoras de bebidas no Brasil.
    Analise os seguintes dados recentes da loja e forneça 3 sugestões táticas curtas e diretas para o dono aumentar o lucro ou melhorar a gestão.
    
    Dados da Loja (Resumo JSON):
    ${JSON.stringify(summary)}

    Formato da resposta:
    Use Markdown. Seja direto. Fale a linguagem do comerciante brasileiro.
    Não use introduções longas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Erro ao gerar insights:", error);
    return "Erro ao conectar com o assistente inteligente. Verifique sua conexão.";
  }
};