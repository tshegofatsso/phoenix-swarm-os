from app.core.command_router import CommandRouter

def setup_routes(app, orchestrator, bus):
    router = CommandRouter(orchestrator, bus)
    app.include_router(router)