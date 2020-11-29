import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import "../styles.css";

class NewsDetails extends Component {
  render() {
    const {
      title,
      urlToImage,
      content,
      author,
      publishedAt,
      description,
      source,
    } = this.props.location.result;

    return (
      <div className="container-fluid">
        <div className="row" key={title}>
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-horizontal">
                <div className="img-square-wrapper">
                  <img
                    className=""
                    src={urlToImage}
                    width="100%"
                    alt="Card image cap"
                  />
                </div>
                <div className="card-body">
                  <h4 className="card-title">{title}</h4>
                  <p className="card-text">{content}</p>
                  <p className="card-text">{description}</p>
                </div>
              </div>
              <div className="card-footer">
                <small className="text-muted">
                  {author} | {Date(publishedAt)} | {source.name}
                </small>
              </div>
            </div>
          </div>
        </div>
        <Link to="/news">Back to All News</Link>
      </div>
    );
  }
}

export default withRouter(NewsDetails);
