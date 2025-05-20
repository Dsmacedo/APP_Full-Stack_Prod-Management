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

import { Product } from "../../types/Product";
import { Category } from "../../types/Category";
import { productsService } from "../../api/productService";
import { categoriesService } from "../../api/categoriesService";
import ImageUpload from "../../components/ImageUpload";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string(),
  price: yup
    .number()
    .typeError("Preço deve ser um número")
    .positive("Preço deve ser positivo")
    .required("Preço é obrigatório"),
  categoryIds: yup.array().of(yup.string()),
  imageUrl: yup.string(),
});

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema) as any, // Adicionamos "as any" para resolver o problema de tipagem
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryIds: [],
      imageUrl: "",
    },
  });

  useEffect(() => {
    fetchCategories();

    if (isEditMode) {
      fetchProduct();
    }
  }, [isEditMode, id]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setError("Falha ao carregar as categorias. Tente novamente.");
    }
  };

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const product = await productsService.getById(id);

      // Reset form with fetched product data
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryIds: product.categoryIds,
        imageUrl: product.imageUrl || "",
      });

      setError(null);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setError("Falha ao carregar os dados do produto.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      if (isEditMode && id) {
        await productsService.update(id, data);
      } else {
        await productsService.create(data);
      }

      navigate("/products");
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError("Falha ao salvar o produto. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await productsService.uploadImage(file);
      return imageUrl;
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
      throw err;
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
        {isEditMode ? "Editar Produto" : "Novo Produto"}
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
                    label="Nome do Produto"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={submitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={submitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Preço"
                    fullWidth
                    type="number"
                    InputProps={{ startAdornment: "R$ " }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    disabled={submitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoryIds}>
                    <InputLabel id="categories-label">Categorias</InputLabel>
                    <Select
                      {...field}
                      labelId="categories-label"
                      multiple
                      label="Categorias"
                      disabled={submitting}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryIds && (
                      <FormHelperText>
                        {errors.categoryIds.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Imagem do Produto
              </Typography>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    initialImageUrl={field.value}
                    onUpload={handleImageUpload}
                    onChange={(url) => setValue("imageUrl", url)}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/products")}
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

export default ProductForm;
