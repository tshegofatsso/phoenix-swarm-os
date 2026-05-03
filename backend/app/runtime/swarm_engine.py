import time
import logging
from app.core.event_bus import EventBus
from app.agents.tjotjo import Tjotjo
from app.agents.bra_killer import BraKiller
from app.agents.uncle_vusi import UncleVusi
from app.agents.auntie_cashflow import AuntieCashflow
from app.agents.og_mkhulu import OgMkhulu

logger = logging.getLogger("swarm_engine")
MAX_RETRIES = 3

class SwarmEngine:
    def __init__(self, bus: EventBus):
        self.bus = bus
        self.agents = {}
        self.mode = "MANUAL"

    def register_default_agents(self):
        self.agents = {
            "tjotjo": Tjotjo(),
            "bra_killer": BraKiller(),
            "uncle_vusi": UncleVusi(),
            "auntie_cashflow": AuntieCashflow(),
            "og_mkhulu": OgMkhulu(),
        }
        logger.info("All agents registered")

    def run_pipeline(self, input_signal) -> dict:
        logger.info("Starting SaaS generation pipeline")
        try:
            ideas = self._retry(lambda: self.agents["tjotjo"].run(input_signal))
            filtered = self._retry(lambda: self.agents["bra_killer"].evaluate(ideas))
            if not filtered.get("approved"):
                return {"status": "no_viable_idea"}
            app = self._retry(lambda: self.agents["uncle_vusi"].build(filtered["approved"][0]))
            monetization = self._retry(lambda: self.agents["auntie_cashflow"].monetize(app))
            self._retry(lambda: self.agents["og_mkhulu"].store(app, monetization))
            self.bus.publish({"type": "saas_created", "data": app})
            return monetization
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            return {"status": "error", "detail": str(e)}

    def _retry(self, func):
        last_exc = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                return func()
            except Exception as e:
                last_exc = e
                logger.warning(f"Attempt {attempt} failed: {e}")
                time.sleep(2 ** attempt)
        raise last_exc