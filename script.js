/* =====================================
   NIRA - JAVASCRIPT
===================================== */


/* =====================================
   GLOBAL DATA
===================================== */

let patient = {
    name: "",
    id: "",
    symptoms: "",
    files: []
};

let symptomEntered = false;



/* =====================================
   PAGE NAVIGATION
===================================== */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });


    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}



/* =====================================
   PAGE 1 - PATIENT LOGIN
===================================== */

function patientLogin() {

    const nameInput = document.getElementById("patientName");
    const idInput = document.getElementById("patientId");

    const name = nameInput.value.trim();
    const id = idInput.value.trim();


    if (name === "" || id === "") {

        alert("Please enter both Patient Name and Patient ID.");

        return;
    }


    patient.name = name;
    patient.id = id;


    document.getElementById("assessmentPatientName").textContent =
        patient.name;


    showPage("consentScreen");
}



/* =====================================
   PAGE 2 - CONSENT
===================================== */

function acceptConsent() {

    const checkbox =
        document.getElementById("consentCheckbox");


    if (!checkbox.checked) {

        alert(
            "Please read and accept the consent before continuing."
        );

        return;
    }


    showPage("assessmentScreen");
}



function goHome() {

    showPage("homeScreen");
}



/* =====================================
   PAGE 3 - VOICE INPUT
===================================== */

function startAssessmentVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice recognition is not supported in this browser. Please use the Type Symptoms option."
        );

        return;
    }


    const recognition = new SpeechRecognition();


    recognition.lang = "en-IN";

    recognition.interimResults = false;

    recognition.continuous = false;


    const status =
        document.getElementById("voiceStatus");


    status.textContent =
        "Listening... Please speak clearly.";


    recognition.start();


    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;


        patient.symptoms = transcript;

        symptomEntered = true;


        status.textContent =
            "✓ Voice response saved.";


        alert(
            "NIRA heard:\n\n" + transcript
        );
    };


    recognition.onerror = function() {

        status.textContent =
            "Voice input could not be completed.";

        alert(
            "We couldn't capture your voice. Please try again or type your symptoms."
        );
    };


    recognition.onend = function() {

        if (!symptomEntered) {

            status.textContent =
                "Voice input ended.";
        }
    };
}



/* =====================================
   TEXT INPUT
===================================== */

function openAssessmentText() {

    document
        .getElementById("textModal")
        .classList.add("show");

}



function closeAssessmentText() {

    document
        .getElementById("textModal")
        .classList.remove("show");

}



function submitAssessmentText() {

    const text =
        document
            .getElementById("symptomText")
            .value
            .trim();


    if (text === "") {

        alert("Please enter your symptoms first.");

        return;
    }


    patient.symptoms = text;

    symptomEntered = true;


    closeAssessmentText();


    alert(
        "Your symptoms have been saved successfully."
    );
}



/* =====================================
   FILE UPLOAD
===================================== */

function handleFiles() {

    const fileInput =
        document.getElementById("medicalFiles");


    const fileList =
        document.getElementById("fileList");


    patient.files =
        Array.from(fileInput.files);


    fileList.innerHTML = "";


    if (patient.files.length === 0) {

        fileList.innerHTML =
            '<p class="empty-message">No records uploaded yet.</p>';

        return;
    }


    patient.files.forEach(function(file) {

        const fileItem =
            document.createElement("div");


        fileItem.className = "file-item";


        fileItem.innerHTML =
            "📄 " + file.name;


        fileList.appendChild(fileItem);

    });

}



/* =====================================
   START AI PROCESSING
===================================== */

function startProcessing() {

    document.getElementById("resultPatientName")
        .textContent = patient.name;


    document.getElementById("resultPatientId")
        .textContent = patient.id;


    document.getElementById("aiResults")
        .classList.remove("show");


    showPage("processingScreen");


    resetProcessingItems();


    startAIProcessing();
}



/* =====================================
   RESET PROCESSING
===================================== */

function resetProcessingItems() {

    for (let i = 1; i <= 4; i++) {

        const item =
            document.getElementById("process" + i);


        item.classList.remove("completed");


        item.querySelector(".process-icon")
            .textContent = "◌";


        item.querySelector(".process-status")
            .textContent = "Waiting";
    }
}



/* =====================================
   AI PROCESSING ANIMATION
===================================== */

function startAIProcessing() {

    let currentStep = 1;


    const interval =
        setInterval(function() {

            const item =
                document.getElementById(
                    "process" + currentStep
                );


            if (item) {

                item.classList.add("completed");


                item.querySelector(".process-icon")
                    .textContent = "✓";


                item.querySelector(".process-status")
                    .textContent = "Complete";
            }


            currentStep++;


            if (currentStep > 4) {

                clearInterval(interval);


                setTimeout(function() {

                    showAIResults();

                }, 700);
            }


        }, 1000);
}



/* =====================================
   SHOW AI RESULTS
===================================== */

function showAIResults() {

    const results =
        document.getElementById("aiResults");


    const message =
        document.getElementById("resultMessage");


    let messageText =
        "NIRA has organized the information provided during your intake.";


    if (symptomEntered && patient.files.length > 0) {

        messageText =
            "NIRA received your symptom information and " +
            patient.files.length +
            " medical record(s). The information has been organized for healthcare professional review.";

    }

    else if (symptomEntered) {

        messageText =
            "NIRA received your symptom information and organized it into your patient intake.";

    }

    else if (patient.files.length > 0) {

        messageText =
            "NIRA received " +
            patient.files.length +
            " medical record(s) and added them to your intake.";

    }

    else {

        messageText =
            "Only your basic patient information was provided. You can add symptoms and medical records for a more complete intake.";

    }


    message.textContent = messageText;


    results.classList.add("show");
}



/* =====================================
   PAGE 5 - SUMMARY
===================================== */

function showSummary() {

    document.getElementById("summaryPatientName")
        .textContent = patient.name;


    document.getElementById("summaryPatientId")
        .textContent = patient.id;


    /* Symptoms */

    const symptomBox =
        document.getElementById("summarySymptoms");


    if (patient.symptoms !== "") {

        symptomBox.textContent =
            patient.symptoms;

    } else {

        symptomBox.textContent =
            "No symptoms were entered during the intake.";
    }



    /* Documents */

    const documentBox =
        document.getElementById("summaryDocuments");


    if (patient.files.length > 0) {

        documentBox.innerHTML = "";


        patient.files.forEach(function(file) {

            const div =
                document.createElement("div");


            div.className = "file-item";


            div.textContent =
                "📄 " + file.name;


            documentBox.appendChild(div);

        });

    } else {

        documentBox.textContent =
            "No medical documents were uploaded.";
    }



    /* Medicines */

    const medicineList =
        document.getElementById("medicineList");


    if (patient.files.length > 0) {

        medicineList.innerHTML = `

            <div class="medicine-placeholder">

                📋 Medicine information may be present in
                uploaded records.

                <br><br>

                <b>
                    Please have a healthcare professional
                    verify all medicines, dosages and instructions.
                </b>

            </div>

        `;

    } else {

        medicineList.innerHTML = `

            <div class="medicine-placeholder">

                No medicine information was provided.

            </div>

        `;
    }


    showPage("summaryScreen");
}



/* =====================================
   START NEW PATIENT
===================================== */

function startNewPatient() {

    patient = {
        name: "",
        id: "",
        symptoms: "",
        files: []
    };


    symptomEntered = false;


    document.getElementById("patientName")
        .value = "";


    document.getElementById("patientId")
        .value = "";


    document.getElementById("symptomText")
        .value = "";


    document.getElementById("medicalFiles")
        .value = "";


    document.getElementById("fileList")
        .innerHTML =
        '<p class="empty-message">No records uploaded yet.</p>';


    document.getElementById("consentCheckbox")
        .checked = false;


    document.getElementById("voiceStatus")
        .textContent =
        "Voice input available in supported browsers.";


    showPage("homeScreen");
}