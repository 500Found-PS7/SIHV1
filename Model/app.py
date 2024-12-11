from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
from model1 import Model  # Assuming your model class is in model1.py

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Initialize the model
model = Model()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from request
        data = request.get_json()
        
        # Validate input data
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        
        # Process input data and make prediction
        # Modify this part according to your model's input requirements
        prediction = model.predict(data)
        
        # Return prediction as JSON
        return jsonify({
            'success': True,
            'prediction': prediction.tolist() if isinstance(prediction, np.ndarray) else prediction
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
