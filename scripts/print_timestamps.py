import json
import sys

FRAME_INTERVAL_SECONDS = 3


def seconds_to_hms(seconds):
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return f"{int(h):02}:{int(m):02}:{int(s):02}"


def print_timestamps(data_file):
    with open(data_file, "r") as file:
        data = json.load(file)

    for i, entry in enumerate(data):
        timestamp = seconds_to_hms(i * FRAME_INTERVAL_SECONDS)
        if i == 0:
            print(f"{timestamp} - 0km")
        elif i % 5 == 0:
            print(f"{timestamp} - {entry['distance']}km")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <data.json>", file=sys.stderr)
        sys.exit(2)
    print_timestamps(sys.argv[1])
