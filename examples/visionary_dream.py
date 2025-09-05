import math
import random
from PIL import Image, ImageDraw

# Set canvas dimensions (1920x1080)
WIDTH, HEIGHT = 1920, 1080

# Create base image with black background
canvas = Image.new('RGB', (WIDTH, HEIGHT), 'black')
draw = ImageDraw.Draw(canvas)

# Define a vibrant, Alex Grey-inspired color palette
palette = [
    (72, 61, 139),   # DarkSlateBlue
    (138, 43, 226),  # BlueViolet
    (255, 140, 0),   # DarkOrange
    (0, 206, 209),   # DarkTurquoise
    (255, 20, 147)   # DeepPink
]

# Draw concentric radial patterns
center = (WIDTH // 2, HEIGHT // 2)
max_radius = int(math.hypot(WIDTH, HEIGHT) / 2)
for radius in range(20, max_radius, 15):
    color = random.choice(palette)
    bbox = [
        center[0] - radius,
        center[1] - radius,
        center[0] + radius,
        center[1] + radius
    ]
    draw.ellipse(bbox, outline=color, width=2)

# Generate symmetrical arc patterns
for i in range(60):
    color = palette[i % len(palette)]
    angle = i * (math.pi / 30)
    x = center[0] + int(math.cos(angle) * max_radius)
    y = center[1] + int(math.sin(angle) * max_radius)
    draw.line([center, (x, y)], fill=color, width=2)

# Add random luminescent points
for _ in range(300):
    x = random.randint(0, WIDTH - 1)
    y = random.randint(0, HEIGHT - 1)
    color = random.choice(palette)
    draw.ellipse([x, y, x + 3, y + 3], fill=color)

# Save the final visionary art piece
canvas.save('Visionary_Dream.png')
