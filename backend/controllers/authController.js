import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const { data: userExists } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (balance is 10000 by default from schema)
        const { data: user, error } = await supabase
            .from('users')
            .insert([
                { name, email, password: hashedPassword }
            ])
            .select()
            .single();

        if (error) throw error;

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') { // not found error
            throw error;
        }

        if (!user) {
            return res.status(404).json({ message: "You don't have an account. Please create one." });
        }

        if (await bcrypt.compare(password, user.password)) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
