const autoBind = require("auto-bind");

class TransactionController {
    constructor() {
        autoBind(this);
    }

    async postTransactionHandler(req, res) {
        const { customer_address, seller_address, status, completed_at } = req.body;

        const { data, error } = await supabase
            .from('transaction')
            .insert({ customer_address, seller_address, status, completed_at });

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

    async getTransactionsByCustomerHandler(req, res) {
        const { customer_address } = req.params;

        const { data, error } = await supabase
            .from('transaction')
            .select()
            .eq('customer_address', customer_address);

        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `Transactions for customer_address = ${customer_address} not found`,
            });
        }

        return res.status(200).json({
            status: 'success',
            data,
        });
    }
}

module.exports = TransactionController;
