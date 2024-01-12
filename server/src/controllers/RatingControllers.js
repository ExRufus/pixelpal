const autoBind = require("auto-bind");

class RatingController {
    constructor() {
        autoBind(this);
    }

    async postRatingHandler(req, res) {
        const { rating, artwork_id, customer_id } = req.body;

        const { data, error } = await supabase
            .from('rating')
            .insert({ rating, artwork_id, customer_id });

        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }

        return res.status(200).json({
            status: 'success',
            data,
        });
    }

    async getRatingsByArtworkHandler(req, res) {
        const { artwork_id } = req.params;

        const { data, error } = await supabase
            .from('rating')
            .select()
            .eq('artwork_id', artwork_id);

        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `Ratings for artwork_id = ${artwork_id} not found`,
            });
        }

        return res.status(200).json({
            status: 'success',
            data,
        });
    }
}

module.exports = RatingController;
