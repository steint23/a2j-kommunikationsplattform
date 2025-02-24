import type { JustizBackendService } from "./justizbackend.server";
import { JustizBackendServiceImpl } from "./justizbackend.server";

class ServicesContext {
  private static justizBackendService: JustizBackendService;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getJustizBackendService(): JustizBackendService {
    if (!ServicesContext.justizBackendService) {
      ServicesContext.justizBackendService = new JustizBackendServiceImpl();
    }
    return ServicesContext.justizBackendService;
  }
}

const justizBackendService = ServicesContext.getJustizBackendService();

export { ServicesContext, justizBackendService };
