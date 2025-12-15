import { Request, Response } from "express";
import { Event, Participant, User } from "../models";

export async function createEvent(req: Request, res: Response) {
    try {
        const { name, description, date, location, maxParticipants } = req.body;
        const event = await Event.create({
            name,
            description,
            date,
            location,
            maxParticipants,
        });
        return res.status(201).json(event);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function getAllEvents(req: Request, res: Response) {
    try {
        const events = await Event.findAll() as any[];

        // Завантажуємо учасників окремо для кожної события
        const eventsWithUsers = await Promise.all(
            events.map(async (event) => {
                const participants = await Participant.findAll({
                    where: { eventId: event.id },
                    include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
                }) as any[];

                const users = participants.map((p) => p.user);

                return {
                    ...event.toJSON(),
                    registeredUsers: users,
                    registeredCount: users.length
                };
            })
        );

        return res.status(200).json(eventsWithUsers);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getEventById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id) as any;

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Завантажуємо учасників
        const participants = await Participant.findAll({
            where: { eventId: id },
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
        }) as any[];

        const users = participants.map((p) => p.user);

        return res.status(200).json({
            ...event.toJSON(),
            registeredUsers: users,
            registeredCount: users.length
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateEvent(req: Request, res: Response) {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        await event.update(req.body);
        return res.status(200).json(event);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }     
}

export async function deleteEvent(req: Request, res: Response) {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        await event.destroy();
        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }   
}
        