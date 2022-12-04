import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/db';
import Movie from '../../../backend/models/Movie';

export default async function movies(req: NextApiRequest, res: NextApiResponse<any>) {
    const { movieId } = req.query;
    if (!movieId) {
        res.status(400).json({ err: `invalid movie id: ${movieId}` })
    }

    await dbConnect();

    switch (req.method) {
        case 'PATCH':
            const movie = req.body;

            if (!movie?.name || !movie?.language || !movie?.cast?.length || !movie?.theatres?.length) {
                res.status(400).json({ err: `invalid movie data` });
            }

            try {
                await Movie.findByIdAndUpdate(movieId, movie);
                return res.status(200).json({ updated: true });
            } catch (e) {
                return res.status(400).json({ err: `error updating movie.` });
            }
        case 'DELETE':
            try {
                await Movie.deleteOne({ _id: movieId });
                return res.status(200).json({ deleted: true });
            } catch (e) {
                return res.status(400).json({ err: `invalid request method: ${req.method}` });
            }
        default:
            return res.status(400).json({ err: `invalid request method: ${req.method}` });
    }
};
