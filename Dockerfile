FROM manimcommunity/manim:stable


# Install additional dependencies
RUN pip install boto3 redis requests python-dotenv

RUN mkdir -p /app/render/output && chmod -R 777 /app/render

# Set workdir
WORKDIR /app

# Copy your worker script
COPY . .

# Default command
CMD ["python", "main.py"]
