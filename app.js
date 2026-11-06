document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("cform");
    const status = document.getElementById("fst");
    const submitBtn = document.getElementById("submitBtn");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (status) {
            status.textContent = "Sending your enquiry...";
            status.className = "status";
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        try {
            const formData = new FormData(form);

            const response = await fetch("contact.php", {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });

            const result = await response.json();

            if (result.ok) {

                if (status) {
                    status.textContent =
                        "Thank you! Your enquiry has been submitted successfully.";
                    status.className = "status success";
                }

                form.reset();

            } else {

                throw new Error(
                    result.message || "Unable to submit the enquiry."
                );
            }

        } catch (error) {

            console.error("Form submission error:", error);

            if (status) {
                status.textContent =
                    "Unable to submit the enquiry right now. Please try again or contact us directly.";
                status.className = "status error";
            }

        } finally {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send enquiry";
            }
        }
    });

});
