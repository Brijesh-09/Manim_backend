FROM manimcommunity/manim:stable


# Install additional dependencies
RUN pip install boto3 redis requests python-dotenv


# Set workdir
WORKDIR /app

# Copy your worker script
COPY . .

# Default command
CMD ["python", "main.py"]
