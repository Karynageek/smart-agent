import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from src.stores import chat_manager_instance, agent_manager_instance

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/hotel_finder", tags=["hotel_finder"])


@router.post("/process_hotels")
async def process_hotels(data: dict):
    """Process hotels"""
    logger.info("Data Agent: Received process hotels request")
    try:
        hotel_finder = agent_manager_instance.get_agent("hotel finder")
        if not hotel_finder:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "Hotel finder agent not found"},
            )

        response = await hotel_finder.process_hotels(data)
        chat_manager_instance.add_message(response)
        return response
    except Exception as e:
        logger.error(f"Failed to process hotels: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Failed to process hotels: {str(e)}"},
        )
