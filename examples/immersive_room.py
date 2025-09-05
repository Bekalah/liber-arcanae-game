import os
import math
import numpy as np
import pygame

# Use a headless video driver if no display is available
os.environ.setdefault("SDL_VIDEODRIVER", "dummy")

# Initialize pygame modules and audio
pygame.init()
pygame.mixer.init(frequency=44100)

# Screen dimensions for the exploratory room
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Immersive Creative Room")

# Create a simple gradient background representing wall art
background = pygame.Surface((WIDTH, HEIGHT))
for y in range(HEIGHT):
    color = (y * 255 // HEIGHT, 0, 128)
    pygame.draw.line(background, color, (0, y), (WIDTH, y))

# Generate a looping sine wave tone as placeholder music
sample_rate = 44100
seconds = 2
samples = np.linspace(0, seconds, int(sample_rate * seconds), False)
tone = (np.sin(2 * math.pi * 440 * samples) * 32767).astype(np.int16)
sound = pygame.sndarray.make_sound(tone)
sound.play(-1)

# Avatar starting position
x, y = WIDTH // 2, HEIGHT // 2
clock = pygame.time.Clock()
frames = 0
running = True

# Main exploration loop (auto-exits after ~2 seconds)
while running and frames < 120:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        x -= 5
    if keys[pygame.K_RIGHT]:
        x += 5
    if keys[pygame.K_UP]:
        y -= 5
    if keys[pygame.K_DOWN]:
        y += 5

    screen.blit(background, (0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (x, y), 10)
    pygame.display.flip()
    clock.tick(60)
    frames += 1

pygame.quit()
