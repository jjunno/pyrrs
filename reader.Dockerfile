FROM python:3.8-slim-buster
WORKDIR /app
ADD ./python_rss_reader /app
ADD ./requirements.txt /app/requirements.txt
# ADD ./.env /app/.env
RUN pip install --no-cache-dir -r requirements.txt

# Expose port outside this container
# but it should not be exposed in the compose file!
# EXPOSE 5000

CMD ["python3", "main.py"]
