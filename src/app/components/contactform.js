import { useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the Formspree endpoint
      const response = await fetch("https://formspree.io/f/xwkdrjke", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // If the email is sent successfully, show the success message
        setSuccessMessage(
          "Thanks for reaching out! I will get back to you as soon as possible."
        );

        // Reset the form fields
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        // Hide the success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 100000);
      } else {
        // Handle the case where sending the email failed
        setErrorMessage(
          "Oops! Something went wrong, please try submitting your message again."
        );
      }
    } catch (error) {
      // Handle any network or other errors here
      setErrorMessage(
        "Oops! Something went wrong, please try submitting your message again."
      );
    }
  };

  return (
    <div className="px-20 lg:mx-48 pt-16">
      <div className="form-container">
        {/* Display success message */}
        {successMessage && (
          <p className="success-message" style={{ margin: "8rem 0" }}>
            {successMessage}
          </p>
        )}

        {/* Hide the form if there is a success message */}
        {!successMessage && (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex-col">
              <div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  labelPlacement="inside"
                  placeholder="Your email *"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="pt-4">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  labelPlacement="inside"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="pt-4">
              <Textarea
                maxRows={5}
                placeholder="Your message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <div className="pt-8">
              <Button
                className={`${
                  formData.email ? "buttonenabled" : "buttondisabled"
                }`}
                variant="flat"
                color="default"
                radius="full"
                type="submit"
              >
                Send
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Display error message below the form */}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}

      <style jsx>{`
        .form-container {
          text-align: center;
        }

        .success-message {
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default ContactForm;
