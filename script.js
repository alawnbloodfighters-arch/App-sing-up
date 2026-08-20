function togglePassword(id, button) {

    const input = document.getElementById(id);

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈";
    } else {
        input.type = "password";
        button.textContent = "👁";
    }
}


document.getElementById("signupForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;


    if (phone.length !== 11) {
        alert("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।");
        return;
    }


    if (password !== confirmPassword) {
        alert("Password এবং Confirm Password একই নয়।");
        return;
    }


    alert("Account creation system এখনো Firebase-এর সাথে যুক্ত করা হয়নি।");

});


function login() {

    alert("Login page পরবর্তী ধাপে তৈরি হবে।");

}
