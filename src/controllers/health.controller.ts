import { Controller, Route, Tags, Get } from "tsoa";
import { get } from "@/services/health.service";

@Route("health")
@Tags("System")
export class HealthController extends Controller {
    @Get("/")
    public get(): string {
        const response = get();
        this.setStatus(response.code);

        return response.body;
    }
}
