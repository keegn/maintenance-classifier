# Maintenance Classifier App

This is a Next.js application designed to evaluate the performance of various AI models in classifying maintenance requests as emergencies or non-emergencies. The app uses pre-classified data from a CSV file to test models like OpenAI, Anthropic, Google, and Mistral.

## Purpose

The primary goal of this app is to assess the accuracy of AI models in identifying emergency maintenance requests. The data used for testing is pre-classified, meaning each request is already labeled as either an emergency or non-emergency in the CSV file. This classification serves as the "ground truth" for evaluating the models.

### Key Features

- **CSV Structure**: The app reads from a CSV file (`generated_maintenance_requests.csv`) with two columns: "Emergency Requests" and "Non-Emergency Requests".
- **Model Testing**: It tests AI models on their ability to correctly classify requests.
- **Performance Metrics**: Calculates true positives, false positives, true negatives, and false negatives to measure model performance.

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd maintenance-classifier-app
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add your API keys for each model:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   GOOGLE_API_KEY=your_google_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   ```

4. **Run the development server**:

   ```bash
   pnpm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

- Select an AI model from the dropdown.
- Adjust the temperature and prompt settings as needed.
- Click "Process CSV" to evaluate the model's performance.
- View the results, including performance metrics and any misclassified requests.

## Learn More

For more information on Next.js, visit the [Next.js Documentation](https://nextjs.org/docs).
