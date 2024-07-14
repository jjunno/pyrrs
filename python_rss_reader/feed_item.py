class FeedItem:
  def __init__(self, post):
    self.post = post
    self.origin_id = None
    self.origin_title = None
    self.origin_category = None
    self.origin_description = None
    self.origin_link = None
    
    self.get_id()
    self.get_title()
    self.get_category()
    self.get_description()
    self.get_link()

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
