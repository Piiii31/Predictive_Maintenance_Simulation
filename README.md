# Predictive Maintenance Simulation Interface

This repository contains a user-friendly web interface for the Predictive Maintenance Simulation API. Built with **Next.js**, **NextUI**, and **Zustand**, the interface allows users to interact with the API seamlessly and visualize predictive maintenance results.

## Features

- **Modern Web Framework**: Developed using **Next.js** for server-side rendering and fast performance.
- **UI Components**: Styled with **NextUI** for a clean and responsive design.
- **State Management**: Utilizes **Zustand** for efficient and scalable state management.
- **API Integration**: Connects directly to the Predictive Maintenance Simulation API.
- **Interactive User Experience**: Provides a user-friendly interface to input year and quarter, fetch data, and view results in a tabular format.

## Requirements

- Node.js (>= 14.x)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Predictive_Maintenance_Simulation_Interface.git
   cd Predictive_Maintenance_Simulation_Interface
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the API endpoint in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
   ```

4. Here is the URL of the Flask API repository: [Predictive Maintenance Simulation API](https://github.com/Piiii31/Predictive_Maintenance_Simulation_API)

## Usage

1. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`.

2. Open the interface in your browser and enter the desired year and quarter (e.g., 2017 Q1) to analyze the data.

## API Integration

The interface interacts with the Predictive Maintenance Simulation API at the `/analyze` endpoint. Users can input a year and quarter to fetch data and view the results in a tabular format.

### Example Workflow

1. Input the year and quarter in the form.
2. Submit the request to fetch hard drive data.
3. View the list of 50 drives with their status (Normal or Anomalous).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- **Next.js** for the web framework.
- **NextUI** for the beautiful UI components.
- **Zustand** for state management.

This README provides an overview of the interface project. For more details, refer to the code and comments in the repository.
