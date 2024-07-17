import requests
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()
NODEJS_INNER_REST_URL = os.getenv('NODEJS_INNER_REST_URL')

class FeedItem:
  def __init__(self, origin, post):
    self.origin_name = origin
    self.post = post
    
    self.origin_id = None
    self.title = None
    self.category = None
    self.description = None
    self.link = None
    
    self.get_id()
    self.get_title()
    self.get_category()
    self.get_description()
    self.get_link()
    
    self.inner_rest_url = f"{NODEJS_INNER_REST_URL}/innerapi/create"

  # Get origin ID from post
  def get_id(self):
    if 'id' in self.post:
      self.origin_id = self.post['id']
    elif 'guid' in self.post:
      self.origin_id = self.post['guid']
    print(f"Found origin ID: {self.origin_id}")

  # Get origin title from post
  def get_title(self):
    if 'title' in self.post:
      self.title = self.post['title']
    # print(f"Origin title: {self.title}")
  
  # Get origin category from post
  def get_category(self):
    if 'category' in self.post:
      self.category = self.post['category']
    # print(f"Origin category: {self.category}")
  
  # Get origin description from post
  def get_description(self):
    if 'description' in self.post:
      self.description = self.post['description']
    # print(f"Description: {self.description}")
  
  # Get origin link from post
  def get_link(self):
    if 'link' in self.post:
      self.link = self.post['link']
    # print(f"Link: {self.link}")

  # Post to inner REST API
  def post_to_inner_rest(self):
    print(f"Posting {self.origin_id} to inner REST API...")
    try:
      response = requests.post(self.inner_rest_url, json={
        'originId': self.origin_id,
        'originName': self.origin_name,
        'title': self.title,
        'category': self.category,
        'description': self.description,
        'url': self.link,
      })
      if response.status_code != 200:
        print(f"Inner REST API returned error code {response.status_code} (200 would be silent).")
        return None
      # print(response.json())
      return response.json()

    except:
      # print(f"Error: {e}")
      print("Error: Could not post to inner REST API.")
      return None

