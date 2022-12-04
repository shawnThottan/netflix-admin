import { useEffect, useState } from 'react';
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';
import Language from '../backend/models/Language';
import Theatre from '../backend/models/Theatre';
import MovieModal from '../components/MovieModal';
import { Container } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import dbConnect from '../backend/db';

export default function Home({ theatres, languages }: { theatres: any, languages: any }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [showModal, setShowModal] = useState(false);

  const fetchMovies = () => {
    fetch('/api/movies')
      .then(data => data.json())
      .then(json => {
        const movies = (json?.movies || []).map((movie: any) => ({
          ...movie,
          id: movie?._id,
        }))
        setMovies(movies);
      });
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  const onAddClick = () => {
    setSelectedMovie({});
    setShowModal(true);
  }

  const onRowClick = (data: any) => {
    setSelectedMovie(data.row);
    setShowModal(true);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: 'transparent' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ height: '80vh', marginTop: '3rem' }}>
        <Box
          m={3}
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button variant="contained" onClick={onAddClick} color='secondary'>Add Movie</Button>
        </Box>
        <DataGrid
          sx={{ backgroundColor: 'white' }}
          rows={movies}
          autoHeight
          onRowClick={onRowClick}
          hideFooter
          columns={[{
            field: 'name',
            headerName: 'Name',
            sortable: false,
            filterable: false,
            flex: 1,
          }, {
            field: 'cast',
            headerName: 'Cast',
            valueGetter: (cell: GridValueGetterParams) => (cell.row.cast.join(', ')),
            sortable: false,
            filterable: false,
            flex: 2,
          }, {
            field: 'genre',
            headerName: 'Genre',
            flex: 1,
          }, {
            field: 'language',
            headerName: 'Language',
            valueGetter: (cell: GridValueGetterParams) => (cell.row.language.name),
            flex: 1,
          }, {
            field: 'theatres',
            headerName: 'Theatres',
            valueGetter: (cell: GridValueGetterParams) => (cell.row.theatres.map((theatre: any) => theatre?.name || '').join(', ')),
            sortable: false,
            filterable: false,
            flex: 2,
          }, {
            field: 'cities',
            headerName: 'Cities',
            valueGetter: (cell: GridValueGetterParams) => (Array.from(new Set(cell.row.theatres.map((theatre: any) => theatre?.city?.name || ''))).join(', ')),
            sortable: false,
            flex: 2,
          }]} />
      </Container>
      <MovieModal movie={selectedMovie} show={showModal} setShow={setShowModal} theatres={theatres} languages={languages} fetchMovies={fetchMovies} />
    </>
  )
}

export async function getServerSideProps() {
  await dbConnect();
  const theatres = await Theatre.find({}, '_id name city').populate('city');
  const languages = await Language.find({}, '_id name');

  return {
    props: { theatres: JSON.parse(JSON.stringify(theatres)), languages: JSON.parse(JSON.stringify(languages)) },
  }
}
