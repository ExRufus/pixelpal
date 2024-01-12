const autoBind = require('auto-bind');

class ArtworkController {
    constructor() {
        autoBind(this);
    }

    async postArtworkHandler(req, res) {
        const { description, price, availability, image_url, owner, max_revision } = req.body;
        const { data, error } = await supabase.from('artwork').insert({ description, price, availability, image_url, owner, max_revision });

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

    async getArtworkByIdHandler(req, res) {
        const { id } = req.params;
    
        const { data, error } = await supabase
            .from('artwork')
            .select()
            .eq('id', id)
            .single();
    
        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }
    
        if (!data) {
            return res.status(404).json({
                status: 'fail',
                message: `Artwork with id = ${id} not found`,
            });
        }
    
        return res.status(200).json({
            status: 'success',
            data,
        });
    }
    
    async getArtworksByOwnerHandler(req, res) {
        const { owner } = req.params;
    
        const { data, error } = await supabase
            .from('artwork')
            .select()
            .eq('owner', owner);
    
        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }
    
        if (!data || data.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `Artworks for owner = ${owner} not found`,
            });
        }
    
        return res.status(200).json({
            status: 'success',
            data,
        });
    }

    
}

module.exports = ArtworkController;