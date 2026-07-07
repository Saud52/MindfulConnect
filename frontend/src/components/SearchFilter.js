import React from 'react';

function SearchFilter({ searchTerm, setSearchTerm, specialties, selectedSpecialty, setSelectedSpecialty }) {
  return (
    <div style={styles.filterContainer}>
      <div style={styles.searchBox}>
        <label htmlFor="searchName">Search by name:</label>
        <input
          type="text"
          id="searchName"
          placeholder="e.g., Professor Anya Sharma"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div style={styles.specialtyBox}>
        <label htmlFor="specialty">Specialty:</label>
        <select
          id="specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

const styles = {
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px', /* More gap */
    justifyContent: 'center',
    backgroundColor: 'var(--color-background-offwhite)', /* Off-white for filter bar */
    borderRadius: '15px', /* More rounded */
    padding: '40px', /* More padding */
    boxShadow: '0 4px 20px var(--color-shadow-subtle)', /* Softer shadow */
    marginBottom: '60px', /* More margin */
    border: '1px solid var(--color-border-light)', /* Subtle border */
  },
  searchBox: {
    flex: '1',
    minWidth: '300px', /* Wider */
  },
  specialtyBox: {
    flex: '1',
    minWidth: '250px', /* Wider */
  },
  label: {
    // Inherited from global CSS, no specific changes needed here
  },
  // Input and select styles are now inherited from global CSS in index.css
};

export default SearchFilter;