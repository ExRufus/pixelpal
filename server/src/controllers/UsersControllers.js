const { User } = require('../../models');
const ClientError = require('../exceptions/ClientError');
const { ethers } = require('ethers');
const supabase = require('../supabase');

const provider = new ethers.providers.Web3Provider(window.ethereum);

class UsersController {
    constructor() {
        autoBind(this);       
    }

    async postUserHandler(req, res) {
        const { wallet_address } = req.body;
        const { data, error } = await supabase.from('user').insert({ wallet_address });

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

    async getUserWalletHandler(req, res) {
        try {
            // Pastikan pengguna terdaftar di Metamask dan telah login
            await provider.send("eth_requestAccounts", []);
    
            // Dapatkan alamat dompet pengguna
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
    
            res.status(200).json({
                status: 'success',
                userContractAddress: userAddress,
            });
        } catch (error) {
            if (error instanceof ClientError) {
                return res.status(error.statusCode).json({
                    status: 'fail',
                    message: error.message,
                });
            }
    
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Sorry, there was a failure on our servers'
            });
        }
    }

    async putUserHandler(req, res) {
        const { id } = req.params;
        const { username, profpict, bio } = req.body;
    
        // Update data in 'user' table using Supabase
        const { data, error } = await supabase
            .from('user')
            .update({ username, profpict, bio })
            .eq('id', id);
    
        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }
    
        res.status(200).json({
            status: 'success',
            message: `User with id = ${id} updated successfully`,
            data,
        });
    }
}

module.exports = UsersController;