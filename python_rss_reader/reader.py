import feedparser

class Reader:
  def __init__(self, url):
    self.url = url
    self.feed = None
    self.entries = None

  def read(self):
    self.feed = feedparser.parse(self.url)['feed']
    self.entries = feedparser.parse(self.url)['entries']
    return None

