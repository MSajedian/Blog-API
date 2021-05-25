import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import BlogItem from "../blog-item";
// import posts from "../../../data/posts.json";


export default class BlogList extends Component {
  state = { posts: [] }

  componentDidMount = async () => {
    const apiUrl = process.env.REACT_APP_LOCAL_API_URL
    // const apiUrl = `http://127.0.0.1:3001`
    console.log("url", `${apiUrl}/blogPosts`);
    // const apiUrl = process.env.REACT_APP_API_URL
    const resp = await fetch(`${apiUrl}/blogPosts`)
    const posts = await resp.json()
    this.setState({ posts: posts })
  }

  render() {
    return (
      <Row>
        {this.state.posts.map((post) => (
          <Col md={4} style={{ marginBottom: 50 }}>
            <BlogItem key={post.title} {...post} />
          </Col>
        ))}
      </Row>
    );
  }
}
