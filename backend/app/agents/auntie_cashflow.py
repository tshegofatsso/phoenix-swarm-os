import logging

logger = logging.getLogger(__name__)

class AuntieCashflow:
    def run(self, prompt: str) -> list:
        logger.info(f"Modeling revenue for: {prompt}")
        return [{"model": "tiered_subscription", "monthly_revenue_12m": 5000}]