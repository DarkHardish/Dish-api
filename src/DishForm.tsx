import { useState } from "react";

const DishForm = () => {
  const [name, setName] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [type, setType] = useState("");
  const [noOfSlices, setNoOfSlices] = useState("");
  const [diameter, setDiameter] = useState("");
  const [spicinessScale, setSpicinessScale] = useState("");
  const [slicesOfBread, setSlicesOfBread] = useState("");
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = {
      name,
      preparation_time: preparationTime,
      type,
      no_of_slices: parseInt(noOfSlices, 10),
      diameter: parseFloat(diameter),
      spiciness_scale: parseInt(spicinessScale, 10),
      slices_of_bread: parseInt(slicesOfBread, 10),
    };

    //Validation
    const validationErrors: Record<string, string> = {};
    if (!name) validationErrors.name = "Name is required.";

    if (!preparationTime)
      validationErrors.preparationTime = "Preparation time is required.";

    if (!type) validationErrors.type = "Type is required.";

    if (type === "pizza") {
      if (!formData.no_of_slices || isNaN(formData.no_of_slices)) {
        validationErrors.noOfSlices =
          "# of Slices is required and must be a valid integer.";
      }
      if (!formData.diameter || isNaN(formData.diameter)) {
        validationErrors.diameter =
          "Diameter is required and must be a valid number.";
      }
    } else if (type === "soup") {
      if (!formData.spiciness_scale || isNaN(formData.spiciness_scale)) {
        validationErrors.spicinessScale =
          "Spiciness scale is required and must be a valid integer.";
      }
    } else if (type === "sandwich") {
      if (!formData.slices_of_bread || isNaN(formData.slices_of_bread)) {
        validationErrors.slicesOfBread =
          "Slices of Bread is required and must be a valid integer.";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Submit form via POST
      fetch("https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to submit the form.");
          }
        })
        .then((data) => {
          console.log("Form submitted successfully!");
          console.log("Returned data:", data);
          setSubmittedData(formData);

          // Handle success response here
        })
        .catch((error) => {
          alert("An error occurred while submitting the form.");
          console.error(error);
        });
    }
  };

  const getImageSrc = (): string => {
    if (type === "pizza") {
      return "./src/img/pizza.jpg";
    } else if (type === "soup") {
      return "./src/img/soup.jpg";
    } else if (type === "sandwich") {
      return "./src/img/sandwich.jpg";
    } else {
      return "./src/img/default.jpg";
    }
  };

  return (
    <div className="dishes">
      <div className="dish-image">
        <img src={getImageSrc()} alt="Dish" />
      </div>
      <div className="form-dish">
        <h1>Dish Form</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Dish Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Name the dish"
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <span>{errors.name}</span>}

          <label htmlFor="preparation_time">Preparation Time:</label>
          <input
            type="text"
            id="preparation_time"
            value={preparationTime}
            onChange={(e) => setPreparationTime(e.target.value)}
            pattern="\d{2}:\d{2}:\d{2}"
            placeholder="HH:MM:SS"
            required
          />
          {errors.preparationTime && <span>{errors.preparationTime}</span>}

          <label htmlFor="type">Dish Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Please Select Type</option>
            <option value="pizza">Pizza</option>
            <option value="soup">Soup</option>
            <option value="sandwich">Sandwich</option>
          </select>
          {errors.type && <span>{errors.type}</span>}

          {type === "pizza" && (
            <>
              <label htmlFor="no_of_slices">No of Slices:</label>
              <input
                type="number"
                id="no_of_slices"
                value={noOfSlices}
                onChange={(e) => setNoOfSlices(e.target.value)}
                required
              />
              {errors.noOfSlices && <span>{errors.noOfSlices}</span>}

              <label htmlFor="diameter">Diameter:</label>
              <input
                type="number"
                step="0.01"
                id="diameter"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                required
              />
              {errors.diameter && <span>{errors.diameter}</span>}
            </>
          )}

          {type === "soup" && (
            <>
              <label htmlFor="spiciness_scale">Spiciness Scale:</label>
              <input
                type="number"
                id="spiciness_scale"
                value={spicinessScale}
                onChange={(e) => setSpicinessScale(e.target.value)}
                min="1"
                max="10"
                required
              />
              {errors.spicinessScale && <span>{errors.spicinessScale}</span>}
            </>
          )}

          {type === "sandwich" && (
            <>
              <label htmlFor="slices_of_bread"># of Slices of Bread:</label>
              <input
                type="number"
                id="slices_of_bread"
                value={slicesOfBread}
                onChange={(e) => setSlicesOfBread(e.target.value)}
                required
              />
              {errors.slicesOfBread && <span>{errors.slicesOfBread}</span>}
            </>
          )}

          <button type="submit">Submit</button>
        </form>
        {submittedData && (
          <div>
            <h2>Submitted Data:</h2>
            <p>
              <b>Name:</b> {submittedData.name}
            </p>
            <p>
              <b>Preparation Time:</b> {submittedData.preparation_time}
            </p>
            <p>
              <b>Type:</b> {submittedData.type}
            </p>
            {submittedData.type === "soup" && (
              <p>
                <b>Spiciness Level:</b> {submittedData.spiciness_scale}
              </p>
            )}
            {submittedData.type === "pizza" && (
              <>
                <p>
                  <b>Number of slices: </b> {submittedData.no_of_slices}
                </p>
                <p>
                  <b>Diamater: </b> {submittedData.diameter}
                </p>
              </>
            )}
            {submittedData.type === "sandwich" && (
              <p>
                <b>Slices of bread: </b> {submittedData.slicesOfBread}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default DishForm;
