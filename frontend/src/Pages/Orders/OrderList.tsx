import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DataTable, { Column } from "../../components/DataTable";
import { Order } from "../../types/Order";
import { ordersService } from "../../api/ordersService";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Falha ao carregar a lista de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: Order) => {
    navigate(`/orders/edit/${order._id}`);
  };

  const handleDelete = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await ordersService.delete(orderToDelete._id);
      setOrders(orders.filter((o) => o._id !== orderToDelete._id));
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
      setError("Falha ao excluir o pedido.");
    }
  };

  const columns: Column<Order>[] = [
    {
      id: "id",
      label: "ID",
      render: (row) => row._id.substring(0, 8) + "...",
    },
    {
      id: "date",
      label: "Data",
      render: (row) => new Date(row.date).toLocaleDateString("pt-BR"),
    },
    {
      id: "products",
      label: "Produtos",
      render: (row) => `${row.productIds?.length || 0} produtos`,
    },
    {
      id: "total",
      label: "Total",
      render: (row) => `R$ ${row.total.toFixed(2)}`,
      align: "right",
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Pedidos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/orders/create")}
        >
          Novo Pedido
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable<Order>
          columns={columns}
          data={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Pedido"
        message={`Tem certeza de que deseja excluir o pedido #${orderToDelete?._id.substring(
          0,
          8
        )}?`}
      />
    </Box>
  );
};

export default OrderList;
