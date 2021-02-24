import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'

const NotFound = () => {
  
  const history = useHistory()

  return <>
    <Container>
      <h1>Oops!</h1>
      <p>Your page was not found...</p>
      <br />
      <Button onClick={() => history.goBack()}>Go back</Button>
    </Container>
  </>
}

export default NotFound