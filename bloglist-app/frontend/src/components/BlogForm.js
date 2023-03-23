import React, { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'

const BlogForm = () => {

  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)

  const handleSubmit = (evt) => {
    evt.preventDefault()
    dispatch(createBlog({ title, author, url, likes }))
    dispatch(notify({
      class: 'success',
      content: `a new blog ${title} by ${author} added`
    }))
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (

    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Url</Form.Label>
              <Form.Control
                type="url"
                name="url"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Likes</Form.Label>
              <Form.Control
                type="number"
                name="likes"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
          Create
            </Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export default BlogForm