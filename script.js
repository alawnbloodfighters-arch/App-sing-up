// Firebase SDK
import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    runTransaction
} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ===============================
// Firebase Configuration
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyAR3uyMlvGNwZaG_w1zs6IKQ2lXB_Y_9M0",
    authDomain: "al-awn-blood-fighters.firebaseapp.com",
    projectId: "al-awn-blood-fighters",
    storageBucket: "al-awn-blood-fighters.firebasestorage.app",
    messagingSenderId: "299061496611",
    appId: "1:299061496611:web:4762f74dbf311cd57f1a96",
    measurementId: "G-D31EXKJWQ3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// ===============================
// Password Show / Hide
// ===============================

window.togglePassword = function (id, button) {

    const input = document.getElementById(id);

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈";
    } else {
        input.type = "password";
        button.textContent = "👁";
    }
};


// ===============================
// Create AABF ID
// ===============================

async function createAABFID() {

    const counterRef = ref(db, "system/userCounter");

    const result = await runTransaction(counterRef, (currentValue) => {

        if (currentValue === null) {
            return 1;
        }

        return currentValue + 1;
    });

    if (!result.committed) {
        throw new Error("User ID তৈরি করা যায়নি।");
    }

    const number = result.snapshot.val();

    return "AABF" + String(number).padStart(5, "0");
}


// ===============================
// Sign Up
// ===============================

document.getElementById("signupForm").addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Name validation
        if (name.length < 2) {
            alert("সঠিক নাম দিন।");
            return;
        }


        // Bangladesh mobile validation
        const phonePattern = /^01[3-9]\d{8}$/;

        if (!phonePattern.test(phone)) {
            alert("সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।");
            return;
        }


        // Password validation
        if (password.length < 6) {
            alert("Password কমপক্ষে ৬ অক্ষরের হতে হবে।");
            return;
        }


        // Confirm password
        if (password !== confirmPassword) {
            alert("Password এবং Confirm Password একই নয়।");
            return;
        }


        const button =
            document.querySelector(".signup-btn");

        button.disabled = true;
        button.textContent = "Creating Account...";


        try {

            // Internal email identifier
            const internalEmail =
                phone + "@aabf-user.app";


            // Firebase account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    internalEmail,
                    password
                );


            const user = userCredential.user;


            // Automatic AABF ID
            const aabfID =
                await createAABFID();


            // Save user profile
            await set(
                ref(db, "users/" + user.uid),
                {
                    uid: user.uid,
                    aabfID: aabfID,
                    name: name,
                    phone: phone,
                    createdAt: Date.now()
                }
            );


            // Show success
            alert(
                "🎉 Account সফলভাবে তৈরি হয়েছে!\n\n" +
                "আপনার AABF ID:\n" +
                aabfID
            );


            // Reset form
            document.getElementById("signupForm").reset();


            button.disabled = false;
            button.textContent = "Create Account";


        } catch (error) {

            console.error(error);

            let message =
                "Account তৈরি করা যায়নি। আবার চেষ্টা করুন।";


            if (error.code === "auth/email-already-in-use") {
                message =
                    "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে Account তৈরি আছে।";
            }

            else if (error.code === "auth/weak-password") {
                message =
                    "Password আরও শক্তিশালী দিন।";
            }

            else if (error.code === "auth/invalid-api-key") {
                message =
                    "Firebase configuration সঠিক নয়।";
            }

            else if (error.code === "auth/network-request-failed") {
                message =
                    "Internet connection পরীক্ষা করুন।";
            }


            alert(message);


            button.disabled = false;
            button.textContent = "Create Account";
        }

    }
);


// ===============================
// Login
// ===============================

window.login = function () {

    alert("Login system পরবর্তী ধাপে তৈরি হবে।");

};
