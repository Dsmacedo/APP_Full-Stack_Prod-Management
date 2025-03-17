import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Remova esta importação se não for usada
// import { Order } from '../../types/Order';
import { Product } from "../../types/Product";
import { ordersService } from "../../api/ordersService";
import { productsService } from "../../api/productService";

interface OrderFormData {
  date: string;
  productIds: string[];
  total: number;
}

const schema = yup.object({
  date: yup.string().required("Data é obrigatória"),
  productIds: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione pelo menos um produto"),
  total: yup
    .number()
    .typeError("Total deve ser um número")
    .positive("Total deve ser positivo")
    .required("Total é obrigatório"),
});

const OrderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: yupResolver(schema) as any, // Use 'as any' para resolver o problema de tipagem
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      productIds: [],
      total: 0,
    },
  });

  const watchProductIds = watch("productIds");

  useEffect(() => {
    fetchProducts();

    if (isEditMode) {
      fetchOrder();
    }
  }, [isEditMode, id]);

  useEffect(() => {
    // Update selected products when product IDs change
    if (watchProductIds && products.length > 0) {
      const selected = products.filter((product) =>
        watchProductIds.includes(product._id)
      );
      setSelectedProducts(selected);

      // Calculate total
      const total = selected.reduce((sum, product) => sum + product.price, 0);
      setValue("total", total);
    }
  }, [watchProductIds, products, setValue]);

  const fetchProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Falha ao carregar os produtos. Tente novamente.");
    }
  };

  const fetchOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const order = await ordersService.getById(id);

      // Reset form with fetched order data
      reset({
        date: new Date(order.date).toISOString().split("T")[0],
        productIds: order.productIds,
        total: order.total,
      });

      setError(null);
    } catch (err) {
      console.error("Erro ao buscar pedido:", err);
      setError("Falha ao carregar os dados do pedido.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      if (isEditMode && id) {
        await ordersService.update(id, data);
      } else {
        await ordersService.create(data);
      }

      navigate("/orders");
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
      setError("Falha ao salvar o pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
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
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {isEditMode ? "Editar Pedido" : "Novo Pedido"}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data do Pedido"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    disabled={submitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="total"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total"
                    fullWidth
                    type="number"
                    InputProps={{ startAdornment: "R$ " }}
                    error={!!errors.total}
                    helperText={errors.total?.message}
                    disabled
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="productIds"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.productIds}>
                    <InputLabel id="products-label">Produtos</InputLabel>
                    <Select
                      {...field}
                      labelId="products-label"
                      multiple
                      label="Produtos"
                      disabled={submitting}
                    >
                      {products.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                          {product.name} - R$ {product.price.toFixed(2)}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.productIds && (
                      <FormHelperText>
                        {errors.productIds.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Resumo do Pedido
              </Typography>
              <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
                {selectedProducts.length > 0 ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {selectedProducts.map((product) => (
                      <Box
                        key={product._id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{product.name}</Typography>
                        <Typography>R$ {product.price.toFixed(2)}</Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography fontWeight="bold">Total</Typography>
                      <Typography fontWeight="bold">
                        R${" "}
                        {selectedProducts
                          .reduce((sum, p) => sum + p.price, 0)
                          .toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Nenhum produto selecionado
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/orders")}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? "Salvando..." : "Salvar"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default OrderForm;
