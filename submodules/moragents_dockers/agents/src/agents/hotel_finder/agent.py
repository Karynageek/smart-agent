import json
import logging

from src.models.messages import ChatRequest
import requests
from bs4 import BeautifulSoup as bs


logger = logging.getLogger(__name__)


class HotelFinderAgent:
    def __init__(self, config, llm, embeddings):
        self.config = config
        self.llm = llm
        self.embeddings = embeddings


    def chat(self, request: ChatRequest):
        try:
            #return {"role": "assistant", "content": "Tell me how much is 10+5"}
            data = request.dict()
            if "prompt" in data:
                prompt = data["prompt"]["content"]

                url = "https://www.booking.com/searchresults.html"
                #TODO: parse parameters from prompt using language model
                params = {
                    'dest_id': '-1456928',
                    'dest_type': 'city',
                    'checkin': '2025-01-02',
                    'checkout': '2025-01-03',
                    'group_adults': '2',
                    'no_rooms': '1',
                    'group_children': '0',
                }
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                }

                # Fetch the webpage
                response = requests.get(url, params=params, headers=headers)
                html = response.content

                # Parse the HTML
                soup = bs(html, features="html.parser")

                # Select all hotel cards
                cards = soup.select('[data-testid="property-card"]')

                # Initialize a list to store hotel data
                hotels = []

                # Loop through each card
                for card in cards:
                    # Extract title
                    title = card.select_one('[data-testid="title"]').text.strip()

                    # Extract review score and text if available
                    reviewDiv = card.select_one('[data-testid="review-score"]')
                    reviewScore = ""
                    reviewText = ""
                    if reviewDiv:
                        reviewDivChildren = reviewDiv.children
                        try:
                            reviewScore = next(next(reviewDivChildren).children).text.strip()
                            reviewText = next(reviewDivChildren).text.strip()
                        except StopIteration:
                            pass

                    # Extract other information and clean \xa0
                    distance = card.select_one('[data-testid="distance"]').text.strip().replace('\xa0', ' ')
                    nightsText = card.select_one('[data-testid="price-for-x-nights"]').text.strip().replace('\xa0', ' ')
                    priceText = card.select_one('[data-testid="price-and-discounted-price"]').text.strip().replace(
                        '\xa0', ' ')

                    # Create a dictionary for the current hotel
                    hotel_data = {
                        "title": title,
                        "review_score": reviewScore,
                        "review_text": reviewText,
                        "distance": distance,
                        "nights": nightsText,
                        "price": priceText,
                    }

                    # Append the dictionary to the list
                    hotels.append(hotel_data)

                system_prompt = (
                    "You will try to find the best hotel for the person based on their preferences.\n"
                    "You know following information about hotels:\n"
                    f"{str(hotels)}"
                )

                messages = [
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {"role": "user", "content": prompt},
                ]

                result = self.llm.invoke(messages)
                return {"role": "assistant", "content": result.content.strip()}
            else:
                return {"error": "Missing required parameters"}, 400
        except Exception as e:
            logger.error(f"Error in chat endpoint: {str(e)}")
            return {"Error": str(e)}, 500

