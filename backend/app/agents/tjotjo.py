import logging

logger = logging.getLogger(__name__)

class Tjotjo:
    def run(self, prompt: str) -> list:
        logger.info(f"Generating ideas from: {prompt}")
        return [{"title": f"Idea: {prompt}", "score": 0.9}]

class BraKiller:
    def evaluate(self, ideas: list) -> dict:
        logger.info("Evaluating ideas")
        return {"approved": ideas[:1]}

class UncleVusi:
    def build(self, idea: dict) -> dict:
        logger.info(f"Building app from: {idea['title']}")
        return {"app_name": idea['title'], "code": "// generated code"}

class AuntieCashflow:
    def monetize(self, app: dict) -> dict:
        logger.info(f"Monetizing {app['app_name']}")
        return {"plan": "subscription", "price": "R99/month"}

class OgMkhulu:
    def store(self, app: dict, monetization: dict):
        logger.info(f"Storing {app['app_name']}")