import React from 'react';

const calculateFillPercentage = (count) => {
  const [current, total] = count.split('/').map(Number);
  return (current / total) * 100;
};

const getButtonStyles = (percentage, baseColor, fillColor, textColor) => ({
  cursor: 'pointer',
  width: '227px',
  height: '48px',
  padding: '0 8px',
  border: '0',
  boxSizing: 'border-box',
  borderRadius: '12px',
  background: `linear-gradient(90deg, ${fillColor} ${percentage}%, ${baseColor} ${percentage}%)`,
  color: textColor,
  fontSize: '16px',
  // fontFamily: 'Nunito',
  fontWeight: 800,
  lineHeight: '26px',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  justifyContent: 'space-between',
});

const styles = {
  Label: {
    flex: '1',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  Count: {
    fontSize: '14px',
    color: '#000', // Default text color for numbers (will be overridden by prop)
    fontWeight: 'bold',
  },
};

const Button = ({ label, count, baseColor = '#7587eb', fillColor = '#6278f7', textColor = '#f7f8fd' }) => {
  const percentage = calculateFillPercentage(count);

  return (
    <button style={getButtonStyles(percentage, baseColor, fillColor, textColor)}>
      <div style={styles.Label}>{label}</div>
      <div style={{ ...styles.Count, color: textColor }}>{count}</div>
    </button>
  );
};

export default Button;
