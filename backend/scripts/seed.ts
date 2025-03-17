import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CategoriesService } from '../src/categories/categories.service';
import { ProductsService } from '../src/products/products.service';
import { OrdersService } from '../src/orders/orders.service';
import { Category } from '../src/schemas/category.schema';
import { Product } from '../src/schemas/product.schema';
import { Order } from '../src/schemas/order.schema';

// Interfaces para tipos com o _id (documento MongoDB)
interface CategoryDocument extends Category {
  _id: any;
}

interface ProductDocument extends Product {
  _id: any;
}

interface OrderDocument extends Order {
  _id: any;
}

async function seed() {
  try {
    console.log('Iniciando seed...');

    // Criar uma instância da aplicação NestJS para acessar os serviços
    const app = await NestFactory.createApplicationContext(AppModule);

    // Obter os serviços
    const categoriesService = app.get(CategoriesService);
    const productsService = app.get(ProductsService);
    const ordersService = app.get(OrdersService);

    // Limpar os dados existentes
    console.log('Limpando dados existentes...');

    // Criar categorias
    console.log('Criando categorias...');
    const aiCategory = (await categoriesService.create({
      name: 'Inteligência Artificial',
    })) as CategoryDocument;

    const webDevelopment = (await categoriesService.create({
      name: 'Desenvolvimento Web',
    })) as CategoryDocument;

    console.log('Categorias criadas com sucesso!');
    console.log('ID Categoria IA:', aiCategory._id.toString());
    console.log('ID Categoria Web:', webDevelopment._id.toString());

    // Criar produtos
    console.log('Criando produtos...');

    // Produto de IA
    const aiDataCourse = (await productsService.create({
      name: 'Curso de Machine Learning para Finanças',
      description:
        'Aprenda a usar IA para prever tendências do mercado financeiro.',
      price: 2700,
      categoryIds: [aiCategory._id.toString()],
      imageUrl:
        'https://static.wixstatic.com/media/11062b_bfab4ff6dc8b439ab1643263e059ab85~mv2.jpg/v1/fill/w_320,h_240,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_bfab4ff6dc8b439ab1643263e059ab85~mv2.jpg',
    })) as ProductDocument;

    // Produtos de Desenvolvimento Web
    const fullStackCourse = (await productsService.create({
      name: 'Curso Full Stack com React e Node.js',
      description:
        'Aprenda a desenvolver aplicações web completas usando React no front-end e Node.js no back-end.',
      price: 1200,
      categoryIds: [webDevelopment._id.toString()],
      imageUrl:
        'https://miro.medium.com/v2/resize:fit:320/0*FPVenGRUjuYjbggo.jpg',
    })) as ProductDocument;

    console.log('Produtos criados com sucesso!');
    console.log('ID Produto IA:', aiDataCourse._id.toString());
    console.log('ID Produto Web:', fullStackCourse._id.toString());

    // Criar pedidos
    console.log('Criando pedidos...');

    const order = (await ordersService.create({
      date: new Date(),
      productIds: [aiDataCourse._id.toString(), fullStackCourse._id.toString()],
      total: aiDataCourse.price + fullStackCourse.price,
    })) as OrderDocument;

    console.log('Pedido criado com sucesso!');
    console.log('ID do pedido:', order._id.toString());
    console.log('Total do pedido:', order.total);

    console.log('✅ Banco populado com sucesso!');

    // Fechar a aplicação NestJS
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  }
}

// Executar o seed
seed();
