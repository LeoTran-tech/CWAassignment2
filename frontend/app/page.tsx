// assi2/frontend/app/page.tsx

// This page includes a client-side code generator that allows users to
// add, delete mini tabs, and generate HTML code. It uses localStorage (saved
// in the user's browser) to persist the tabs and their contents across page 
// reloads. The generated HTML code is displayed in a textarea for users to copy.

'use client';

import { tabTemplate } from './templates/tabTemplate';
import { useState, useEffect } from 'react';
import Nav from './Components/Navbar';

export default function TabsPage() {
  // ---STATE VARIABLES---
  const [steps, setSteps] = useState<string[]>([]); // list of steps
  const [activeStep, setActiveStep] = useState<string | null>(null); // current selected step
  const [stepTexts, setStepTexts] = useState<{ [key: string]: string }>({}); // list of text for each step
  const [newStepName, setNewStepName] = useState(''); // input for new step name
  const [output, setOutput] = useState(''); // Generated HTML output shown in the Output panel

  // ---LOAD SAVED DATA---
  // when the page loads, restore steps and contents from localStorage
  useEffect(() => {
    const savedSteps = localStorage.getItem('steps');
    const savedTexts = localStorage.getItem('stepTexts');

    if (savedSteps) setSteps(JSON.parse(savedSteps));
    if (savedTexts) setStepTexts(JSON.parse(savedTexts));

    // Set first step as active if it exists
    const stepsArray = savedSteps ? JSON.parse(savedSteps) : [];
    if (stepsArray.length > 0) setActiveStep(stepsArray[0]);
  }, []);

  // ---SAVE DATA---
  // whenever steps or their contents change, update localStorage 
  useEffect(() => {
    localStorage.setItem('steps', JSON.stringify(steps));
    localStorage.setItem('stepTexts', JSON.stringify(stepTexts));
  }, [steps, stepTexts]);

  // ---ADD NEW STEP---
  // Add a new step with validation rules
  const addStep = () => {
    const trimmedName = newStepName.trim();
    if (!trimmedName) return; // prevent empty name

    // Prevent exceeding 15 steps
    if (steps.length >= 15) {
      alert("You cannot add more than 15 steps!");
      return;
    }

    // Prevent duplicate step names
    if (steps.includes(trimmedName)) {
      alert("A step with this name already exists!");
      return;
    }

    setSteps([...steps, trimmedName]);
    setNewStepName(''); // clear input
  };

  // ---DELETE STEP---
  // Delete the last step
  const deleteStep = () => {
    if (steps.length === 0) return;
    const removedStep = steps[steps.length - 1];
    setSteps(steps.slice(0, -1));

    // Remove text for deleted step
    setStepTexts((prev) => {
      const copy = { ...prev };
      delete copy[removedStep];
      return copy;
    });

    // If active step was deleted, switch to previous step
    if (activeStep === removedStep) {
      setActiveStep(steps[steps.length - 2] || null);
    }
  };

  // ---UPDATE STEP CONTENT---
  // Update text for the active step
  const handleTextChange = (text: string) => {
    if (!activeStep) return;
    setStepTexts((prev) => ({ ...prev, [activeStep]: text }));
  };

  return (
    <div>
      <Nav />
      <div className="container mt-5">
        <div className="row">
          {/* Column 1: Tab headers */}
          <div className="col-md-4">
            <h2>Tab Headers</h2>
            <div className="mb-3 d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Enter step name"
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
              />
              <button className="btn btn-success me-2" onClick={addStep}>
                Add
              </button>
              <button className="btn btn-danger" onClick={deleteStep}>
                Delete
              </button>
            </div>

            <div className="mb-3 d-flex flex-column">
              {steps.map((step, index) => (
                <button
                  key={step} // use step name as key
                  className={`btn mb-2 ${activeStep === step ? "btn-primary" : "btn-outline-primary"
                    }`}
                  onClick={() => setActiveStep(step)}
                >
                  Step {index + 1}. {step}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Tab content */}
          <div className="col-md-4">
            <h2>Tab Content</h2>
            {activeStep && (
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows={8}
                  value={stepTexts[activeStep] || ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Column 3: Output */}
          <div className="col-md-4">
            <button
              className="btn btn-info mb-3"
              onClick={() => {
                const headers = steps;
                const contents = steps.map((step) => stepTexts[step] || "");
                setOutput(tabTemplate(headers, contents));
              }}
            >
              Output
            </button>

            <textarea
              className="form-control"
              rows={15}
              value={output}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );

}