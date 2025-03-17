// src/stories/DataTable.stories.tsx
import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import DataTable, { Column } from "../components/DataTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface MockItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

const mockData: MockItem[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(11) 99999-9999",
    status: "active",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(11) 88888-8888",
    status: "inactive",
  },
  {
    _id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "(11) 77777-7777",
    status: "active",
  },
];

const columns: Column<MockItem>[] = [
  {
    id: "name",
    label: "Nome",
    render: (row) => row.name,
  },
  {
    id: "email",
    label: "E-mail",
    render: (row) => row.email,
  },
  {
    id: "phone",
    label: "Telefone",
    render: (row) => row.phone,
  },
  {
    id: "status",
    label: "Status",
    render: (row) => (
      <span
        style={{
          color: row.status === "active" ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {row.status === "active" ? "Ativo" : "Inativo"}
      </span>
    ),
  },
];

export default {
  title: "Components/DataTable",
  component: DataTable,
  parameters: {
    componentSubtitle:
      "Uma tabela para exibir dados com colunas configuráveis e ações",
  },
} as Meta;

const theme = createTheme();

const Template: StoryFn<any> = (args) => (
  <ThemeProvider theme={theme}>
    <DataTable<MockItem> {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  columns,
  data: mockData,
  title: "Lista de Usuários",
};

export const WithActions = Template.bind({});
WithActions.args = {
  columns,
  data: mockData,
  title: "Lista de Usuários com Ações",
  onEdit: (item: MockItem) => alert(`Editar: ${item.name}`),
  onDelete: (item: MockItem) => alert(`Excluir: ${item.name}`),
};

export const EmptyData = Template.bind({});
EmptyData.args = {
  columns,
  data: [],
  title: "Lista de Usuários - Sem Dados",
};
