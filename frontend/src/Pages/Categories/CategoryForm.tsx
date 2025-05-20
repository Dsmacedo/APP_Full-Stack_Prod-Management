import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Category } from "../../types/Category";
import { categoriesService } from "../../api/categoriesService";

interface CategoryFormData {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
});

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [isEditMode, id]);

  const fetchCategory = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const category = await categoriesService.getById(id);

      // Reset form with fetched category data
      reset({
        name: category.name,
      });

      setError(null);
    } catch (err) {
      console.error("Erro ao buscar categoria:", err);
      setError("Falha ao carregar os dados da categoria.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      if (isEditMode && id) {
        await categoriesService.update(id, data);
      } else {
        await categoriesService.create(data);
      }

      navigate("/categories");
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setError("Falha ao salvar a categoria. Tente novamente.");
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
        {isEditMode ? "Editar Categoria" : "Nova Categoria"}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome da Categoria"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={submitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/categories")}
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

export default CategoryForm;
