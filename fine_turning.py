import pandas as pd
import random
import json

# Load the CSV file
input_file = "Recipes.csv"  # Replace with your file name
output_train_file = "fine_tuning_train.jsonl"  # Output file name for training set (JSONL format)
output_validation_file = "fine_tuning_validation.jsonl"  # Output file name for validation set (JSONL format)

# Read the CSV into a DataFrame
df = pd.read_csv(input_file)

# Sort by Calories and drop the highest-calorie rows if necessary
# Keep a larger portion of the data (90% to start)
df_sorted = df.sort_values('Calories', ascending=True)
df_reduced = df_sorted.head(int(len(df_sorted) * 0.9))  # Keep 90% of the lower-calorie rows

# Ensure balanced representation of diet_type and Cuisine_type
diet_types = df_reduced['Diet_type'].unique()
cuisine_types = df_reduced['Cuisine_type'].unique()

# For each diet_type and Cuisine_type, get a balanced number of examples
balanced_data = []
for diet_type in diet_types:
    for cuisine_type in cuisine_types:
        filtered_data = df_reduced[(df_reduced['Diet_type'] == diet_type) & (df_reduced['Cuisine_type'] == cuisine_type)]
        if not filtered_data.empty:
            # Sample 3 examples from each combination if possible
            sample_size = min(len(filtered_data), 3)
            balanced_data.extend(filtered_data.sample(n=sample_size, random_state=42).to_dict('records'))

# Convert balanced data to a DataFrame
balanced_df = pd.DataFrame(balanced_data)

# Ensure we have at least 2000 samples for training
if len(balanced_df) < 2000:
    # If not enough data, sample from the remaining data
    remaining_data = df_reduced[~df_reduced.index.isin(balanced_df.index)]
    remaining_samples_needed = 2000 - len(balanced_df)
    additional_samples = remaining_data.sample(n=remaining_samples_needed, random_state=42)
    balanced_df = pd.concat([balanced_df, additional_samples])

# Sample 100 entries for the validation set from the remaining data
remaining_data_for_validation = df_reduced[~df_reduced.index.isin(balanced_df.index)]
validation_data = remaining_data_for_validation.sample(n=100, random_state=42)

# Convert balanced training data to fine-tuning format
train_fine_tuning_data = []
for _, row in balanced_df.iterrows():
    message = {
        "messages": [
            {"role": "system", "content": "You are an AI nutritionist who provides personalized daily meal plans and recipe suggestions based on user preferences and health goals."},
            {"role": "user", "content": f"I want a {row['Diet_type']} and {row['Cuisine_type']} meal suggestion, and the calories of it should be {row['Calories']}"},
            {"role": "assistant", "content": f"Here is your {row['Diet_type']} and {row['Cuisine_type']} meal suggestion:\n\n{row['Recipe_name']}\n\nLet me know if you'd like detailed recipes for any of these meals!"}
        ]
    }
    train_fine_tuning_data.append(message)

# Convert validation data to fine-tuning format
validation_fine_tuning_data = []
for _, row in validation_data.iterrows():
    message = {
        "messages": [
            {"role": "system", "content": "You are an AI nutritionist who provides personalized daily meal plans and recipe suggestions based on user preferences and health goals."},
            {"role": "user", "content": f"I want a {row['Diet_type']} and {row['Cuisine_type']} meal suggestion, and the calories of it should be {row['Calories']}"},
            {"role": "assistant", "content": f"Here is your {row['Diet_type']} and {row['Cuisine_type']} meal suggestion:\n\n{row['Recipe_name']}\n\nLet me know if you'd like detailed recipes for any of these meals!"}
        ]
    }
    validation_fine_tuning_data.append(message)

# Save the training dataset to a JSONL file (one JSON object per line)
with open(output_train_file, 'w') as f:
    for data in train_fine_tuning_data:
        json.dump(data, f)
        f.write('\n')

# Save the validation dataset to a JSONL file (one JSON object per line)
with open(output_validation_file, 'w') as f:
    for data in validation_fine_tuning_data:
        json.dump(data, f)
        f.write('\n')

print(f"Fine-tuning dataset for training saved as {output_train_file}")
print(f"Fine-tuning dataset for validation saved as {output_validation_file}")
