import { NextFunction, Request, Response } from "express";
import type { Event } from "../../../shared/Event";
import { EventService } from "../services/EventService";
import { EventRepository } from "../repositories/EventRepository";

export class EventController {
	static async createEvent(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			console.log(request.body);
			const eventId = await EventService.createEvent(request.body as Partial<Event>);
			response.json({ message: "Event Creation Successful.", id: eventId });
		} catch (e) {
			// response.status(400).json({ message: "Bad Request", received: request.body });
			next(e);
		}
	}

	static async readEvent(request: Request, response: Response): Promise<void> {
		const event = await EventRepository.getEventById(request.params.id);

		if (event) {
			response.json(event);
			return;
		}

		response.status(404).json({ message: "Event Not Found.", id: request.params.id });
	}

	static async updateEvent(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			const result = await EventRepository.updateEvent(request.params.id, request.body as Event);
			response.json(result);
		} catch (e) {
			next(e);
		}
	}

	static async deleteEvent(request: Request, response: Response) {
		const deletedId = EventRepository.deleteEvent(request.params.id);

		if (deletedId) {
			response.json({ message: `Successfully deleted event.`, id: deletedId });
			return;
		}

		response.status(404).json({ message: "Event not found.", id: request.params.id });
	}
}
