import pickle


with open('model1.pkl', 'rb') as file:
    model = pickle.load(file)
with open('feature_scaler.pkl', 'rb') as sfile:
    scalar = pickle.load(sfile)
print("Model and Scaler loaded successfully.")

