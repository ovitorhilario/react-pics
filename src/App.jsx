import { AppBar, Box, Container, Grid, Paper, Toolbar, Typography } from '@mui/material'
import SearchForm from './components/SearchForm.jsx'
import ImageGallery from './components/ImageGallery.jsx'
import { GalleryProvider } from './contexts/GalleryContext.jsx'

function App() {
  return (
    <GalleryProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
              React Pics
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <SearchForm />
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper sx={{ p: 2 }}>
                <ImageGallery />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </GalleryProvider>
  )
}

export default App
