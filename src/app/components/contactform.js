import { useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isAnimationVisible, setIsAnimationVisible] = useState(false);
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
      const response = await fetch('https://formspree.io/f/xwkdrjke', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // If the email is sent successfully, show the success message and animation
        setIsAnimationVisible(true);
        setSuccessMessage("Thanks for reaching out! I will get back to you as soon as possible.");

        // Reset the form fields
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        // Hide the animation and success message after 5 seconds
        setTimeout(() => {
          setIsAnimationVisible(false);
          setSuccessMessage("");
        }, 500000);
      } else {
        // Handle the case where sending the email failed
        setErrorMessage("Oops! Something went wrong, please try submitting your message again.");
      }
    } catch (error) {
      // Handle any network or other errors here
      console.error('An error occurred:', error);
      setErrorMessage("Oops! Something went wrong, please try submitting your message again.");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col pt-20" style={{ minWidth: "75%" }}>
      {/* Display the animation on top */}
      {isAnimationVisible && (
        <div className="mb-4">
          <iframe
            style={{ border: "none", width: "350px", height: "350px" }}
            src="https://rive.app/s/D6VZao6wok2LZqzVqKrTDQ/embed"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Display success message */}
      {successMessage && <p>{successMessage}</p>}

      {/* Hide the form if the animation is visible */}
      {!isAnimationVisible && !successMessage && (
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-4">
            <div>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                labelPlacement="inside"
                placeholder="Your name *"
              />
            </div>
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
          </div>

          <div className="pt-4">
            <Textarea
              maxRows={5}
              placeholder="Your message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              fullWidth="true"
            />
          </div>
          <div className="pt-4">
            <Button variant="flat" color="default" radius="full" type="submit">
              Send
            </Button>
          </div>
        </form>
      )}

      {/* Display error message below the form */}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default ContactForm;
