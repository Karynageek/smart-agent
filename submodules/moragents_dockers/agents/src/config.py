import logging
import datetime

# Logging configuration
logging.basicConfig(level=logging.INFO)


# Configuration object
class Config:

    # Model configuration
    OLLAMA_MODEL = "llama3.2:3b"
    OLLAMA_EMBEDDING_MODEL = "nomic-embed-text"
    OLLAMA_URL = "http://host.docker.internal:11434"

    MAX_UPLOAD_LENGTH = 16 * 1024 * 1024
    AGENTS_CONFIG = {
        "agents": [
            {
                "path": "src.agents.default.agent",
                "class": "DefaultAgent",
                "description": "Must be used for meta-queries that ask about active Morpheus agents, and also for general, simple questions",
                "name": "default",
                "human_readable_name": "Default General Purpose",
                "upload_required": False,
            },
            {
                "path": "src.agents.imagen.agent",
                "class": "ImagenAgent",
                "description": "Must only be used for image generation tasks. Use when the query explicitly mentions generating or creating an image.",
                "name": "imagen",
                "human_readable_name": "Image Generator",
                "upload_required": False,
            },
            {
                "path": "src.agents.base_agent.agent",
                "class": "BaseAgent",
                "description": "Handles transactions on the Base crypto network. Use when the user makes any reference to Base, base, the base network, or Coinbase",
                "name": "base",
                "human_readable_name": "Base Transaction Manager",
                "upload_required": False,
            },
            {
                "path": "src.agents.crypto_data.agent",
                "class": "CryptoDataAgent",
                "description": "Crypto-specific. Provides real-time cryptocurrency data such as price, market cap, and fully diluted valuation (FDV).",
                "name": "crypto data",
                "human_readable_name": "Crypto Data Fetcher",
                "upload_required": False,
            },
            {
                "path": "src.agents.hotel_finder.agent",
                "class": "HotelFinderAgent",
                "description": "Fetches hotel data based on user input. Use when the query explicitly mentions hotels, accommodations, or lodging.",
                "name": "hotel finder",
                "human_readable_name": "Hotel Finder",
                "upload_required": False,
            },
            # DISABLED: Pending 1inch protocol fix
            #
            # {
            #     "path": "src.agents.token_swap.agent",
            #     "class": "TokenSwapAgent",
            #     "description": "Handles cryptocurrency swapping operations. Use when the query explicitly mentions swapping, exchanging, or converting one cryptocurrency to another.",
            #     "name": "token swap",
            #     "upload_required": False,
            # },
            {
                "path": "src.agents.tweet_sizzler.agent",
                "class": "TweetSizzlerAgent",
                "description": "Generates engaging tweets. Use ONLY when the query explicitly mentions Twitter, tweeting, or the X platform.",
                "name": "tweet sizzler",
                "human_readable_name": "Tweet / X-Post Generator",
                "upload_required": False,
            },
            {
                "path": "src.agents.dca_agent.agent",
                "class": "DCAAgent",
                "description": "Sets up DCA strategies. Use when the user requests to set up a dollar-cost averaging strategy for crypto purchases or trades.",
                "name": "dca",
                "human_readable_name": "DCA Strategy Manager",
                "upload_required": False,
            },
            {
                "path": "src.agents.rag.agent",
                "class": "RagAgent",
                "description": "Answers questions about a document. Must be used anytime an upload, a document, Documents, or uploaded document is mentioned",
                "name": "rag",
                "human_readable_name": "Document Assistant",
                "upload_required": True,
            },
            # DISABLED:
            #
            # {
            #     "path": "src.agents.mor_claims.agent",
            #     "class": "MorClaimsAgent",
            #     "description": "Manages the process of claiming rewards or tokens, specifically MOR rewards. Use when the query explicitly mentions claiming rewards or tokens.",
            #     "name": "mor claims",
            #     "upload_required": False,
            # },
            {
                "path": "src.agents.mor_rewards.agent",
                "class": "MorRewardsAgent",
                "description": "Provides information about user's accrued MOR rewards or tokens. Use when the query is about checking or querying reward balances.",
                "name": "mor rewards",
                "human_readable_name": "MOR Rewards Tracker",
                "upload_required": False,
            },
            {
                "path": "src.agents.realtime_search.agent",
                "class": "RealtimeSearchAgent",
                "description": f"Use when the query is about searching the web or asks about a recent / current event (The year is {datetime.datetime.now().year})",
                "name": "realtime search",
                "human_readable_name": "Real-Time Search",
                "upload_required": False,
            },
            {
                "path": "src.agents.news_agent.agent",
                "class": "NewsAgent",
                "description": "Fetches and analyzes cryptocurrency news for potential price impacts.",
                "name": "crypto news",
                "human_readable_name": "Crypto News Analyst",
                "upload_required": False,
            },
        ]
    }
