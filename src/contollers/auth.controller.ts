import {Request, Response} from "express";
import {User} from "../models"
import { hashPassword, comparePasswords } from "../utils/password";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Всі поля є обов'язковими" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = signToken({ id: user.id, username: user.username, email: user.email }); 

        return res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Невірний email або пароль" });
        }

        const isValid = await comparePasswords(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Невірний email або пароль" });
        }

        const token = signToken({ id: user.id, username: user.username, email: user.email });

        return res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email'],
        });

        return res.status(200).json(users);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}