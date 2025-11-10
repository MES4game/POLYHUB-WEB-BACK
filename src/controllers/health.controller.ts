import { Controller, Route, Tags, Get } from "tsoa";
import { healthGet } from "@/services/health.service";

@Route("health")
@Tags("System")
export class HealthController extends Controller {
    @Get("/")
    public controllerHealthGet(): void {
        const response = healthGet();
        this.setStatus(response.code);

        return response.body;
    }
}
