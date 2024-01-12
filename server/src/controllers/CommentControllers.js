const autoBind = require("auto-bind");

class postCommentController {
    constructor() {
        autoBind(this);
    }

    async postCommentHandler(req, res) {
        const { comment, artwork_id, customer_id } = req.body;
    
        const { data, error } = await supabase
            .from('comment')
            .insert({ comment, artwork_id, customer_id });
    
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

    async getCommentsByArtworkHandler(req, res) {
        const { artwork_id } = req.params;
    
        const { data, error } = await supabase
            .from('comment')
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
                message: `Comments for artwork_id = ${artwork_id} not found`,
            });
        }
    
        return res.status(200).json({
            status: 'success',
            data,
        });
    }    
}

module.exports = postCommentController;