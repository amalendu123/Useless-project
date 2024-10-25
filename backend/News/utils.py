import google.generativeai as genai
import requests
import json
from typing import List, Dict

def setup_gemini(key1: str) -> genai.GenerativeModel:
    """Initialize Gemini API with your API key."""
    genai.configure(api_key=key1)
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.9,
        "top_k": 40,
        "max_output_tokens": 2048,
    }
    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config=generation_config
    )
    return model


def generate_fake_news(model: genai.GenerativeModel, number_of_news: int = 20) -> List[Dict]:
    """
    Generates fake movie or series-related news using Gemini API.
    Returns a list of dictionaries containing news items.
    """
    prompt = (
        f"Generate {number_of_news} movie or TV show news items. "
        "Respond with ONLY a JSON array of objects. Each object must have exactly two fields: "
        "'title' (a headline) and 'content' (a news snippet). "
        "Make each headline unique and include real actor names. "
        "Example format: [{\"title\":\"New Marvel Movie Announced\",\"content\":\"Studios revealed today...\"}]"
    )

    try:
        response = model.generate_content(prompt)
        if response and response.text:
            try:
                cleaned_text = response.text.strip()
                if not cleaned_text.startswith('['):
                    cleaned_text = cleaned_text[cleaned_text.find('['):]
                if not cleaned_text.endswith(']'):
                    cleaned_text = cleaned_text[:cleaned_text.rfind(']')+1]
                
                news_items = json.loads(cleaned_text)
               # print(news_items)
                if isinstance(news_items, list) and len(news_items) > 0:
                    return news_items
                
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {e}")
        
        return [{"title": f"Sample Movie News {i}", "content": "Sample content"} for i in range(number_of_news)]
    
    except Exception as e:
        print(f"Error generating news with Gemini: {e}")
        return [{"title": f"Sample Movie News {i}", "content": "Sample content"} for i in range(number_of_news)]


def get_image_from_google(api_key_google: str, cse_id: str, query: str) -> str:
    """
    Fetches the first image related to a search query using Google Custom Search API.
    """
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": f"{query} movie official",
        "searchType": "image",
        "cx": cse_id,
        "key": api_key_google,
        "num": 1
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json() 
            
        if "items" in data and len(data["items"]) > 0:
            print(data["items"][0]["link"])
            return data["items"][0]["link"]
        
        return "https://via.placeholder.com/300x450"
    
    except Exception as e:
        print(f"Error fetching image: {e}")
        return "https://via.placeholder.com/300x450"

def get_movie_news(api_key_gemini: str, api_key_google: str, cse_id: str) -> str:
    """
    Generates movie news and returns it as a JSON string.
    """
    model = setup_gemini(api_key_gemini)
    movie_news = generate_fake_news(model)
    result = []

    for news_item in movie_news:
        try:
            title = news_item.get("title", "")
            # Extract first few words for image search
            search_terms = ' '.join(title.split()[:4])
            image_url = get_image_from_google(api_key_google, cse_id, search_terms)
            
            data = {
                "title": title,
                "content": news_item.get("content", ""),
                "image": image_url
            }
            result.append(data)
            
        except Exception as e:
            print(f"Error processing news item: {e}")
            result.append({
                "title": "Sample Movie News",
                "content": "Sample content",
                "image": "https://via.placeholder.com/300x450"
            })

    return json.dumps(result, indent=2)