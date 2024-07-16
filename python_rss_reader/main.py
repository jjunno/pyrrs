import time
from dotenv import load_dotenv
import os

import reader
import feed_item

# Either .env for development or .env_yle (host, .env in container)
load_dotenv()

MAIN_INTERVAL_SECONDS = int(os.getenv('MAIN_INTERVAL_SECONDS'))
FEED_URL = os.getenv('FEED_URL')

def main():
  print("Initiating main!")
  
  if FEED_URL is None:
    print("No feed URL provided.")
    return None
  
  print(f"Feed URL: {FEED_URL}")
  
  if MAIN_INTERVAL_SECONDS is None:
    print("No interval provided.")
    return None
  
  #
  # .env should be fine
  #
  
  # Read the feed
  feed = reader.Reader(FEED_URL)
  feed.read()
  
  if feed.feed is None:
    print("No feed found.")
    return None
  for post in feed.entries:
    item = feed_item.FeedItem(feed.feed.title, post)
    item.post_to_inner_rest()
    # print(post.keys())
  return None

if __name__ == "__main__":
  main()
  # while True:
  #   main()
  #   time.sleep(MAIN_INTERVAL_SECONDS)
