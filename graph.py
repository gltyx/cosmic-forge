import json
from graphviz import Digraph

# Load data from techdata.json
with open("./resources/techData.json", "r") as file:
    tech_data = json.load(file)

# Initialize the directed graph
dot = Digraph(comment="Tech Relationships", format="png")

# Set global graph attributes
dot.attr("node", style="filled", color="black", fontcolor="white", fillcolor="black", fontname="Arial")

# Add nodes with labels including the price
for key, value in tech_data.items():
    # Get the price
    price = value.get("price", "Unknown")

    # Create the label
    label_parts = [f"<b>{key}</b>", f"Price: {price}"]
    label_html = "<br/>".join(label_parts)
    label = f"<{label_html}>"

    # Add the node with the HTML-like label
    dot.node(key, label=label, shape="box")

# Add edges based on the `appearsAt` field
for key, value in tech_data.items():
    appears_at = value.get("appearsAt", [])
    if appears_at:
        # All elements except the first are treated as prerequisites
        prereqs = appears_at[1:]
        for prereq in prereqs:
            if prereq:  # Only add edges if the prereq exists
                dot.edge(prereq, key)

# Render the graph
output_path = "./resources/graph"
dot.render(output_path)

print(f"Graph generated at {output_path}.png")
