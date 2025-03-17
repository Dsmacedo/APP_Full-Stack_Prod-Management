#!/bin/bash

echo "Criando bucket S3 no LocalStack..."

# Criar o bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://ecommerce-bucket

# Configurar permissões CORS para permitir upload do frontend
aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket ecommerce-bucket --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ]
}'

echo "Bucket S3 configurado com sucesso!"