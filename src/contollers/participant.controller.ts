import { Request, Response } from 'express';
import { Participant, Event } from '../models';

export async function registerForEvent(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user!.id;

    // Перевіряємо чи подія існує
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Подію не знайдено' });
    }

    // Перевіряємо кількість учасників
    const participantCount = await Participant.count({ where: { eventId } });
    if (participantCount >= event.maxParticipants) {
      return res.status(400).json({ error: 'Досягнуто максимальну кількість учасників' });
    }

    // Реєструємо учасника
    const participant = await Participant.create({ userId, eventId });
    res.status(201).json(participant);
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ви вже зареєстровані на цю подію' });
    }
    res.status(400).json({ error: error.message });
  }
}

export async function getUserEvents(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const participants = await Participant.findAll({
      where: { userId },
      include: [{ model: Event, as: 'event' }],
    });

    const events = participants.map((p: any) => p.event);
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}