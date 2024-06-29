import React, { useState, useEffect } from 'react';

const styles = {
  Card: {
    position: 'absolute',
    width: '20%',
    height: '100%',
    backgroundColor: '#28282c',
    padding: '20px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  Title: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  JobItem: {
    marginBottom: '10px',
    padding: '20px',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    position: 'relative',
  },
  JobTitle: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  Salary: {
    fontSize: '14px',
    color: '#b0b0b0',
  },
  AddButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#6278f7',
    borderRadius: '50%',
    color: 'white',
    fontSize: '24px',
    marginTop:'10px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  ManageButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6278f7',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: 'auto',
  },
  ManagerInputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  ManagerInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #444',
    backgroundColor: '#3a3a3c',
    color: 'white',
    height: '40px',
    marginTop:'3px',
    boxSizing: 'border-box',
    marginLeft: '10px',
  },
  Form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
  },
  Input: {
    width: '80%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    margin: '5px',
  },
  SubmitButton: {
    cursor: 'pointer',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#6278f7',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '10px',
  },
  DeleteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#6278f7',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: '5px 10px',
  },
  UpdateButton: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#6278f7',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: '5px 10px',
  },
};

const JobPanel = ({ setHeaderTitle, setSelectedJobId }) => {
  const [jobs, setJobs] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', salary: '' });
  const [manageMode, setManageMode] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const url = "https://job-tracking-backend-lkhc.onrender.com/api/"
  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch(url+'savedjobs');
      const data = await response.json();
      setJobs(data.jobs);
    };
    fetchJobs();
  }, [updateTrigger]);

  const handleMouseEnter = (id) => {
    setHovered(id);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const handleClick = (id, title) => {
    setHeaderTitle(title);
    setSelectedJobId(id);
  };

  const handleAddClick = () => {
    setShowForm(!showForm);
    setNewJob({ title: '', salary: '' }); // Clear form when clicking Add
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(url+'savedjobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    });
    const job = await response.json();
    setJobs((prevJobs) => [...prevJobs, job]);
    setShowForm(false);
    setNewJob({ title: '', salary: '' });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(url+`savedjobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      setUpdateTrigger(!updateTrigger); // Trigger update to refetch jobs
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(url+`savedjobs/${newJob._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedJobFromDB = await response.json();
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === newJob._id ? updatedJobFromDB : job))
      );
      setShowForm(false);
      setNewJob({ title: '', salary: '' });
      setUpdateTrigger(!updateTrigger); // Trigger update to refetch jobs
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleEditClick = (id) => {
    const jobToEdit = jobs.find((job) => job._id === id);
    if (jobToEdit) {
      setNewJob(jobToEdit);
      setShowForm(true);
    }
  };

  return (
    <div style={styles.Card}>
      <div>
        <div style={styles.Title}>Job Tracker</div>
        {showForm ? (
          <form
            style={styles.Form}
            onSubmit={(e) => {
              if (newJob._id) {
                handleEditSubmit(e);
              } else {
                handleSubmit(e);
              }
            }}
          >
            {/* <div style={styles.AddButton} onClick={handleAddClick}>
              -
            </div> */}
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={newJob.title}
              onChange={handleChange}
              style={styles.Input}
              required
            />
            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={newJob.salary}
              onChange={handleChange}
              style={styles.Input}
              required
            />
            <button type="submit" style={styles.SubmitButton}>
              {newJob._id ? 'Update Job' : 'Add Job'}
            </button>
          </form>
        ) : (
          <div></div>
          // <div style={styles.AddButton} onClick={handleAddClick}>
          //   +
          // </div>
        )}
        <div style={styles.ManagerInputContainer}>
          <div style={styles.AddButton} onClick={handleAddClick}>
            {showForm ? '-' : '+'}
          </div>
          <input type="text" placeholder="Manager" style={styles.ManagerInput} />
        </div>
        {jobs.map((job) => (
          <div
            key={job._id}
            style={{
              ...styles.JobItem,
              boxShadow: hovered === job._id ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
              border: hovered === job._id ? '1px solid #6278f7' : 'none',
            }}
            onMouseEnter={() => handleMouseEnter(job._id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(job._id, job.title)}
          >
            <div style={styles.JobTitle}>{job.title}</div>
            {job.salary && <div style={styles.Salary}>{job.salary}</div>}
            {manageMode && (
              <>
                <button
                  style={styles.DeleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(job._id);
                  }}
                >
                  X
                </button>
                <button
                  style={styles.UpdateButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(job._id);
                  }}
                >
                  ✎
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        style={styles.ManageButton}
        onClick={() => setManageMode((prevMode) => !prevMode)}
      >
        {manageMode ? 'Done' : 'Manage jobs'}
      </button>
    </div>
  );
};

export default JobPanel;
