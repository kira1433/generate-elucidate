import json

# Load the JSON data
with open('merged.json', 'r') as file:
    data = json.load(file)

# Initialize an empty list to store the new items
new_items = []

# Iterate through the original data
for item in data:
    # For each solution in the 'solution' array, create a new item
    for solution in item["solution"]:
        new_item = {
            "id": len(new_items)+1,
            "question": item["question"],
            "code": item["code"],
            "solution": solution
        }
        new_items.append(new_item)

# Save the new items to a new JSON file
with open('leetcode_dataset.json', 'w') as output_file:
    json.dump(new_items, output_file, indent=2)
