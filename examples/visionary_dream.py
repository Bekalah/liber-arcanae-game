import argparse
import math
import random
from datetime import datetime
import struct
import wave

from PIL import Image, ImageDraw


def generate_tone(filename, duration=2.0, freq=440.0, sample_rate=44100):
    """Create a simple sine-wave tone and save it as a WAV file."""
    n_samples = int(sample_rate * duration)
    amplitude = 32767
    with wave.open(filename, "w") as wav_file:
        wav_file.setparams((1, 2, sample_rate, n_samples, "NONE", "not compressed"))
        for i in range(n_samples):
            value = int(amplitude * math.sin(2 * math.pi * freq * i / sample_rate))
            wav_file.writeframes(struct.pack("<h", value))


def create_visionary_room(room_name: str, width: int = 1920, height: int = 1080) -> None:
    """Generate an immersive visionary art room and matching audio."""
    # Create base image with black background
    canvas = Image.new("RGB", (width, height), "black")
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
    center = (width // 2, height // 2)
    max_radius = int(math.hypot(width, height) / 2)
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
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        color = random.choice(palette)
        draw.ellipse([x, y, x + 3, y + 3], fill=color)

    # Timestamped filenames prevent overwriting
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    image_name = f"Visionary_Dream_{room_name}_{timestamp}.png"
    audio_name = f"Visionary_Audio_{room_name}_{timestamp}.wav"

    # Save the final visionary artifacts
    canvas.save(image_name)
    generate_tone(audio_name, freq=220 + random.randint(0, 220))

    print(f"Created room {room_name}: {image_name} & {audio_name}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate immersive visionary art rooms.")
    parser.add_argument("--rooms", type=int, default=1, help="Number of rooms to create.")
    args = parser.parse_args()

    for i in range(1, args.rooms + 1):
        create_visionary_room(f"room{i}")

