import { initializeApp } from "firebase/app";
import { child, ref, set, get, getDatabase, push } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMKvz4x7WwFIKct-h-bWwxG5KqqzHUyso",
  authDomain: "demosite-a8f2c.firebaseapp.com",
  databaseURL: "https://demosite-a8f2c-default-rtdb.firebaseio.com",
  projectId: "demosite-a8f2c",
  storageBucket: "demosite-a8f2c.firebasestorage.app",
  messagingSenderId: "136636475352",
  appId: "1:136636475352:web:f8a658ce245d7577ce74ad",
  measurementId: "G-PJXK8MZWBH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export function readDB() {
  const dbRef = ref(database);

  // Attempt to read data at the 'home' path
  get(child(dbRef, "home"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Data retrieved:", snapshot.val()); // Log the data from the snapshot
      } else {
        console.log("No data available at 'home'");
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
}

// Call readDB when the page loads
//
window.onload = function () {
  readDB();
};

export function writeToDatabase(
  firstName,
  lastName,
  breed,
  service,
  email,
  phone
) {
  const dbRef = ref(database, "home"); // You can change "home" to another path if needed

  // Write data under the "home" node
  push(dbRef, {
    firstName: firstName,
    lastName: lastName,
    breed: breed,
    service: service,
    email: email,
    phone: phone,
    timestamp: new Date().toISOString(),
  })
    .then(() => {
      console.log("Data written successfully!");
      document.getElementById("message").innerText =
        "Data submitted successfully!";
    })
    .catch((error) => {
      console.error("Error writing data: ", error);
      document.getElementById("message").innerText = `Error: ${error.message}`;
    });
}
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Handle form submission
document
  .getElementById("dataForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get the values from the form
    const fName = document.getElementById("f-name").value;
    const lName = document.getElementById("l-name").value;
    const breed = document.getElementById("breed").value;
    const serviceChoice = document.getElementById("services").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Call the function to write data to Firebase
    writeToDatabase(fName, lName, breed, serviceChoice, email, phone);

    // Clear the form
    document.getElementById("dataForm").reset();

    const msg = {
      to: "ksoup12@gmail.com", // Change to your recipient
      from: "kadecampbelldev@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  });
