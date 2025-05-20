import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Chip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DataTable, { Column } from "../../components/DataTable";
import { Product } from "../../types/Product";
import { productsService } from "../../api/productService";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Falha ao carregar a lista de produtos.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product._id}`);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productsService.delete(productToDelete._id);
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      setError("Falha ao excluir o produto.");
    }
  };

  const columns: Column<Product>[] = [
    {
      id: "name",
      label: "Nome",
      render: (row) => row.name,
    },
    {
      id: "price",
      label: "Preço",
      render: (row) => `R$ ${row.price.toFixed(2)}`,
      align: "right",
    },
    {
      id: "categories",
      label: "Categorias",
      render: (row) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {row.categoryIds && row.categoryIds.length > 0 ? (
            row.categoryIds.map((categoryId) => (
              <Chip
                key={categoryId}
                label="Categoria"
                size="small"
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sem categorias
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "image",
      label: "Imagem",
      render: (row) =>
        row.imageUrl ? (
          <Box
            component="img"
            src={row.imageUrl}
            alt={row.name}
            sx={{
              width: 50,
              height: 50,
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Sem imagem
          </Typography>
        ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Produtos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/products/create")}
        >
          Novo Produto
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
        <DataTable<Product>
          columns={columns}
          data={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Produto"
        message={`Tem certeza de que deseja excluir o produto "${productToDelete?.name}"?`}
      />
    </Box>
  );
};

export default ProductList;
