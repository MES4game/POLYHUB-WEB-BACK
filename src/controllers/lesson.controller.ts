import {
    Controller, Route, Tags, Get, Post, Delete, Patch, Security, Path, Body, Query,
} from "tsoa";
import { Lesson, LessonType } from "../models/lesson.model";
import {
    lessonGetAll,
    lessonGetById,
    lessonPostCreate,
    lessonDeleteById,
    lessonPatchName,
    lessonPatchDescription,
    lessonPatchColor,
    lessonTypeGetAll,
    lessonTypeGetById,
    lessonTypePostCreate,
    lessonTypeDeleteById,
    lessonTypePatchName,
    lessonTypePatchDescription,
    lessonGetLinkGroup,
} from "@/services/lesson.service";

@Route("lesson")
@Tags("Lesson")
export class LessonController extends Controller {
    /**
     * @summary Get all lessons
     */
    @Get("all")
    public async controllerLessonGetAll(): Promise<Lesson[]> {
        const response = await lessonGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get lesson by ID
     */
    @Get("id/{lesson_id}")
    public async controllerLessonGetById(
        @Path() lesson_id: number,
    ): Promise<Lesson> {
        const response = await lessonGetById(lesson_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Create a new lesson
     */
    @Post("create")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonPostCreate(
        @Body() body: { name: string; description: string; color: string },
    ): Promise<Lesson> {
        const response = await lessonPostCreate(body.name, body.description, body.color);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Delete lesson by ID
     */
    @Delete("delete/{lesson_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonDeleteById(
        @Path() lesson_id: number,
    ): Promise<void> {
        const response = await lessonDeleteById(lesson_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change lesson name
     */
    @Patch("name")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonPatchName(
        @Body() body: { lesson_id: number; new_name: string },
    ): Promise<void> {
        const response = await lessonPatchName(body.lesson_id, body.new_name);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change lesson description
     */
    @Patch("description")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonPatchDescription(
        @Body() body: { lesson_id: number; new_description: string },
    ): Promise<void> {
        const response = await lessonPatchDescription(body.lesson_id, body.new_description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change lesson color
     */
    @Patch("color")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonPatchColor(
        @Body() body: { lesson_id: number; new_color: string },
    ): Promise<void> {
        const response = await lessonPatchColor(body.lesson_id, body.new_color);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get all groups linked to lessons filtered by various parameters
     */
    @Get("link/group")
    public async controllerEventGetAllFiltered(
        @Query() lesson_ids?: number[],
        @Query() lesson_type_ids?: number[],
        @Query() lesson_args?: number[],
    ): Promise<{ groups: number[] }> {
        const response = await lessonGetLinkGroup(
            lesson_ids,
            lesson_type_ids,
            lesson_args,
        );
        this.setStatus(response.code);

        return response.body;
    }
}

@Route("lesson_type")
@Tags("Lesson Type")
export class LessonTypeController extends Controller {
    /**
     * @summary Get all lesson types
     */
    @Get("all")
    public async controllerLessonTypeGetAll(): Promise<LessonType[]> {
        const response = await lessonTypeGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get lesson type by ID
     */
    @Get("id/{lesson_type_id}")
    public async controllerLessonTypeGetById(
        @Path() lesson_type_id: number,
    ): Promise<LessonType> {
        const response = await lessonTypeGetById(lesson_type_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Create a new lesson type
     */
    @Post("create")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonTypePostCreate(
        @Body() body: { name: string; description: string },
    ): Promise<LessonType> {
        const response = await lessonTypePostCreate(body.name, body.description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Delete lesson type by ID
     */
    @Delete("delete/{lesson_type_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonTypeDeleteById(
        @Path() lesson_type_id: number,
    ): Promise<void> {
        const response = await lessonTypeDeleteById(lesson_type_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change lesson type name
     */
    @Patch("name")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonTypePatchName(
        @Body() body: { lesson_type_id: number; new_name: string },
    ): Promise<void> {
        const response = await lessonTypePatchName(body.lesson_type_id, body.new_name);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change lesson type description
     */
    @Patch("description")
    @Security("auth", ["admin", "moderator"])
    public async controllerLessonTypePatchDescription(
        @Body() body: { lesson_type_id: number; new_description: string },
    ): Promise<void> {
        const response = await lessonTypePatchDescription(body.lesson_type_id, body.new_description);
        this.setStatus(response.code);

        return response.body;
    }
}
