import pandas as pd

# Load the CSV file
input_file = "All_Diets.csv"  # Replace with your file name
output_file = "Recipes.csv"  # Output file name

# Read the CSV into a DataFrame
df = pd.read_csv(input_file)

# Function to calculate calories
def calculate_calories(protein, carbs, fat):
    return (protein * 4) + (carbs * 4) + (fat * 9)

# Apply the function to calculate calories for each row
df['Calories'] = df.apply(
    lambda row: calculate_calories(row['Protein(g)'], row['Carbs(g)'], row['Fat(g)']),
    axis=1
)

# Reorder columns to place Calories after Fat(g)
columns = list(df.columns)
fat_index = columns.index("Fat(g)")
columns.insert(fat_index + 1, columns.pop(columns.index("Calories")))
df = df[columns]

# Save the updated DataFrame to a new CSV file
df.to_csv(output_file, index=False)

print(f"Updated file saved as {output_file}")

{
  "messages": [
    {"role": "system", "content": "You are an AI nutritionist who provides personalized daily meal plans and recipe suggestions based on user preferences and health goals."},
    {"role": "user", "content": "I want a {diet_type} and {Cuisine_type} meal suggestion, and the carolries of it should be {Calories}"},
    {"role": "assistant", "content": "Here is your {diet_type} and {Cuisine_type} meal suggestion:\n\n{Recipe_name}\n\nLunch: Grilled tempeh salad with mixed greens, cherry tomatoes, cucumber, and a lemon-tahini dressing.\n\nSnack: Roasted chickpeas with paprika.\n\nDinner: Stuffed bell peppers with quinoa, black beans, and diced vegetables, topped with a cashew cream sauce.\n\nLet me know if you'd like detailed recipes for any of these meals!"}
  ]
}
