import json
from graphviz import Digraph

# Paths to the JSON files
tech_data_path = "./resources/techData.json"
unlock_data_path = "./resources/unlockData.json"

# Load data from the JSON files
with open(tech_data_path, "r") as tech_file:
    tech_data = json.load(tech_file)

with open(unlock_data_path, "r") as unlock_file:
    unlock_data = json.load(unlock_file)

# Initialize the directed graph
dot = Digraph(comment="Tech Relationships", format="png")

# Set global graph attributes
dot.attr("node", style="filled", color="black", fontcolor="white", fillcolor="black", fontname="Arial")

# Add nodes with labels including the price and unlock data
for key, value in tech_data.items():
    # Get the price and unlock data
    price = value.get("price", "Unknown")  # Price from techData.json
    unlock_values = unlock_data.get(key, ["", "", ""])  # Unlock data from unlockData.json

    # Filter out empty strings from unlock values
    unlock_text = ", ".join(filter(lambda x: x != "", unlock_values))

    # Combine all information for the label with lime green color for unlock text
    label_parts = [f"<b>{key}</b>", f"Price: {price}"]
    if unlock_text:
        label_parts.append(f'<font color="limegreen">{unlock_text}</font>')

    # Join the label parts with <br/> for HTML-like formatting
    label_html = "<br/>".join(label_parts)

    # Wrap the label in << ... >> for Graphviz to interpret it as HTML
    label = f"<{label_html}>"

    # Add the node with the HTML-like label
    dot.node(key, label=label, shape="box")

# Add edges based on the `appearsAt` field
for key, value in tech_data.items():
    appears_at = value.get("appearsAt", [])
    if len(appears_at) > 1:
        # First prerequisite
        prerequisite1 = appears_at[1]
        if prerequisite1 and prerequisite1 != "":
            dot.edge(prerequisite1, key)  # Draw an edge from prerequisite1 to the current tech
        
        # Second prerequisite (if present)
        if len(appears_at) > 2:
            prerequisite2 = appears_at[2]
            if prerequisite2 and prerequisite2 != "":
                dot.edge(prerequisite2, key)  # Draw an edge from prerequisite2 to the current tech

# Render the graph
output_path = "./resources/graph"
dot.render(output_path)

print(f"Graph generated at {output_path}.png")
