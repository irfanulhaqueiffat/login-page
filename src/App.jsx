
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {

  const [value, setValue] = useState(null);
   useEffect(()=>{fetch('https://fakestoreapi.com/users')
  .then(response => response.json())
  .then(data => console.log(data))},[]) ;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [bgUrl, setBgUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const newErrors = {};
    const messages = [];

    // Required fields
    [
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "confirmPassword",
    ].forEach((key) => {
      if (!form[key] || form[key].toString().trim() === "") {
        newErrors[key] = true;
        messages.push(`${labelFor(key)} is required`);
      }
    });

    // Simple email pattern
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = true;
      messages.push("Email is invalid");
    }

    // Password match
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.password = true;
      newErrors.confirmPassword = true;
      messages.push("Passwords do not match");
    }

    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, messages };
  };

  const labelFor = (key) => {
    switch (key) {
      case "firstName":
        return "First name";
      case "lastName":
        return "Last name";
      case "username":
        return "Username";
      case "email":
        return "Email";
      case "password":
        return "Password";
      case "confirmPassword":
        return "Confirm password";
      default:
        return key;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, messages } = validate();
    if (!valid) {
      setShowSuccess(false);
      // show toast for errors
      toast.error(messages.join(". "));
      return;
    }
    // Simulate successful registration (replace with API call)
    setShowSuccess(true);
    
    // show success toast
    toast.success("Registration successful!");
    // Optionally clear form
    setForm({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  // pick a random unsplash image keyword and set background URL on mount
  useEffect(() => {
    const keywords = [
      "nature",
      "city",
      "mountains",
      "abstract",
      "sunrise",
      "forest",
      "beach",
      "technology",
      "architecture",
    ];
    const pick = keywords[Math.floor(Math.random() * keywords.length)];
    // Unsplash random image URL with keyword, fixed size for performance
    const url = `https://source.unsplash.com/1600x900/?${encodeURIComponent(pick)}`;
    setBgUrl(url);
  }, []);

  return (
    <div className="page" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}}>
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h2>Create an account</h2>

        <div className="row">
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={errors.firstName ? "input invalid" : "input"}
              placeholder="first name"
            />
          </div>

          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={errors.lastName ? "input invalid" : "input"}
              placeholder="last name"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className={errors.username ? "input invalid" : "input"}
            placeholder="user-name"
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input invalid" : "input"}
            placeholder="@mail.com"
          />
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "input invalid" : "input"}
              placeholder="••••••••"
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input invalid" : "input"}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn primary">
            Register
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Registration successful</h3>
            <p>Your account has been created successfully.</p>
            <div className="modalActions">
              <button
                className="btn"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Toast container placed at root so toasts appear */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default App;
