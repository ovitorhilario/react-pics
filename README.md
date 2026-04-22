# React Pics

SPA de galeria de imagens desenvolvida com React e Vite para consumo da API Picsum Photos.

## Descrição do projeto

O projeto permite buscar imagens com filtros personalizados de largura, altura, quantidade por página, desfoque e escala de cinza. A interface foi construída com Material UI e o estado global é gerenciado com Context API + useReducer.

## Tecnologias utilizadas

- React 19: https://react.dev/
- Vite: https://vite.dev/
- Material UI: https://mui.com/material-ui/
- Picsum Photos API: https://picsum.photos/

## Instalação e execução local

1. Instale as dependências:

~~~bash
npm install
~~~

2. Rode o projeto em desenvolvimento:

~~~bash
npm run dev
~~~

3. Acesse no navegador o endereço exibido no terminal.

## Build de produção

~~~bash
npm run build
~~~

## Estrutura de pastas

~~~text
src/
	components/
		SearchForm.jsx
		ImageGallery.jsx
		ImageCard.jsx
		ImageModal.jsx
		PaginationControls.jsx
	contexts/
		GalleryContext.jsx
	App.jsx
	main.jsx
~~~

## Endpoints da API utilizados

- Lista paginada de imagens:
	https://picsum.photos/v2/list?page={page}&limit={limit}

- URL final de exibição montada no front-end:
	https://picsum.photos/id/{id}/{width}/{height}

- Parâmetros opcionais na URL final:
	grayscale
	blur={n}

## Deploy

Link de deploy:
[LINK_DO_DEPLOY]