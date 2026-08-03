import json
import re

def parse_wkt_polygon(wkt_str):
    # wkt_str looks like: POLYGON ((-1.2821 54.5646, -1.2816 54.5647, ...))
    # or MULTIPOLYGON (((-1.2435 54.7225, ...)), ((-1.2432 ...)))
    wkt_str = wkt_str.strip()
    if wkt_str.startswith("MULTIPOLYGON"):
        inner = wkt_str[len("MULTIPOLYGON"):].strip()
        # remove outermost parens
        if inner.startswith("(") and inner.endswith(")"):
            inner = inner[1:-1].strip()
        
        # Split by top level polygon parts: "), ((" or "), (("
        # Let's find polygon blocks inside MULTIPOLYGON
        polygons = []
        # Find all ((...)) blocks
        poly_matches = re.findall(r'\(\s*\((.*?)\)\s*\)', inner)
        if not poly_matches:
            # fallback
            poly_matches = re.findall(r'\((.*?)\)', inner)
            
        for poly_str in poly_matches:
            rings = []
            # Check for inner rings separated by "), ("
            ring_strs = poly_str.split("), (")
            for ring_s in ring_strs:
                ring_s = ring_s.replace("(", "").replace(")", "").strip()
                coords = []
                for pt in ring_s.split(","):
                    pt = pt.strip()
                    if not pt: continue
                    parts = pt.split()
                    if len(parts) >= 2:
                        lng, lat = float(parts[0]), float(parts[1])
                        coords.append([lng, lat])
                if coords:
                    rings.append(coords)
            if rings:
                polygons.append(rings)
        return "MultiPolygon", polygons

    elif wkt_str.startswith("POLYGON"):
        inner = wkt_str[len("POLYGON"):].strip()
        if inner.startswith("(") and inner.endswith(")"):
            inner = inner[1:-1].strip()
        
        rings = []
        # Rings inside POLYGON are ((ring1), (ring2))
        ring_matches = re.findall(r'\((.*?)\)', inner)
        if not ring_matches:
            ring_matches = [inner]
        for ring_s in ring_matches:
            ring_s = ring_s.replace("(", "").replace(")", "").strip()
            coords = []
            for pt in ring_s.split(","):
                pt = pt.strip()
                if not pt: continue
                parts = pt.split()
                if len(parts) >= 2:
                    lng, lat = float(parts[0]), float(parts[1])
                    coords.append([lng, lat])
            if coords:
                rings.append(coords)
        return "Polygon", rings
    return None, None

yorkshire_codes = {
    "E06000001": ("E06000001", "Hartlepool"),
    "E06000002": ("E06000002", "Middlesbrough"),
    "E06000003": ("E06000003", "Redcar and Cleveland"),
    "E06000004": ("E06000004", "Stockton-on-Tees"),
    "E06000005": ("E06000005", "Darlington"),
    "E06000010": ("E06000010", "Kingston upon Hull"),
    "E06000011": ("E06000011", "East Riding of Yorkshire"),
    "E06000012": ("E06000012", "North East Lincolnshire"),
    "E06000013": ("E06000013", "North Lincolnshire"),
    "E06000014": ("E06000014", "City of York"),
    "E06000065": ("E06000065", "North Yorkshire"),
    "E08000017": ("E08000017", "Doncaster"),
    "E08000018": ("E08000018", "Rotherham"),
    "E08000032": ("E08000032", "Bradford"),
    "E08000033": ("E08000033", "Calderdale"),
    "E08000034": ("E08000034", "Kirklees"),
    "E08000035": ("E08000035", "Leeds"),
    "E08000036": ("E08000036", "Wakefield"),
    "E08000038": ("E08000038", "Barnsley"),
    "E08000039": ("E08000039", "Sheffield")
}

def convert_csv_to_geojson(csv_path, output_path):
    features = []
    import csv
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, None)
        for row in reader:
            if not row or len(row) < 3: continue
            code, name, geom_str = row[0].strip(), row[1].strip(), row[2].strip()
            if code in yorkshire_codes:
                code_val, name_val = yorkshire_codes[code]
                geom_type, coords = parse_wkt_polygon(geom_str)
                if geom_type and coords:
                    feature = {
                        "type": "Feature",
                        "properties": {
                            "LAD24CD": code_val,
                            "LAD24NM": name_val,
                            "LAD22CD": code_val,
                            "LAD22NM": name_val,
                            "name": name_val
                        },
                        "geometry": {
                            "type": geom_type,
                            "coordinates": coords
                        }
                    }
                    features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": features
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f)

    print(f"Saved {len(features)} features to {output_path}")

if __name__ == '__main__':
    convert_csv_to_geojson('attached_data.csv', 'public/yorkshire_local_authorities.json')
