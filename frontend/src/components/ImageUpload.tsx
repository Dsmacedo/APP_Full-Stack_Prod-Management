import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>;
  initialImageUrl?: string;
  onChange: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  initialImageUrl,
  onChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [error, setError] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      const uploadedImageUrl = await onUpload(file);
      setImageUrl(uploadedImageUrl);
      onChange(uploadedImageUrl);
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
      setError("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    onChange("");
  };

  return (
    <Box sx={{ mb: 2 }}>
      {!imageUrl ? (
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 1,
            p: 3,
            mb: 2,
            textAlign: "center",
          }}
        >
          <input
            accept="image/*"
            id="upload-image"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <label htmlFor="upload-image">
            <Button
              variant="contained"
              component="span"
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <UploadIcon />
              }
              disabled={isLoading}
            >
              Selecionar Imagem
            </Button>
          </label>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ position: "relative", mb: 2 }}>
          <Box
            component="img"
            src={imageUrl}
            alt="Preview"
            sx={{
              width: "100%",
              maxHeight: 200,
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
