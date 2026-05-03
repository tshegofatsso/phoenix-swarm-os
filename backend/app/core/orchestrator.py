import logging

logger = logging.getLogger("orchestrator")

class Orchestrator:
    def __init__(self, swarm):
        self.swarm = swarm

    def dispatch(self, command: dict) -> dict:
        action = command.get("action")
        logger.info(f"Dispatching command: {action}")
        if action == "spawn_product":
            return self.swarm.run_pipeline(command.get("target"))
        elif action == "switch_mode":
            self.swarm.mode = command.get("value", "MANUAL")
            return {"mode": self.swarm.mode}
        elif action == "optimize_revenue":
            return {"status": "CashFlow optimization triggered"}
        else:
            logger.error(f"Unknown action: {action}")
            return {"error": "unknown_command"}