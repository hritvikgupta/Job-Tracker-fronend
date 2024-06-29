import React, { useEffect, useState } from 'react';
import Button from '../uiComponents/button';

const styles = {
  Container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    width: '74%',
    padding: '20px',
    height: '100%',
    gap: '20px',
    top: '5%',
    left: '22%',
    marginRight: '10px',
    backgroundColor: '#3a3a3c',
  },
  Column: {
    flex: 1,
    backgroundColor: '#28282c',
    borderRadius: '40px',
    padding: '20px',
    color: 'white',
    height: '85%',
    overflowY: 'auto',
  },
  ColumnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '20px',
  },
  Title: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'black',
  },
  Count: {
    fontSize: '16px',
    marginTop: '10px',
    color: 'black',
  },
  Card: {
    backgroundColor: '#3a3a3c',
    borderRadius: '20px',
    padding: '10px',
    marginBottom: '10px',
    textAlign: 'center',
    position: 'relative',
  },
  CardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  Tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    justifyContent: 'center',
    marginTop: '10px',
  },
  Tag: {
    backgroundColor: '#4a4a4c',
    borderRadius: '4px',
    padding: '5px 10px',
    fontSize: '12px',
  },
  Form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  Input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
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
    cursor: 'pointer',
    marginLeft: '10px',
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

const getColumnHeaderStyle = (baseColor, fillColor, filledPercentage) => ({
  ...styles.ColumnHeader,
  background: `linear-gradient(to right, ${fillColor} ${filledPercentage}%, ${baseColor} ${filledPercentage}%)`,
  color: 'black',
});

const initialColumns = {
  new: {
    title: 'New',
    baseColor: '#e0bfff',
    fillColor: '#d19fe8',
    cards: [],
  },
  shortlisted: {
    title: 'Shortlisted',
    baseColor: '#ffe0b2',
    fillColor: '#ffb74d',
    cards: [],
  },
  interviewed: {
    title: 'Interviewed',
    baseColor: '#c8e6c9',
    fillColor: '#66bb6a',
    cards: [],
  },
};

const CardColumns = ({ jobId }) => {
  const url = 'https://job-tracking-backend-lkhc.onrender.com/api/'
  const [columns, setColumns] = useState(initialColumns);
  const [showForm, setShowForm] = useState({
    new: false,
    shortlisted: false,
    interviewed: false,
  });
  const [formState, setFormState] = useState({
    new: {
      title: '',
      companyName: '',
      tags: '',
      salary: '',
      hrContact: '',
    },
    shortlisted: {
      title: '',
      companyName: '',
      tags: '',
      salary: '',
      hrContact: '',
    },
    interviewed: {
      title: '',
      companyName: '',
      tags: '',
      salary: '',
      hrContact: '',
    },
  });
  const [editState, setEditState] = useState({
    isEditing: false,
    cardId: null,
    column: '',
    title: '',
    companyName: '',
    tags: '',
    salary: '',
    hrContact: '',
  });

  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(url+'jobs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched jobs:', data);

        const jobsForSelectedJobId = data.jobs.filter(job => job.jobId === jobId);

        const newCards = jobsForSelectedJobId.filter(job => job.status === 'new');
        const shortlistedCards = jobsForSelectedJobId.filter(job => job.status === 'shortlisted');
        const interviewedCards = jobsForSelectedJobId.filter(job => job.status === 'interviewed');

        setColumns({
          new: { ...initialColumns.new, cards: newCards },
          shortlisted: { ...initialColumns.shortlisted, cards: shortlistedCards },
          interviewed: { ...initialColumns.interviewed, cards: interviewedCards },
        });
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    if (jobId) {
      fetchJobs();
    }
  }, [jobId, fetchTrigger]);

  const handleAddClick = column => {
    setShowForm(prevShowForm => ({
      ...prevShowForm,
      [column]: !prevShowForm[column],
    }));
  };

  const handleChange = (e, column) => {
    const { name, value } = e.target;
    setFormState(prevFormState => ({
      ...prevFormState,
      [column]: { ...prevFormState[column], [name]: value },
    }));
  };

  const handleSubmit = async (e, column) => {
    e.preventDefault();

    const data = {
      title: formState[column].title,
      companyName: formState[column].companyName,
      tags: formState[column].tags.split(',').map(tag => tag.trim()),
      salary: formState[column].salary,
      hrContact: formState[column].hrContact,
      status: column,
      jobId,
    };

    try {
      console.log('Submitting new job:', data); // Log the data being submitted
      const response = await fetch(url+'jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status); // Log response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData); // Log error details from the response
        throw new Error('Network response was not ok');
      }
      const job = await response.json();
      console.log('Received job:', job);

      setColumns(prevColumns => ({
        ...prevColumns,
        [column]: { ...prevColumns[column], cards: [...prevColumns[column].cards, job] },
      }));
      setShowForm(prevShowForm => ({
        ...prevShowForm,
        [column]: false,
      }));
      setFormState(prevFormState => ({
        ...prevFormState,
        [column]: {
          title: '',
          companyName: '',
          tags: '',
          salary: '',
          hrContact: '',
        },
      }));
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDelete = async (cardId) => {
    try {
      const response = await fetch(url+`jobs/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };
        Object.keys(updatedColumns).forEach((columnKey) => {
          updatedColumns[columnKey].cards = updatedColumns[columnKey].cards.filter(
            (card) => card._id !== cardId
          );
        });
        return updatedColumns;
      });
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleEditClick = (card, column) => {
    setEditState({
      isEditing: true,
      cardId: card._id,
      column,
      title: card.title,
      companyName: card.companyName,
      tags: card.tags.join(', '),
      salary: card.salary,
      hrContact: card.hrContact,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditState(prevEditState => ({
      ...prevEditState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: editState.title,
      companyName: editState.companyName,
      tags: editState.tags.split(',').map(tag => tag.trim()),
      salary: editState.salary,
      hrContact: editState.hrContact,
    };

    try {
      console.log('Updating job:', data); // Log the data being updated
      const response = await fetch(url+`jobs/${editState.cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status); // Log response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData); // Log error details from the response
        throw new Error('Network response was not ok');
      }
      const updatedJob = await response.json();
      console.log('Updated job:', updatedJob);

      setColumns(prevColumns => {
        const updatedCards = prevColumns[editState.column].cards.map(card =>
          card._id === editState.cardId ? updatedJob : card
        );

        return {
          ...prevColumns,
          [editState.column]: {
            ...prevColumns[editState.column],
            cards: updatedCards,
          },
        };
      });

      setEditState({
        isEditing: false,
        cardId: null,
        column: '',
        title: '',
        companyName: '',
        tags: '',
        salary: '',
        hrContact: '',
      });

      setFetchTrigger(!fetchTrigger); // Toggle fetch trigger to refetch data
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const totalJobs = Object.values(columns).reduce((sum, column) => sum + column.cards.length, 0);

  return (
    <div style={styles.Container}>
      {Object.entries(columns).map(([key, column]) => {
        const filledPercentage = totalJobs ? (column.cards.length / totalJobs) * 100 : 0;
        return (
          <div style={styles.Column} key={key}>
            <div style={getColumnHeaderStyle(column.baseColor, column.fillColor, filledPercentage)}>
              <span style={styles.Title}>{column.title}</span>
              <span style={styles.Count}>{`${column.cards.length}/${totalJobs}`}</span>
              <div style={styles.AddButton} onClick={() => handleAddClick(key)}>
                {showForm[key] ? '-' : '+'}
              </div>
            </div>
            {showForm[key] && (
              <form style={styles.Form} onSubmit={e => handleSubmit(e, key)}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formState[key].title}
                  onChange={e => handleChange(e, key)}
                  style={styles.Input}
                  required
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formState[key].companyName}
                  onChange={e => handleChange(e, key)}
                  style={styles.Input}
                />
                <input
                  type="text"
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={formState[key].tags}
                  onChange={e => handleChange(e, key)}
                  style={styles.Input}
                />
                <input
                  type="text"
                  name="salary"
                  placeholder="Salary"
                  value={formState[key].salary}
                  onChange={e => handleChange(e, key)}
                  style={styles.Input}
                />
                <input
                  type="text"
                  name="hrContact"
                  placeholder="HR Contact"
                  value={formState[key].hrContact}
                  onChange={e => handleChange(e, key)}
                  style={styles.Input}
                />
                <button type="submit" style={styles.SubmitButton}>Add Card</button>
              </form>
            )}
            {editState.isEditing && editState.column === key && (
              <form style={styles.Form} onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={editState.title}
                  onChange={handleEditChange}
                  style={styles.Input}
                  required
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={editState.companyName}
                  onChange={handleEditChange}
                  style={styles.Input}
                />
                <input
                  type="text"
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={editState.tags}
                  onChange={handleEditChange}
                  style={styles.Input}
                />
                <input
                  type="text"
                  name="salary"
                  placeholder="Salary"
                  value={editState.salary}
                  onChange={handleEditChange}
                  style={styles.Input}
                />
                <input
                  type="text"
                  name="hrContact"
                  placeholder="HR Contact"
                  value={editState.hrContact}
                  onChange={handleEditChange}
                  style={styles.Input}
                />
                <button type="submit" style={styles.SubmitButton}>Update Card</button>
              </form>
            )}
            {column.cards &&
              column.cards.map((card, index) => (
                <div style={styles.Card} key={index}>
                  <button style={styles.DeleteButton} onClick={() => handleDelete(card._id)}>X</button>
                  <button style={styles.UpdateButton} onClick={() => handleEditClick(card, key)}>✎</button>
                  <div style={styles.CardTitle}>{card.title}</div>
                  <div>{card.companyName}</div>
                  <div>{card.salary}</div>
                  <div>{card.hrContact}</div>
                  <div style={styles.Tags}>
                    {card.tags &&
                      card.tags.map((tag, tagIndex) => (
                        <div style={styles.Tag} key={tagIndex}>
                          {tag}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default CardColumns;
