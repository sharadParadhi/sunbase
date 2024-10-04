document.addEventListener("DOMContentLoaded", function () {
  let formElements = [];

  // Generate unique ID for each element
  function generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  // Render form elements
  function renderForm() {
    const form = document.getElementById("dynamic-form");
    form.innerHTML = ""; // Clear previous form

    formElements.forEach((el, index) => {
      const formGroup = document.createElement("div");
      formGroup.className = "form-group";
      formGroup.setAttribute("draggable", true);
      formGroup.setAttribute("data-index", index);
      formGroup.ondragstart = drag;
      formGroup.ondragover = allowDrop;
      formGroup.ondrop = drop;

      let label = document.createElement("label");
      label.textContent = el.label;
      label.contentEditable = false;

      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-element";
      deleteButton.onclick = () => deleteElement(index);

      let formControl;
      if (el.type === "input") {
        formControl = document.createElement("input");
        formControl.placeholder = el.placeholder;
      } else if (el.type === "select") {
        formControl = document.createElement("div");
        formControl.classList.add("select-wrapper");

        // Create select element
        const selectElement = document.createElement("select");
        selectElement.className = "styled-select"; // Adding class for styling

        el.options.forEach((optionText) => {
          const option = document.createElement("option");
          option.textContent = optionText;
          option.value = optionText;
          selectElement.appendChild(option);
        });
        formControl.appendChild(selectElement);

        const inputSaveContainer = document.createElement("div");
        inputSaveContainer.className = "inputsavecontainer";
        inputSaveContainer.style.display = "none";

        const newOptionInput = document.createElement("input");
        newOptionInput.placeholder = "New Option";
        newOptionInput.className = "new-option-input";
        newOptionInput.style.display = "none";

        const saveOptionButton = document.createElement("button");
        saveOptionButton.textContent = "Save Option";
        saveOptionButton.className = "save-option-button";
        saveOptionButton.style.display = "none";

        saveOptionButton.onclick = function () {
          const newOption = newOptionInput.value.trim();
          if (newOption && !el.options.includes(newOption)) {
            el.options.push(newOption);
            newOptionInput.value = "";
            renderForm();
          }
        };

        inputSaveContainer.appendChild(newOptionInput);
        inputSaveContainer.appendChild(saveOptionButton);

        const addOptionButton = document.createElement("button");
        addOptionButton.textContent = "+ Add Option";
        addOptionButton.className = "add-option-button";

        addOptionButton.onclick = function (e) {
          e.preventDefault();
          inputSaveContainer.style.display = "block";
          saveOptionButton.style.display = "block";
          newOptionInput.style.display = "block";
          newOptionInput.classList.toggle("visible"); // Toggle input visibility
        };

        // Delete Option button
        const deleteOptionButton = document.createElement("button");
        deleteOptionButton.textContent = "Delete Options";
        deleteOptionButton.className = "delete-element";
        deleteOptionButton.onclick = function (e) {
          e.preventDefault();
          const selectedOption = selectElement.value; // Get the currently selected option value

          if (selectedOption === "Select an option") {
          console.log("Default option selected");
            return; // Prevent deletion of the default option
          }
        

          if (selectedOption && el.options.includes(selectedOption)) {
            const optionIndex = el.options.indexOf(selectedOption); // Find the index of the selected option

            console.log("optionIndex: " + optionIndex);
            console.log("selectedOption: " + selectedOption);

            if (optionIndex !== -1 ) {
              el.options.splice(optionIndex, 1); // Remove the option from the array
              renderForm(); // Re-render the form to update the select options
            }
          }
        };

        formControl.appendChild(addOptionButton);
        formControl.appendChild(inputSaveContainer);
        formControl.appendChild(deleteOptionButton);
      } else if (el.type === "textarea") {
        formControl = document.createElement("textarea");
        formControl.placeholder = el.placeholder;
      }

      formGroup.appendChild(label);
      formGroup.appendChild(formControl);
      formGroup.appendChild(deleteButton);

      form.appendChild(formGroup);
    });
  }

  // Add new input element
  document.getElementById("add-input").addEventListener("click", function () {
    const newElement = {
      id: generateId(),
      type: "input",
      label: "Sample Label",
      placeholder: "Enter text",
    };
    formElements.push(newElement);
    renderForm();
  });

  // Add new select element
  document.getElementById("add-select").addEventListener("click", function () {
    const newElement = {
      id: generateId(),
      type: "select",
      label: "Sample Label",
      placeholder: "Select an option ",
      options: ["Select an option"], // default option,
    };
    formElements.push(newElement);
    renderForm();
  });

  // Add new textarea element
  document
    .getElementById("add-textarea")
    .addEventListener("click", function () {
      const newElement = {
        id: generateId(),
        type: "textarea",
        label: "Sample Label",
        placeholder: "Enter your text",
      };
      formElements.push(newElement);
      renderForm();
    });

  // Delete element
  function deleteElement(index) {
    formElements.splice(index, 1);
    renderForm();
  }

  // Save form data to JSON and localStorage
  document.getElementById("save-form").addEventListener("click", function () {
    console.log(JSON.stringify(formElements));
    localStorage.setItem("formData", JSON.stringify(formElements));
  });

  // Drag and drop handlers
  let draggedIndex = null;

  // Drag and drop handlers
  function allowDrop(event) {
    event.preventDefault();
  }

  function drag(event) {
    draggedIndex = event.target.getAttribute("data-index");
  }

  function drop(event) {
    event.preventDefault();
    const targetIndex = event.target
      .closest(".form-group")
      .getAttribute("data-index");

    if (draggedIndex !== targetIndex) {
      // Remove dragged element and insert it at the drop position
      const draggedElement = formElements.splice(draggedIndex, 1)[0];
      formElements.splice(targetIndex, 0, draggedElement);
      renderForm();
    }
  }

  const savedFormData = localStorage.getItem("formData");
  if (savedFormData) {
    formElements = JSON.parse(savedFormData);
    renderForm();
  }
});
