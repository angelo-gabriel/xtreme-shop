import "dotenv/config";

import mongoose from "mongoose";

import { env } from "../config/env.js";
import { Category } from "../modules/categories/category.model.js";
import { Product } from "../modules/products/product.model.js";

if (env.NODE_ENV === "production") {
  throw new Error("O seed não pode ser executado em ambiente de produção.");
}

const categories = [
  {
    name: "Eletrônicos",
    slug: "eletronicos",
    description: "Celulares, notebooks e acessórios tecnológicos.",
  },
  {
    name: "Games",
    slug: "games",
    description: "Consoles, jogos e periféricos para jogadores.",
  },
  {
    name: "Casa e Cozinha",
    slug: "casa-e-cozinha",
    description: "Produtos para tornar o dia a dia mais prático.",
  },
  {
    name: "Moda",
    slug: "moda",
    description: "Roupas e acessórios para diferentes estilos.",
  },
  {
    name: "Esportes",
    slug: "esportes",
    description: "Equipamentos e acessórios para atividades físicas.",
  },
  {
    name: "Livros",
    slug: "livros",
    description: "Leitura para estudo, trabalho e lazer.",
  },
];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);

  await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);

  const createdCategories = await Category.insertMany(categories);
  const categoryBySlug = new Map(
    createdCategories.map((category) => [category.slug, category._id]),
  );

  await Product.insertMany([
    {
      name: "Smartphone Galaxy S25",
      slug: "smartphone-galaxy-s25",
      description: "Smartphone premium com tela AMOLED, câmera avançada e 256 GB de armazenamento.",
      price: 4499.9,
      stock: 18,
      categoryId: categoryBySlug.get("eletronicos"),
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"],
      active: true,
    },
    {
      name: "Notebook Ultrafino 14",
      slug: "notebook-ultrafino-14",
      description: "Notebook leve para trabalho e estudos, com 16 GB de RAM e SSD de 512 GB.",
      price: 3799,
      stock: 8,
      categoryId: categoryBySlug.get("eletronicos"),
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
      active: true,
    },
    {
      name: "Fone Bluetooth Pro",
      slug: "fone-bluetooth-pro",
      description: "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
      price: 699.9,
      stock: 35,
      categoryId: categoryBySlug.get("eletronicos"),
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
      active: true,
    },
    {
      name: "Smartwatch Fit",
      slug: "smartwatch-fit",
      description: "Relógio inteligente com monitoramento cardíaco e notificações.",
      price: 899,
      stock: 0,
      categoryId: categoryBySlug.get("eletronicos"),
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
      active: true,
    },
    {
      name: "Console Next Gen",
      slug: "console-next-gen",
      description: "Console de nova geração com suporte a jogos em 4K.",
      price: 3999,
      stock: 12,
      categoryId: categoryBySlug.get("games"),
      images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3"],
      active: true,
    },
    {
      name: "Controle Sem Fio",
      slug: "controle-sem-fio",
      description: "Controle ergonômico sem fio com vibração e bateria recarregável.",
      price: 429.9,
      stock: 25,
      categoryId: categoryBySlug.get("games"),
      images: ["https://images.unsplash.com/photo-1592840496694-26d035b52b48"],
      active: true,
    },
    {
      name: "Headset Gamer RGB",
      slug: "headset-gamer-rgb",
      description: "Headset surround com microfone removível e iluminação RGB.",
      price: 349.9,
      stock: 14,
      categoryId: categoryBySlug.get("games"),
      images: ["https://images.unsplash.com/photo-1599669454699-248893623440"],
      active: true,
    },
    {
      name: "Cafeteira Expresso",
      slug: "cafeteira-expresso",
      description: "Cafeteira compacta para preparar espresso cremoso em minutos.",
      price: 1299,
      stock: 9,
      categoryId: categoryBySlug.get("casa-e-cozinha"),
      images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"],
      active: true,
    },
    {
      name: "Air Fryer Digital",
      slug: "air-fryer-digital",
      description: "Fritadeira elétrica de 5 litros com painel digital e 8 receitas pré-programadas.",
      price: 499.9,
      stock: 22,
      categoryId: categoryBySlug.get("casa-e-cozinha"),
      images: ["https://images.unsplash.com/photo-1585515320310-259814833e62"],
      active: true,
    },
    {
      name: "Conjunto de Panelas",
      slug: "conjunto-de-panelas",
      description: "Conjunto antiaderente com cinco peças para preparar refeições completas.",
      price: 289,
      stock: 16,
      categoryId: categoryBySlug.get("casa-e-cozinha"),
      images: ["https://images.unsplash.com/photo-1584990347449-39b7d2f5dd78"],
      active: false,
    },
    {
      name: "Camiseta Básica Premium",
      slug: "camiseta-basica-premium",
      description: "Camiseta de algodão macio com corte confortável disponível em várias cores.",
      price: 89.9,
      stock: 50,
      categoryId: categoryBySlug.get("moda"),
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
      active: true,
    },
    {
      name: "Tênis Casual Urbano",
      slug: "tenis-casual-urbano",
      description: "Tênis leve e versátil para uso diário, com sola antiderrapante.",
      price: 279.9,
      stock: 21,
      categoryId: categoryBySlug.get("moda"),
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
      active: true,
    },
    {
      name: "Mochila Executiva",
      slug: "mochila-executiva",
      description: "Mochila resistente com compartimento acolchoado para notebook.",
      price: 219,
      stock: 30,
      categoryId: categoryBySlug.get("moda"),
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"],
      active: true,
    },
    {
      name: "Tênis de Corrida Aero",
      slug: "tenis-de-corrida-aero",
      description: "Tênis de corrida com amortecimento responsivo e suporte no calcanhar.",
      price: 549.9,
      stock: 17,
      categoryId: categoryBySlug.get("esportes"),
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772"],
      active: true,
    },
    {
      name: "Tapete de Yoga",
      slug: "tapete-de-yoga",
      description: "Tapete antiderrapante com espessura confortável para exercícios.",
      price: 149.9,
      stock: 40,
      categoryId: categoryBySlug.get("esportes"),
      images: ["https://images.unsplash.com/photo-1599447421416-3414500d18a5"],
      active: true,
    },
    {
      name: "Garrafa Térmica Sport",
      slug: "garrafa-termica-sport",
      description: "Garrafa térmica de aço inox com capacidade para 750 ml.",
      price: 119,
      stock: 45,
      categoryId: categoryBySlug.get("esportes"),
      images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8"],
      active: true,
    },
    {
      name: "Código Limpo",
      slug: "codigo-limpo",
      description: "Guia sobre boas práticas de programação e escrita de código sustentável.",
      price: 99.9,
      stock: 28,
      categoryId: categoryBySlug.get("livros"),
      images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f"],
      active: true,
    },
    {
      name: "Arquitetura Limpa",
      slug: "arquitetura-limpa",
      description: "Conceitos essenciais para projetar aplicações escaláveis e organizadas.",
      price: 109.9,
      stock: 20,
      categoryId: categoryBySlug.get("livros"),
      images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794"],
      active: true,
    },
  ]);

  console.log(
    `Seed concluído: ${createdCategories.length} categorias e 18 produtos adicionados.`,
  );
}

seed()
  .catch((error) => {
    console.error("Falha ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
