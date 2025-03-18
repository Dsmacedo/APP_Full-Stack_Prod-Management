Este projeto é uma aplicação full stack que integra NestJS, MongoDB, ReactJS e AWS (com LocalStack para S3), usando TypeScript e Serverless Framework para funções Lambda.
Estrutura do Projeto
Copyprojeto/
├── backend/ # API NestJS + MongoDB
├── frontend/ # Interface React.js
├── sales-report-lambda/ # Função Serverless para relatórios
└── docker-compose.yml # Configuração dos serviços Docker
Requisitos

Node.js (v16+)
Docker e Docker Compose
AWS CLI
Git

Configuração Inicial

1. Clone o Repositório
   bashCopygit clone [URL_DO_REPOSITÓRIO]
   cd [NOME_DO_PROJETO]
2. Inicie os Serviços de Infraestrutura
   bashCopy# Inicie o MongoDB e LocalStack (S3)
   docker-compose up -d
3. Configure o Bucket S3 no LocalStack
   bashCopy# Criar o bucket S3
   aws --endpoint-url=http://localhost:4566 s3 mb s3://ecommerce-bucket

# Configurar CORS

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
Backend (NestJS + MongoDB)
bashCopy# Acesse a pasta do backend
cd backend

# Instale as dependências

npm install

# Iniciar em modo desenvolvimento

npm run start:dev

# Opcional: Popular o banco de dados com dados iniciais

npm run seed
O servidor backend estará disponível em: http://localhost:8000/api
Frontend (React + Material UI)
bashCopy# Acesse a pasta do frontend
cd frontend

# Instale as dependências

npm install

# Iniciar em modo desenvolvimento

npm start
A aplicação frontend estará disponível em: http://localhost:3000
Serverless Lambda (Processamento de Relatórios)
bashCopy# Acesse a pasta da função Lambda
cd sales-report-lambda

# Instale as dependências

npm install

# Execute localmente

npm run local
Endpoints disponíveis na função Lambda:

Relatório sob demanda: http://localhost:4000/dev/reports/generate
Relatório diário: http://localhost:4000/dev/reports/daily
Relatório mensal: http://localhost:4000/dev/reports/monthly

Documentação de Componentes (Storybook)
bashCopy# Na pasta do frontend
cd frontend

# Iniciar o Storybook

npm run storybook
O Storybook estará disponível em: http://localhost:6006
Funcionalidades Principais
Backend

CRUD completo para Produtos, Categorias e Pedidos
Upload de imagens para S3 (LocalStack)
Endpoint de dashboard com métricas e estatísticas

Frontend

Interface de usuário moderna com Material UI
Gerenciamento de produtos, categorias e pedidos
Dashboard com gráficos e KPIs
Upload e visualização de imagens

Serverless Lambda

Processamento assíncrono de relatórios de vendas
Pode ser acionada por schedule (cron) ou sob demanda (HTTP)

Testando o Upload de Imagens

Acesse o frontend em http://localhost:3000
Navegue até a página de Produtos
Clique em "Novo Produto"
Preencha o formulário e faça upload de uma imagem
Salve o produto e verifique se a imagem aparece na listagem

Testando as Funções Lambda
Você pode testar as funções Lambda de processamento de relatórios através do Postman ou de qualquer cliente HTTP:
CopyPOST http://localhost:4000/dev/reports/generate

Body (JSON):
{
"startDate": "2025-01-01",
"endDate": "2025-03-01"
}
Avisos e Solução de Problemas

MongoDB: Certifique-se de que a porta 27017 não está sendo usada por outra instância do MongoDB.
LocalStack (S3): Se encontrar problemas com o LocalStack, verifique se a porta 4566 está disponível.
Permissões de Arquivo: Em ambientes Linux/Mac, pode ser necessário ajustar as permissões dos scripts:
bashCopychmod +x setup-s3.sh

Próximos Passos

Implementar autenticação e autorização
Adicionar testes automatizados
Configurar CI/CD

Recursos e Documentação

NestJS
React
Material UI
Serverless Framework
LocalStack
MongoDB
