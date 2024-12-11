from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
import pickle

import numpy as np
import pandas as pd


testing_data=pd.read_csv('./final_test.csv')
testing_data["datetime"]=pd.to_datetime(testing_data["datetime"])
testing_data.set_index("datetime",inplace=True)

def create_input_sequences(mydata, scaler, sequence_length=24):
    """
    Create input sequences for a model from scaled data.

    Parameters:
    - mydata (pd.DataFrame): The input data containing features and datetime index.
    - scaler (sklearn.preprocessing object): The scaler used to normalize the data.
    - sequence_length (int): The length of each input sequence.

    Returns:
    - X_sequences (np.ndarray): The array of input sequences for the model.
    """
    # Ensure the datetime column is the index
    if not isinstance(mydata.index, pd.DatetimeIndex):
        raise ValueError("The data must have a datetime index.")

    # Ensure filtered data matches scaler's expected features
    if not set(scaler.feature_names_in_).issubset(mydata.columns):
        raise ValueError("The data contains unexpected features not seen during training.")

    mydata = mydata[scaler.feature_names_in_]

    # Scale the data
    scaled_data = scaler.transform(mydata)

    # Create sequences
    X_sequences = []

    for i in range(len(scaled_data) - sequence_length + 1):
        X_sequences.append(scaled_data[i:i + sequence_length])

    # Convert to NumPy array
    X_sequences = np.array(X_sequences)

    return X_sequences

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Load the model from pickle file
try:
    
    with open('model1.pkl', 'rb') as file:
        model = pickle.load(file)
    
    with open('feature_scaler.pkl', 'rb') as sfile:
        scalar = pickle.load(sfile)
        
except Exception as e:
    model = None
    print(f"Error loading model or scaler")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("Received a request to the /predict endpoint.")

        # Check if model is loaded
        if model is None:
            print("Error: Model not loaded properly.")
            return jsonify({'error': 'Model not loaded properly'}), 500

        # Get input data from request
        data = request.get_json()
        print(f"Input data received: {data}")

        # # Validate input data
        # if not data or 'input' not in data:
        #     print("Error: No input data provided.")
        #     return jsonify({'error': 'No input data provided'}), 400

        # Convert input data to appropriate format
        try:
            print("Creating input sequences...")
            input_data = create_input_sequences(testing_data, scalar, 24)
            print("Input sequences created successfully.")

            print("Making predictions...")
            prediction = model.predict(input_data)
            print(f"Prediction: {prediction}")

            # Return prediction as JSON
            return jsonify({
                'success': True,
                'prediction': prediction.tolist() if isinstance(prediction, np.ndarray) else prediction
            })
        except Exception as e:
            print(f"Error processing input: {str(e)}")
            return jsonify({'error': f'Error processing input: {str(e)}'}), 400

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
