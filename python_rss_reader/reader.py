import feedparser

class Reader:
  def __init__(self, url):
    self.url = url
    self.feed = None
    self.entries = None

  # Read RRS feed and set self
  def read(self):
    print(f"Reading RRS feed from {self.url}")
    self.feed = feedparser.parse(self.url)['feed']
    self.entries = feedparser.parse(self.url)['entries']
    print(f"Found feed: {self.feed.title} with {len(self.entries)} entries.")
    return None

