import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/db';
import Movie from '../../../backend/models/Movie';

export default async function movies(req: NextApiRequest, res: NextApiResponse<any>) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            const movies = await Movie.find({}).populate('language').populate('theatres').populate({ path: 'theatres', populate: { path: 'city' }});
            return res.status(200).json({ movies });
        case 'POST':
            const movie = req.body;

            if (!movie?.name || !movie?.language || !movie?.cast?.length || !movie?.theatres?.length) {
                res.status(400).json({ err: `invalid movie data` });
            }

            try {
                const doc = await Movie.create(movie);
                return res.status(200).json({ created_movie: doc });
            } catch(e) {
                return res.status(500).json({ err: `error creating movie. ${e}` });
            }
        default:
            return res.status(400).json({ err: `invalid request method: ${req.method}` });
    }
};
