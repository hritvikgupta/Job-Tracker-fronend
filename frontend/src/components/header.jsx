import React from 'react';

const styles = {
  Header: {
    position: 'fixed', // Ensure the header stays at the top
    top: '0px',
    right: '0px',
    width: '80%',
    height: '60px',
    backgroundColor: '#28282c',
    borderBottom: '1px solid #444',
    color: 'white',
    // fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxSizing: 'border-box',
    zIndex: 1000, // Ensure the header is above other elements

  },
  Logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  Nav: {
    display: 'flex',
    alignItems: 'center',
  },
  NavItem: {
    marginLeft: '20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  Text: {
    color: '#cdccd4',
    fontSize: '23px',
    // fontFamily: 'Nunito',
    fontWeight: 500,
    lineHeight: '38px',
  },
};

const defaultProps = {
    text: 'Senior Java Developer',
  };
  const Header = (props) => {
    return (
      <div style={styles.Header}>
        <div style={styles.Title}>
          {props.title ?? defaultProps.title}
        </div>
        <div style={styles.Nav}>
          <div style={styles.NavItem}>Home</div>
          <div style={styles.NavItem}>About</div>
          <div style={styles.NavItem}>Contact</div>
        </div>
      </div>
    );
  };

export default Header;
