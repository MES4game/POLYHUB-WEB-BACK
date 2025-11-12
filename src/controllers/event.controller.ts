import {
    Controller, Route, Tags, Get, Post, Delete, Patch, Security, Path, Body, Query,
} from "tsoa";
import { Event } from "../models/event.model";
import {
    eventGetAll,
    eventGetAllFiltered,
    eventGetById,
    eventPostCreate,
    eventDeleteById,
    eventPatch,
    eventGetLinkRoom,
    eventPostLinkRoom,
    eventDeleteLinkRoom,
    eventGetLinkUser,
    eventPostLinkUser,
    eventDeleteLinkUser,
} from "@/services/event.service";

@Route("event")
@Tags("Event")
export class EventController extends Controller {
    /**
     * @summary Get all events
     */
    @Get("all")
    public async controllerEventGetAll(): Promise<Event[]> {
        const response = await eventGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get all events with filters
     */
    @Get("filtered")
    public async controllerEventGetAllFiltered(
        @Query() after_date?: Date,
        @Query() before_date?: Date,
        @Query() room_ids?: number[],
        @Query() lesson_ids?: number[],
        @Query() lesson_type_ids?: number[],
        @Query() lesson_args?: number[],
    ): Promise<Event[]> {
        const response = await eventGetAllFiltered(
            after_date,
            before_date,
            room_ids,
            lesson_ids,
            lesson_type_ids,
            lesson_args,
        );
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get event by ID
     */
    @Get("id/{event_id}")
    public async controllerEventGetById(
        @Path() event_id: number,
    ): Promise<Event> {
        const response = await eventGetById(event_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Create a new event
     */
    @Post("create")
    @Security("auth", ["admin", "moderator"])
    public async controllerEventPostCreate(
        @Body() body: { start: Date; end: Date; lesson_id: null | number; lesson_type_id: null | number; lesson_arg?: number },
    ): Promise<Event> {
        const response = await eventPostCreate(body.start, body.end, body.lesson_id, body.lesson_type_id, body.lesson_arg);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Delete event by ID
     */
    @Delete("delete/{event_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerEventDeleteById(
        @Path() event_id: number,
    ): Promise<void> {
        const response = await eventDeleteById(event_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change event's details
     */
    @Patch("/")
    @Security("auth", ["admin", "moderator"])
    public async controllerEventPatchParentId(
        @Body() body: {
            event_id           : number;
            new_start?         : Date;
            new_end?           : Date;
            new_lesson_id?     : null | number;
            new_lesson_type_id?: null | number;
            new_lesson_arg?    : number;
        },
    ): Promise<void> {
        const response = await eventPatch(
            body.event_id,
            body.new_start,
            body.new_end,
            body.new_lesson_id,
            body.new_lesson_type_id,
            body.new_lesson_arg,
        );
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get rooms linked to an event
     */
    @Get("link/{event_id}/room")
    public async controllerEventGetLinkRoom(
        @Path() event_id: number,
    ): Promise<{ rooms: number[] }> {
        const response = await eventGetLinkRoom(event_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Link a room to an event
     */
    @Post("link/{event_id}/room/{room_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerEventPostLinkRoom(
        @Path() event_id: number,
        @Path() room_id: number,
    ): Promise<void> {
        const response = await eventPostLinkRoom(event_id, room_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Unlink a room from an event
     */
    @Delete("link/{event_id}/room/{room_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerEventDeleteLinkRoom(
        @Path() event_id: number,
        @Path() room_id: number,
    ): Promise<void> {
        const response = await eventDeleteLinkRoom(event_id, room_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get users linked to an event
     */
    @Get("link/{event_id}/user")
    public async controllerEventGetLinkUser(
        @Path() event_id: number,
    ): Promise<{ users: number[] }> {
        const response = await eventGetLinkUser(event_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Link a user to an event
     */
    @Post("link/{event_id}/user/{user_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerEventPostLinkUser(
        @Path() event_id: number,
        @Path() user_id: number,
    ): Promise<void> {
        const response = await eventPostLinkUser(event_id, user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Unlink a user from an event
     */
    @Delete("link/{event_id}/user/{user_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerEventDeleteLinkUser(
        @Path() event_id: number,
        @Path() user_id: number,
    ): Promise<void> {
        const response = await eventDeleteLinkUser(event_id, user_id);
        this.setStatus(response.code);

        return response.body;
    }
}
