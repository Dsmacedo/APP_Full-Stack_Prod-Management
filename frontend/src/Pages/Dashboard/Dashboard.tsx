// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  dashboardService,
  OrderStatistics,
  PeriodOrder,
  CategorySales,
  TopSellingProduct,
} from "../../api/dashboardService";
import { Category } from "../../types/Category";
import { categoriesService } from "../../api/categoriesService";

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2)}`;
};

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OrderStatistics | null>(null);
  const [periodOrders, setPeriodOrders] = useState<PeriodOrder[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30d");

  useEffect(() => {
    fetchCategories();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCategory, timeRange]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Calculate date ranges based on selected time range
      const endDate = new Date().toISOString();
      let startDate: string;

      switch (timeRange) {
        case "7d":
          startDate = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "30d":
          startDate = new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "90d":
          startDate = new Date(
            Date.now() - 90 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "180d":
          startDate = new Date(
            Date.now() - 180 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "365d":
          startDate = new Date(
            Date.now() - 365 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        default:
          startDate = new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString();
      }

      // Get category filter
      const categoryId =
        selectedCategory !== "all" ? selectedCategory : undefined;

      // Fetch dashboard data
      const [statsData, periodData, categoryData, topProductsData] =
        await Promise.all([
          dashboardService.getStatistics(startDate, endDate, categoryId),
          dashboardService.getOrdersByPeriod(startDate, endDate),
          dashboardService.getOrdersByCategory(),
          dashboardService.getTopSellingProducts(5),
        ]);

      setStats(statsData);
      setPeriodOrders(periodData);
      setCategorySales(categoryData);
      setTopProducts(topProductsData);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError("Falha ao carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // Format period data for chart
  const formatPeriodData = (data: PeriodOrder[]) => {
    return data.map((item) => ({
      date: `${item._id.day}/${item._id.month}`,
      vendas: item.count,
      receita: item.total,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="category-select-label">Categoria</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              label="Categoria"
              onChange={(e) => setSelectedCategory(e.target.value as string)}
            >
              <MenuItem value="all">Todas as categorias</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="time-range-select-label">Período</InputLabel>
            <Select
              labelId="time-range-select-label"
              value={timeRange}
              label="Período"
              onChange={(e) => setTimeRange(e.target.value as string)}
            >
              <MenuItem value="7d">Últimos 7 dias</MenuItem>
              <MenuItem value="30d">Últimos 30 dias</MenuItem>
              <MenuItem value="90d">Últimos 90 dias</MenuItem>
              <MenuItem value="180d">Últimos 180 dias</MenuItem>
              <MenuItem value="365d">Último ano</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Pedidos
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.totalOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Receita Total
              </Typography>
              <Typography variant="h4" component="div">
                {formatCurrency(stats?.totalRevenue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valor Médio por Pedido
              </Typography>
              <Typography variant="h4" component="div">
                {formatCurrency(stats?.averageOrderValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valor Máximo de Pedido
              </Typography>
              <Typography variant="h4" component="div">
                {formatCurrency(stats?.maxOrderValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Orders by Period Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pedidos por Período
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formatPeriodData(periodOrders)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    formatter={(value: number, name) => {
                      return name === "receita" ? formatCurrency(value) : value;
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="vendas"
                    name="Número de Pedidos"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="receita"
                    name="Receita"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Sales by Category Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vendas por Categoria
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="categoryName"
                    label={({ categoryName, total, percent }) =>
                      `${categoryName}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categorySales.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Selling Products Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Produtos Mais Vendidos
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Total de Vendas" fill="#8884d8" />
                  <Bar
                    dataKey="count"
                    name="Quantidade Vendida"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
