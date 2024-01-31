import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries'; // Import the GET_ME query
import { REMOVE_BOOK } from '../utils/mutations'; // Import the REMOVE_BOOK mutation
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Use the useQuery hook to execute the GET_ME query on load
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};

  // Use the useMutation hook to execute the REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use the removeBook mutation here
      const { data } = await removeBook({
        variables: { bookId: bookId },
      });

      // If there's an error with the mutation, return early
      if (data?.removeBook?.message) {
        throw new Error('something went wrong!');
      }

      // If successful, update the user data without making an additional request
      const updatedUser = { ...userData };
      updatedUser.savedBooks = updatedUser.savedBooks.filter((book) => book.bookId !== bookId);
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* ... (unchanged code) ... */}
    </>
  );
};

export default SavedBooks;
