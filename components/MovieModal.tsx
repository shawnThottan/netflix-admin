import { Modal, Box, Autocomplete } from "@mui/material";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useRef } from "react";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
};

const MovieModal = ({ movie, show, setShow, theatres, languages, fetchMovies }: any) => {
    const nameRef: any = useRef();
    const languageRef: any = useRef();
    const genreRef: any = useRef();
    const castRef: any = useRef();
    const theatresRef: any = useRef();

    useEffect(() => {
        languageRef.current = { value: movie?.language || { label: languages[0].name, id: languages[0]._id } };
        castRef.current = { value: movie?.cast || [] };
        theatresRef.current = { value: movie?.theatres?.map((theatre: any) => ({ label: `${theatre.name} (${theatre?.city?.name})`, id: theatre._id })) || [] };
    }, [movie]);

    const saveMovie = () => {
        const url = '/api/movies/' + (movie?._id || '');
        const method = movie?._id ? 'PATCH' : 'POST';
        const body = {
            name: nameRef?.current?.value,
            language: languageRef?.current?.value?.id,
            genre: genreRef?.current?.value,
            cast: castRef?.current?.value,
            theatres: theatresRef?.current?.value?.map((theatre: any) => theatre.id),
        };

        fetch(url, {
            method,
            body: JSON.stringify(body), 
            headers: {
              'Content-Type': 'application/json'
            }}
        ).then(() => {
            setShow(false);
            fetchMovies();
        });
    }

    return <Modal open={show} onClose={() => setShow(false)}>
        <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
                {movie?._id ? 'Edit Movie' : 'Add Movie'}
            </Typography>
            <Box sx={{ marginTop: '2rem' }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Movie Name"
                    inputRef={nameRef}
                    defaultValue={movie?.name || ''}
                />
                <Autocomplete
                    sx={{ marginTop: '.5rem' }}
                    fullWidth
                    disablePortal
                    options={languages.map((language: any) => ({ label: language.name, id: language._id }))}
                    defaultValue={movie?.language?.name ? { label: movie?.language?.name, id: movie?.language?._id } : { label: languages[0].name, id: languages[0]._id }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(ev, values) => languageRef.current.value = values}
                    renderInput={(params) => <TextField {...params} label="Language" />}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Genre"
                    inputRef={genreRef}
                    defaultValue={movie?.genre || ''}
                />
                <Autocomplete
                    sx={{ marginTop: '.5rem' }}
                    fullWidth
                    disablePortal
                    freeSolo
                    multiple
                    options={[]}
                    defaultValue={movie?.cast || []}
                    onChange={(ev, values) => castRef.current.value = values}
                    renderInput={(params) => <TextField {...params} label="Cast" />}
                />
                <Autocomplete
                    sx={{ marginTop: '1rem' }}
                    fullWidth
                    disablePortal
                    multiple
                    options={theatres.map((theatre: any) => ({ label: `${theatre.name} (${theatre?.city?.name})`, id: theatre._id }))}
                    defaultValue={movie?.theatres?.map((theatre: any) => ({ label: `${theatre.name} (${theatre?.city?.name})`, id: theatre._id })) || []}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(ev, values) => theatresRef.current.value = values}
                    renderInput={(params) => <TextField {...params} label="Theatres" />}
                />
            </Box>
            <Box
                mt={3}
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <Stack spacing={2} direction="row">
                    <Button variant="text" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => saveMovie()}>Save</Button>
                </Stack>
            </Box>
        </Box>
    </Modal>
}

export default MovieModal;