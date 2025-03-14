import { config } from "~/config/config.server";
import {
  type JustizBackendService,
  JustizBackendServiceImpl,
} from "./justizBackend.server";

class ServicesContext {
  private static justizBackendService: JustizBackendService;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getJustizBackendService(): JustizBackendService {
    if (!ServicesContext.justizBackendService) {
      ServicesContext.justizBackendService = new JustizBackendServiceImpl(
        config().JUSTIZ_BACKEND_API_URL,
      );
    }
    return ServicesContext.justizBackendService;
  }
}

const justizBackendService = ServicesContext.getJustizBackendService();

export { ServicesContext, justizBackendService };
