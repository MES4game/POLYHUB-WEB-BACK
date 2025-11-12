import { Controller, Route, Tags, Get, SuccessResponse } from "tsoa";
import { healthGet } from "@/services/health.service";

@Route("health")
@Tags("System")
export class HealthController extends Controller {
    /**
     * @summary Get the health status of the API
     */
    @Get("/")
    @SuccessResponse("204", "OK")
    public controllerHealthGet(): void {
        const response = healthGet();
        this.setStatus(response.code);

        return response.body;
    }
}
