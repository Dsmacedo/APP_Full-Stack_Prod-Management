// src/handler.ts
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  ScheduledEvent,
} from "aws-lambda";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import { Order } from "./models/order";
import moment from "moment";

// Gerar relatório diário de vendas
export async function generateDailyReport(
  event: ScheduledEvent,
  context: Context
): Promise<void> {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();

    // Definir data de ontem
    const yesterday = moment().subtract(1, "day").startOf("day").toDate();
    const today = moment().startOf("day").toDate();

    // Buscar pedidos do dia anterior
    const orders = await Order.find({
      date: { $gte: yesterday, $lt: today },
    }).populate("productIds");

    // Calcular estatísticas
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalRevenue / totalOrders || 0;

    console.log(
      `=== Relatório de Vendas Diário: ${moment(yesterday).format(
        "DD/MM/YYYY"
      )} ===`
    );
    console.log(`Número total de pedidos: ${totalOrders}`);
    console.log(`Receita total: R$ ${totalRevenue.toFixed(2)}`);
    console.log(`Valor médio por pedido: R$ ${averageOrderValue.toFixed(2)}`);

    // Aqui você poderia enviar o relatório por email, salvar em S3, etc.

    await disconnectFromDatabase();
  } catch (error) {
    console.error("Erro ao gerar relatório diário:", error);
    await disconnectFromDatabase();
    throw error;
  }
}

// Gerar relatório mensal de vendas
export async function generateMonthlyReport(
  event: ScheduledEvent,
  context: Context
): Promise<void> {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();

    // Definir período do mês anterior
    const startOfLastMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "month")
      .endOf("month")
      .toDate();

    // Buscar pedidos do mês anterior
    const orders = await Order.find({
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    }).populate("productIds");

    // Calcular estatísticas
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalRevenue / totalOrders || 0;

    // Agrupar por dia para análise de tendência
    const ordersByDay = orders.reduce((acc, order) => {
      const day = moment(order.date).format("DD/MM/YYYY");
      if (!acc[day]) {
        acc[day] = { count: 0, revenue: 0 };
      }
      acc[day].count += 1;
      acc[day].revenue += order.total;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    console.log(
      `=== Relatório de Vendas Mensal: ${moment(startOfLastMonth).format(
        "MM/YYYY"
      )} ===`
    );
    console.log(`Número total de pedidos: ${totalOrders}`);
    console.log(`Receita total: R$ ${totalRevenue.toFixed(2)}`);
    console.log(`Valor médio por pedido: R$ ${averageOrderValue.toFixed(2)}`);
    console.log("\nTendência diária:");
    Object.entries(ordersByDay).forEach(([day, data]) => {
      console.log(
        `${day}: ${data.count} pedidos, R$ ${data.revenue.toFixed(2)}`
      );
    });

    // Aqui você poderia enviar o relatório por email, salvar em S3, etc.

    await disconnectFromDatabase();
  } catch (error) {
    console.error("Erro ao gerar relatório mensal:", error);
    await disconnectFromDatabase();
    throw error;
  }
}

// Gerar relatório sob demanda
export async function generateReportOnDemand(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();

    // Extrair parâmetros da solicitação
    const body = event.body ? JSON.parse(event.body) : {};
    const startDate = body.startDate
      ? new Date(body.startDate)
      : moment().subtract(30, "days").toDate();
    const endDate = body.endDate ? new Date(body.endDate) : new Date();

    // Buscar pedidos do período especificado
    const orders = await Order.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("productIds");

    // Calcular estatísticas
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalRevenue / totalOrders || 0;

    // Criar objeto de relatório
    const report = {
      period: {
        startDate: moment(startDate).format("DD/MM/YYYY"),
        endDate: moment(endDate).format("DD/MM/YYYY"),
      },
      statistics: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
      },
      generatedAt: new Date().toISOString(),
    };

    await disconnectFromDatabase();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(report),
    };
  } catch (error) {
    console.error("Erro ao gerar relatório sob demanda:", error);
    await disconnectFromDatabase();

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Erro ao processar relatório" }),
    };
  }
}
