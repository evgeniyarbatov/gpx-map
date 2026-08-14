import json
import sys

import gpxpy
import pandas as pd
from geopy.distance import geodesic
from pyproj import Geod

SAMPLING_INTERVAL_METERS = 300.0


def get_gpx_df(gpx_file):
    with open(gpx_file, "r") as file:
        gpx = gpxpy.parse(file)

    data = []
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                data.append(
                    {
                        "latitude": point.latitude,
                        "longitude": point.longitude,
                    }
                )

    df = pd.DataFrame(data)

    df["prev_latitude"] = df["latitude"].shift(1)
    df["prev_longitude"] = df["longitude"].shift(1)

    df["distance"] = df.apply(
        lambda x: (
            geodesic(
                (x["prev_latitude"], x["prev_longitude"]),
                (x["latitude"], x["longitude"]),
            ).meters
            if not pd.isna(x["prev_latitude"]) and not pd.isna(x["prev_longitude"])
            else 0
        ),
        axis=1,
    )
    df["accumulated_distance"] = df["distance"].cumsum()

    df = df.drop(
        columns=[
            "prev_latitude",
            "prev_longitude",
            "distance",
        ]
    )

    df.rename(columns={"accumulated_distance": "distance"}, inplace=True)

    return df


def get_segment_info(segment):
    mid = len(segment) // 2

    geod = Geod(ellps="WGS84")
    fwd_azimuth, _, _ = geod.inv(
        segment[0][1],
        segment[0][0],
        segment[mid][1],
        segment[mid][0],
    )

    return segment[0][0], segment[0][1], fwd_azimuth


def segment_gpx(gpx_file, output_file):
    df = get_gpx_df(gpx_file)

    segments, current_segment = [], []
    distance, distance_counter = 0, 0

    for _, row in df.iterrows():
        current_segment.append((row["latitude"], row["longitude"]))
        current_distance_count = row["distance"] // SAMPLING_INTERVAL_METERS

        if current_distance_count > distance_counter:
            distance = round(row["distance"] / 1000.0, 2)
            segments.append((current_segment, distance))

            current_segment = []
            distance_counter = current_distance_count

    if current_segment:
        segments.append((current_segment, distance))

    points = [(get_segment_info(segment[0]), segment[1]) for segment in segments]

    data = []
    for idx, ((lat, lon, fwd_azimuth), distance) in enumerate(points, start=1):
        data.append(
            {
                "name": f"img{idx:04}",
                "lat": lat,
                "lon": lon,
                "azimuth": -fwd_azimuth,
                "distance": distance,
            }
        )

    with open(output_file, "w") as f:
        json.dump(data, f, indent=4)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <gpx> <output.json>", file=sys.stderr)
        sys.exit(2)
    segment_gpx(sys.argv[1], sys.argv[2])
