// src/stories/ImageUpload.stories.tsx
import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import ImageUpload from "../components/ImageUpload";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default {
  title: "Components/ImageUpload",
  component: ImageUpload,
  parameters: {
    componentSubtitle: "Componente para upload de imagens",
  },
} as Meta;

const mockUpload = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulando um atraso de rede
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    }, 1500);
  });
};

const theme = createTheme();

const Template: StoryFn<any> = (args) => (
  <ThemeProvider theme={theme}>
    <ImageUpload {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  onUpload: mockUpload,
  onChange: (url: string) => console.log("Image URL:", url),
};

export const WithInitialImage = Template.bind({});
WithInitialImage.args = {
  onUpload: mockUpload,
  initialImageUrl: "https://via.placeholder.com/400x300",
  onChange: (url: string) => console.log("Image URL:", url),
};
