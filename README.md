# Package Delivery Simulation Application

## Overview
This application simulates the process of delivering packages to parcel machines. Users can add a package, which will then appear on a map showing its destination parcel machine. A simulated courier, running on a preset time interval, will update the package status automatically. Additionally, users can manually specify the slot in the parcel machine where the package should be placed, triggering an automatic delivery notification.

## Technologies

- **Framework:**  
  - Built using [Next.js](https://nextjs.org/).

- **Real-Time Communication:**  
  - **WebSockets:** For real-time data updates.  
  - **MQTT:** using **Eclipse Mosquitto**

- **HTTP API:**  
  - **POST:** To create new package entries.  
  - **GET:** To retrieve package details and status updates.  
  - **UPDATE:** To modify package status as it progresses through the delivery process.

- **Security:**  
  - **HTTPS:** Certificates are used to enable secure HTTPS communication.  
  - **Password Hashing:** Ensures that user passwords are stored securely.  
  - **JSON Web Tokens:** For authentication and authorization.  
  - **Advanced Cookies:** Used for secure session management.

- **Database:**  
  - Utilizes [PostgreSQL](https://www.postgresql.org/) for data storage.

## Features

- **Package Simulation:**  
  - Add a package and view its destination on an interactive map.  
  - Simulated courier movement based on a preset time interval in the code.  
  - Automatic status updates reflecting the package's journey.

- **Manual Slot Selection:**  
  - Option to manually assign the package to a specific slot in the parcel machine.  
  - Automatic notifications are sent confirming the package delivery once the slot is selected.

## Fotos

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/02b1ed13-f46d-4211-8f0e-b243d83de903" />
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/4a2bc131-f0bd-4868-99d8-f3ef3c370503" />
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/39a2f0b2-b012-4772-962d-78668fbe69a9" />
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/164ef3c8-efa7-4cab-bac6-32db4703d410" />
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/b8aae69e-d0c1-4dd7-a492-2a0f37bba40e" />





