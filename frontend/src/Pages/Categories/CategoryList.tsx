import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DataTable, { Column } from "../../components/DataTable";
import { Category } from "../../types/Category";
import { categoriesService } from "../../api/categoriesService";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setError("Falha ao carregar a lista de categorias.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    navigate(`/categories/edit/${category._id}`);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await categoriesService.delete(categoryToDelete._id);
      setCategories(categories.filter((c) => c._id !== categoryToDelete._id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      setError("Falha ao excluir a categoria.");
    }
  };

  const columns: Column<Category>[] = [
    {
      id: "name",
      label: "Nome",
      render: (row) => row.name,
    },
    {
      id: "createdAt",
      label: "Data de Criação",
      render: (row) =>
        new Date(row.createdAt || "").toLocaleDateString("pt-BR"),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Categorias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/categories/create")}
        >
          Nova Categoria
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
        <DataTable<Category>
          columns={columns}
          data={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Categoria"
        message={`Tem certeza de que deseja excluir a categoria "${categoryToDelete?.name}"?`}
      />
    </Box>
  );
};

export default CategoryList;
