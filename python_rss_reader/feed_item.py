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
    self.origin_title = None
    self.origin_category = None
    self.origin_description = None
    self.origin_link = None
    self.origin_image = None
    self.origin_date = None
    
    self.get_id()
    self.get_title()
    self.get_category()
    self.get_description()
    self.get_link()
    self.get_image()
    self.get_date()
    
    self.inner_rest_url = f"{NODEJS_INNER_REST_URL}/innerapi/create"

  def get_id(self):
    if 'id' in self.post:
      self.origin_id = self.post['id']
    elif 'guid' in self.post:
      self.origin_id = self.post['guid']
    print(f"Origin ID: {self.origin_id}")

  def get_title(self):
    if 'title' in self.post:
      self.origin_title = self.post['title']
    print(f"Origin title: {self.origin_title}")
    
  def get_category(self):
    if 'category' in self.post:
      self.origin_category = self.post['category']
    print(f"Origin category: {self.origin_category}")
    
  def get_description(self):
    if 'description' in self.post:
      self.origin_description = self.post['description']
    print(f"Description: {self.origin_description}")
    
  def get_link(self):
    if 'link' in self.post:
      self.origin_link = self.post['link']
    print(f"Link: {self.origin_link}")
    
  def get_image(self):
    if 'enclosure' in self.post:
      self.origin_image = self.post['enclosure']['url']
    print(f"Image: {self.origin_image}")

  def get_date(self):
    if 'published' in self.post:
      # Step 1: Parse the original date string
      # The format '%a, %d %b %Y %H:%M:%S %z' corresponds to the original format of the string
      # '%a' - Abbreviated weekday name, '%d' - Day of the month, '%b' - Abbreviated month name
      # '%Y' - Year with century, '%H:%M:%S' - Hour, minute, and second, '%z' - UTC offset
      parsed_date = datetime.strptime(self.post['published'], "%a, %d %b %Y %H:%M:%S %z")
      
      # Step 2: Format the parsed date to the desired format 'YYYY-mm-dd H:I:S'
      # Note: There's a small correction in the format specifier for minutes and seconds. It should be '%M' for minutes and '%S' for seconds.
      formatted_date = parsed_date.strftime("%Y-%m-%d %H:%M:%S")
      self.origin_date = formatted_date
    print(f"Date: {self.origin_date}")

  def post_to_inner_rest(self):
    print("Posting to inner REST API...")
    try:
      response = requests.post(self.inner_rest_url, json={
        'origin_id': self.origin_id,
        'origin_name': self.origin_name,
        'title': self.origin_title,
        'category': self.origin_category,
        'description': self.origin_description,
        'url': self.origin_link,
        'image_url': None,
        'date': self.origin_date
      })
      print(response.json())
      return response.json()

    except:
      # print(f"Error: {e}")
      return None

